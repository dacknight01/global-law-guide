import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/components/dlaw/ChatPage";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Chat — D-Law AI" },
      {
        name: "description",
        content: "Your D-Law AI conversation. Ask follow-up questions about laws across 195 countries.",
      },
      { property: "og:title", content: "Chat — D-Law AI" },
      {
        property: "og:description",
        content: "Continue your legal information conversation with D-Law AI.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { threadId } = Route.useParams();
  return <ChatPage threadId={threadId} key={threadId} />;
}
