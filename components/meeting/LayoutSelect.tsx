import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dispatch, SetStateAction } from "react";
import { CallLayoutType } from "./MeetingRoom";
import { LayoutList } from "lucide-react";

interface IProps {
  layouts: string[];
  onChangeLayout: Dispatch<SetStateAction<CallLayoutType>>;
}

function LayoutSelect({ layouts, onChangeLayout }: IProps) {
  return (
    <Select>
      <SelectTrigger className="size-9 [&_svg:last-child]:hidden [&_svg:first-child]:shrink-0 rounded-full bg-[#192b2d] hover:bg-[#323b44] border-transparent">
        <LayoutList size={20} />
      </SelectTrigger>
      <SelectContent className="bg-[#19232d] shadow-[0_0_24px_-4px_rgba(0,0,0,0.64)] p-4 rounded-[24px] border-none">
        {layouts.map((layout, index) => {
          return (
            <SelectItem
              value={layout}
              key={layout + index}
              className={cn(
                "hover:bg-[#323b44] focus:bg-[#323b44] rounded-full data-[state=checked]:bg-[#323b44 py-1"
              )}
            >
              {layout}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default LayoutSelect;
