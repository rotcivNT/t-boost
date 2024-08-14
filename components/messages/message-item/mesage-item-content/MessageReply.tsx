import { getFileExtension, getIconOfFile } from "@/app/utils";
import TBImage from "@/components/common/TBImage";
import { cn } from "@/lib/utils";
import { FileData, MessageItemProps } from "@/types";
import parse from "html-react-parser";

interface IProps {
  replyMessage: MessageItemProps;
  className?: string;
  onJump?: (key: string) => void;
}

const RenderFile = ({ file }: { file: FileData }) => {
  if (file.type === "image")
    return (
      <div>
        <TBImage MAX_WIDTH={50} file={file} className="cursor-pointer" />
      </div>
    );
  const extension = getFileExtension(file.mimeType);
  const Icon = getIconOfFile(extension);
  return (
    <div>
      <Icon width={30} height={30} />
    </div>
  );
};

function MessageReply({ replyMessage, className, onJump }: IProps) {
  const file =
    replyMessage?.files && replyMessage?.files.length > 0
      ? replyMessage?.files[0]
      : undefined;
  return (
    <div
      className={cn(
        "p-2 inline-flex items-stretch gap-2 bg-dark-secondary rounded-[8px] border border-border cursor-pointer",
        "min-w-[50%] lg:min-w-[300px] my-1",
        className
      )}
      onClick={onJump ? () => onJump(replyMessage._id) : undefined}
    >
      <div className="w-1 rounded-[8px] bg-[#D0D0D0]" />
      <div className="flex items-center gap-2">
        {/* Icon or file */}
        {file && <RenderFile file={file} />}
        <div className="text-[13px] flex flex-col gap-1">
          <span className="text-[#F8F8F8]">
            {replyMessage.sender?.fullName}
          </span>
          <span className=" text-text-primary ">
            {file
              ? file?.type === "image"
                ? "[Image]"
                : `[File] ${file?.name}`
              : ""}
            {parse(replyMessage.content)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageReply;
