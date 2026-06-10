import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { DLAW_SYSTEM_PROMPT } from "@/lib/dlaw-system-prompt";
import {
  COUNTRIES,
  DEFAULT_CATEGORY,
  DEFAULT_COUNTRY,
  LEGAL_CATEGORIES,
} from "@/lib/dlaw-options";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const MAX_MESSAGES = 50;
const MAX_PARTS = 20;
const MAX_TEXT_PER_PART = 4000;
const MAX_TOTAL_TEXT = 20000;

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(MAX_TEXT_PER_PART),
}).passthrough();

const otherPartSchema = z.object({
  type: z.string().max(40),
}).passthrough();

const messageSchema = z.object({
  id: z.string().max(100).optional(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.union([textPartSchema, otherPartSchema])).min(1).max(MAX_PARTS),
}).passthrough();

const COUNTRY_SET = new Set<string>(COUNTRIES as readonly string[]);
const CATEGORY_SET = new Set<string>(LEGAL_CATEGORIES as readonly string[]);

const bodySchema = z.object({
  threadId: z.string().uuid(),
  country: z.string().trim().max(80).optional(),
  category: z.string().trim().max(80).optional(),
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return new Response("Invalid request", { status: 400 });
        }
        const { threadId, country, category, messages } = parsed;

        // Enforce total combined text cap
        const totalText = messages.reduce(
          (sum, m) =>
            sum +
            m.parts.reduce(
              (s, p) => s + (p.type === "text" ? (p as { text: string }).text.length : 0),
              0,
            ),
          0,
        );
        if (totalText > MAX_TOTAL_TEXT) {
          return new Response("Invalid request", { status: 400 });
        }

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length);

        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
        if (claimsError || !claims?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = claims.claims.sub as string;

        // Verify thread belongs to user
        const { data: thread, error: threadError } = await supabase
          .from("threads")
          .select("id")
          .eq("id", threadId)
          .eq("user_id", userId)
          .maybeSingle();
        if (threadError || !thread) {
          return new Response("Thread not found", { status: 404 });
        }

        const uiMessages = messages as UIMessage[];
        const last = uiMessages[uiMessages.length - 1];

        // Persist incoming user message (latest only)
        if (last && last.role === "user") {
          const { error: insertErr } = await supabase.from("messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            parts: last.parts as unknown as object,
          });
          if (insertErr) console.error("user msg insert", insertErr);

          // If thread is still default title, set it from first user message text.
          const userText = last.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join(" ")
            .trim()
            .slice(0, 80);
          if (userText) {
            await supabase
              .from("threads")
              .update({ title: userText })
              .eq("id", threadId)
              .eq("title", "New conversation");
          }
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const selectedCountry = (country ?? "").trim() || "Global / International";
        const selectedCategory = (category ?? "").trim() || "Any / General";
        const contextPreamble = `\n\nUSER SELECTION (treat as primary jurisdiction & topic unless the user explicitly overrides in their message):\n- Country / Jurisdiction: ${selectedCountry}\n- Legal Category: ${selectedCategory}\n\nWhen relevant, set the response header to "📍 Country: ${selectedCountry}" and "⚖️ Legal Category: ${selectedCategory}". If the question is clearly about a different country/category, follow the user's wording instead and note the change.`;

        const result = streamText({
          model,
          system: DLAW_SYSTEM_PROMPT + contextPreamble,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ messages: finalMessages }) => {
            const assistantMsg = finalMessages[finalMessages.length - 1];
            if (assistantMsg && assistantMsg.role === "assistant") {
              const { error: aErr } = await supabase.from("messages").insert({
                thread_id: threadId,
                user_id: userId,
                role: "assistant",
                parts: assistantMsg.parts as unknown as object,
              });
              if (aErr) console.error("assistant msg insert", aErr);
            }
          },
          onError: (err) => {
            console.error("stream error", err);
            return "An error occurred while generating the response.";
          },
        });
      },
    },
  },
});
