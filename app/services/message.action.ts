"use server";

import { MessageCluster } from "@/types";
import {
  DeleteFileInMessageProps,
  UpdateMessageProps,
} from "../apis/api-payload";
import { messageAPI } from "../apis/messageAPI";
import { SerializeMessageToMap } from "../helpers/serializeMessageToMap";
import { ApiStatus } from "../utils/api.response";

export const getMessages = async (url: string) => {
  try {
    const res = await messageAPI.getMessagesList(url);

    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateMessage = async (message: UpdateMessageProps) => {
  try {
    const res = await messageAPI.updateMessage(message);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
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
    return res;
  } catch (e) {
    console.log(e);
  }
};
