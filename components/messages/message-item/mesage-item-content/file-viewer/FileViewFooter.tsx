import { FileData } from "@/types";
import FooterButton from "./file-viewer-button/FooterButton";
import styles from "./styles.module.scss";

interface IProps {
  file: FileData;
  onDeleteFile: () => void;
  onDownload: (file: FileData) => void;
}

function FileViewFooter({ file, onDeleteFile, onDownload }: IProps) {
  return (
    <div className="px-3 py-2 flex items-center justify-end">
      <div className={styles["file-viewer-footer"]} />
      {/* Right content */}
      <div className="flex gap-4">
        <FooterButton
          onDownload={onDownload}
          file={file}
          onDeleteFile={onDeleteFile}
        />
      </div>
    </div>
  );
}

export default FileViewFooter;
