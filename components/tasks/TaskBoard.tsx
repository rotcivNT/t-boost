"use client";
import { ChannelTaskApiKey } from "@/app/apis/api-key/channel-task-api.key";
import { CreateTaskPayload } from "@/app/apis/api-payload/conversation.payload";
import { createTask } from "@/app/services/channel.action";
import { useChannelStore } from "@/app/store/channel.store";
import { TaskColumn } from "@/types/task.type";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import { mutate } from "swr";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import TaskCardList from "./TaskCardList";

interface IProps {
  taskColumn: TaskColumn;
}

interface ITaskForm {
  onClose: () => void;
  taskColumn: TaskColumn;
}

const AddTaskForm = ({ onClose, taskColumn }: ITaskForm) => {
  const channelId = useChannelStore((state) => state.showTask)?.channelId;
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();

  const onCreateTask = () => {
    startTransition(async () => {
      if (!channelId || !auth.isSignedIn) return;
      const createTaskPayload: CreateTaskPayload = {
        channelId: channelId,
        title,
        memberIds: [auth.userId],
        columnId: taskColumn._id,
      };
      mutate(
        ChannelTaskApiKey.getTaskByChannelId(channelId),
        async (data: TaskColumn[] | undefined) => {
          const res = await createTask(createTaskPayload);
          if (res && data) {
            setTitle("");
            onClose();
            const optimisticData = data.map((item) => {
              if (item._id === taskColumn._id) {
                return {
                  ...item,
                  taskOrderIds: [...item.taskOrderIds, res[0]._id],
                  taskOrders: [...item.taskOrders, ...res],
                };
              }
              return item;
            });
            return optimisticData;
          }
        }
      );
    });
  };
  return (
    <div className="pr-2 space-y-2">
      <Textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        spellCheck={false}
        className="text-text-primary font-medium focus-visible:ring-0 focus-visible:ring-offset-0 w-full h-[56px] min-h-10 bg-dark-secondary resize-none outline-none border-transparent"
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
};

export default function TaskBoard({ taskColumn }: IProps) {
  const [openAddTask, setOpenAddTask] = useState(false);
  const onClose = () => setOpenAddTask(false);
  return (
    <div className="shrink-0 p-2 flex h-full">
      <div className="bg-[#101204] rounded-lg p-4 pb-[9px] h-fit max-h-full flex flex-col">
        <h2 className="text-sm font-bold mb-4 text-text-primary">
          {taskColumn.title}
        </h2>
        <TaskCardList
          keyColumn={taskColumn._id}
          tasks={taskColumn.taskOrders}
          columnTitle={taskColumn.title}
        />
        {!openAddTask ? (
          <Button
            variant="icon"
            onClick={() => setOpenAddTask(true)}
            className="w-full justify-start px-2 text-text-primary text-sm font-medium gap-2 h-auto py-[6px]"
          >
            <Plus className="text-inherit" size={16} />
            Add a card
          </Button>
        ) : (
          <AddTaskForm taskColumn={taskColumn} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
