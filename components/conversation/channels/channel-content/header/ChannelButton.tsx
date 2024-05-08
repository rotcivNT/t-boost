import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ChannelButton() {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="hover:bg-[rgba(255,255,255,0.06)] py-[2px] px-2 rounded-[6px] text-lg text-text-primary font-[500]">
              # team-dev
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get channel details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Dialog>
  );
}

export default ChannelButton;
