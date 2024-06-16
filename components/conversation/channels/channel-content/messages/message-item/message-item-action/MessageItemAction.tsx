"use client";
import { UpdateMessageProps } from "@/app/apis/api-payload";
import { updateMessage } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import { pusher } from "@/configs/pusher";
import { MessageItemProps } from "@/types";
import { EmojiClickData, Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";
import { RefObject, useState } from "react";
import FowardButton from "./FowardButton";
import MoreActionButton from "./MoreActionButton";
const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

interface IProps {
  message: MessageItemProps;
  reactions: any;
  wrapperRef: RefObject<HTMLDivElement>;
  isOpenDropdown: boolean;
  setIsOpenDropdown: (isOpen: boolean) => void;
}

function MessageItemAction({
  message,
  reactions,
  wrapperRef,
  isOpenDropdown,
  setIsOpenDropdown,
}: IProps) {
  const { updateMessageLocal, channel } = useChannelStore((state) => ({
    channel: state.currentChannel,
    updateMessageLocal: state.updateMessage,
  }));
  const [showReactions, setShowReactions] = useState(false);
  const iconStyles = {
    size: 20,
    color: "#ffffffb3",
  };
  const onSelectEmoji = async (e: EmojiClickData) => {
    try {
      let unified = e.unified;
      let isExist = false;
      let updatedReactions = reactions.map((item: any) => {
        if (item.emoji === unified) {
          item.count++;
          isExist = true;
        }
        return item;
      });
      if (!isExist) {
        updatedReactions.push({
          emoji: unified,
          count: 1,
        });
      }
      updateMessageLocal(message._id, "reactions", updatedReactions);
      setShowReactions(false);

      const payload: UpdateMessageProps = {
        _id: message._id,
        reactions: updatedReactions,
        socketId: pusher.connection.socket_id,
        channelId: channel._id,
      };

      await updateMessage(payload);
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteMessage = async (isRecall: boolean = false) => {
    try {
      const payload: UpdateMessageProps = {
        _id: message._id,
        channelId: channel._id,
        socketId: pusher.connection.socket_id,
      };
      if (isRecall) {
        payload.isRecall = true;
        updateMessageLocal(message._id, "isRecall", true);
      } else {
        payload.isDelete = true;
        updateMessageLocal(message._id, "isDelete", true);
      }
      await updateMessage(payload);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex px-1 relative" ref={wrapperRef}>
      <Button
        variant="icon"
        className="p-2 h-auto hover:bg-[rgba(255,255,255,0.06)]"
        onClick={() => setShowReactions((pre) => !pre)}
      >
        <Smile {...iconStyles} />
      </Button>
      <FowardButton message={message} />
      <MoreActionButton
        onDeleteMessage={onDeleteMessage}
        container={wrapperRef}
        isOpen={isOpenDropdown}
        setIsOpen={setIsOpenDropdown}
      />
      <div className="absolute top-0 right-full">
        <Picker
          open={showReactions}
          reactionsDefaultOpen={true}
          theme={Theme.DARK}
          onReactionClick={(e) => onSelectEmoji(e)}
          onEmojiClick={(e) => onSelectEmoji(e)}
          lazyLoadEmojis={true}
          className="z-[999]"
        />
      </div>
    </div>
  );
}

export default MessageItemAction;
