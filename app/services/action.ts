"use server";

import { clerkClient } from "@/configs/clerkClient";
import { ChannelProps } from "@/types";
import {
  DeleteFileInMessageProps,
  UpdateChannelProps,
  UpdateMessageProps,
} from "../apis/api-payload";
import { channelAPI } from "../apis/channelAPI";
import { messageAPI } from "../apis/messageAPI";
import { uploadAPI } from "../apis/uploadAPI";

export async function createChannel(payload: any) {
  try {
    const res = await channelAPI.createChannel(payload);
    return res.json();
  } catch (e) {
    console.log(e);
  }
}

export const getAllChannelsById = async (url: string) => {
  try {
    const res = await channelAPI.getAllChannelsById(url);
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

export const getUserInfo = async (userId: string) => {
  try {
    const res = await clerkClient.users.getUser(userId);
    return JSON.stringify(res);
  } catch (e) {
    console.log(e);
  }
};

export const updateChannel = async (
  id: string,
  payload: UpdateChannelProps
) => {
  try {
    const res = await channelAPI.updateChannel(id, payload);
    if (res.ok) {
      return {
        code: 1,
        message: "Updated",
      };
    } else return res.json();
  } catch (e) {
    console.log(e);

    return e;
  }
};

export const acceptInvitation = async (invitationId: string) => {
  try {
    const res = await channelAPI.acceptInvitation(invitationId);
    return res.json();
  } catch (e) {
    return e;
  }
};

export const sendMessage = async (formData: FormData) => {
  try {
    const res = await messageAPI.sendMessage(formData);
    return res.json();
  } catch (e) {
    return e;
  }
};

export const uploadFile = async (formData: FormData) => {
  try {
    const res = await uploadAPI.uploadFile(formData);
    return res.json();
  } catch (e) {
    return e;
  }
};

export const updateMessage = async (message: UpdateMessageProps) => {
  try {
    const res = await messageAPI.updateMessage(message);
    return res.json();
  } catch (e) {
    return e;
  }
};

export const forwardMessage = async (payload: any) => {
  try {
    const res = await messageAPI.forwardMessage(payload);
    return res.json();
  } catch (e) {
    return e;
  }
};

export const deleteFile = async (
  msgId: string,
  fileUrl: string,
  socketId: string,
  channelId: string
) => {
  try {
    const payload: DeleteFileInMessageProps = {
      _id: msgId,
      fileUrl,
      channelId,
      socketId,
    };
    const res = await messageAPI.deleteFile(payload);
    return res.json();
  } catch (e) {
    return e;
  }
};
