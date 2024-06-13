import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileData } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface IProps {
  files: FileData[];
  activeFile: FileData;
  setActiveFile: (file: FileData) => void;
}
const iconStyles = {
  size: 20,
  color: "#ffffffb3",
};

const btnStyles =
  "fixed top-1/2 -translate-y-1/2 bg-dark-secondary size-10 rounded-full p-0 hover:bg-dark-secondary z-[10]";

function RedirectButton({ files, activeFile, setActiveFile }: IProps) {
  const activeIndex = files.findIndex((file) => file.url === activeFile.url);
  const onClick = (index: number) => setActiveFile(files[index]);
  return (
    <div>
      {activeIndex !== 0 && (
        <Button
          variant="icon"
          className={cn(btnStyles, "left-12")}
          onClick={() => onClick(activeIndex - 1)}
        >
          <ArrowLeft {...iconStyles} />
        </Button>
      )}
      {activeIndex !== files.length - 1 && (
        <Button
          variant="icon"
          className={cn(btnStyles, "right-12")}
          onClick={() => onClick(activeIndex + 1)}
        >
          <ArrowRight {...iconStyles} />
        </Button>
      )}
    </div>
  );
}

export default RedirectButton;
