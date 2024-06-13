import { Tabs } from "@/components/ui/tabs";
import ContentTabList from "./ContentTabList";

interface IProps {
  defaultTab?: string;
}

function ContentTab({ defaultTab }: IProps) {
  return (
    <Tabs
      defaultValue={defaultTab ? defaultTab : "about"}
      className="w-full h-[calc(100%-96px)]"
    >
      <ContentTabList />
    </Tabs>
  );
}

export default ContentTab;
