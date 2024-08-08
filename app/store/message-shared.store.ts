import { ActionForMessage, MessageCluster } from "@/types";
import { create } from "zustand";

export interface MessageSharedState {
  files: File[];
  setFiles: (file: File) => void;
  clearFiles: () => void;
  removeSpecificFile: (fileName: string, lastModified: number) => void;
  actionMessage: ActionForMessage | null;
  setActionMessage: (message: ActionForMessage | null) => void;
  queryMessageUrl: string;
  setQueryMessageUrl: (url: string) => void;
  allMessages: Map<string, MessageCluster>;
  setAllMessages: (messages: Map<string, MessageCluster>) => void;
}

export const useMessageSharedStore = create<MessageSharedState>((set) => ({
  files: [],
  setFiles: (file: File) =>
    set((prevState) => ({
      ...prevState,
      files: [...prevState.files, file],
    })),
  actionMessage: null,
  setActionMessage: (message: ActionForMessage | null) =>
    set((prevState) => ({
      ...prevState,
      actionMessage: message,
    })),
  queryMessageUrl: "",
  setQueryMessageUrl: (url: string) =>
    set((prevState) => ({
      ...prevState,
      queryMessageUrl: url,
    })),
  clearFiles: () =>
    set((prevState) => ({
      ...prevState,
      files: [],
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
  allMessages: new Map<string, MessageCluster>(),
  setAllMessages: (messages: Map<string, MessageCluster>) =>
    set((prevState) => ({
      ...prevState,
      allMessages: messages,
    })),
}));
