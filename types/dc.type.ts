import { MessageType } from "@/app/apis/api-payload";
import { Bookmark, BookmarkFolder } from ".";
import { ConversationType } from "./conversation.type";
import { User } from "./user.type";

export interface LastMessage {
  senderId: string;
  content: string;
  createdAt: string;
  type: MessageType;
}

// dc = Direct Conversation
export interface DirectConversation {
  _id: string;
  type: ConversationType;
  workspaceId: string;
  topic: string;
  members: string[];
  membersInfo: User[];
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: LastMessage;
}
