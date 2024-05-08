import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { Headset } from "lucide-react";
function HuddleButton() {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="flex items-center justify-center h-7 rounded-[6px] border border-[#797c814d] p-1 hover:bg-[rgba(255,255,255,0.03)]">
              <Headset {...iconStyles} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start huddle</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Dialog>
  );
}

export default HuddleButton;
