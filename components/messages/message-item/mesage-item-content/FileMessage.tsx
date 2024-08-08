"use client";
import { getFileExtension, getIconOfFile } from "@/app/utils";
import { cn } from "@/lib/utils";
import { FileData } from "@/types";
import Image from "next/image";

interface IProps {
  fileData: FileData;
  onClick: () => void;
}

const supportFileExtension = ["docx", "doc", "xls", "xlsx", "json", "pdf"];

function FileMessage({ fileData, onClick }: IProps) {
  const extension = getFileExtension(fileData.mimeType);
  const Icon = getIconOfFile(extension);
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      const sizeInKB = size / 1024;
      return `${sizeInKB.toFixed(2)} KB`;
    } else {
      const sizeInMB = size / (1024 * 1024);
      return `${sizeInMB.toFixed(2)} MB`;
    }
  };
  const onOpenFileViewer = supportFileExtension.includes(extension)
    ? onClick
    : undefined;

  return (
    <>
      <div
        onClick={onOpenFileViewer}
        className={cn(
          "flex items-start gap-2 bg-dark-secondary rounded-[8px] border border-border",
          "px-4 py-2",
          `${onOpenFileViewer ? "cursor-zoom-in" : "cursor-default"}`
        )}
      >
        <p className="relative top-[2px]">
          {fileData.type === "image" ? (
            <Image
              src={fileData.url}
              alt={fileData.name}
              width={36}
              height={36}
              className="size-9 rounded-[6px]"
            />
          ) : (
            <Icon />
          )}
        </p>
        <p className="flex flex-1 flex-col">
          <span className="text-[15px] font-[500] text-text-primary line-clamp-2 break-all">
            {fileData.name}
          </span>
          <span className="text-[13px] text-text-secondary flex justify-between items-center">
            <span>{formatFileSize(fileData.size)}</span>
          </span>
        </p>
      </div>
    </>
  );
}

export default FileMessage;
