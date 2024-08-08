import { useChannelStore } from "@/app/store/channel.store";
import { useMessageSharedStore } from "@/app/store/message-shared.store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionType, MessageItemProps } from "@/types";
import { Ellipsis } from "lucide-react";
import { RefObject, useState } from "react";

interface IProps {
  onDeleteMessage: (isRecall?: boolean) => void;
  container: RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: MessageItemProps;
}

function MoreActionButton({
  onDeleteMessage,
  container,
  isOpen,
  setIsOpen,
  message,
}: IProps) {
  const { setActionMessage } = useMessageSharedStore((state) => ({
    setActionMessage: state.setActionMessage,
  }));
  const iconStyles = {
    size: 20,
    color: "#ffffffb3",
  };

  const onSetActionForMessage = (type: ActionType) => {
    setActionMessage({
      type,
      message,
    });
  };
  return (
    <DropdownMenu
      open={isOpen}
      modal={true}
      onOpenChange={() => setIsOpen(!isOpen)}
    >
      <DropdownMenuTrigger asChild>
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
          <DropdownMenuItem
            onClick={() => onSetActionForMessage(ActionType.EDIT)}
            className="px-6 text-text-primary focus:text-white"
          >
            <span className="text-[15px] font-[400]">Edit message</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-6 text-text-primary focus:text-white"
            onClick={() => onSetActionForMessage(ActionType.REPLY)}
          >
            <span className="text-[15px] font-[400]">Reply message</span>
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
