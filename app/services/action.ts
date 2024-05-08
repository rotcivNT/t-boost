"use server";

import { channelAPI } from "../apis/channelAPI";

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

// export const getChannelById = async (url: string) => {
//   try {
//     const res = await channelAPI.getChannelById(url);
//     return res.json();
//   } catch (e) {
//     console.log(e);
//   }
// };
