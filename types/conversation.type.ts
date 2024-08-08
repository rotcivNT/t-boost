import { ChannelState } from "@/app/store/channel.store";
import { DirectMessageState } from "@/app/store/direct-message.store";

export enum ConversationType {
  DIRECT_MESSAGE = "conversation.direct-message",
  CHANNEL = "conversation.channel",
}

type ConversationStateByType = {
  [ConversationType.DIRECT_MESSAGE]: DirectMessageState;
  [ConversationType.CHANNEL]: ChannelState;
};

export interface ConversationState<T extends ConversationType> {
  type: T;
  store?: ConversationStateByType[T];
}
