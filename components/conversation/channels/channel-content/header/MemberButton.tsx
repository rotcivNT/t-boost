import { useChannelStore } from "@/app/store/channel.store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import ChannelDetails from "./channel-button/ChannelDetails";

function MemberButton() {
  const channel = useChannelStore().currentChannel;
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="flex items-center justify-center h-7 rounded-[6px] border border-[#797c814d] p-1 hover:bg-[rgba(255,255,255,0.03)]">
              <Image
                src="https://ca.slack-edge.com/T06FW3SK3MH-U06G8RS0317-2d5da6c4fb79-48"
                alt=""
                width={20}
                height={20}
                className="rounded-[4px] relative [&+img]:-left-2 z-10"
              />
              <Image
                src="https://ca.slack-edge.com/T06FW3SK3MH-U06MXDLPTSR-dc219b4bc688-48"
                alt=""
                width={20}
                height={20}
                className="rounded-[4px] relative"
              />
              <span className="text-[13px] text-[#E8E8E8B3] font-[500] pl-[6px] pr-[2px]">
                1
              </span>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View all members of this channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="bg-dark-primary border-border rounded-[8px] p-0">
        <ChannelDetails channel={channel} defaultTab="members" />
      </DialogContent>
    </Dialog>
  );
}

export default MemberButton;
