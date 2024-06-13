import { Loader2 } from "lucide-react";
import FilePreview from "../chat-input/preview-file/FilePreview";

interface IProps {
  file: File;
}

function FileMessageStatus({ file }: IProps) {
  return (
    <div className="relative border-border border rounded-[8px] mt-2">
      <FilePreview fileName={file.name} />
      <Loader2 size={17} className="absolute -top-1 -right-1 animate-spin" />
    </div>
  );
}

export default FileMessageStatus;
