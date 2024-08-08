import { Bookmark, BookmarkFolder } from ".";
import { ConversationType } from "./conversation.type";
import { User } from "./user.type";

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
}
