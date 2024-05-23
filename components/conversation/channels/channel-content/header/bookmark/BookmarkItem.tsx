import DropdownTriggerButton from "@/components/shadcn-custom/dropdowm-menu/DropdownTriggerButton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Bookmark } from "@/types";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import Image from "next/image";
import Link from "next/link";
import { BookmarkDialogContent } from "./dialog-content/BookmarkDialogContent";
import { useMemo } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { socket } from "@/configs/socket";
import { usePathname } from "next/navigation";
import { LinkIcon } from "lucide-react";

interface IProps {
  bookmark: Bookmark;
  folderName?: string;
}

function BookmarkItem({ bookmark, folderName }: IProps) {
  const channelId = usePathname().split("/C/")[1];
  const initValue = useMemo(() => {
    return {
      name: bookmark.name,
      url: bookmark.url,
      thumbnail: bookmark.thumbnail,
      folderName,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onCoppyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
  };
  const onDelete = () => {
    const payload = {
      channelId,
      bookmarkData: {
        bookmarkName: bookmark.name,
        parentName: folderName,
        isFolder: false,
      },
    };
    socket.emit("delete-bookmark", payload);
  };
  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger className="h-[26px]">
          <Link
            className="hover:bg-[rgba(255,255,255,0.06)] rounded-[4px] px-2 py-1 cursor-pointer block"
            href={bookmark.url}
            target="_blank"
          >
            <DropdownTriggerButton
              title={bookmark.name}
              leftIcon={
                bookmark.thumbnail ? (
                  <Image
                    alt={bookmark.name}
                    src={bookmark.thumbnail}
                    width={16}
                    height={16}
                  />
                ) : (
                  <LinkIcon width={16} height={16} color="#ABABAD" />
                )
              }
              className="text-[13px] text-[#ABABAD]"
            />
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-dark border-border">
          <DialogTrigger asChild>
            <ContextMenuItem className="text-[13px] text-text-primary">
              Edit
            </ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem
            onClick={onDelete}
            className="text-[13px] text-text-primary"
          >
            Delete
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onCoppyLink}
            className="text-[13px] text-text-primary"
          >
            Coppy link
          </ContextMenuItem>
        </ContextMenuContent>
        <BookmarkDialogContent
          isFolder={false}
          folderName={folderName}
          initValue={initValue}
          isEdit={true}
        />
      </ContextMenu>
    </Dialog>
  );
}

export default BookmarkItem;
