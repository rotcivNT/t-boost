import { BookmarkData } from "@/components/bookmark/dialog-content/BookmarkDialogContent";
import { ChannelProps, FileData, MessageItemProps } from "@/types";
import { ConversationType } from "@/types/conversation.type";

export type sendInvitationPayload = {
  workspaceId: string;
  channelId: string;
  senderEmail: string;
  receiverEmail: string;
  role: string;
  senderId: string;
};

interface Reaction {
  emoji: string;
  count: number;
  reactorName: string;
}

export interface LinkMetadata {
  url: string;
  favicon: string;
  domain: string;
  sitename: string;
  image: string;
  description: string;
}

export enum MessageType {
  TEXT = "text",
  VIDEO = "video",
  FILE = "file",
  IMAGE = "image",
  LINK = "link",
  SYSTEM = "system",
  MEETING = "meeting",
}

export enum SystemMessageContent {
  MEMBER_JOINED = "member.joined",
  MEMBER_LEFT = "member.left",
  MEMBER_DELETED = "member.deleted",
  MEMBER_INVITED = "member.invited",
  MEMBER_UPDATED = "member.updated",
  CHANNEL_UPDATED = "channel.updated",
  CHANNEL_REMOVED = "channel.removed",
}

export interface Sender {
  clerkUserId: string;
  fullName: string;
  imageUrl: string;
}

export interface SendMessageProps {
  receiverId: string;

  socketId: string;

  senderId: string;

  sender: Sender;

  fowarder?: string;

  type: MessageType;

  content: string;

  replyFor?: string;

  metadata?: LinkMetadata;

  isRecall?: boolean;

  reactions?: any[];

  uniqueId: string;

  files?: FileData[];

  createdAt?: Date;
}

export interface GetMessageDto {
  channelId: string;
  dateTime?: string;
  page: number;
  pageSize: number;
}

export interface UploadFileProps {
  senderId: string;
  workspaceId?: string;
  channelId: string;
}

export interface UpdateMessageProps extends Partial<MessageItemProps> {
  channelId: string;
  socketId: string;
}

export interface DeleteFileInMessageProps {
  _id: string;
  fileUrl: string;
  socketId: string;
  channelId: string;
}

export interface UpdateChannelProps extends Partial<ChannelProps> {
  socketId?: string;
}

export interface RemoveUserProps {
  channelId: string;
  deleteId: string;
  senderId: string;
}

export interface NewMeetingRequestProps {
  channelId: string;
  meetingLink: string;
  senderId: string;
  sender: Sender;
}

export interface CreateBookmarkProps {
  conversationId: string;
  isFolder: boolean;
  type: ConversationType;
  payload:
    | {
        name: string;
        previousName?: string;
      }
    | BookmarkData;
}

export interface DeleteBookmarkProps {
  conversationId: string;
  isFolder: boolean;
  bookmarkName: string;
  parentName?: string;
  type: ConversationType;
}

export interface UpdateMeetingProps {
  meetingLink: string;
  isDelete: boolean;
  sender: Sender;
}
