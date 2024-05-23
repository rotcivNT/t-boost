import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_CHANNEL_API_BASE_URL || "");
