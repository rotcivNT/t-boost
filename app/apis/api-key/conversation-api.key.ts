import { getChannelById } from "@/app/services/action";
import { getDCById } from "@/app/services/channel.action";
import { ConversationType } from "@/types/conversation.type";

export const ConversationApiKeys = {
  getDCByIdKey: (id: string) => `get-direct-conversation/${id}`,
  getChannelByIdKey: (id: string) => `/${id}`,
};

export const GetConversationApiFunction = {
  [ConversationType.CHANNEL]: getChannelById,
  [ConversationType.DIRECT_MESSAGE]: getDCById,
};
