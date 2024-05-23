/* eslint-disable react-hooks/exhaustive-deps */
import useDebounce from "@/app/hooks/useDebounce";
import { previewLink } from "@/app/utils/previewLink";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BookmarkData } from "./BookmarkDialogContent";

interface IProps {
  isFolder: boolean;
  setBookmarkData: (data: any) => void;
  bookmarkData: BookmarkData;
  isEdit: boolean;
}

function AddBookmarkContent({
  isFolder,
  setBookmarkData,
  bookmarkData,
  isEdit,
}: IProps) {
  const [linkPreview, setLinkPreview] = useState<any>(() => {
    return !isFolder && bookmarkData.name
      ? {
          data: { title: bookmarkData.name, image: bookmarkData.thumbnail },
          url: true,
        }
      : undefined;
  });
  const debounceValue = useDebounce(bookmarkData.url, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [isFecthLink, setIsFetchLink] = useState(() =>
    bookmarkData.name ? true : false
  );

  useEffect(() => {
    const getLinkPreviewData = async () => {
      setIsLoading(true);
      const res = await previewLink(debounceValue);

      if (!res || res?.data === 425) {
        setLinkPreview(res);
      } else {
        setLinkPreview(res);
        setBookmarkData((pre: any) => ({
          ...pre,
          thumbnail: res.data.image,
        }));
      }

      setIsLoading(false);
    };
    !isFolder && !isFecthLink && getLinkPreviewData();
    setIsFetchLink(false);
  }, [debounceValue]);
  const onChange = (key: string, value: string) => {
    setBookmarkData((pre: any) => ({
      ...pre,
      [key]: value,
    }));
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-bold text-[22px] text-text-primary text-left">
          {!isFolder
            ? isEdit
              ? "Edit bookmark"
              : "Add a bookmark to this channel"
            : isEdit
            ? "Edit folder"
            : "Create a folder"}
        </DialogTitle>
      </DialogHeader>
      <div className="flex space-y-2 flex-col">
        <p className="text-[15px] text-text-primary">
          {isFolder ? "Name" : "Link"}
        </p>
        <div className="relative">
          {isLoading && (
            <div className="absolute top-1/2 right-1 -translate-y-1/2 size-8 flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          <Input
            placeholder={
              isFolder ? "Ex. Project tracker" : "https://example.com"
            }
            className="bg-inherit border-[rgba(209,210,211,.3)] pr-8"
            spellCheck={false}
            value={isFolder ? bookmarkData.name : bookmarkData.url}
            onChange={(e) =>
              isFolder
                ? onChange("name", e.target.value)
                : onChange("url", e.target.value)
            }
          />
        </div>
      </div>
      {linkPreview?.url && (
        <div className="flex space-y-2 flex-col">
          <p className="text-[15px] text-text-primary">Name</p>
          <div className="relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 size-8 flex justify-center items-center">
              {linkPreview?.data.image ? (
                <Image
                  alt={linkPreview.data.title}
                  src={linkPreview.data.image}
                  width={20}
                  height={20}
                  sizes="100%"
                  className="rounded-full object-cover size-5"
                />
              ) : (
                <Link width={16} height={16} color="#ABABAD" />
              )}
            </div>
            <Input
              placeholder="Ex. Project tracker"
              className="bg-inherit border-[rgba(209,210,211,.3)] pl-8"
              spellCheck={false}
              value={bookmarkData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AddBookmarkContent;
