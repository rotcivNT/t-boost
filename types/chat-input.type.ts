import { MessageSharedState } from "@/app/store/message-shared.store";
import { ConversationType } from "./conversation.type";

export interface ChatInputProps {
  store: MessageSharedState;
  type: ConversationType;
  conversationId: string;
}
