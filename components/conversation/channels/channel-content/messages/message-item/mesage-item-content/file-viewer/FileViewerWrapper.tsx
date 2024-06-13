import { Sender } from "@/app/apis/api-payload";
import { deleteFile } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileData, MessageItemProps } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";
import DocViewerWrapper from "./DocViewerWrapper";
import FileViewFooter from "./FileViewFooter";
import FileViewerHeader from "./FileViewerHeader";
import ImageViewer from "./ImageViewer";
import RedirectButton from "./file-viewer-button/RedirectButton";
import styles from "./styles.module.scss";
import { pusher } from "@/configs/pusher";

interface IProps {
  files: FileData[];
  activeIndex: number;
  sender: Sender;
  setActiveIndex: (index: number) => void;
  onDeleteFile: (deleteUrl: string) => void;
  onDownload: (file: FileData) => void;
}

function FileViewerWrapper({
  files,
  activeIndex,
  setActiveIndex,
  sender,
  onDeleteFile,
  onDownload,
}: IProps) {
  const [activeFile, setActiveFile] = useState<FileData>(files[activeIndex]);
  const onClose = () => setActiveIndex(-1);
  return (
    <div className="fixed p-7 w-full h-full top-0 left-0 z-[99] bg-[#0009]">
      <div
        className={cn(
          "relative h-full bg-black overflow-hidden rounded-[8px]",
          styles["container"]
        )}
      >
        <div
          className="absolute inset-[-100px] bg-cover bg-black bg-[50%] blur-[40px] brightness-[0.4]"
          style={{
            backgroundImage: `url(${encodeURI(activeFile.url)})`,
          }}
        />
        <div
          className={cn(
            "absolute top-0 left-0 w-full opacity-0 -translate-y-5 z-[9]",
            styles["header-wrapper"]
          )}
        >
          <FileViewerHeader sender={sender} fileName={activeFile.name} />
        </div>
        {activeFile.type === "image" && <ImageViewer file={activeFile} />}
        {activeFile.type === "file" ? (
          <DocViewerWrapper uri={activeFile.url} />
        ) : (
          ""
        )}

        <div
          className={cn(
            "absolute bottom-0 left-0 w-full opacity-0 translate-y-5 z-[10]",
            styles["footer-wrapper"]
          )}
        >
          <FileViewFooter
            onDeleteFile={() => onDeleteFile(activeFile.url)}
            file={activeFile}
            onDownload={onDownload}
          />
        </div>
        <Button
          variant="icon"
          onClick={onClose}
          className={cn(
            "absolute top-3 right-2 z-[10] px-2 opacity-0 -translate-y-5",
            styles["close-button"]
          )}
        >
          <X color="#DADADA" />
        </Button>
        <RedirectButton
          activeFile={activeFile}
          files={files}
          setActiveFile={setActiveFile}
        />
      </div>
    </div>
  );
}

export default FileViewerWrapper;
