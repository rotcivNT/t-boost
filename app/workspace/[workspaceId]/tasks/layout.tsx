import ConversationSidebar from "@/components/conversation/ConversationSidebar";
import ContentLayout from "@/components/workspace/layouts/MainContent";

function TaskLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ContentLayout leftContent={null} rightContent={children} />
    </div>
  );
}

export default TaskLayout;
