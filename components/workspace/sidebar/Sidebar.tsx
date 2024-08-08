"use client";
import { cn } from "@/lib/utils";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import SidebarList from "./sidebar-body/SidebarList";
import SidebarFooter from "./sidebar-footer/SidebarFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

function Sidebar() {
  const workspace = useOrganization();

  return (
    <div className="h-sidebar-height">
      <div
        className={cn(
          "pt-3 w-12 flex flex-col items-center h-full justify-between",
          "lg:w-[76px]"
        )}
      >
        <div className="h-full overflow-hidden w-full">
          <div className="pb-3 flex justify-center">
            {workspace.organization?.imageUrl && (
              <Image
                alt=""
                src={workspace.organization?.imageUrl}
                width={26}
                height={26}
                className="rounded-[5px]"
              />
            )}
          </div>

          <ScrollArea className="h-[calc(100%-50px)]">
            <SidebarList />
          </ScrollArea>
        </div>
        <SidebarFooter />
      </div>
    </div>
  );
}

export default Sidebar;
