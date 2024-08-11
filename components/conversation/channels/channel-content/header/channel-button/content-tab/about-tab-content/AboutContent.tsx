import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelProps } from "@/types";
import { Copy } from "lucide-react";
import ContentButton from "../ContentButton";
import { RemoveUserProps } from "@/app/apis/api-payload";
import { useAuth } from "@clerk/nextjs";
import { removeMember } from "@/app/services/channel.action";
import { ApiStatus } from "@/app/utils/api.response";
import { useChannelStore } from "@/app/store/channel.store";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

interface IProps {
  channel: ChannelProps;
}

function AboutContent({ channel }: IProps) {
  const setPartialDataChannel = useChannelStore(
    (state) => state.setPartialDataChannel
  );
  const router = useRouter();
  const auth = useAuth();
  const onRemoveUser = async () => {
    if (!auth.isSignedIn) return;
    const payload: RemoveUserProps = {
      channelId: channel._id,
      senderId: auth.userId,
      deleteId: auth.userId,
    };
    try {
      router.push(`workspace/${auth.orgId}/home`);
      const res = await removeMember(payload);
      if (res?.status === ApiStatus.OK) {
        mutate(`?workspaceId=${auth.orgId}&userId=${auth.userId}`);
        setPartialDataChannel({ members: res.data.members });
      }
    } catch (e) {
      console.log(e);
    }
  };
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
          onClick={onRemoveUser}
          title="Leave channel"
          editable={false}
          className="text-[#E01E5A] cursor-pointer"
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
