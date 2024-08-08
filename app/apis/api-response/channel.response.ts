import { ApiResponse } from "@/app/utils/api.response";
import { ChannelProps } from "@/types";
import { DirectConversation } from "@/types/dc.type";
import { TaskCard, TaskColumn } from "@/types/task.type";

export type AllChannelDataResponse = ApiResponse<{
  data: ChannelProps[];
}>;

export type ChannelDataResponse = ApiResponse<{
  data: ChannelProps;
}>;

export type DirectConversationResponse = ApiResponse<{
  data: DirectConversation[];
}>;

export type ChannelTaskColumnReponse = ApiResponse<{
  data: TaskColumn[];
}>;

export type ChannelTaskCardReponse = ApiResponse<{
  data: TaskCard[];
}>;
