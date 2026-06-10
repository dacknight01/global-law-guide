import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { DLAW_SYSTEM_PROMPT } from "@/lib/dlaw-system-prompt";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";

type ChatRequestBody = {
  messages?: unknown;
  threadId?: string;
  country?: string;
  category?: string;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, threadId, country, category } =
          (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        if (!threadId || typeof threadId !== "string") {
          return new Response("threadId is required", { status: 400 });
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

        const result = streamText({
          model,
          system: DLAW_SYSTEM_PROMPT,
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
