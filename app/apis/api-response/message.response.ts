import { ApiResponse, ApiStatus } from "@/app/utils/api.response";
import { MessageCluster, MessageItemProps } from "@/types";

export type MessageListResponse = ApiResponse<{
  data: MessageCluster[];
}>;

export type MessageItemResponse = ApiResponse<{
  data: MessageItemProps;
  status: ApiStatus;
}>;
