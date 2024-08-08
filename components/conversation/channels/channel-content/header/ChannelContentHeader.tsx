"use client";
import ChannelButton from "./channel-button/ChannelButton";
import HuddleButton from "./HuddleButton";
import MemberButton from "./MemberButton";
import BookmarkWrapper from "../../../../bookmark/BookmarkWrapper";
import { useChannelStore } from "@/app/store/channel.store";
import { useMemo } from "react";
import { ConversationType } from "@/types/conversation.type";

function ChannelContentHeader() {
  const channel = useChannelStore((state) => state.currentChannel);
  const channelStore = useChannelStore();
  const memberIds = useMemo(() => {
    if (channel && channel.members)
      return channel.members.map((member) => member.userID);
    return [];
  }, [channel]);
  return (
    <div>
      <div className="h-[50px] pl-5 pr-3 flex items-center justify-between">
        <ChannelButton />
        <div className="flex items-center gap-3">
          <MemberButton />
          <HuddleButton receiverId={channel._id} memberIds={memberIds} />
        </div>
      </div>
      <div className="pl-5 pr-3 h-9 flex items-center">
        <BookmarkWrapper type={ConversationType.CHANNEL} store={channelStore} />
      </div>
    </div>
  );
}

export default ChannelContentHeader;
