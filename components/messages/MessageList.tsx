/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { MessageApiKeys } from "@/app/apis/api-key/message-api.key";
import {
  isAtBottom,
  isElementInViewport,
  scrollElementToBottom,
} from "@/app/helpers";
import { addMessage } from "@/app/helpers/addMessage";
import { SerializeMessageToMap } from "@/app/helpers/serializeMessageToMap";
import { getMessages } from "@/app/services/message.action";
import { pusher } from "@/configs/pusher";
import { MessageCluster, MessageItemProps } from "@/types";
import { ConversationType } from "@/types/conversation.type";
import { MessageListProps } from "@/types/message-list.type";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
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
import { updateMessageByUniqueId } from "@/app/helpers/updateMessage";

function MessageList({ store, type, conversationId }: MessageListProps) {
  const [isPending, startTransition] = useTransition();
  const { queryMessageUrl, setQueryMessageUrl, allMessages, setAllMessages } =
    store;
  const { cid } = useParams();
  const currentConversationId =
    type === ConversationType.CHANNEL ? cid : cid.slice(1);
  const chatListRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, any>>({});
  const [scrollBottom, setScrollBottom] = useState(false);
  const [jumpTo, setJumpTo] = useState("");
  const [scrollToKey, setScrollToKey] = useState<string>("");
  const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    conversationId ? MessageApiKeys.getMessage(queryMessageUrl) : null,
    getMessages,
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const loadMoreMessages = () => {
    startTransition(async () => {
      if (!allMessages) return;
      const firstCluster: MessageCluster = allMessages.entries().next()
        .value[1];
      setQueryMessageUrl(
        `?receiverId=${conversationId}&beforeId=${firstCluster.messages[0]._id}`
      );
    });
  };

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (conversationId !== currentConversationId || !allMessages) return;
      const { scrollTop } = e.target as HTMLDivElement;

      if (scrollTop <= 0 && !isPending) {
        if (
          !(
            queryMessageUrl.includes("beforeId") &&
            allMessages &&
            allMessages.size === 0
          )
        ) {
          setIsLoadMoreMsg(true);
          loadMoreMessages();
        }
      }
      const lastCluster = Array.from(allMessages.values()).pop();
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
        setQueryMessageUrl(
          `?receiverId=${conversationId}&afterId=${idOfMessagesOfLastCluster}`
        );
        setJumpTo("");
      }
    },
    [loadMoreMessages, isPending]
  );

  useLayoutEffect(() => {
    setAllMessages(new Map());
  }, [cid]);
  useLayoutEffect(() => {
    if (!chatListRef.current) return;
    if (
      scrollToKey === undefined ||
      (chatListRef.current as HTMLDivElement).scrollTop !== 0
    )
      return;
    if (itemRefs.current[scrollToKey]) {
      itemRefs.current[scrollToKey].scrollIntoView();
      setScrollToKey("");
    }
  }, [scrollToKey]);

  useEffect(() => {
    if (data && data.length > 0) {
      const messages = SerializeMessageToMap(data);
      if (jumpTo) {
        setScrollToKey(jumpTo);
      } else {
        if (isLoadMoreMsg) {
          setIsLoadMoreMsg(false);
          const firstCluster: MessageCluster = allMessages.entries().next()
            .value[1];
          setScrollToKey(firstCluster.messages[0]._id);
        }
      }
      if (allMessages.size !== 0 && isLoadMoreMsg) {
        const newMessages = new Map(allMessages);
        const arrayCluster = Array.from(messages.values());
        const lastCluster = arrayCluster.pop();
        if (lastCluster) {
          const isExisting = newMessages.get(lastCluster._id);
          if (isExisting) {
            isExisting.messages = [
              ...lastCluster.messages,
              ...isExisting.messages,
            ];
          }
        }
        arrayCluster.forEach((cluster) => {
          newMessages.set(cluster._id, cluster);
        });
        setAllMessages(newMessages);
      } else setAllMessages(messages);
    } else {
      setScrollBottom(true);
      setIsLoadMoreMsg(false);
    }
  }, [data]);

  useEffect(() => {
    let channelEvent: any = {
      unsubscribe: () => null,
      unbind: (event: string, callBack: any) => null,
    };
    const handleAddNewMessage = (message: MessageItemProps) => {
      const clusterId = new Date(message.createdAt as string)
        .toISOString()
        .split("T")[0];

      if (!isAtBottom(chatListRef)) {
        setScrollBottom(false);
      }

      const newMessagesList = addMessage({
        messagesList: allMessages || new Map<string, MessageCluster>(),
        clusterId,
        message,
      });
      setAllMessages(newMessagesList);
    };
    const handleUpdateMessage = (message: MessageItemProps) => {
      const clusterId = new Date(message.createdAt as string)
        .toISOString()
        .split("T")[0];
      const newMessagesList = updateMessageByUniqueId({
        clusterId,
        message,
        messagesList: allMessages || new Map<string, MessageCluster>(),
        updateSending: false,
      });
      setAllMessages(newMessagesList);
    };
    if (conversationId) {
      channelEvent = pusher.subscribe(conversationId);
      channelEvent.bind("new-message", handleAddNewMessage);
      channelEvent.bind("update-message", handleUpdateMessage);
    }

    return () => {
      channelEvent.unsubscribe();
      channelEvent.unbind("new-message", handleAddNewMessage);
      channelEvent.unbind("update-message", handleUpdateMessage);
    };
  }, [conversationId, allMessages]);

  useEffect(() => {
    if (scrollBottom && !scrollToKey && chatListRef.current) {
      scrollElementToBottom(chatListRef);
    }
  }, [scrollBottom, allMessages]);

  useEffect(() => {
    setQueryMessageUrl(`?receiverId=${conversationId}`);
  }, [conversationId]);

  return isLoading && !isLoadMoreMsg ? (
    <div className="size-full flex justify-center items-center">
      <Loader2 className="animate-spin" size={30} />
    </div>
  ) : (
    <div className="dropzone min-h-0 pt-10 relative">
      {isLoadMoreMsg && (
        <div className="flex justify-center absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}
      <div
        ref={chatListRef}
        id="message-list"
        className="h-full overflow-y-auto"
        onScroll={onScroll}
      >
        {allMessages &&
          allMessages.size > 0 &&
          conversationId === currentConversationId &&
          Array.from(allMessages).map(([clusterId, clusterMessages]) => (
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
          `?receiverId=${conversationId}&aroundId=666afbaad35a11a17c2b0dd6`
        );
      }}
    >
      CLICK
    </div> */}
    </div>
  );
}

export default MessageList;
