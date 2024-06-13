import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { RefObject, useState } from "react";

interface IProps {
  onDeleteMessage: (isRecall?: boolean) => void;
  container: RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function MoreActionButton({
  onDeleteMessage,
  container,
  isOpen,
  setIsOpen,
}: IProps) {
  const iconStyles = {
    size: 20,
    color: "#ffffffb3",
  };
  return (
    <DropdownMenu
      open={isOpen}
      modal={true}
      onOpenChange={() => setIsOpen(!isOpen)}
    >
      <DropdownMenuTrigger>
        <Button
          variant="icon"
          className="p-2 h-auto hover:bg-[rgba(255,255,255,0.06)]"
        >
          <Ellipsis {...iconStyles} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        portalProps={{ container: container?.current }}
        className="z-[99] relative bg-dark-primary w-[220px] max-w-full py-3 px-0 border-[rgb(112,114,118)]"
      >
        <div>
          <DropdownMenuItem className="px-6 text-text-primary focus:text-white">
            <span className="text-[15px] font-[400]">Edit message</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteMessage(true)}
            className="px-6 text-text-primary focus:text-white"
          >
            <span className="text-[15px] font-[400]">Recall message</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={() => onDeleteMessage()}
            className="px-6 text-[#DE678A] focus:text-white focus:bg-[#DE678A]"
          >
            <span className="text-[15px] font-[400]">Delete message</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MoreActionButton;
