"use server";
import { GetUserPayload } from "../apis/api-payload/auth.payload";
import { authAPI } from "../apis/auth.api";
import { ApiStatus } from "../utils/api.response";

export const getUser = async (payload: GetUserPayload) => {
  if (!payload.field) {
    return;
  }
  try {
    const res = await authAPI.getUser(payload);
    if (res.status === ApiStatus.OK) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
