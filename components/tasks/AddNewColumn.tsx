"use client";
import { useState, useTransition } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import { Input } from "../ui/input";
import { CreateTaskColumnPayload } from "@/app/apis/api-payload/conversation.payload";
import { createTaskColumn } from "@/app/services/channel.action";
import { mutate } from "swr";
import { ChannelTaskApiKey } from "@/app/apis/api-key/channel-task-api.key";

interface IProps {
  onClose: () => void;
  channelId: string;
}

export default function AddNewColumn({ onClose, channelId }: IProps) {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const onCreateTask = () => {
    startTransition(async () => {
      if (!channelId) return;
      const payload: CreateTaskColumnPayload = {
        channelId,
        title,
      };
      const res = await createTaskColumn(payload);
      if (res) {
        setTitle("");
        onClose();
        mutate(ChannelTaskApiKey.getTaskByChannelId(channelId));
      }
    });
  };
  return (
    <div className="mx-2 h-fit p-3 rounded-[10px] bg-[#101204] space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list name..."
        className="w-[272px] focus-visible:ring-0 font-bold focus-visible:ring-offset-0 bg-dark-secondary resize-none outline-none border-transparent"
      />
      <div className="flex gap-2 items-center">
        <Button
          onClick={isPending ? undefined : onCreateTask}
          className="h-auto min-w-[100px] py-[6px] bg-[#579DFF] hover:bg-[#579DFF] hover:opacity-80"
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "Add card"
          )}
        </Button>
        <Button
          onClick={onClose}
          variant="icon"
          className="w-8 h-full px-0 py-[6px]"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
