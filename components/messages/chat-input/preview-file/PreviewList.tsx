import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FilePreview from "./FilePreview";
import ImagePreview from "./ImagePreview";
import { useMessageSharedStore } from "@/app/store/message-shared.store";

interface IProps {
  files: File[];
}
// Image or File
export const detectTypeOfPreview = (file: File) => {
  const type = file.type;
  if (type.includes("image")) return "image";
  return "file";
};
function PreviewList({ files }: IProps) {
  const removeSpecificFile = useMessageSharedStore(
    (state) => state.removeSpecificFile
  );
  return (
    <div className="flex gap-3 flex-wrap">
      {files.map((file, index) => {
        const type = detectTypeOfPreview(file);
        return (
          <div key={index} className="relative [&:hover_button]:flex">
            {type === "image" ? (
              <ImagePreview file={file} />
            ) : (
              <FilePreview fileName={file.name} />
            )}

            <Button
              className="bg-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.7)] justify-center items-center size-5 absolute z-[1] -top-2 -right-2 rounded-full overflow-hidden hidden"
              size="icon"
              variant="icon"
              onClick={() => removeSpecificFile(file.name, file.lastModified)}
            >
              <X size={16} color="#000" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default PreviewList;
