/* eslint-disable react-hooks/exhaustive-deps */
import { useChannelStore } from "@/app/store/channel.store";
import { useDropzone } from "react-dropzone";
import MessageList from "./MessageList";
import ChatInput from "./chat-input/ChatInput";

function MessageContainer() {
  const { setFiles } = useChannelStore((state) => ({
    setFiles: state.setFiles,
  }));
  const { getRootProps } = useDropzone({
    noClick: true,
    onDrop(acceptedFiles, fileRejections, event) {
      acceptedFiles.forEach((file) => setFiles(file));
    },
  });
  return (
    <div className="flex flex-col justify-between h-full relative">
      <MessageList />
      <div
        {...getRootProps({
          className: "dropzone p-5 w-full",
        })}
      >
        <ChatInput />
      </div>
    </div>
  );
}

export default MessageContainer;
