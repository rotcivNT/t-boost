import { ChannelProps } from "@/types";
import { DirectConversation } from "@/types/dc.type";

type Props = ChannelProps | DirectConversation;

interface IUpdatePartialProps<T extends Props, K extends keyof T> {
  conversation: T;
  key: K;
  value: T[K];
}

export const updatePartialConversation = <T extends Props, K extends keyof T>({
  conversation,
  key,
  value,
}: IUpdatePartialProps<T, K>) => {
  return {
    ...conversation,
    [key]: value,
  };
};
