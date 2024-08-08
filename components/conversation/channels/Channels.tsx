/* eslint-disable react-hooks/exhaustive-deps */
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

export const ChannelLoading = () => (
  <div className="animate-pulse flex items-center px-3 gap-2 h-7 w-full rounded-[5px]">
    <div className="h-4 w-4 bg-[rgba(50,53,56,1)] rounded"></div>
    <div className="flex-1 h-4 bg-[rgba(50,53,56,1)] rounded"></div>
  </div>
);

function Channels({ type, workspaceId, userId }: IProps) {
  const { data, isLoading } = useSWR(
    `?workspaceId=${workspaceId}&userId=${userId}`,
    getAllChannelsById
  );

  const { setChannels, channels } = useChannelStore((state) => ({
    setChannels: state.setChannels,
    channels: state.channels,
  }));

  useEffect(() => {
    if (data) {
      setChannels(data);
    }
  }, [data]);

  return (
    <ConversationSidebarItem title="Channels">
      {isLoading || !data ? (
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
            href={`/workspace/${workspaceId}/home/${channel._id}`}
            icon={<ChannelIcon />}
          />
        ))
      )}
      <CreateButton title="Add channels" />
    </ConversationSidebarItem>
  );
}

export default Channels;
