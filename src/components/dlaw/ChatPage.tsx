import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";

import { supabase } from "@/integrations/supabase/client";
import {
  createThread,
  deleteThread,
  getThreadMessages,
  listThreads,
} from "@/lib/threads.functions";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, LogOut, Menu, Scale } from "lucide-react";
import logo from "@/assets/dlaw-logo.png";
import {
  SelectorsBar,
  resolveCountry,
  type SelectorsValue,
} from "@/components/dlaw/SelectorsBar";
import { DEFAULT_CATEGORY, DEFAULT_COUNTRY } from "@/lib/dlaw-options";

const PENDING_KEY = "dlaw:pending";
type Pending = { country?: string; category?: string; text?: string };

type ThreadRow = {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
};

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setToken(data.session?.access_token ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setToken(session?.access_token ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return token;
}

export function ChatPage({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const token = useAuthToken();

  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const remove = useServerFn(deleteThread);
  const fetchMessages = useServerFn(getThreadMessages);

  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sel, setSel] = useState<SelectorsValue>({
    country: DEFAULT_COUNTRY,
    customCountry: "",
    category: DEFAULT_CATEGORY,
  });
  const [pending, setPending] = useState<Pending | null>(null);

  // Hydrate pending question (passed in from landing page) once per mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Pending;
        sessionStorage.removeItem(PENDING_KEY);
        if (p.country) setSel((s) => ({ ...s, country: p.country!, customCountry: "" }));
        if (p.category) setSel((s) => ({ ...s, category: p.category! }));
        if (p.text) setPending(p);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load thread list
  useEffect(() => {
    list().then(setThreads).catch((e) => console.error(e));
  }, [list]);

  // Load this thread's messages
  useEffect(() => {
    setInitialMessages(null);
    fetchMessages({ data: { threadId } })
      .then((res) => {
        const msgs: UIMessage[] = res.messages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts.map((p) => ({
            type: "text" as const,
            text: p.text ?? "",
          })),
        }));
        setInitialMessages(msgs);
      })
      .catch((e) => {
        console.error(e);
        setInitialMessages([]);
      });
  }, [threadId, fetchMessages]);

  const country = resolveCountry(sel);
  const category = sel.category;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: () => (token ? ({ Authorization: `Bearer ${token}` } as Record<string, string>) : ({} as Record<string, string>)),
        body: { threadId, country, category },
      }),
    [token, threadId, country, category],
  );

  const ready = initialMessages !== null && token !== null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-30 inset-y-0 left-0 w-72 border-r border-border bg-card flex flex-col transition-transform`}
      >
        <div className="p-4 flex items-center gap-2 border-b border-border">
          <img src={logo} alt="" width={32} height={32} className="rounded-md" />
          <div className="flex-1">
            <div className="font-semibold text-foreground">D-Law AI</div>
            <div className="text-xs text-muted-foreground">Global legal info</div>
          </div>
        </div>
        <div className="p-3">
          <Button
            className="w-full"
            onClick={async () => {
              try {
                const t = await create();
                setThreads((prev) => [t as ThreadRow, ...prev]);
                navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
                setSidebarOpen(false);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Failed to create");
              }
            }}
          >
            <Plus className="h-4 w-4" /> New conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center gap-1 rounded-md px-2 py-2 text-sm hover:bg-accent ${t.id === threadId ? "bg-accent" : ""}`}
            >
              <button
                className="flex-1 text-left truncate"
                onClick={() => {
                  navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
                  setSidebarOpen(false);
                }}
              >
                {t.title || "New conversation"}
              </button>
              <button
                aria-label="Delete"
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await remove({ data: { id: t.id } });
                    const next = threads.filter((x) => x.id !== t.id);
                    setThreads(next);
                    if (t.id === threadId) {
                      if (next[0]) navigate({ to: "/chat/$threadId", params: { threadId: next[0].id } });
                      else navigate({ to: "/" });
                    }
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Failed to delete");
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {threads.length === 0 && (
            <div className="px-2 py-4 text-xs text-muted-foreground">No conversations yet.</div>
          )}
        </div>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-2 p-3 border-b border-border">
          <button onClick={() => setSidebarOpen((v) => !v)} aria-label="Menu" className="p-2 -ml-2 rounded hover:bg-accent">
            <Menu className="h-5 w-5" />
          </button>
          <img src={logo} alt="" width={24} height={24} className="rounded" />
          <span className="font-semibold">D-Law AI</span>
        </header>

        {ready && initialMessages ? (
          <ChatInner
            threadId={threadId}
            initialMessages={initialMessages}
            transport={transport}
            sel={sel}
            onSelChange={setSel}
            pending={pending}
            onPendingConsumed={() => setPending(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <Shimmer>Loading…</Shimmer>
          </div>
        )}
      </main>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="md:hidden fixed inset-0 z-20 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function ChatInner({
  threadId,
  initialMessages,
  transport,
  sel,
  onSelChange,
  pending,
  onPendingConsumed,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  transport: DefaultChatTransport<UIMessage>;
  sel: SelectorsValue;
  onSelChange: (v: SelectorsValue) => void;
  pending: Pending | null;
  onPendingConsumed: () => void;
}) {
  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message || "Something went wrong"),
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  const isBusy = status === "submitted" || status === "streaming";

  // Auto-send a pending question (e.g. coming from the public landing page).
  const autoSentRef = useRef(false);
  useEffect(() => {
    if (autoSentRef.current) return;
    if (!pending?.text) return;
    if (messages.length > 0) {
      autoSentRef.current = true;
      onPendingConsumed();
      return;
    }
    autoSentRef.current = true;
    sendMessage({ text: pending.text });
    onPendingConsumed();
  }, [pending, messages.length, sendMessage, onPendingConsumed]);

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<img src={logo} alt="" width={56} height={56} className="rounded-xl" />}
              title="Ask D-Law AI about any law, anywhere"
              description="Clear, structured legal information from 195 countries. Not legal advice."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full max-w-xl">
                {[
                  "What are the penalties for drunk driving in Germany?",
                  "Explain tenant rights in California, USA",
                  "How does inheritance work in Japan?",
                  "Compare data privacy laws in EU vs India",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="text-left rounded-lg border border-border bg-card hover:bg-accent transition p-3 text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent className={m.role === "user" ? "bg-primary text-primary-foreground" : "bg-transparent border-0 px-0 py-0"}>
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      if (m.role === "assistant") {
                        return (
                          <div key={i} className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </div>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent border-0 px-0 py-0">
                <Shimmer>Researching legal sources…</Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && (
            <div className="text-sm text-destructive px-4 py-2">
              {error.message || "Request failed"}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto w-full p-3 space-y-2">
          <SelectorsBar value={sel} onChange={onSelChange} />
          <PromptInput

            onSubmit={(message) => {
              const text = message.text.trim();
              if (!text || isBusy) return;
              sendMessage({ text });
              setInput("");
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a law in any country… (e.g. 'Speeding fines in France')"
            />
            <PromptInputFooter className="justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Scale className="h-3 w-3" /> Information only — not legal advice
              </div>
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() || isBusy}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </>
  );
}
