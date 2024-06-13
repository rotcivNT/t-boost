import { uploadAPI } from "@/app/apis/uploadAPI";
import { deleteFile } from "@/app/services/action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileData } from "@/types";
import { CloudDownload, Copy, Ellipsis } from "lucide-react";
import Link from "next/link";

interface IProps {
  file: FileData;
  onDeleteFile: () => void;
  onDownload: (file: FileData) => void;
}

function FooterButton({ file, onDeleteFile, onDownload }: IProps) {
  const iconStyles = {
    size: 20,
    color: "#ffffffb3",
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(file.url);
  };
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onDownload(file)}
              variant="icon"
              className="px-[6px] py-[5px] size-9"
            >
              <CloudDownload {...iconStyles} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs font-[500]">Download</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="icon" className="px-[6px] py-[5px] size-9">
              <Link href={file.url} target="_blank">
                <Copy {...iconStyles} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs font-[500]">Open in new window</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="icon" className="px-[6px] py-[5px] size-9">
                <Ellipsis {...iconStyles} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {/* Tooltip content */}
          <TooltipContent>
            <p className="text-xs font-[500]">More actions</p>
          </TooltipContent>
          {/* Dropdown content */}
          <DropdownMenuContent className="z-[99] bg-dark-primary w-[220px] max-w-full py-3 px-0 border-[rgb(112,114,118)]">
            <DropdownMenuItem className="px-6 text-text-primary focus:text-white">
              <span className="text-[15px] font-[400]">Share file...</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onCopyLink}
              className="px-6 text-text-primary focus:text-white"
            >
              <span className="text-[15px] font-[400]">Copy link to file</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="px-6 text-[#DE678A] focus:text-white focus:bg-[#DE678A]"
              onClick={onDeleteFile}
            >
              <span className="text-[15px] font-[400]">Delete file</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </Tooltip>
      </TooltipProvider>
    </DropdownMenu>
  );
}

export default FooterButton;
