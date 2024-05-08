/* eslint-disable react-hooks/exhaustive-deps */
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { socket } from "@/configs/socket";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import AddBookmarkContent from "./AddBookmarkContent";

export type BookmarkData = {
  name: string;
  url: string;
  thumbnail: string;
  folderName?: string;
};

interface IProps {
  isFolder: boolean;
  folderName?: string;
  initValue?: Partial<BookmarkData>;
  isEdit?: boolean;
}

export const BookmarkDialogContent = ({
  isFolder,
  folderName,
  initValue,
  isEdit = false,
}: IProps) => {
  const initState = useMemo(() => {
    return {
      name: "",
      url: "",
      thumbnail: "",
      folderName,
      ...initValue,
    };
  }, []);
  const [bookmarkData, setBookmarkData] = useState<BookmarkData>(initState);
  const [isPending, startTransition] = useTransition();
  const channelId = usePathname().split("/C/")[1];
  const setCurrentChannel = useChannelStore((state) => state.setCurrentChannel);
  const closeButtonRef = useRef<any>(null);

  const onCreate = () => {
    startTransition(() => {
      const data: any = {
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
        socket.emit("update-bookmark", data);
      } else socket.emit("add-bookmark", data);
    });
  };

  useEffect(() => {
    socket.on("add-bookmark", (data) => {
      if (!data?.code) {
        setCurrentChannel(data);
      }
    });
  }, []);
  useEffect(() => {
    if (!isPending) {
      closeButtonRef.current?.click();
      setBookmarkData(initState);
    }
  }, [isPending]);
  return (
    <DialogContent className="sm:max-w-md bg-[#1A1D21] border-[rgb(59,61,66)] rounded-[6px]">
      <AddBookmarkContent
        isFolder={isFolder}
        setBookmarkData={setBookmarkData}
        bookmarkData={bookmarkData}
      />
      <DialogFooter className="flex-row justify-end pt-6">
        <DialogClose ref={closeButtonRef}>
          <Button
            variant="outline"
            className="w-20 mr-3 bg-inherit border-[rgba(209,210,211,.3)]"
          >
            Cancle
          </Button>
        </DialogClose>
        <Button
          variant="default"
          className="bg-[#007A5A] text-white font-[500] w-20 hover:opacity-90 hover:bg-[#007A5A] hover:text-white 
              hover:font-[500]"
          onClick={onCreate}
        >
          {isPending ? (
            <LoaderCircle size={20} className="animate-spin z-10 relative" />
          ) : (
            `${isEdit ? "Save" : "Create"}`
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
