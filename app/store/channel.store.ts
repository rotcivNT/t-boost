import { ChannelProps } from "@/types";
import { create } from "zustand";

interface ChannelState {
  currentChannel: ChannelProps;
  setCurrentChannel: (currentChannel: any) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  currentChannel: {} as ChannelProps,
  setCurrentChannel: (currentChannel: ChannelProps) =>
    set((prevState) => ({
      ...prevState,
      currentChannel,
    })),
}));
