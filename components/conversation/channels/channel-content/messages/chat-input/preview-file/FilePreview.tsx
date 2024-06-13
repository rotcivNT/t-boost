import { detectTypeFileFromUrl, getIconOfFile } from "@/app/utils";
import { cn } from "@/lib/utils";

interface IProps {
  fileName: string;
}

function FilePreview({ fileName }: IProps) {
  const fileExtension = detectTypeFileFromUrl(fileName);
  const FileIcon = getIconOfFile(fileExtension);
  return (
    <div>
      <div
        className={cn(
          "bg-dark-secondary rounded-[12px] p-3 flex gap-2 items-center"
        )}
      >
        <FileIcon width={36} height={36} />
        <div>
          <p className="truncate text-[15px] text-text-primary max-w-[180px] font-[500]">
            {fileName}
          </p>
          <p className="text-[13px] text-text-secondary">
            {fileExtension.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
