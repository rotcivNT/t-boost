"use client";
import { ConversationState, ConversationType } from "@/types/conversation.type";
import AddBookmarkMenu from "./AddBookmarkMenu";
import BookmarkList from "./BookmarkList";
import useSWR from "swr";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ConversationApiKeys,
  GetConversationApiFunction,
} from "@/app/apis/api-key/conversation-api.key";

function BookmarkWrapper<T extends ConversationType>({
  type,
  store,
}: ConversationState<T>) {
  const { cid: conversationId } = useParams();
  const apiKey = useMemo(() => {
    switch (type) {
      case ConversationType.CHANNEL:
        return ConversationApiKeys.getChannelByIdKey(conversationId as string);
      case ConversationType.DIRECT_MESSAGE:
        return ConversationApiKeys.getDCByIdKey(
          (conversationId as string).slice(1)
        );
    }
  }, [conversationId, type]);

  const { data, isLoading } = useSWR(apiKey, GetConversationApiFunction[type]);
  console.log("bookmark", data);

  return (
    data && (
      <div className="flex justify-between items-center flex-1">
        <BookmarkList
          bookmarkFolders={data[0].bookmarkFolders}
          bookmarks={data[0].bookmarks}
        />
        <AddBookmarkMenu data={data} type={type} />
      </div>
    )
  );
}

export default BookmarkWrapper;
