/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ConversationApiKeys } from "@/app/apis/api-key/conversation-api.key";
import { getChannelById } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { useMessageSharedStore } from "@/app/store/message-shared.store";
import { Separator } from "@/components/ui/separator";
import { pusher } from "@/configs/pusher";
import { ChannelProps } from "@/types";
import { useEffect } from "react";
import useSWR from "swr";
import ChannelMessageContainer from "../../../messages/ChannelMessageContainer";
import ChannelContentHeader from "./header/ChannelContentHeader";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface IProps {
  cid: string;
}

function ChannelContent({ cid }: IProps) {
  const { data: channel, isLoading } = useSWR(
    ConversationApiKeys.getChannelByIdKey(cid),
    getChannelById
  );
  const router = useRouter();
  const auth = useAuth();

  const { setCurrentChannel, setPartialDataChannel } = useChannelStore(
    (state) => ({
      setCurrentChannel: state.setCurrentChannel,
      setPartialDataChannel: state.setPartialDataChannel,
    })
  );
  const setQueryMessageUrl = useMessageSharedStore(
    (state) => state.setQueryMessageUrl
  );
  useEffect(() => {
    if (!auth.isSignedIn) return;

    let channelEvent: any = {
      unsubscribe: () => null,
      unbind: (event: string, callBack: any) => null,
    };
    const handleChangeMembership = (data: any) => {
      if (data.code === 1) {
        setPartialDataChannel({ members: data.members });
      }
    };

    const handleAddBookmark = (data: ChannelProps) => {
      if (data) {
        setPartialDataChannel({
          bookmarkFolders: data.bookmarkFolders,
          bookmarks: data.bookmarks,
        });
      }
    };

    const handleOutGroup = (res: any) => {
      router.push(`/workspace/${auth.orgId}/home`);
    };
    const userEvent = pusher.subscribe(auth.userId);
    userEvent.bind("member.deleted", handleOutGroup);

    if (channel) {
      setCurrentChannel(channel[0]);
      setQueryMessageUrl(`?receiverId=${channel[0]._id}`);
      if (channel && channel[0]._id) {
        channelEvent = pusher.subscribe(channel[0]._id);
        channelEvent.bind("member.joined", handleChangeMembership);
        channelEvent.bind("member.deleted", handleChangeMembership);
        channelEvent.bind("add-bookmark", handleAddBookmark);
      }
    }
    return () => {
      channelEvent.unsubscribe();
      channelEvent.unbind("member.joined", handleChangeMembership);
      channelEvent.unbind("member.deleted", handleChangeMembership);
      channelEvent.unbind("add-bookmark", handleAddBookmark);
      userEvent.unbind("member.deleted", handleOutGroup);
    };
  }, [isLoading, channel]);

  return (
    <div className="flex flex-col h-full">
      <ChannelContentHeader />
      <Separator />
      <div className="flex-1 h-[calc(100%-126px)]">
        <ChannelMessageContainer />
      </div>
    </div>
  );
}

export default ChannelContent;
