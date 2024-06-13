import { Button } from "@/components/ui/button";
import { DialogClose, DialogHeader } from "@/components/ui/dialog";
import { ChannelProps } from "@/types";
import { BellOff, Headset } from "lucide-react";
import ContentTab from "./content-tab/ContentTab";

interface IProps {
  channel: ChannelProps;
  defaultTab?: string;
}

function ChannelDetails({ channel, defaultTab }: IProps) {
  return (
    <div className="h-[min(85vh,820px)] overflow-hidden">
      <div className="pt-5 px-7 bg-dark-secondary h-[96px]">
        <DialogHeader className="text-left text-[20px] text-text-primary font-[600]">
          <span># {channel.name}</span>
          <DialogClose />
        </DialogHeader>
        <div className="flex items-center gap-2 pt-1 pb-2">
          <Button variant="primary" className="h-7 px-3 gap-1 text-[13px]">
            <BellOff size={15} strokeWidth={2.5} className="text-inherit" />
            <span>Notifications Off</span>
          </Button>
          <Button variant="primary" className="h-7 px-3 gap-1 text-[13px]">
            <Headset size={15} strokeWidth={2.5} className="text-inherit" />
            <span>Huddle</span>
          </Button>
        </div>
      </div>

      <ContentTab defaultTab={defaultTab} />
    </div>
  );
}

export default ChannelDetails;
