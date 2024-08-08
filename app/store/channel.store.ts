import { ChannelProps } from "@/types";
import { ShowTask } from "@/types/task.type";
import { create } from "zustand";

export interface ChannelState {
  currentChannel: ChannelProps;
  setCurrentChannel: (currentChannel: ChannelProps) => void;
  setPartialDataChannel: (channelData: Partial<ChannelProps>) => void;
  channels: ChannelProps[];
  setChannels: (channels: ChannelProps[]) => void;
  addChannel: (channels: ChannelProps) => void;
  clearOldChannelData: () => void;
  showTask: ShowTask | null;
  setShowTask: (showTask: ShowTask | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  currentChannel: {} as ChannelProps,
  setCurrentChannel: (currentChannel: ChannelProps) =>
    set((prevState) => ({
      ...prevState,
      currentChannel,
    })),
  setPartialDataChannel: (channelData: Partial<ChannelProps>) =>
    set((prevState) => ({
      ...prevState,
      currentChannel: {
        ...prevState.currentChannel,
        ...channelData,
      },
    })),
  channels: [],
  setChannels: (channels: ChannelProps[]) =>
    set((prevState) => ({
      ...prevState,
      channels,
    })),
  addChannel: (channel: ChannelProps) =>
    set((prevState) => ({
      ...prevState,
      channels: [...prevState.channels, channel],
    })),
  clearOldChannelData: () =>
    set((prevState) => ({
      ...prevState,
      currentChannel: {
        ...prevState.currentChannel,
        _id: "",
      },
    })),
  showTask: null,
  setShowTask: (showTask: ShowTask | null) =>
    set((prevState) => ({
      ...prevState,
      showTask,
    })),
}));
