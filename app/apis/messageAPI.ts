import { MessageItemProps } from "@/types";
import axios from "axios";
import { DeleteFileInMessageProps, UpdateMessageProps } from "./api-payload";

const baseURL =
  process.env.NEXT_PUBLIC_MESSAGE_API_BASE_URL + "/v1/api/messages";
export const messageAPI = {
  sendMessage: (formData: any) => {
    return fetch(baseURL, {
      method: "POST",
      body: formData,
    });
  },
  getMessagesList: async (queryURL: string) => {
    const res = await axios.get(baseURL + queryURL);
    return res.data;
  },
  updateMessage: (message: UpdateMessageProps) => {
    return fetch(baseURL + "/update-message", {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  forwardMessage: (payload: any) => {
    return fetch(baseURL + "/forward-message", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  deleteFile: (payload: DeleteFileInMessageProps) => {
    return fetch(baseURL + "/delete-file", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
