import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { ChannelProps } from "@/types";
import { Copy } from "lucide-react";
import ContentButton from "../ContentButton";

interface IProps {
  channel: ChannelProps;
}

function AboutContent({ channel }: IProps) {
  return (
    <ScrollArea className="h-full px-7">
      <ContentButton
        channel={channel}
        title="Channel name"
        subTitle={`# ${channel.name}`}
      />
      <div className="my-5">
        <ContentButton
          channel={channel}
          title="Topic"
          subTitle={channel.topic ? channel.topic : "Add a topic"}
          className="rounded-b-none"
        />
        <ContentButton
          channel={channel}
          title="Description"
          subTitle={
            channel.description ? channel.description : "Add a description"
          }
        />
        <ContentButton
          channel={channel}
          title="Created by"
          subTitle={"Ngọc Thắng"}
          editable={false}
        />

        <ContentButton
          channel={channel}
          title="Leave channel"
          editable={false}
          className="text-[#E01E5A]"
        />
      </div>
      <ContentButton
        channel={channel}
        title="Files"
        editable={false}
        subTitle="There aren’t any files to see here right now. But there could be — drag and drop any file into the message pane to add it to this conversation."
      />
      <div className="flex gap-2 items-center py-5 mb-5 pl-1">
        <p className="text-[13px] text-[#E8E8E8B3]">
          Channel ID: {channel._id}
        </p>
        <Copy
          size={13}
          className="text-text-primary cursor-pointer hover:opacity-90"
        />
      </div>
    </ScrollArea>
  );
}

export default AboutContent;
