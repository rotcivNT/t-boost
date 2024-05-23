import { io } from "socket.io-client";

export const socket = io(process.env.CHANNEL_API_BASE_URL || "");
