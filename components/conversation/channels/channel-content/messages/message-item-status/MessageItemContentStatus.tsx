import { detectTypeOfFileFromMimeType } from "@/app/utils";
import { cn } from "@/lib/utils";
import { MessageItemProps } from "@/types";
import TextMessage from "../message-item/mesage-item-content/TextMessage";
import FileMessageStatus from "./FileMessageStatus";
import VideoMessageStatus from "./VideoMessageStatus";
import ImageMessageStatus from "./ImageMessageStatus";

interface IProps {
  message: MessageItemProps;
}

const renderFile = (file: File) => {
  const extension = detectTypeOfFileFromMimeType(file.type);
  switch (extension) {
    case "file":
      return <FileMessageStatus file={file} />;
    case "video":
      return <VideoMessageStatus file={file} />;
    case "image":
      return <ImageMessageStatus file={file} />;
    default:
      return null;
  }
};

function MessageItemContentStatus({ message }: IProps) {
  return (
    <div>
      <TextMessage content={message.content} />
      <div className="flex flex-wrap max-w-[80%]">
        {message.filesStatus?.map((file) => (
          <div
            key={`${file.name}-${new Date()}`}
            className={cn(
              "px-1 max-w-[420px]",
              `${
                message.filesStatus && message.filesStatus.length <= 1
                  ? "basis-6/12"
                  : "basis-4/12"
              }`
            )}
          >
            {renderFile(file)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageItemContentStatus;
