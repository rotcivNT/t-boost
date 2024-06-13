import axios from "axios";
import { UpdateChannelProps, sendInvitationPayload } from "./api-payload";
const baseURL =
  process.env.NEXT_PUBLIC_CHANNEL_API_BASE_URL + "/v1/api/channels";

export const channelAPI = {
  createChannel: async (payload: any) => {
    return fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(payload),
    });
  },
  // ID creator + workspace
  getAllChannelsById: async (url: string) => fetch(baseURL + url),
  // Channel Id
  getChannelById: async (url: string) => {
    const res = await fetch(baseURL + url);
    return res.json();
  },
  sendInvitation: async (payload: sendInvitationPayload) =>
    axios.post(`${baseURL}/send-invitation`, payload),

  updateChannel: async (id: string, payload: UpdateChannelProps) => {
    return fetch(`${baseURL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(payload),
    });
  },
  acceptInvitation: async (invitationId: string) => {
    return fetch(`${baseURL}/accept-invitation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitationId,
      }),
    });
  },
};
