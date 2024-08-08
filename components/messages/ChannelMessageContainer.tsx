/* eslint-disable react-hooks/exhaustive-deps */
import { useChannelStore } from "@/app/store/channel.store";
import { useDropzone } from "react-dropzone";
import MessageList from "./MessageList";
import ChatInput from "./chat-input/ChatInput";
import { ConversationType } from "@/types/conversation.type";
import { useMessageSharedStore } from "@/app/store/message-shared.store";

function ChannelMessageContainer() {
  const channelStore = useChannelStore();
  const messageSharedStore = useMessageSharedStore();
  const { getRootProps } = useDropzone({
    noClick: true,
    onDrop(acceptedFiles) {
      acceptedFiles.forEach((file) => messageSharedStore.setFiles(file));
    },
  });
  return (
    <div className="flex flex-col justify-between h-full relative">
      <MessageList
        type={ConversationType.CHANNEL}
        conversationId={channelStore.currentChannel._id}
        store={messageSharedStore}
      />
      <div
        {...getRootProps({
          className: "dropzone p-5 w-full max-h-[80%]",
        })}
      >
        <ChatInput
          type={ConversationType.CHANNEL}
          conversationId={channelStore.currentChannel._id}
          store={messageSharedStore}
        />
      </div>
    </div>
  );
}

export default ChannelMessageContainer;
