import DropdownTriggerButton from "@/components/shadcn-custom/dropdowm-menu/DropdownTriggerButton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { BookmarkFolder } from "@/types";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { ChevronDown, Folder, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import BookmarkItem from "./BookmarkItem";
import { BookmarkDialogContent } from "./dialog-content/BookmarkDialogContent";

interface IProps {
  bookmarkFolder: BookmarkFolder;
}

const DropdownBookmarkFolder = ({ bookmarkFolder }: IProps) => {
  if (bookmarkFolder.bookmarks.length === 0)
    return (
      <p className="text-[13px] text-[#E8E8E8D3] font-[500] px-5 py-2">
        No bookmarks in folder
      </p>
    );

  return bookmarkFolder.bookmarks.map((bookmark, index) => (
    <div key={bookmark.name + index} className="pb-1">
      <BookmarkItem bookmark={bookmark} folderName={bookmarkFolder.name} />
    </div>
  ));
};

function BookmarkFolderItem({ bookmarkFolder }: IProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const initValue = useMemo(() => {
    return {
      name: bookmarkFolder.name,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onClick = (value: boolean) => {
    setIsEdit(value);
    setIsFolder(value);
    setIsDelete(false);
  };
  const handleClickDelete = () => {
    setIsDelete(true);
    setIsEdit(false);
    setIsFolder(true);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <ContextMenu>
          <ContextMenuTrigger>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:bg-[rgba(255,255,255,0.06)] rounded-[4px] px-2 py-1">
              <DropdownTriggerButton
                title={bookmarkFolder.name}
                leftIcon={<Folder width={13} height={13} color="#ABABAD" />}
                rightIcon={
                  <ChevronDown
                    width={14}
                    height={14}
                    strokeWidth={2.5}
                    color="#ABABAD"
                  />
                }
                className="text-[#ABABAD] font-[400]"
              />
            </DropdownMenuTrigger>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-dark border-border">
            <DialogTrigger asChild>
              <ContextMenuItem
                onClick={() => onClick(true)}
                className="text-[13px] text-text-primary"
              >
                Edit
              </ContextMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild>
              <ContextMenuItem
                onClick={handleClickDelete}
                className="text-[13px] text-text-primary"
              >
                Delete
              </ContextMenuItem>
            </DialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
        <DropdownMenuContent className="bg-dark border-border w-[300px] py-2 px-0">
          <DropdownBookmarkFolder bookmarkFolder={bookmarkFolder} />
          <Separator className="bg-[rgb(59,61,66)]" />
          <DialogTrigger className="text-left w-full pt-2">
            <DropdownMenuItem
              onClick={() => onClick(false)}
              className="py-2 px-5"
            >
              <p className="flex text-[13px] text-text-primary items-center gap-3">
                <Plus
                  width={14}
                  height={14}
                  color="#D1D2D3"
                  strokeWidth={2.5}
                />
                <span className="font-[500]">Add a bookmark</span>
              </p>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookmarkDialogContent
        isFolder={isFolder}
        folderName={bookmarkFolder.name}
        isEdit={isEdit}
        initValue={initValue}
        isDelete={isDelete}
      />
    </Dialog>
  );
}

export default BookmarkFolderItem;
