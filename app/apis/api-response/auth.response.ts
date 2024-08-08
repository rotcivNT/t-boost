import { ApiResponse } from "@/app/utils/api.response";
import { User } from "@/types/user.type";

export type UserProfileResponse = ApiResponse<{
  data: User[];
}>;
