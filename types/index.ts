import { LinkMetadata, MessageType, Sender } from "@/app/apis/api-payload";

interface ChannelMember {
  userID: string;

  joinedAt: Date;
}

export interface Bookmark {
  name: string;

  url: string;

  thumbnail: string;
}

export interface BookmarkFolder {
  name: string;

  bookmarks: Bookmark[];
}

export interface ChannelSettings {
  autoAddNewMember: boolean;
}

export interface ChannelProps {
  _id: string;
  name: string;
  isPublic: boolean;
  creatorID: string;
  workspaceID: string;
  members: ChannelMember[];
  topic?: string;
  description?: string;
  bookmarks?: Bookmark[];
  bookmarkFolders?: BookmarkFolder[];
  settings?: ChannelSettings;
}

export interface FileData {
  type: string;
  url: string;
  mimeType: string;
  size: number;
  name: string;
  originalWidth?: number;
  originalHeight?: number;
  blurHash?: string;
}

export interface MessageItemProps {
  _id: string;
  senderId: string;
  sender?: Sender;
  type: MessageType;
  content: string;
  files?: FileData[];
  reactions?: any[];
  isRecall?: boolean;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  replyMessage: MessageItemProps[];
  metadata?: LinkMetadata;
  // use for checking is sending when send message
  isSending?: boolean;
  uniqueId?: string;
  filesStatus?: File[];
}

export interface MessageCluster {
  // id is date
  _id: string;
  messages: MessageItemProps[];
}

export enum ActionType {
  EDIT = "edit",
  REPLY = "reply",
}

export interface ActionForMessage {
  type: ActionType;
  message: MessageItemProps;
}

export interface QueryMessageProps {
  aroundId?: string;
  receiverId: string;
  beforeId?: string;
  afterId?: string;
}
