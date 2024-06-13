/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { channelAPI } from "@/app/apis/channelAPI";
import { useChannelStore } from "@/app/store/channel.store";
import { pusher } from "@/configs/pusher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ChannelContentHeader from "./header/ChannelContentHeader";
import { Separator } from "@/components/ui/separator";
import MessageContainer from "./messages/MessageContainer";
import { ChannelProps } from "@/types";

interface IProps {
  cid: string;
}

function ChannelContent({ cid }: IProps) {
  const {
    data: channel,
    error,
    isLoading,
  } = useSWR(`/${cid}`, channelAPI.getChannelById);
  const { setCurrentChannel, setPartialDataChannel } = useChannelStore(
    (state) => ({
      setCurrentChannel: state.setCurrentChannel,
      setPartialDataChannel: state.setPartialDataChannel,
    })
  );

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
      <div className="flex-1 h-[calc(100%-126px)]">{<MessageContainer />}</div>
    </div>
  );
}

export default ChannelContent;
