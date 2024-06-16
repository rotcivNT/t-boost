/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { channelAPI } from "@/app/apis/channelAPI";
import { useChannelStore } from "@/app/store/channel.store";
import { Separator } from "@/components/ui/separator";
import { pusher } from "@/configs/pusher";
import { useEffect } from "react";
import useSWR from "swr";
import ChannelContentHeader from "./header/ChannelContentHeader";
import MessageContainer from "./messages/MessageContainer";

interface IProps {
  cid: string;
}

function ChannelContent({ cid }: IProps) {
  const {
    data: channel,
    error,
    isLoading,
  } = useSWR(`/${cid}`, channelAPI.getChannelById);
  const { setCurrentChannel, setPartialDataChannel, currentChannel } =
    useChannelStore((state) => ({
      setCurrentChannel: state.setCurrentChannel,
      setPartialDataChannel: state.setPartialDataChannel,
      currentChannel: state.currentChannel,
    }));

  useEffect(() => {
    let channelEvent: any = {
      unsubscribe: () => null,
      unbind: (event: string, callBack: any) => null,
    };
    const handleChangeMembership = (data: any) => {
      if (data.code === 1) {
        setPartialDataChannel({ members: data.members });
      }
    };

    if (!isLoading && !error) {
      setCurrentChannel(channel);

      if (channel) {
        channelEvent = pusher.subscribe(channel._id);
        channelEvent.bind("new-member-joined", handleChangeMembership);
      }
    }
    return () => {
      channelEvent.unsubscribe();
      channelEvent.unbind("new-member-joined", handleChangeMembership);
    };
  }, [isLoading, channel]);

  return (
    <div className="flex flex-col h-full">
      <ChannelContentHeader />
      <Separator />
      <div className="flex-1 h-[calc(100%-126px)]">
        <MessageContainer />
      </div>
    </div>
  );
}

export default ChannelContent;
