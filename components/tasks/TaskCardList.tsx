"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import TaskCardItem from "./TaskCardItem";
import "./tasks.scss";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "@/types/task.type";
import Image from "next/image";
import { PanelsTopLeft, PictureInPicture } from "lucide-react";
import DescriptionCard from "../icons/DescriptionCard";
import { Textarea } from "../ui/textarea";
import MyLinkIcon from "../icons/MyLinkIcon";
import TaskCardDialogContent from "./TaskCardDialogContent";

interface IProps {
  tasks: TaskCard[];
  keyColumn: string;
  columnTitle: string;
}

export default function TaskCardList({
  tasks,
  keyColumn,
  columnTitle,
}: IProps) {
  return (
    <Droppable key={keyColumn} droppableId={keyColumn} type="card">
      {(provied) => (
        <>
          <div
            ref={provied.innerRef}
            id="list"
            className="flex-1 pr-2 w-[272px] min-h-[76px]"
          >
            {tasks.map((task, index) => (
              <Draggable index={index} key={task._id} draggableId={task._id}>
                {(provided) => (
                  <Dialog>
                    <DialogTrigger>
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        className="mb-2"
                      >
                        <TaskCardItem task={task} />
                      </div>
                    </DialogTrigger>
                    {/* Dialog-content */}
                    <TaskCardDialogContent
                      task={task}
                      columnTitle={columnTitle}
                    />
                  </Dialog>
                )}
              </Draggable>
            ))}
            {tasks.length === 0 && (
              <p className="select-none cursor-default h-[68px] text-sm rounded-[10px] bg-dark-primary flex justify-center items-center">
                No task in this stage...
              </p>
            )}
          </div>

          {provied.placeholder}
        </>
      )}
    </Droppable>
  );
}
