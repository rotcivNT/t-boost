"use server";
import {
  CreateBookmarkProps,
  DeleteBookmarkProps,
  UpdateChannelProps,
  UpdateMeetingProps,
} from "../apis/api-payload";
import { MessageItemResponse } from "../apis/api-response/message.response";
import { channelAPI } from "../apis/channelAPI";
import { messageAPI } from "../apis/messageAPI";
import { uploadAPI } from "../apis/uploadAPI";
import { ApiStatus } from "../utils/api.response";

export async function createChannel(payload: any) {
  try {
    const res = await channelAPI.createChannel(payload);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export const getAllChannelsById = async (url: string) => {
  try {
    if (url.includes("undefined")) {
      return;
    }
    const res = await channelAPI.getAllChannelsById(url);

    if (res.status === ApiStatus.OK) {
      return res.data;
    }
    return;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getChannelById = async (url: string) => {
  try {
    const res = await channelAPI.getChannelById(url);

    if (res.status === ApiStatus.OK) {
      return [res.data];
    }
    return;
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

export const sendMessage = async (
  formData: FormData
): Promise<MessageItemResponse | null> => {
  try {
    const res = await messageAPI.sendMessage(formData);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const uploadFile = async (formData: FormData) => {
  try {
    const res = await uploadAPI.uploadFile(formData);
    return res.json();
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const onlyUploadFile = async (formData: FormData) => {
  try {
    const res = await uploadAPI.onlyUploadFiles(formData);
    return res.json();
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const forwardMessage = async (payload: any) => {
  try {
    const res = await messageAPI.forwardMessage(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    return e;
  }
};

export const createBookmark = async (payload: CreateBookmarkProps) => {
  try {
    const res = await channelAPI.createBookmark(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateBookmark = async (payload: CreateBookmarkProps) => {
  try {
    const res = await channelAPI.updateBookmark(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    return;
  }
};

export const deleteBookmark = async (payload: DeleteBookmarkProps) => {
  try {
    const res = await channelAPI.deleteBookmark(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    return;
  }
};

export const updateMeeting = async (payload: UpdateMeetingProps) => {
  try {
    const res = await messageAPI.updateMeeting(payload);
    if (res.ok) {
      return {
        code: 1,
        message: "Updated",
      };
    }
  } catch (e) {
    return e;
  }
};
