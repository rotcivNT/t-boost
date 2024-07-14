import { ActionForMessage, ChannelProps, MessageCluster } from "@/types";
import { create } from "zustand";
import { replace } from "../utils";
import { MessageItemProps } from "./../../types/index";
import { stringToTimestamp } from "../utils/date";

const initialState: Partial<ChannelState> = {
  // currentChannel: {} as ChannelProps,
  isSendingNewMessage: false,
  messages: new Map<string, MessageCluster>(),
  files: [],
};

interface ChannelState {
  currentChannel: ChannelProps;
  setCurrentChannel: (currentChannel: ChannelProps) => void;
  setPartialDataChannel: (channelData: Partial<ChannelProps>) => void;
  isSendingNewMessage: boolean;
  setIsSendingNewMessage: (isSendingNewMessage: boolean) => void;
  messages: Map<string, MessageCluster>;
  setMessages: (
    messages: MessageCluster | MessageCluster[],
    isReplace?: boolean
  ) => void;
  updateMessageByUniqueId: (
    message: MessageItemProps,
    clusterId: string,
    updateSending: boolean
  ) => void;
  updateMessage: (
    msgId: string,
    clusterId: string,
    fieldName: string,
    fieldData: any
  ) => void;
  files: File[];
  setFiles: (file: File) => void;
  removeSpecificFile: (fileName: string, lastModified: number) => void;
  clearFiles: () => void;
  channels: ChannelProps[];
  setChannels: (channels: ChannelProps[]) => void;
  clearOldChannelData: () => void;
  actionMessage: ActionForMessage | null;
  setActionMessage: (message: ActionForMessage | null) => void;
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
  messages: new Map<string, MessageCluster>(),
  setMessages: (
    messages: MessageCluster | MessageCluster[],
    isReplace?: boolean
  ) => {
    set((prevState) => {
      const newestMessages = new Map(prevState.messages);
      const messagesForAdd = Array.isArray(messages) ? messages : [messages];
      if (!isReplace && newestMessages.size > 0) {
        const lastClusterWillAdd = messagesForAdd.pop() as MessageCluster;
        const firstClusterWillAdd =
          messagesForAdd.length === 0
            ? lastClusterWillAdd
            : (messagesForAdd.shift() as MessageCluster);

        if (newestMessages.has(lastClusterWillAdd._id)) {
          const currentCluster: MessageCluster = newestMessages.get(
            lastClusterWillAdd._id
          ) as MessageCluster;
          const currentMessageDate = stringToTimestamp(
            currentCluster.messages[0].createdAt as string
          );
          const incomingMessageDate = stringToTimestamp(
            lastClusterWillAdd.messages[0].createdAt as string
          );

          if (currentMessageDate > incomingMessageDate) {
            currentCluster?.messages.unshift(...lastClusterWillAdd.messages);
          } else {
            currentCluster?.messages.push(...lastClusterWillAdd.messages);
          }
        } else if (newestMessages.has(firstClusterWillAdd._id)) {
          const currentCluster: MessageCluster = newestMessages.get(
            lastClusterWillAdd._id
          ) as MessageCluster;
          const currentMessageDate = stringToTimestamp(
            currentCluster.messages[0].createdAt as string
          );
          const incomingMessageDate = stringToTimestamp(
            lastClusterWillAdd.messages[0].createdAt as string
          );
          if (currentMessageDate > incomingMessageDate) {
            currentCluster?.messages.unshift(...firstClusterWillAdd.messages);
          } else {
            currentCluster?.messages.push(...firstClusterWillAdd.messages);
          }
        }
      }

      // Add rest messages or replace will add all messages
      messagesForAdd.forEach((cluster) => {
        newestMessages.set(cluster._id, cluster);
      });
      return {
        ...prevState,
        messages: newestMessages,
      };
    });
  },
  updateMessageByUniqueId: (
    message: MessageItemProps,
    clusterId: string,
    updateSending: boolean
  ) => {
    set((prevState) => {
      const newestMessages = new Map(prevState.messages);
      const cluster = newestMessages.get(clusterId);
      if (cluster) {
        const updateMessageIndex = cluster.messages.findIndex(
          (messageItem) =>
            messageItem.uniqueId === message.uniqueId &&
            (!updateSending || messageItem.isSending)
        );
        if (updateMessageIndex !== -1) {
          cluster.messages[updateMessageIndex] = message;
        }
      }
      return {
        ...prevState,
        messages: newestMessages,
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
  updateMessage: (msgId, clusterId, fieldName, fieldData) => {
    set((prevState) => {
      return {
        ...prevState,
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
  actionMessage: null,
  setActionMessage: (message: ActionForMessage | null) =>
    set((prevState) => ({
      ...prevState,
      actionMessage: message,
    })),
}));
