import { Sender } from "@/app/apis/api-payload";
import Image from "next/image";
import styles from "./styles.module.scss";

interface IProps {
  sender: Sender;
  fileName: string;
}

function FileViewerHeader({ sender, fileName }: IProps) {
  return (
    <div className="p-3 flex items-center justify-between">
      <div className={styles["file-viewer-header"]} />
      <div className="flex gap-2">
        <Image
          alt={sender.fullName}
          src={sender.imageUrl}
          width={36}
          height={36}
          className="rounded-[8px] object-cover size-9 relative top-[2px]"
        />
        <p className="flex flex-col text-white">
          <span className="text-[15px] font-[500]">{sender.fullName}</span>
          <span className="text-xs">{fileName}</span>
        </p>
      </div>
    </div>
  );
}

export default FileViewerHeader;
