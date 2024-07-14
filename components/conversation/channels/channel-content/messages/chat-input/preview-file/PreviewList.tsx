import { Button } from "@/components/ui/button";
import FilePreview from "./FilePreview";
import ImagePreview from "./ImagePreview";
import { Trash, X } from "lucide-react";
import { useChannelStore } from "@/app/store/channel.store";

interface IProps {
  files: File[];
  setFiles: (file: File) => void;
}
// Image or File
export const detectTypeOfPreview = (file: File) => {
  const type = file.type;
  if (type.includes("image")) return "image";
  return "file";
};
function PreviewList({ files, setFiles }: IProps) {
  const removeSpecificFile = useChannelStore(
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
