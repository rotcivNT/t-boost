"use client";

import DropdownTriggerButton from "@/components/shadcn-custom/dropdowm-menu/DropdownTriggerButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { Folder, Link, Plus } from "lucide-react";
import { useState } from "react";
import { BookmarkDialogContent } from "./dialog-content/BookmarkDialogContent";
import { useChannelStore } from "@/app/store/channel.store";

function AddBookmarkMenu() {
  const [isFolder, setIsFolder] = useState(false);
  const currentChannel = useChannelStore((state) => state.currentChannel);
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-pointer hover:bg-[rgba(255,255,255,0.06)] rounded-[4px] p-1">
            {!currentChannel?.bookmarkFolders?.length &&
            !currentChannel?.bookmarks?.length ? (
              <span className="text-[13px] text-[#ABABAD]">Add a bookmark</span>
            ) : (
              <Plus {...iconStyles} widths={16} height={16} />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-dark-primary border-border w-[300px] py-4 px-0">
          <DialogTrigger className="text-left w-full">
            <DropdownMenuItem
              onClick={() => setIsFolder(true)}
              className="py-2 px-5"
            >
              <DropdownTriggerButton
                leftIcon={<Folder {...iconStyles} width={15} height={15} />}
                title="Create a folder"
                subtitle="Organize your bookmarks"
                className="gap-4"
              />
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger className="text-left w-full">
            <DropdownMenuItem
              onClick={() => setIsFolder(false)}
              className="py-2 px-5"
            >
              <DropdownTriggerButton
                leftIcon={<Link {...iconStyles} width={15} height={15} />}
                title="Add a bookmark to this channel"
                subtitle="Easily find your team's importank links"
                className="gap-4"
              />
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookmarkDialogContent isFolder={isFolder} />
    </Dialog>
  );
}

export default AddBookmarkMenu;
