"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ListFilter, SendHorizonal, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ConversationSidebarButton from "./ConversationSidebarButton";
import Channels from "./channels/Channels";
import DirectMessages from "./direct-messages/DirectMessages";
import HelperApps from "./helper-app/HelperApps";
import { ScrollArea } from "../ui/scroll-area";

function ConversationSidebar() {
  const workspace = useOrganization();
  const { user } = useUser();
  return (
    <div className="h-sidebar-height flex flex-col">
      <div className="flex items-center justify-between p-4">
        <span className="text-text-primary font-bold">
          {workspace.organization?.name}
        </span>
        <div className="flex items-center gap-4">
          <Button variant="icon" size="icon">
            <ListFilter
              width={20}
              height={20}
              color="#B9BABD"
              strokeWidth={1.5}
            />
          </Button>
          <Button variant="icon" size="icon">
            <SquarePen
              width={20}
              height={20}
              color="#B9BABD"
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>
      <Separator className="bg-[#3B3D42]" />
      <ScrollArea className="h-full">
        <div className="mb-10">
          <div className="px-2 pt-[10px] mb-5">
            <ConversationSidebarButton
              icon={<SendHorizonal width={20} height={20} strokeWidth={1.5} />}
              title="Drafts & sent"
              href=""
            />
          </div>
          <div className="px-2">
            <Channels
              workspaceId={workspace.organization?.id}
              userId={user?.id}
            />
          </div>
          <div className="px-2">
            <DirectMessages />
          </div>
          <div className="px-2">
            <HelperApps />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default ConversationSidebar;
