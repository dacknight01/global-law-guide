import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/components/dlaw/ChatPage";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { threadId } = Route.useParams();
  return <ChatPage threadId={threadId} key={threadId} />;
}
