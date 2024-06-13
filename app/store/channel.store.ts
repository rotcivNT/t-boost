import { ChannelProps, MessageItemProps } from "@/types";
import { create } from "zustand";
import { replace } from "../utils";

const initialState: Partial<ChannelState> = {
  currentChannel: {} as ChannelProps,
  isSendingNewMessage: false,
  messages: [],
  files: [],
};

interface ChannelState {
  currentChannel: ChannelProps;
  setCurrentChannel: (currentChannel: ChannelProps) => void;
  setPartialDataChannel: (channelData: Partial<ChannelProps>) => void;
  isSendingNewMessage: boolean;
  setIsSendingNewMessage: (isSendingNewMessage: boolean) => void;
  messages: MessageItemProps[];
  setMessages: (
    messages: MessageItemProps | MessageItemProps[],
    isReplace?: boolean
  ) => void;
  updateMessageByUniqueId: (
    message: MessageItemProps,
    updateSending: boolean
  ) => void;
  updateMessage: (msgId: string, fieldName: string, fieldData: any) => void;
  files: File[];
  setFiles: (file: File) => void;
  removeSpecificFile: (fileName: string, lastModified: number) => void;
  clearFiles: () => void;
  channels: ChannelProps[];
  setChannels: (channels: ChannelProps[]) => void;
  clearOldChannelData: () => void;
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
  isSendingNewMessage: false,
  setIsSendingNewMessage: (isSendingNewMessage: boolean) =>
    set((prevState) => ({
      ...prevState,
      isSendingNewMessage,
    })),
  messages: [],
  setMessages: (
    messages: MessageItemProps | MessageItemProps[],
    isReplace?: boolean
  ) => {
    if (Array.isArray(messages)) {
      return set((prevState) => ({
        ...prevState,
        messages: isReplace ? messages : [...prevState.messages, ...messages],
      }));
    }
    return set((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, messages],
    }));
  },
  updateMessageByUniqueId: (
    message: MessageItemProps,
    updateSending: boolean
  ) => {
    set((prevState) => {
      const foundIndex = prevState.messages.findIndex(
        (messageItem) =>
          messageItem?.uniqueId == message.uniqueId &&
          (!updateSending || messageItem?.isSending)
      );

      if (foundIndex === -1) return prevState;
      const updatedMessage = replace(prevState.messages, foundIndex, message);

      return {
        ...prevState,
        messages: updatedMessage,
      };
    });
  },
  files: [],
  setFiles: (file: File) =>
    set((prevState) => ({
      ...prevState,
      files: [...prevState.files, file],
    })),
  removeSpecificFile: (fileName: string, lastModified: number) => {
    set((prevState) => {
      const newFileList = prevState.files.filter(
        (file) => file.name !== fileName && file.lastModified !== lastModified
      );
      return {
        ...prevState,
        files: newFileList,
      };
    });
  },
  clearFiles: () =>
    set((prevState) => ({
      ...prevState,
      files: [],
    })),
  updateMessage: (msgId, fieldName, fieldData) => {
    set((prevState) => {
      const foundIndex = prevState.messages.findIndex(
        (messageItem) => messageItem._id == msgId
      );

      if (foundIndex === -1) return prevState;
      const updatedMessage = replace(prevState.messages, foundIndex, {
        ...prevState.messages[foundIndex],
        [fieldName]: fieldData,
      });

      return {
        ...prevState,
        messages: updatedMessage,
      };
    });
  },
  channels: [],
  setChannels: (channels: ChannelProps[]) =>
    set((prevState) => ({
      ...prevState,
      channels,
    })),
  clearOldChannelData: () =>
    set((prevState) => ({
      ...prevState,
      ...initialState,
    })),
}));
