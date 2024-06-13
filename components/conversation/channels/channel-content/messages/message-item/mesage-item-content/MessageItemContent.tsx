import { deleteFile } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import { pusher } from "@/configs/pusher";
import { cn } from "@/lib/utils";
import { FileData, MessageItemProps } from "@/types";
import { CloudDownload, Trash } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import FowardButton from "../message-item-action/FowardButton";
import EmojiWrapper from "./EmojiWrapper";
import FileMessage from "./FileMessage";
import ImageMessage from "./ImageMessage";
import TextMessage from "./TextMessage";
import VideoMessage from "./VideoMessage";
import FileViewerWrapper from "./file-viewer/FileViewerWrapper";
import { uploadAPI } from "@/app/apis/uploadAPI";

interface IProps {
  message: MessageItemProps;
}

interface RenderFileProps {
  file: FileData;
  onClick: () => void;
  isFileAllImages: boolean;
  isMultipleImages: boolean;
}

const RenderFile = ({
  file,
  onClick,
  isFileAllImages,
  isMultipleImages,
}: RenderFileProps) => {
  switch (file.type) {
    case "file":
      return <FileMessage onClick={onClick} fileData={file} />;
    case "video":
      return <VideoMessage content={file.url} />;
    case "image":
      return isFileAllImages ? (
        <ImageMessage
          onClick={onClick}
          file={file}
          isFileAllImages={isFileAllImages}
          isMultipleImages={isMultipleImages}
        />
      ) : (
        <FileMessage onClick={onClick} fileData={file} />
      );
    default:
      return null;
  }
};

function MessageItemContent({ message }: IProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const onSetActiveIndex = (index: number) => {
    setActiveIndex((pre) => index);
  };
  const { channel, updateMessageLocal } = useChannelStore((state) => ({
    channel: state.currentChannel,
    updateMessageLocal: state.updateMessage,
  }));
  const isFileAllImages = useMemo(() => {
    return message.files?.every((file) => file.type === "image");
  }, [message.files]);

  const onDeleteFile = async (deleteUrl: string) => {
    const files = message.files;
    if (!files) return;

    const newFiles = files?.filter((file) => file.url !== deleteUrl);
    try {
      if (!files || !newFiles) return;
      const res = await deleteFile(
        message._id,
        deleteUrl,
        pusher.connection.socket_id,
        channel._id
      );
      console.log(res);

      if (res?._id) {
        if (newFiles.length === 0) {
          updateMessageLocal(message._id, "isDelete", true);
        }
        updateMessageLocal(message._id, "files", newFiles);
        setActiveIndex(-1);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const download = async (file: FileData) => {
    if (file.type === "image") {
      const newTab = window.open(file.url, "_blank");
      const response = await uploadAPI.getImages(file.url);

      newTab?.close();
      const byteArray = new Uint8Array(response.data.data);
      const blob = new Blob([byteArray], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  return message.isRecall ? (
    <span className="text-[15px] text-text-secondary italic">
      Tin nhắn đã bị thu hồi
    </span>
  ) : (
    <div>
      <TextMessage content={message.content} />
      <div className="flex flex-wrap relative">
        {message.files?.map((file, index) => (
          <div
            key={file.url}
            className={cn(
              "p-1 max-w-[420px] relative [&:hover_div:last-child]:flex",
              `${!isFileAllImages ? "min-w-[80%] lg:min-w-[400px]" : ""}`,
              `${
                file.type === "video" ? "basis-full max-w-none" : "basis-auto"
              }`
            )}
          >
            <RenderFile
              file={file}
              onClick={() => onSetActiveIndex(index)}
              isFileAllImages={isFileAllImages as boolean}
              isMultipleImages={
                message.files ? message.files.length > 1 : false
              }
            />

            <div className="absolute top-2 left-2 hidden bg-dark-primary border border-border rounded-[8px] z-[2]">
              <Button
                variant="icon"
                className="px-[6px] py-[5px] size-9"
                onClick={() => download(file)}
              >
                <CloudDownload color="#ffffffb3" size={18} />
              </Button>
              <FowardButton message={message} />
              <Button
                onClick={() => onDeleteFile(file.url)}
                variant="icon"
                className="px-[6px] py-[5px] size-9"
              >
                <Trash color="#ffffffb3" size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-1">
        {message.reactions?.map((item) => (
          <EmojiWrapper
            unified={item.emoji}
            count={item.count}
            key={item.emoji}
          />
        ))}
      </div>
      {activeIndex !== -1 && (
        <FileViewerWrapper
          sender={message.sender}
          activeIndex={activeIndex}
          files={message.files || []}
          setActiveIndex={setActiveIndex}
          onDeleteFile={onDeleteFile}
          onDownload={download}
        />
      )}
    </div>
  );
}

export default MessageItemContent;
