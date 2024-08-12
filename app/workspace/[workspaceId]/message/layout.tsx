import DCSidebar from "@/components/dc-tab/DCSidebar";
import ContentLayout from "@/components/workspace/layouts/MainContent";

function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ContentLayout leftContent={<DCSidebar />} rightContent={children} />
    </div>
  );
}

export default MessageLayout;
