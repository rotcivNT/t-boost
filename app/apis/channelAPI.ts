import axios from "axios";
import {
  CreateBookmarkProps,
  DeleteBookmarkProps,
  RemoveUserProps,
  UpdateChannelProps,
  sendInvitationPayload,
} from "./api-payload";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v1/api/channels";

export const channelAPI = {
  createChannel: async (payload: any) => {
    return fetch(baseURL + "/create-channel", {
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
    try {
      const res = await fetch(baseURL + url);
      return res.json();
    } catch (e) {
      return e;
    }
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
    return fetch(`${baseURL}/accept-invitation/${invitationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  removeUser: (payload: RemoveUserProps) => {
    return fetch(`${baseURL}/remove-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  createBookmark: (payload: CreateBookmarkProps) => {
    return fetch(`${baseURL}/add-bookmark/${payload.channelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  updateBookmark: (payload: CreateBookmarkProps) => {
    return fetch(`${baseURL}/update-bookmark/${payload.channelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  deleteBookmark: (payload: DeleteBookmarkProps) => {
    return fetch(`${baseURL}/delete-bookmark/${payload.channelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
};
