import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
interface IProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftContentWidth?: number;
}
function ContentLayout({ leftContent, rightContent }: IProps) {
  return (
    <div className="border border-[#3B3D42] h-sidebar-height rounded-[6px]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="bg-[rgba(16,18,20,0.55)]" defaultSize={30}>
          {leftContent}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>{rightContent}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default ContentLayout;
