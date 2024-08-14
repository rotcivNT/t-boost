"use client";
import { useMessageSharedStore } from "@/app/store/message-shared.store";
import RecordVideo from "@/components/dialog-content/RecordVideo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, SendHorizonal } from "lucide-react";
import dynamic from "next/dynamic";
import { ChangeEvent, useRef } from "react";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

interface IProps {
  sendMessage: () => void;
}

function Footerbar({ sendMessage }: IProps) {
  const setFiles = useMessageSharedStore((state) => state.setFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFileChoosen = () => {
    fileInputRef.current?.click();
  };
  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files || [];
    const fileArray = Array.from(files);
    fileArray.forEach((file) => setFiles(file));
  };
  return (
    <div className="flex justify-between items-center relative">
      <div className="flex gap-2 items-center text-[#9D9E9F] flex-1">
        <Button
          variant="icon"
          size="icon"
          className="rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
          onClick={openFileChoosen}
        >
          <Input
            onChange={onChangeFile}
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
          />
          <Plus size={20} className="text-inherit" strokeWidth={1.6} />
        </Button>

        <Separator orientation="vertical" className="h-[26px] w-[2px]" />
        <RecordVideo />
      </div>
      <div>
        <Button
          variant="icon"
          size="icon"
          className="text-[#9D9E9F] hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
          onClick={sendMessage}
        >
          <SendHorizonal size={20} className="text-inherit" strokeWidth={1.6} />
        </Button>
      </div>
    </div>
  );
}

export default Footerbar;
