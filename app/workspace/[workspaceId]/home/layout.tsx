import ConversationSidebar from "@/components/conversation/ConversationSidebar";
import ContentLayout from "@/components/workspace/layouts/MainContent";

function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ContentLayout
        leftContent={<ConversationSidebar />}
        rightContent={children}
      />
    </div>
  );
}

export default HomeLayout;
