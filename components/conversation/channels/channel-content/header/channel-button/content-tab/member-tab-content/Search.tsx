import { Input } from "@/components/ui/input";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

function Search() {
  return (
    <div className="px-7">
      <div className="relative">
        <SearchIcon
          {...iconStyles}
          className="absolute left-2 top-1/2 -translate-y-1/2"
        />
        <Input
          variant="default"
          placeholder="Find members"
          className={cn(
            "bg-inherit border-[rgba(209,210,211,.3)] text-text-primary placeholder:text-text-primary",
            "pl-8 pr-4"
          )}
        />
      </div>
    </div>
  );
}

export default Search;
