import axios from "axios";
const baseURL = "http://localhost:3001/v1/api/channels";

export const channelAPI = {
  createChannel: async (payload: any) => {
    return fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(payload),
    });
  },
  // ID creator + workspace
  getAllChannelsById: async (url: string) => fetch(baseURL + url),
  // Channel Id
  getChannelById: async (url: string) => {
    const res = await axios.get(baseURL + url);
    return res.data;
  },
};
