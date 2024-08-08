import { Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState, useTransition } from "react";
import { UpdateTaskPayload } from "@/app/apis/api-payload/conversation.payload";
import { updateTask } from "@/app/services/channel.action";
import { mutate } from "swr";
import { ChannelTaskApiKey } from "@/app/apis/api-key/channel-task-api.key";
import { useChannelStore } from "@/app/store/channel.store";

interface IProps {
  initDesc: string;
  onClose: () => void;
  taskId: string;
}
export default function TaskCardSimpleForm({
  initDesc,
  onClose,
  taskId,
}: IProps) {
  const [desc, setDesc] = useState(initDesc);
  const [isPending, startTransition] = useTransition();
  const showTask = useChannelStore((state) => state.showTask);
  const onUpdateDesc = () => {
    startTransition(async () => {
      if (!showTask) return;

      const payload: UpdateTaskPayload = {
        taskId,
        description: desc,
      };
      const res = await updateTask(payload);
      if (res) {
        setDesc("");
        onClose();
        mutate(ChannelTaskApiKey.getTaskByChannelId(showTask?.channelId));
      }
    });
  };
  return (
    <div className="space-y-3">
      <Textarea
        value={desc}
        spellCheck={false}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Enter a description for this task..."
        className="focus-visible:ring-0 focus-visible:ring-offset-0 w-full h-[60px] min-h-10 bg-dark-secondary resize-none outline-none border-transparent"
      />
      <div className="flex gap-2 items-center">
        <Button
          disabled={desc === initDesc}
          onClick={isPending ? undefined : onUpdateDesc}
          className="h-auto min-w-[100px] py-[6px] bg-[#579DFF] hover:bg-[#579DFF] hover:opacity-80"
        >
          {isPending ? <Loader2 size={20} className="animate-spin" /> : "Save"}
        </Button>
        <Button
          onClick={isPending ? undefined : onClose}
          variant="icon"
          className="w-8 h-full px-0 py-[6px]"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
