import { ChannelProps, FileData, MessageItemProps } from "@/types";

export type sendInvitationPayload = {
  workspaceId: string;
  channelId: string;
  senderEmail: string;
  receiverEmail: string;
  role: string;
};

export interface Sender {
  senderId: string;
  fullName: string;
  imageUrl: string;
}

interface Reaction {
  emoji: string;
  count: number;
  reactorName: string;
}

export interface LinkMetadata {
  thumbnail: string;
  title: string;
  subtitle: string;
  description: string;
}

export enum MessageType {
  TEXT = "text",
  VIDEO = "video",
  FILE = "file",
  IMAGE = "image",
  LINK = "link",
}

export interface SendMessageProps {
  sender: Sender;

  fowarder?: Sender;

  type: MessageType;

  content: string;

  replyFor?: string;

  metadata?: LinkMetadata;

  isRecall?: boolean;

  reactions?: any[];

  uniqueId: string;

  files?: FileData[];
}

export interface CreateBucketMessageProps {
  channelId: string;
  socketId?: string;
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
