import { TaskAttachment } from "@/types/task.type";

export interface GetDirectConversation {
  memberClerkUserId: string;
  workspaceId: string;
}

export interface CreateTaskPayload {
  channelId: string;
  title: string;
  memberIds: string[];
  columnId: string;
}

export interface UpdateTaskStatePayload {
  taskId: string;

  newStatus: string;

  currentOrder: number;

  newOrder: number;

  channelId: string;
}

export interface UpdateTaskColumn {
  taskColumnId: string;

  title?: string;

  taskOrderIds?: string[];
}

export interface CreateTaskColumnPayload {
  title: string;
  channelId: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  taskId: string;

  attachments?: TaskAttachment[];

  cover?: string;

  description?: string;
}
