import { useChannelStore } from "@/app/store/channel.store";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import AboutContent from "./about-tab-content/AboutContent";
import MemberContent from "./member-tab-content/MemberContent";

function ContentTabList() {
  const channel = useChannelStore((state) => state.currentChannel);
  const tabTriggerStyles = cn(
    "px-0 rounded-none data-[state=active]:bg-transparent border-b-[2px] border-transparent data-[state=active]:border-[#2ba5ce]",
    "text-[13px] text-text-secondary data-[state=active]:text-text-primary hover:text-text-primary"
  );

  return (
    <>
      <TabsList className="w-full h-10 bg-dark-secondary justify-start gap-8 px-7 rounded-none">
        <TabsTrigger value="about" className={tabTriggerStyles}>
          About
        </TabsTrigger>
        <TabsTrigger className={tabTriggerStyles} value="members">
          Members
        </TabsTrigger>
        <TabsTrigger className={tabTriggerStyles} value="integrations">
          Integrations
        </TabsTrigger>
        <TabsTrigger className={tabTriggerStyles} value="settings">
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="about"
        className="bg-dark-primary mt-5 h-[calc(100%-40px)]"
      >
        <AboutContent channel={channel} />
      </TabsContent>
      <TabsContent
        value="members"
        className="bg-dark-secondary pt-5 mt-0 h-[calc(100%-40px)]"
      >
        <MemberContent />
      </TabsContent>
    </>
  );
}

export default ContentTabList;
