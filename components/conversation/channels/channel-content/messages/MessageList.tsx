/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { messageAPI } from "@/app/apis/messageAPI";
import { useChannelStore } from "@/app/store/channel.store";
import { pusher } from "@/configs/pusher";
import { MessageCluster, MessageItemProps } from "@/types";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import useSWR from "swr";
import MessageItemStatus from "./message-item-status/MessageItemStatus";
import DayDivider from "./message-item/DayDivider";
import MessageItem from "./message-item/MessageItem";
import "./styles.scss";
import {
  isAtBottom,
  isElementInViewport,
  scrollElementToBottom,
} from "@/app/helpers";

function MessageList() {
  const channel = useChannelStore((state) => state.currentChannel);
  const [isPending, startTransition] = useTransition();
  const [queryUrl, setQueryUrl] = useState<string>(
    `?receiverId=${channel._id}`
  );
  const currentChannelId = usePathname().split("/C/")[1];
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

  const chatListRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, any>>({});
  const [scrollBottom, setScrollBottom] = useState(false);
  const [jumpTo, setJumpTo] = useState("");
  const [scrollToKey, setScrollToKey] = useState<string>("");
  const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);
  const { data, error, isLoading } = useSWR(
    channel._id ? queryUrl : null,
    messageAPI.getMessagesList,
    {
      revalidateIfStale: false,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );
  console.log(data);
  const loadMoreMessages = () => {
    startTransition(async () => {
      const firstCluster: MessageCluster = messages.entries().next().value[1];

      setQueryUrl(
        `?receiverId=${channel._id}&beforeId=${firstCluster.messages[0]._id}`
      );
    });
  };

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (channel._id !== currentChannelId) return;
      const { scrollTop } = e.target as HTMLDivElement;

      if (scrollTop <= 0 && !isPending) {
        if (!(queryUrl.includes("beforeId") && data && data.length === 0)) {
          setIsLoadMoreMsg(true);
          loadMoreMessages();
        }
      }
      const lastCluster = Array.from(messages.values()).pop();
      if (!lastCluster) return;
      const latestLength = lastCluster?.messages.length;
      const key =
        lastCluster.messages[
          latestLength < 8 ? latestLength - 1 : latestLength - 8
        ]?._id;
      const messagesOfLastCluster = lastCluster.messages;
      const idOfMessagesOfLastCluster =
        messagesOfLastCluster[messagesOfLastCluster.length - 1]._id;

      if (
        key &&
        jumpTo &&
        isElementInViewport(
          itemRefs.current[key],
          chatListRef.current as HTMLDivElement
        )
      ) {
        setQueryUrl(
          `?receiverId=${channel._id}&afterId=${idOfMessagesOfLastCluster}`
        );
        setJumpTo("");
      }
    },
    [loadMoreMessages, isPending]
  );

  useLayoutEffect(() => {
    if (
      scrollToKey === undefined ||
      (chatListRef.current as HTMLDivElement).scrollTop !== 0
    )
      return;
    itemRefs.current[scrollToKey] &&
      itemRefs.current[scrollToKey].scrollIntoView();
  }, [scrollToKey]);

  useLayoutEffect(() => {
    setMessages([], true);
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      if (jumpTo) {
        setMessages([...data], true);
        setScrollToKey(jumpTo);
      } else {
        if (isLoadMoreMsg) {
          setIsLoadMoreMsg(false);
          const firstCluster: MessageCluster = messages.entries().next()
            .value[1];
          setScrollToKey(firstCluster.messages[0]._id);
        }

        setMessages([...data], false);
        messages.size === 0 && setScrollBottom(true);
      }
    } else setIsLoadMoreMsg(false);
  }, [data]);

  useEffect(() => {
    let channelEvent: any = {
      unsubscribe: () => null,
      unbind: (event: string, callBack: any) => null,
    };
    const handleAddNewMessage = (message: MessageItemProps) => {
      const cluster: MessageCluster = {
        _id: new Date(message.createdAt as string).toISOString().split("T")[0],
        messages: [message],
      };

      if (!isAtBottom(chatListRef)) {
        setScrollBottom(false);
      }
      setMessages(cluster);
    };
    const handleUpdateMessage = (message: MessageItemProps) => {
      const clusterId = new Date(message.createdAt as string)
        .toISOString()
        .split("T")[0];
      updateMessageByUniqueId(message, clusterId, false);
    };
    if (channel?._id) {
      channelEvent = pusher.subscribe(channel._id);
      channelEvent.bind("new-message", handleAddNewMessage);
      channelEvent.bind("update-message", handleUpdateMessage);
    }

    return () => {
      channelEvent.unsubscribe();
      channelEvent.unbind("new-message", handleAddNewMessage);
      channelEvent.unbind("update-message", handleUpdateMessage);
    };
  }, [channel]);

  useEffect(() => {
    if (scrollBottom && !scrollToKey) {
      scrollElementToBottom(chatListRef);
    }
  }, [scrollBottom, messages]);

  useEffect(() => {
    setQueryUrl(`?receiverId=${channel._id}`);
  }, [channel]);

  return (
    <div className="dropzone h-[calc(100%-156px)] pt-10 relative">
      {isLoadMoreMsg && (
        <div className="flex justify-center absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}
      <div
        ref={chatListRef}
        onScroll={onScroll}
        id="message-list"
        className="h-full overflow-y-auto"
      >
        {messages.size > 0 &&
          channel._id === currentChannelId &&
          Array.from(messages).map(([clusterId, clusterMessages]) => (
            <Fragment key={clusterId}>
              <DayDivider
                ref={(el: HTMLDivElement) => {
                  itemRefs.current[clusterId] = el;
                  return itemRefs.current[clusterId];
                }}
                createdAt={clusterId}
              />
              {clusterMessages.messages.map((item: MessageItemProps) =>
                !item?.isSending ? (
                  <MessageItem
                    ref={(el: HTMLDivElement) => {
                      itemRefs.current[item._id] = el;
                      return itemRefs.current[item._id];
                    }}
                    key={item._id}
                    message={item}
                  />
                ) : (
                  <MessageItemStatus key={item.uniqueId} message={item} />
                )
              )}
            </Fragment>
          ))}
      </div>
      {/* <div ref={chatEndRef} /> */}
      {/* <div
        onClick={() => {
          setJumpTo("666afbaad35a11a17c2b0dd6");
          setQueryUrl(
            `?receiverId=${channel._id}&aroundId=666afbaad35a11a17c2b0dd6`
          );
        }}
      >
        CLICK
      </div> */}
    </div>
  );
}

export default MessageList;
