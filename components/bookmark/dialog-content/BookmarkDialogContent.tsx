/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ConversationApiKeys } from "@/app/apis/api-key/conversation-api.key";
import {
  CreateBookmarkProps,
  DeleteBookmarkProps,
} from "@/app/apis/api-payload";
import {
  createBookmark,
  deleteBookmark,
  updateBookmark,
} from "@/app/services/action";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ConversationType } from "@/types/conversation.type";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { mutate } from "swr";
import AddBookmarkContent from "./AddBookmarkContent";
import DeleteBookmarkContent from "./DeleteBookmarkContent";

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
  const pathName = usePathname();
  const closeButtonRef = useRef<any>(null);
  const conversationData = useMemo(() => {
    const id = pathName.split("/home/")[1];
    return {
      id: id.includes("D") ? id.slice(1) : id,
      type: id.includes("D")
        ? ConversationType.DIRECT_MESSAGE
        : ConversationType.CHANNEL,
    };
  }, [pathName]);

  const handleMutate = () => {
    if (conversationData.type === ConversationType.CHANNEL) {
      mutate(ConversationApiKeys.getChannelByIdKey(conversationData.id));
    } else {
      mutate(ConversationApiKeys.getDCByIdKey(conversationData.id));
    }
  };

  const onCreate = () => {
    startTransition(async () => {
      const data: CreateBookmarkProps = {
        conversationId: conversationData.id,
        isFolder,
        type: conversationData.type,
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
        if (res) {
          handleMutate();
        }
      } else {
        const res = await createBookmark(data);
        if (res) {
          handleMutate();
        }
      }
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const payload: DeleteBookmarkProps = {
        type: conversationData.type,
        bookmarkName: isFolder
          ? (initState.folderName as string)
          : (initValue?.name as string),
        conversationId: conversationData.id,
        isFolder,
        parentName: !isFolder ? (initState.folderName as string) : "",
      };

      try {
        const res = await deleteBookmark(payload);
        if (res) {
          handleMutate();
        }
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
