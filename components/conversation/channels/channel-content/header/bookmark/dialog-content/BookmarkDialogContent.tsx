/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import AddBookmarkContent from "./AddBookmarkContent";
import DeleteBookmarkContent from "./DeleteBookmarkContent";
import {
  createBookmark,
  deleteBookmark,
  updateBookmark,
} from "@/app/services/action";
import {
  CreateBookmarkProps,
  DeleteBookmarkProps,
} from "@/app/apis/api-payload";

export type BookmarkData = {
  name: string;
  url: string;
  thumbnail: string;
  folderName?: string;
  previousName?: string;
};

interface IProps {
  isFolder: boolean;
  folderName?: string;
  initValue?: Partial<BookmarkData>;
  isEdit?: boolean;
  isDelete?: boolean;
}

export const BookmarkDialogContent = ({
  isFolder,
  folderName,
  initValue,
  isEdit = false,
  isDelete = false,
}: IProps) => {
  const initState = useMemo(() => {
    let name = initValue?.name && isEdit ? initValue.name : "";

    return {
      url: "",
      thumbnail: "",
      folderName,
      ...initValue,
      name,
    };
  }, [isEdit]);
  const [bookmarkData, setBookmarkData] = useState<BookmarkData>(initState);
  const [isPending, startTransition] = useTransition();
  const channelId = usePathname().split("/C/")[1];
  const setCurrentChannel = useChannelStore((state) => state.setCurrentChannel);
  const closeButtonRef = useRef<any>(null);

  const onCreate = () => {
    startTransition(async () => {
      const data: CreateBookmarkProps = {
        channelId,
        isFolder,
        payload: {
          name: bookmarkData.name,
        },
      };
      if (!isFolder) {
        data.payload = bookmarkData;
      }

      if (isEdit) {
        data.payload.previousName = initValue?.name;
        const res = await updateBookmark(data);
        console.log(res);
      } else {
        const res = await createBookmark(data);
        console.log(res);
      }
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const payload: DeleteBookmarkProps = {
        bookmarkName: isFolder
          ? (initState.folderName as string)
          : (initValue?.name as string),
        channelId,
        isFolder,
        parentName: !isFolder ? (initState.folderName as string) : "",
      };

      try {
        const res = await deleteBookmark(payload);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    });
  };

  useEffect(() => {
    if (!isPending) {
      closeButtonRef.current?.click();
      setBookmarkData(initState);
    }
  }, [isPending]);
  useEffect(() => {
    setBookmarkData(initState);
  }, [isEdit]);

  return (
    <DialogContent className="sm:max-w-md bg-[#1A1D21] border-[rgb(59,61,66)] rounded-[6px]">
      {!isDelete ? (
        <AddBookmarkContent
          isEdit={isEdit}
          isFolder={isFolder}
          setBookmarkData={setBookmarkData}
          bookmarkData={bookmarkData}
        />
      ) : (
        <DeleteBookmarkContent isFolder={isFolder} />
      )}
      <DialogFooter className="flex-row justify-end pt-6">
        <DialogClose asChild ref={closeButtonRef}>
          <Button
            variant="outline"
            className="w-20 mr-3 bg-inherit border-[rgba(209,210,211,.3)]"
          >
            Cancle
          </Button>
        </DialogClose>
        <Button
          variant="default"
          className={cn(
            " text-white font-[500] w-20 hover:opacity-90 hover:text-white hover:font-[500]",
            `${
              isDelete
                ? "bg-dangerous hover:bg-dangerous"
                : "bg-[#007A5A] hover:bg-[#007A5A]"
            }`
          )}
          onClick={isDelete ? onDelete : onCreate}
        >
          {isPending ? (
            <LoaderCircle size={20} className="animate-spin z-10 relative" />
          ) : (
            `${isEdit ? "Save" : isDelete ? "Delete" : "Create"}`
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
