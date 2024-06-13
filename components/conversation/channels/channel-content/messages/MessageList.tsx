/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { messageAPI } from "@/app/apis/messageAPI";
import { useChannelStore } from "@/app/store/channel.store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pusher } from "@/configs/pusher";
import { MessageItemProps } from "@/types";
import { Loader2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import useSWR from "swr";
import MessageItemStatus from "./message-item-status/MessageItemStatus";
import DayDivider from "./message-item/DayDivider";
import MessageItem from "./message-item/MessageItem";

function MessageList() {
  const channel = useChannelStore((state) => state.currentChannel);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const {
    isSendingNewMessage,
    setIsSendingNewMessage,
    messages,
    setMessages,
    updateMessageByUniqueId,
  } = useChannelStore((state) => ({
    isSendingNewMessage: state.isSendingNewMessage,
    setIsSendingNewMessage: state.setIsSendingNewMessage,
    messages: state.messages,
    setMessages: state.setMessages,
    updateMessageByUniqueId: state.updateMessageByUniqueId,
  }));
  const queryURL = useMemo(() => {
    if (!channel) return "";
    const params = new URLSearchParams();

    params.set("channelId", channel._id);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  }, [channel, page]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollBottom, setScrollBottom] = useState(false);
  const [scrollToKey, setScrollToKey] = useState<string>("");
  const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);
  const { data, error, isLoading } = useSWR(
    queryURL,
    messageAPI.getMessagesList
  );

  const loadMoreMessages = () => {
    startTransition(async () => {
      setPage((prev) => prev + 1);
    });
  };

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.target as HTMLDivElement;
      if (scrollTop <= 0 && !isPending && data && data[0]) {
        setIsLoadMoreMsg(true);
        loadMoreMessages();
      }
    },
    [loadMoreMessages, isPending]
  );

  useLayoutEffect(() => {
    if (
      scrollToKey === undefined ||
      (containerRef.current as HTMLDivElement).scrollTop !== 0
    )
      return;
    itemRefs.current[scrollToKey] &&
      itemRefs.current[scrollToKey].scrollIntoView();
  }, [scrollToKey]);
  useEffect(() => {
    let channelEvent: any = {
      unsubscribe: () => null,
      unbind: (event: string, callBack: any) => null,
    };
    const handleAddNewMessage = (message: MessageItemProps) => {
      setMessages(message);
    };
    const handleUpdateMessage = (message: MessageItemProps) => {
      updateMessageByUniqueId(message, false);
    };
    if (!isLoading) {
      if (data && data[0]) {
        if (page === 1) {
          setMessages(data[0].messages, true);
          setScrollBottom(true);
        } else {
          setScrollToKey(messages[0]._id);
          const newMessages = [...data[0].messages, ...messages];
          setIsLoadMoreMsg(false);
          setMessages(newMessages, true);
        }
      } else setIsLoadMoreMsg(false);
      if (channel?._id) {
        channelEvent = pusher.subscribe(channel._id);
        channelEvent.bind("new-message", handleAddNewMessage);
        channelEvent.bind("update-message", handleUpdateMessage);
      }
    }
    return () => {
      channelEvent.unsubscribe();
      channelEvent.unbind("new-message", handleAddNewMessage);
      channelEvent.unbind("update-message", handleUpdateMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, data]);

  useEffect(() => {
    if (chatEndRef.current && isSendingNewMessage) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      setIsSendingNewMessage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSendingNewMessage]);

  useEffect(() => {
    if (scrollBottom)
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollBottom]);

  return (
    <ScrollArea
      ref={containerRef}
      onScroll={onScroll}
      className="dropzone h-[calc(100%-156px)] mt-5"
    >
      {isLoadMoreMsg && (
        <div className="flex justify-center mb-5">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}
      <div className="flex-1 h-full">
        <DayDivider />
        {messages.length > 0 &&
          messages.map((item: MessageItemProps) =>
            !item?.isSending ? (
              <MessageItem
                key={item._id}
                message={item}
                ref={(el: HTMLDivElement) => {
                  itemRefs.current[item._id] = el;
                  return itemRefs.current[item._id];
                }}
              />
            ) : (
              <MessageItemStatus key={item.uniqueId} message={item} />
            )
          )}
      </div>
      <div ref={chatEndRef} />
    </ScrollArea>
  );
}

export default MessageList;
