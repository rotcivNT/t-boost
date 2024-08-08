import axios from "axios";
import {
  CreateBookmarkProps,
  DeleteBookmarkProps,
  RemoveUserProps,
  UpdateChannelProps,
  sendInvitationPayload,
} from "./api-payload";
import {
  CreateTaskColumnPayload,
  CreateTaskPayload,
  GetDirectConversation,
  UpdateTaskColumn,
  UpdateTaskPayload,
  UpdateTaskStatePayload,
} from "./api-payload/conversation.payload";
import {
  AllChannelDataResponse,
  ChannelDataResponse,
  ChannelTaskCardReponse,
  ChannelTaskColumnReponse,
  DirectConversationResponse,
} from "./api-response/channel.response";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v1/api/channels";

export const channelAPI = {
  createChannel: async (payload: any): Promise<ChannelDataResponse> => {
    const res = await fetch(baseURL + "/create-channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  // ID creator + workspace
  getAllChannelsById: async (url: string): Promise<AllChannelDataResponse> =>
    fetch(baseURL + url).then((response) => response.json()),

  // Channel Id
  getChannelById: async (url: string): Promise<ChannelDataResponse> =>
    fetch(baseURL + url).then((response) => response.json()),

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
  removeMember: async (
    payload: RemoveUserProps
  ): Promise<ChannelDataResponse> => {
    const res = await fetch(`${baseURL}/remove-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  createBookmark: async (
    payload: CreateBookmarkProps
  ): Promise<ChannelDataResponse> => {
    const res = await fetch(
      `${baseURL}/add-bookmark/${payload.conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  },
  updateBookmark: async (
    payload: CreateBookmarkProps
  ): Promise<ChannelDataResponse> => {
    const res = await fetch(
      `${baseURL}/update-bookmark/${payload.conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  },
  deleteBookmark: async (
    payload: DeleteBookmarkProps
  ): Promise<ChannelDataResponse> => {
    const res = await fetch(
      `${baseURL}/delete-bookmark/${payload.conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  },
  getDirectConversation: async (
    payload: GetDirectConversation
  ): Promise<DirectConversationResponse> => {
    const res = await fetch(`${baseURL}/get-direct-conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  getDirectConversationById: async (
    url: string
  ): Promise<DirectConversationResponse> => {
    const res = await fetch(`${baseURL}/${url}`);
    return res.json();
  },
  getTaskByChannelId: async (
    url: string
  ): Promise<ChannelTaskColumnReponse> => {
    const res = await fetch(`${baseURL}/${url}`);
    return res.json();
  },
  createTask: async (
    payload: CreateTaskPayload
  ): Promise<ChannelTaskCardReponse> => {
    const res = await fetch(`${baseURL}/create-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  updateTaskState: async (
    payload: UpdateTaskStatePayload
  ): Promise<ChannelTaskCardReponse> => {
    const res = await fetch(`${baseURL}/update-task-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  updateTaskColumn: async (
    payload: UpdateTaskColumn
  ): Promise<ChannelTaskColumnReponse> => {
    const res = await fetch(`${baseURL}/update-task-column`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  createTaskColumn: async (
    payload: CreateTaskColumnPayload
  ): Promise<ChannelTaskColumnReponse> => {
    const res = await fetch(`${baseURL}/create-task-column`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  updateTask: async (
    payload: UpdateTaskPayload
  ): Promise<ChannelTaskCardReponse> => {
    const res = await fetch(`${baseURL}/update-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
