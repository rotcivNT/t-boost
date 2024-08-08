import {
  detectTypeOfFileFromMimeType,
  formatDateFileUpload,
  getFileExtension,
  getIconOfFile,
} from "@/app/utils";
import { TaskAttachment } from "@/types/task.type";
import Image from "next/image";
import { Button } from "../ui/button";

interface IProps {
  taskAttachment: TaskAttachment;
  onRemoveAttachment: () => void;
}
export default function TaskAttachmentItem({
  taskAttachment,
  onRemoveAttachment,
}: IProps) {
  const extension = getFileExtension(taskAttachment.mimeType);
  const typeOfFile = detectTypeOfFileFromMimeType(taskAttachment.mimeType);
  const Icon = getIconOfFile(extension);

  return (
    <div className="flex gap-4 my-4">
      {typeOfFile === "image" ? (
        <Image
          src={taskAttachment.fileUrl}
          alt={taskAttachment.fileName}
          width={80}
          height={80}
          className="object-cover rounded-[10px]"
        />
      ) : (
        <div className="size-[80px] flex justify-center items-center">
          <Icon width={60} height={60} />
        </div>
      )}
      <div className="space-y-1">
        <p className="font-bold text-text-primary">{taskAttachment.fileName}</p>
        <p className="text-sm font-medium text-text-primary">
          {formatDateFileUpload(taskAttachment.createdAt.toString())}
        </p>
        <div className="flex gap-3">
          <Button
            variant="link"
            className="p-0 h-fit text-text-primary underline"
          >
            Download
          </Button>
          <Button
            onClick={onRemoveAttachment}
            variant="link"
            className="p-0 h-fit text-text-primary underline"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
