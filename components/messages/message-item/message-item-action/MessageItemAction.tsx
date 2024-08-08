"use client";
import { UpdateMessageProps } from "@/app/apis/api-payload";
import {
  updateMessageByUniqueId,
  updatePartialMessageById,
} from "@/app/helpers/updateMessage";
import { updateMessage } from "@/app/services/message.action";
import { useChannelStore } from "@/app/store/channel.store";
import { useMessageSharedStore } from "@/app/store/message-shared.store";
import { Button } from "@/components/ui/button";
import { pusher } from "@/configs/pusher";
import { MessageCluster, MessageItemProps } from "@/types";
import { EmojiClickData, Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";
import { RefObject, useMemo, useState } from "react";
import FowardButton from "./ForwardButton";
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
  const { channel } = useChannelStore((state) => ({
    channel: state.currentChannel,
  }));
  const { queryMessageUrl, messages, setAllMessages } = useMessageSharedStore(
    (state) => ({
      queryMessageUrl: state.queryMessageUrl,
      messages: state.allMessages,
      setAllMessages: state.setAllMessages,
    })
  );
  const clusterId = useMemo(() => {
    return (message.createdAt as string).split("T")[0];
  }, [message.createdAt]);
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
      const optimisticData = updatePartialMessageById({
        messageId: message._id,
        key: "reactions",
        value: updatedReactions,
        clusterId: clusterId,
        messagesList: messages as Map<string, MessageCluster>,
      });
      setAllMessages(optimisticData);
      setShowReactions(false);
      const payload: UpdateMessageProps = {
        _id: message._id,
        reactions: updatedReactions,
        socketId: pusher.connection.socket_id,
        channelId: channel._id,
        sender: message.sender,
      };

      const res = await updateMessage(payload);
      if (res) {
        const newCluster = updateMessageByUniqueId({
          updateSending: false,
          message: res,
          clusterId: clusterId,
          messagesList: messages,
        });
        setAllMessages(newCluster);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteMessage = async (isRecall: boolean = false) => {
    try {
      let optimisticData = messages;
      const payload: UpdateMessageProps = {
        _id: message._id,
        channelId: channel._id,
        socketId: pusher.connection.socket_id,
        sender: message.sender,
      };
      if (isRecall) {
        payload.isRecall = true;
        optimisticData = updatePartialMessageById({
          clusterId: clusterId,
          messageId: message._id,
          messagesList: messages as Map<string, MessageCluster>,
          key: "isRecall",
          value: true,
        });
      } else {
        payload.isDelete = true;
        optimisticData = updatePartialMessageById({
          clusterId: clusterId,
          messageId: message._id,
          messagesList: messages as Map<string, MessageCluster>,
          key: "isDelete",
          value: true,
        });
      }
      setAllMessages(optimisticData);
      const res = await updateMessage(payload);
      if (res) {
        const newCluster = updateMessageByUniqueId({
          updateSending: false,
          message: res,
          clusterId: clusterId,
          messagesList: messages,
        });
        setAllMessages(newCluster);
      }
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
        message={message}
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
