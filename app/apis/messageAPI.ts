import {
  DeleteFileInMessageProps,
  NewMeetingRequestProps,
  UpdateMeetingProps,
  UpdateMessageProps,
} from "./api-payload";
import {
  MessageItemResponse,
  MessageListResponse,
} from "./api-response/message.response";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v1/api/messages";
export const messageAPI = {
  sendMessage: async (formData: any): Promise<MessageItemResponse> => {
    const res = await fetch(baseURL, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },
  getMessagesList: async (queryUrl: string): Promise<MessageListResponse> => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + queryUrl);
    return res.json();
  },
  updateMessage: async (
    message: UpdateMessageProps
  ): Promise<MessageItemResponse> => {
    const res = await fetch(baseURL + "/update-message", {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  },
  forwardMessage: async (payload: any): Promise<MessageItemResponse> => {
    const res = await fetch(baseURL + "/forward-message", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  },
  deleteFile: async (
    payload: DeleteFileInMessageProps
  ): Promise<MessageItemResponse> => {
    const res = await fetch(baseURL + "/delete-file", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  },
  newMeeting: (payload: NewMeetingRequestProps) => {
    return fetch(`${baseURL}/new-meeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  updateMeeting: (payload: UpdateMeetingProps) => {
    return fetch(`${baseURL}/update-meeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
};
