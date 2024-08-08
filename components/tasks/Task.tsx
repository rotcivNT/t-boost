"use client";
import { ChannelTaskApiKey } from "@/app/apis/api-key/channel-task-api.key";
import { UpdateTaskColumn } from "@/app/apis/api-payload/conversation.payload";
import {
  getTaskByChannelId,
  updateTaskColumn,
} from "@/app/services/channel.action";
import { useChannelStore } from "@/app/store/channel.store";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { ChevronLeft, Plus } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import AddNewColumn from "./AddNewColumn";
import TaskBoard from "./TaskBoard";
import { TaskColumn } from "@/types/task.type";

export default function Task() {
  const { setShowTask, showTask } = useChannelStore((state) => ({
    setShowTask: state.setShowTask,
    showTask: state.showTask,
  }));
  const [showAddColumn, setShowAddColumn] = useState(false);
  const { data, isLoading } = useSWR(
    showTask?.channelId
      ? ChannelTaskApiKey.getTaskByChannelId(showTask?.channelId)
      : null,
    getTaskByChannelId
  );
  const onClose = () => setShowAddColumn(false);
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !data) return;

    const sourceColumn = data.find(
      (col) => col._id === result.source.droppableId
    );
    const destColumn = data.find(
      (col) => col._id === result.destination?.droppableId
    );

    const updatedColumns = data;

    if (!sourceColumn || !destColumn) return;

    if (sourceColumn._id === destColumn._id) {
      // Moving within the same column
      const newTaskOrderIds = Array.from(sourceColumn.taskOrderIds);
      const [movedTask] = sourceColumn.taskOrders.splice(
        result.source.index,
        1
      );
      sourceColumn.taskOrders.splice(result.destination.index, 0, movedTask);

      newTaskOrderIds.splice(result.source.index, 1);
      newTaskOrderIds.splice(result.destination.index, 0, movedTask._id);

      const columnIndex = updatedColumns.findIndex(
        (col) => col._id === sourceColumn._id
      );
      updatedColumns[columnIndex] = {
        ...sourceColumn,
        taskOrderIds: newTaskOrderIds,
      };
      const payload: UpdateTaskColumn = {
        taskColumnId: sourceColumn._id,
        taskOrderIds: newTaskOrderIds,
      };
      await updateTaskColumn(payload);
    } else {
      const sourceTaskOrderIds = Array.from(sourceColumn.taskOrderIds);
      const destTaskOrderIds = Array.from(destColumn.taskOrderIds);
      const [movedTask] = sourceColumn.taskOrders.splice(
        result.source.index,
        1
      );
      destColumn.taskOrders.splice(result.destination.index, 0, movedTask);

      const movedTaskId = sourceTaskOrderIds.splice(result.source.index, 1)[0];
      destTaskOrderIds.splice(result.destination.index, 0, movedTaskId);

      const sourceColumnIndex = updatedColumns.findIndex(
        (col) => col._id === sourceColumn._id
      );
      const destColumnIndex = updatedColumns.findIndex(
        (col) => col._id === destColumn._id
      );

      updatedColumns[sourceColumnIndex] = {
        ...sourceColumn,
        taskOrderIds: sourceTaskOrderIds,
      };
      updatedColumns[destColumnIndex] = {
        ...destColumn,
        taskOrderIds: destTaskOrderIds,
      };
      const updateSourceColumn: UpdateTaskColumn = {
        taskColumnId: sourceColumn._id,
        taskOrderIds: sourceTaskOrderIds,
      };
      const updateDestColumn: UpdateTaskColumn = {
        taskColumnId: destColumn._id,
        taskOrderIds: destTaskOrderIds,
      };

      const sourceRes = updateTaskColumn(updateSourceColumn);
      const desRes = updateTaskColumn(updateDestColumn);
      await Promise.allSettled([sourceRes, desRes]);
    }
  };
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex gap-3 items-center py-4 px-6">
        <Button
          onClick={() => setShowTask(null)}
          variant="icon"
          size="icon"
          className="size-9 rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Kanban Board</h1>
      </div>
      <div className="relative flex-grow">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex overflow-y-hidden overflow-x-auto absolute bottom-0 left-0 right-0 h-full">
            {data &&
              data.map((task) => (
                <TaskBoard key={task._id} taskColumn={task} />
              ))}

            {showAddColumn ? (
              <AddNewColumn
                channelId={showTask?.channelId as string}
                onClose={onClose}
              />
            ) : (
              <Button
                variant="icon"
                onClick={() => setShowAddColumn(true)}
                className="w-[272px] justify-start px-2 bg-dark-primary mx-2 mt-2 text-text-primary text-sm font-medium gap-2 h-[32px] py-[6px]"
              >
                <Plus className="text-inherit" size={16} />
                Add a card
              </Button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
