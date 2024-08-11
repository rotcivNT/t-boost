import { Sender } from "@/app/apis/api-payload";

export interface TaskAttachment {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  createdAt: Date;
}

export interface TaskColumn {
  _id: string;
  title: string;
  channelId: string;
  taskOrderIds: string[];
  taskOrders: TaskCard[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskCard {
  _id: string;
  title: string;
  cover: string;
  description: string;
  memberIds: string[];
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
  membersInfo?: Sender[];
}

export interface ShowTask {
  channelId: string;
  isShowTask: boolean;
}
