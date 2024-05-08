import { useChannelStore } from "@/app/store/channel.store";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Bookmark, BookmarkFolder } from "@/types";
import { ListCollapse } from "lucide-react";
import { useEffect, useState } from "react";
import { OverflowList } from "./OverflowList";
import dynamic from "next/dynamic";
import { DoubleChervonRight } from "@/components/icons/DoubleChervonRight";

const BookmarkFolderItem = dynamic(() => import("./BookmarkFolderItem"), {
  ssr: false,
});
const BookmarkItem = dynamic(() => import("./BookmarkItem"), { ssr: false });

const ItemRenderer = (item: Bookmark | BookmarkFolder, index: any) => {
  if ((item as BookmarkFolder)?.bookmarks) {
    return (
      <BookmarkFolderItem
        key={index + item.name}
        bookmarkFolder={item as BookmarkFolder}
      />
    );
  } else {
    return <BookmarkItem key={index + item.name} bookmark={item as Bookmark} />;
  }
};

const OverflowRenderer = (items: any) => {
  return (
    <Menubar className="bg-transparent border-none">
      <MenubarMenu>
        <MenubarTrigger className="flex justify-center items-center hover:bg-[rgba(255,255,255,0.06)] rounded-[4px] p-1 cursor-pointer">
          <DoubleChervonRight />
        </MenubarTrigger>
        <MenubarContent className="bg-dark border-border min-w-[unset]">
          {items.map((item: any) => (
            <div key={item.name} className="px-2 py-1">
              {item?.bookmarks ? (
                <BookmarkFolderItem bookmarkFolder={item} />
              ) : (
                <BookmarkItem bookmark={item} />
              )}
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
function BookmarkList() {
  const currentChannel = useChannelStore((state) => state.currentChannel);
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    currentChannel &&
      JSON.stringify(currentChannel) !== "{}" &&
      setItems([
        ...(currentChannel.bookmarkFolders as Array<BookmarkFolder>),
        ...(currentChannel.bookmarks as Array<Bookmark>),
      ]);
  }, [currentChannel]);

  return (
    <div className="flex items-center gap-2 w-[calc(100%-160px)]">
      {currentChannel && (
        <OverflowList
          collapseFrom="end"
          minVisibleItems={0}
          items={items}
          itemRenderer={ItemRenderer}
          overflowRenderer={OverflowRenderer}
        />
      )}
    </div>
  );
}

export default BookmarkList;
