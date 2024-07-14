import axios from "axios";
import {
  DeleteFileInMessageProps,
  NewMeetingRequestProps,
  UpdateMeetingProps,
  UpdateMessageProps,
} from "./api-payload";
import { QueryMessageProps } from "@/types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v1/api/messages";
export const messageAPI = {
  sendMessage: (formData: any) => {
    return fetch(baseURL, {
      method: "POST",
      body: formData,
    });
  },
  getMessagesList: async (queryUrl: string) => {
    const res = await fetch(baseURL + queryUrl);
    return res.json();
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
