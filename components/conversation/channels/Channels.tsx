import { ChannelIcon } from "@/assets/images/ChannelIcon";
import useSWR from "swr";
import ConversationSidebarButton from "../ConversationSidebarButton";
import ConversationSidebarItem from "../ConversationSidebarItem";

import { getAllChannelsById } from "@/app/services/action";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useChannelStore } from "@/app/store/channel.store";
const CreateButton = dynamic(() => import("../CreateButton"), { ssr: false });

interface IProps {
  type?: string;
  workspaceId?: string;
  userId?: string;
}

const ChannelLoading = () => (
  <div className="animate-pulse flex items-center px-3 gap-2 h-7 w-full rounded-[5px]">
    <div className="h-4 w-4 bg-[rgba(50,53,56,1)] rounded"></div>
    <div className="flex-1 h-4 bg-[rgba(50,53,56,1)] rounded"></div>
  </div>
);

function Channels({ type, workspaceId, userId }: IProps) {
  const {
    data: channels,
    error,
    isLoading,
  } = useSWR(
    `?workspaceId=${workspaceId}&userId=${userId}`,
    getAllChannelsById
  );
  const setChannels = useChannelStore((state) => state.setChannels);

  useEffect(() => {
    if (!isLoading && !error) {
      setChannels(channels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <ConversationSidebarItem title="Channels">
      {isLoading || !channels ? (
        <>
          <ChannelLoading />
          <ChannelLoading />
          <ChannelLoading />
          <ChannelLoading />
          <ChannelLoading />
          <ChannelLoading />
        </>
      ) : (
        channels &&
        channels?.map((channel: any) => (
          <ConversationSidebarButton
            key={channel._id}
            title={channel.name}
            href={`/workspace/${workspaceId}/home/C/${channel._id}`}
            icon={<ChannelIcon />}
          />
        ))
      )}
      <CreateButton title="Add channels" />
    </ConversationSidebarItem>
  );
}

export default Channels;
