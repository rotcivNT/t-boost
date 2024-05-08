/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { channelAPI } from "@/app/apis/channelAPI";
import { useChannelStore } from "@/app/store/channel.store";
import { useEffect } from "react";
import useSWR from "swr";
import ChannelContentHeader from "./header/ChannelContentHeader";

interface IProps {
  cid: string;
}

function ChannelContent({ cid }: IProps) {
  const {
    data: channel,
    error,
    isLoading,
  } = useSWR(`/${cid}`, channelAPI.getChannelById);
  const setCurrentChannel = useChannelStore((state) => state.setCurrentChannel);

  useEffect(() => {
    setCurrentChannel(channel);
  }, [channel]);
  return (
    <div>
      <ChannelContentHeader />
    </div>
  );
}

export default ChannelContent;
