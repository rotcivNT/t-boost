/* eslint-disable react-hooks/exhaustive-deps */
import { Sender } from "@/app/apis/api-payload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileData } from "@/types";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DocViewerWrapper from "./DocViewerWrapper";
import FileViewFooter from "./FileViewFooter";
import FileViewerHeader from "./FileViewerHeader";
import ImageViewer from "./ImageViewer";
import RedirectButton from "./file-viewer-button/RedirectButton";
import styles from "./styles.module.scss";
import { PreviewFileDataProps } from "../MessageItemContent";

interface IProps {
  files: FileData[];
  sender: Sender;
  onDeleteFile: (deleteUrl: string) => void;
  onDownload: (file: FileData) => void;
  previewFileData: PreviewFileDataProps;
  setPreviewFileData: (data: PreviewFileDataProps) => void;
}

function FileViewerWrapper({
  files,
  previewFileData,
  setPreviewFileData,
  sender,
  onDeleteFile,
  onDownload,
}: IProps) {
  const onClose = () =>
    setPreviewFileData({ activeIndex: -1, activeFile: null });
  return (
    previewFileData.activeFile && (
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
              backgroundImage: `url(${encodeURI(
                previewFileData.activeFile.url
              )})`,
            }}
          />
          <div
            className={cn(
              "absolute top-0 left-0 w-full opacity-0 -translate-y-5 z-[9]",
              styles["header-wrapper"]
            )}
          >
            <FileViewerHeader
              sender={sender}
              fileName={previewFileData.activeFile.name}
            />
          </div>
          {previewFileData.activeFile.type === "image" && (
            <ImageViewer file={previewFileData.activeFile} />
          )}
          {previewFileData.activeFile.type === "file" ? (
            <DocViewerWrapper uri={previewFileData.activeFile.url} />
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
              onDeleteFile={() =>
                onDeleteFile(previewFileData.activeFile?.url || "")
              }
              file={previewFileData.activeFile}
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
            activeFile={previewFileData.activeFile}
            files={files}
            setPreviewFileData={setPreviewFileData}
          />
        </div>
      </div>
    )
  );
}

export default FileViewerWrapper;
