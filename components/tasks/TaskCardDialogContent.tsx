import Image from "next/image";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, PanelsTopLeft, PictureInPicture, X } from "lucide-react";
import { TaskAttachment, TaskCard, TaskColumn } from "@/types/task.type";
import DescriptionCard from "../icons/DescriptionCard";
import { Textarea } from "../ui/textarea";
import MyLinkIcon from "../icons/MyLinkIcon";
import { Input } from "../ui/input";
import { ChangeEvent, useRef, useState } from "react";
import { UpdateTaskPayload } from "@/app/apis/api-payload/conversation.payload";
import { onlyUploadFile, uploadFile } from "@/app/services/action";
import { getTaskByChannelId, updateTask } from "@/app/services/channel.action";
import TaskAttachmentItem from "./TaskAttachmentItem";
import useSWR, { mutate } from "swr";
import { ChannelTaskApiKey } from "@/app/apis/api-key/channel-task-api.key";
import { useChannelStore } from "@/app/store/channel.store";
import { toast } from "sonner";
import TaskCardSimpleForm from "./TaskCardSimpleForm";

interface IProps {
  task: TaskCard;
  columnTitle: string;
}

export default function TaskCardDialogContent({ task, columnTitle }: IProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const showTask = useChannelStore((state) => state.showTask);
  const [openDescForm, setOpenDescForm] = useState(false);
  const { data, isLoading } = useSWR(
    showTask?.channelId
      ? ChannelTaskApiKey.getTaskByChannelId(showTask?.channelId)
      : null,
    getTaskByChannelId
  );

  const openFileChoosen = (isChangeCover?: boolean) => {
    isChangeCover
      ? fileInputRef.current?.click()
      : attachmentInputRef.current?.click();
  };
  const onChangeCoverFile = async (
    e: ChangeEvent<HTMLInputElement>,
    isChangeCover?: boolean
  ) => {
    const target = e.target as HTMLInputElement;
    const files = target.files || [];
    const fileArray = Array.from(files);
    if (fileArray.length === 0 || !showTask) return;
    const formData = new FormData();
    for (const file of fileArray) {
      formData.append("files", file);
    }
    const uploadToastId = toast("Uploading file...", { duration: 10000 });
    try {
      const uploadRes = await onlyUploadFile(formData);
      if (uploadRes?.code === 1) {
        const newAttachments: TaskAttachment[] = fileArray.map(
          (file, index) => ({
            fileName: file.name,
            createdAt: new Date(),
            fileUrl: uploadRes.data[index],
            mimeType: file.type,
          })
        );
        let payload: UpdateTaskPayload = {
          taskId: task._id,
          attachments: [...task.attachments, ...newAttachments],
        };
        if (isChangeCover) {
          payload = {
            taskId: task._id,
            cover: uploadRes.data[0],
            attachments: [
              ...task.attachments,
              {
                fileName: fileArray[0].name,
                createdAt: new Date(),
                fileUrl: uploadRes.data[0],
                mimeType: fileArray[0].type,
              },
            ],
          };
        }
        const res = await updateTask(payload);
        if (res) {
          toast.dismiss(uploadToastId);
          toast.success("Success...");
          mutate(ChannelTaskApiKey.getTaskByChannelId(showTask?.channelId));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onCloseForm = () => {
    setOpenDescForm(false);
  };
  const onRemoveAttachment = async (index: number) => {
    if (!showTask || !data) return;

    const newAttachments = [...task.attachments];
    const [deleted] = newAttachments.splice(index, 1);
    const sourceColumn = data.find((col) => col.title === columnTitle);
    if (!sourceColumn) return;
    const newTaskOrders = [
      ...sourceColumn.taskOrders.map((t) => {
        if (t._id === task._id) {
          if (deleted.fileUrl === task.cover) {
            t.cover = "";
          }
          t.attachments = newAttachments;
        }
        return t;
      }),
    ];
    const updatedColumns = [...data];

    const columnIndex = updatedColumns.findIndex(
      (col) => col._id === sourceColumn._id
    );
    updatedColumns[columnIndex] = {
      ...sourceColumn,
      taskOrders: newTaskOrders,
    };
    const payload: UpdateTaskPayload = {
      taskId: task._id,
      attachments: task.attachments,
      cover: task.cover,
    };

    mutate(
      ChannelTaskApiKey.getTaskByChannelId(showTask.channelId),
      async (oldData: TaskColumn[] | undefined) => {
        const res = await updateTask(payload);
        if (res && oldData) {
          const newData = oldData.map((col) => {
            if (col.title === columnTitle) {
              col.taskOrders = col.taskOrders.map((t) => {
                if (t._id === res[0]._id) {
                  t.attachments = newAttachments;
                }
                return t;
              });
            }
            return col;
          });

          return newData;
        }
      },
      {
        optimisticData: updatedColumns,
        rollbackOnError(error: any) {
          return error.name !== "AbortError";
        },
      }
    );
  };

  return (
    <DialogContent
      id="list"
      className="min-w-[80%] max-h-[80vh] overflow-y-scroll rounded-[10px] bg-dark-primary"
    >
      <span>{data && data[0].taskOrderIds[0]}</span>
      {task.cover && (
        <div className="h-[160px] relative">
          <div
            className="absolute inset-0 bg-cover bg-black bg-[50%] blur-[20px] brightness-[0.4]"
            style={{
              backgroundImage: `url(${encodeURI(task.cover)})`,
            }}
          />
          <Image src={task.cover} alt="" fill className="object-contain" />
        </div>
      )}
      <DialogHeader>
        <DialogTitle className="text-text-primary text-xl flex gap-2">
          <PanelsTopLeft size={20} />
          <p className="flex flex-col text-left leading-none gap-[6px]">
            <span className="font-bold">{task.title}</span>
            <span className="text-text-secondary text-sm">
              in list <u>{columnTitle}</u>
            </span>
          </p>
        </DialogTitle>
      </DialogHeader>

      <div className="flex gap-3">
        <div className="flex-[4]">
          <div className="flex gap-2 mt-5 mb-10">
            <DescriptionCard width={20} height={20} />
            <div className="flex-1 space-y-4">
              <p className="leading-none text-text-primary font-bold flex justify-between">
                <span>Description</span>
                <Button
                  onClick={() => setOpenDescForm(true)}
                  variant="link"
                  className="text-text-primary font-bold p-0 h-fit"
                >
                  Edit
                </Button>
              </p>
              {openDescForm ? (
                <TaskCardSimpleForm
                  taskId={task._id}
                  onClose={onCloseForm}
                  initDesc={task.description}
                />
              ) : (
                <p>{task.description}</p>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <div className="flex gap-2">
              <MyLinkIcon width={20} height={20} />
              <p className="leading-none text-text-primary font-bold">
                Attachments
              </p>
            </div>
            {task.attachments.map((attachment, index) => (
              <TaskAttachmentItem
                onRemoveAttachment={() => onRemoveAttachment(index)}
                key={attachment.fileName + attachment.createdAt}
                taskAttachment={attachment}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4 flex flex-col items-end">
          <Button
            onClick={() => openFileChoosen(true)}
            className="min-w-[150px] gap-2 text-text-primary"
            variant="icon"
            size="icon"
          >
            <PictureInPicture size={18} />
            Upload cover
            <Input
              onChange={(e) => onChangeCoverFile(e, true)}
              ref={fileInputRef}
              type="file"
              className="hidden"
            />
          </Button>
          <Button
            onClick={() => openFileChoosen()}
            className="min-w-[150px] gap-2 text-text-primary"
            variant="icon"
            size="icon"
          >
            <MyLinkIcon width={22} height={22} />
            Attachments
            <Input
              onChange={(e) => onChangeCoverFile(e)}
              ref={attachmentInputRef}
              type="file"
              className="hidden"
              multiple
            />
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
