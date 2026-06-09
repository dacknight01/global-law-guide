import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";


export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads")
      .select("id, title, updated_at, created_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads")
      .insert({ user_id: context.userId })
      .select("id, title, updated_at, created_at")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("threads")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type StoredMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: string; text?: string }>;
};

export const getThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ threadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: thread, error: tErr } = await context.supabase
      .from("threads")
      .select("id, title")
      .eq("id", data.threadId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (tErr) throw new Error(tErr.message);
    if (!thread) {
      return {
        thread: null as { id: string; title: string } | null,
        messages: [] as StoredMessage[],
      };
    }

    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("id, role, parts, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const messages: StoredMessage[] = (rows ?? []).map((r) => {
      const rawParts = Array.isArray(r.parts) ? (r.parts as unknown[]) : [];
      const parts = rawParts
        .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
        .map((p) => ({
          type: String(p.type ?? "text"),
          text: typeof p.text === "string" ? p.text : undefined,
        }));
      return {
        id: r.id as string,
        role: r.role as "user" | "assistant" | "system",
        parts,
      };
    });
    return { thread: thread as { id: string; title: string } | null, messages };
  });
