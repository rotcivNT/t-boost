"use server";

import { RemoveUserProps } from "../apis/api-payload";
import {
  CreateTaskColumnPayload,
  CreateTaskPayload,
  GetDirectConversation,
  UpdateTaskColumn,
  UpdateTaskPayload,
  UpdateTaskStatePayload,
} from "../apis/api-payload/conversation.payload";
import { channelAPI } from "../apis/channelAPI";
import { ApiStatus } from "../utils/api.response";

export const removeMember = async (payload: RemoveUserProps) => {
  try {
    const res = await channelAPI.removeMember(payload);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getAllDCByUser = async (getDC: GetDirectConversation) => {
  try {
    const res = await channelAPI.getDirectConversation(getDC);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getDCById = async (url: string) => {
  try {
    const res = await channelAPI.getDirectConversationById(url);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getTaskByChannelId = async (channelId: string) => {
  try {
    const res = await channelAPI.getTaskByChannelId(channelId);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const createTask = async (payload: CreateTaskPayload) => {
  try {
    const res = await channelAPI.createTask(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateTaskState = async (payload: UpdateTaskStatePayload) => {
  try {
    const res = await channelAPI.updateTaskState(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateTaskColumn = async (payload: UpdateTaskColumn) => {
  try {
    const res = await channelAPI.updateTaskColumn(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const createTaskColumn = async (payload: CreateTaskColumnPayload) => {
  try {
    const res = await channelAPI.createTaskColumn(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateTask = async (payload: UpdateTaskPayload) => {
  try {
    const res = await channelAPI.updateTask(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
