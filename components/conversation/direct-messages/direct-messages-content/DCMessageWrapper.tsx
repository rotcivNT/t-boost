import { useMessageSharedStore } from "@/app/store/message-shared.store";
import { ConversationType } from "@/types/conversation.type";
import { useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import MessageList from "../../../messages/MessageList";
import ChatInput from "../../../messages/chat-input/ChatInput";

export default function DCMessageWrapper() {
  const sharedMessageStore = useMessageSharedStore();
  const { getRootProps } = useDropzone({
    noClick: true,
    onDrop(acceptedFiles) {
      acceptedFiles.forEach((file) => sharedMessageStore.setFiles(file));
    },
  });
  const { cid: conversationId } = useParams();
  return (
    <div className="flex flex-col justify-between h-full relative">
      <MessageList
        conversationId={(conversationId as string).slice(1)}
        store={sharedMessageStore}
        type={ConversationType.DIRECT_MESSAGE}
      />
      <div
        {...getRootProps({
          className: "dropzone p-5 w-full max-h-[80%]",
        })}
      >
        <ChatInput
          conversationId={(conversationId as string).slice(1)}
          store={sharedMessageStore}
          type={ConversationType.DIRECT_MESSAGE}
        />
      </div>
    </div>
  );
}
