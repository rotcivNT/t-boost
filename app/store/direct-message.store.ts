import { User } from "@/types/user.type";
import { create } from "zustand";

export interface DirectMessageState {
  isOpenProfile: boolean;
  setIsOpenProfile: (isOpenProfile: boolean) => void;
  currentDMUser: User | null;
  setCurrentDMUser: (currentDMUser: User) => void;
}

export const useDirectMessageStore = create<DirectMessageState>((set) => ({
  isOpenProfile: false,
  setIsOpenProfile: (isOpenProfile: boolean) =>
    set((prevState) => ({
      ...prevState,
      isOpenProfile,
    })),
  currentDMUser: null,
  setCurrentDMUser: (currentDMUser: User) =>
    set((prevState) => ({
      ...prevState,
      currentDMUser,
    })),
}));
