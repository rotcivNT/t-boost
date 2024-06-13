import { ChannelProps, MessageCluster, MessageItemProps } from "@/types";
import { create } from "zustand";
import { replace } from "../utils";

const initialState: Partial<ChannelState> = {
  // currentChannel: {} as ChannelProps,
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
  messages: MessageCluster[];
  setMessages: (
    messages: MessageCluster | MessageCluster[],
    isReplace?: boolean
  ) => void;
  updateMessageByUniqueId: (
    message: MessageItemProps,
    clusterId: string,
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
    messages: MessageCluster | MessageCluster[],
    isReplace?: boolean
  ) => {
    set((prevState) => {
      const isParamArray = Array.isArray(messages);
      const newMessages = isParamArray ? messages : [messages];
      let updatedMessages: MessageCluster[] = newMessages;
      let oldMessages = prevState.messages;
      if (!isReplace) {
        if (
          newMessages.length > 0 &&
          oldMessages[0]._id === newMessages[newMessages.length - 1]._id
        ) {
          isParamArray
            ? (oldMessages[0].messages = [
                ...(newMessages.pop() as MessageCluster).messages,
                ...oldMessages[0].messages,
              ])
            : (oldMessages[0].messages = [
                ...oldMessages[0].messages,
                ...(newMessages.pop() as MessageCluster).messages,
              ]);
        } else if (
          newMessages.length > 0 &&
          oldMessages[oldMessages.length - 1]._id ===
            newMessages[newMessages.length - 1]._id
        ) {
          isParamArray
            ? (oldMessages[oldMessages.length - 1].messages = [
                ...(newMessages.pop() as MessageCluster).messages,
                ...oldMessages[oldMessages.length - 1].messages,
              ])
            : (oldMessages[oldMessages.length - 1].messages = [
                ...oldMessages[oldMessages.length - 1].messages,
                ...(newMessages.pop() as MessageCluster).messages,
              ]);
        }
        updatedMessages = isParamArray
          ? [...newMessages, ...oldMessages]
          : [...oldMessages, ...newMessages];
      }

      return {
        ...prevState,
        messages: updatedMessages,
      };
    });
  },
  updateMessageByUniqueId: (
    message: MessageItemProps,
    clusterId: string,
    updateSending: boolean
  ) => {
    set((prevState) => {
      const prevClusters = [...prevState.messages];
      const clusterIndex = prevState.messages.findIndex(
        (item) => item._id === clusterId
      );

      if (clusterIndex === -1) return prevState;
      const foundIndex = prevClusters[clusterIndex].messages.findIndex(
        (msg) =>
          msg.uniqueId === message.uniqueId && (!updateSending || msg.isSending)
      );
      if (foundIndex === -1) return prevState;
      const updatedCluster = replace(
        prevClusters[clusterIndex].messages,
        foundIndex,
        message
      );
      prevClusters[clusterIndex].messages = updatedCluster;
      return {
        ...prevState,
        messages: prevClusters,
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
      const foundIndex = -1;

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
      currentChannel: {
        ...prevState.currentChannel,
        _id: "",
      },
    })),
}));
