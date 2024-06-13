"use client";
import { useChannelStore } from "@/app/store/channel.store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import ChannelDetails from "./ChannelDetails";

function ChannelButton() {
  const currentChannel = useChannelStore((state) => state.currentChannel);

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger
              className={cn(
                "hover:bg-[rgba(255,255,255,0.06)] py-[2px] px-2 rounded-[6px] text-lg text-text-primary font-[500]",
                "flex items-center gap-1"
              )}
            >
              # {currentChannel && currentChannel.name}
              <ChevronDown {...iconStyles} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get channel details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="bg-dark-primary border-border rounded-[8px] p-0">
        <ChannelDetails channel={currentChannel} />
      </DialogContent>
    </Dialog>
  );
}

export default ChannelButton;
