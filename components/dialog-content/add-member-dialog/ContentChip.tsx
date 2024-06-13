import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface IProps {
  content: string;
  isValid?: boolean;
  onClick?: () => void;
}

function ContentChip({ content, onClick, isValid }: IProps) {
  return (
    <div
      contentEditable={false}
      className={cn(
        "bg-[#1d9bd11a] border py-1 px-2 rounded-[6px] flex items-center gap-1 cursor-pointer",
        `${isValid ? "border-transparent" : "border-red-700"}`
      )}
      onClick={onClick}
    >
      <p
        className={cn(
          "text-text-primary font-[500]",
          `${isValid ? "" : "line-through text-slate-500"}`
        )}
      >
        {content}
      </p>
      <X
        {...iconStyles}
        color="#D1D2D3"
        strokeWidth={2}
        className="hover:bg-[#24333B] rounded-[4px]"
      />
    </div>
  );
}

export default ContentChip;
