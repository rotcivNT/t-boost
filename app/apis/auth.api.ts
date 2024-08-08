import { GetUserPayload } from "./api-payload/auth.payload";
import { UserProfileResponse } from "./api-response/auth.response";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v1/api/auths";
export const authAPI = {
  getUser: async (payload: GetUserPayload): Promise<UserProfileResponse> => {
    const res = await fetch(`${baseURL}/get-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },
};
