"use client";
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { Mic, Plus, SendHorizonal, Smile, Video } from "lucide-react";
import { ChangeEvent, useRef, useTransition } from "react";

interface IProps {
  sendMessage: () => void;
}

function Footerbar({ sendMessage }: IProps) {
  const { setFiles } = useChannelStore((state) => ({
    setFiles: state.setFiles,
  }));
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
    <div className="flex justify-between items-center">
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
        <Button
          variant="icon"
          size="icon"
          className=" hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
        >
          <Smile size={20} className="text-inherit" strokeWidth={1.6} />
        </Button>

        <Separator orientation="vertical" className="h-[26px] w-[2px]" />

        <Button
          variant="icon"
          size="icon"
          className=" hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
        >
          <Video size={20} className="text-inherit" strokeWidth={1.6} />
        </Button>
        <Button
          variant="icon"
          size="icon"
          className=" hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
        >
          <Mic size={20} className="text-inherit" strokeWidth={1.6} />
        </Button>
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
