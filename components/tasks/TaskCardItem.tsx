import { TaskCard } from "@/types/task.type";
import Image from "next/image";
import CommentIcon from "../icons/CommentIcon";
import DescriptionCard from "../icons/DescriptionCard";
import MyLinkIcon from "../icons/MyLinkIcon";
import { Card, CardContent } from "../ui/card";

interface IProps {
  task: TaskCard;
}

export default function TaskCardItem({ task }: IProps) {
  return (
    <Card className="overflow-hidden w-[272px] bg-transparent border-2 border-transparent cursor-pointer hover:border-white">
      <CardContent className="bg-dark-secondary p-1 text-text-primary">
        {/* Cover */}
        {task.cover && (
          <div className="pt-[100%] relative mb-5">
            <Image
              fill
              src={task.cover}
              alt=""
              className="object-cover rounded-[8px]"
            />
          </div>
        )}
        <h3 className="text-sm font-medium text-inherit text-left px-3 pt-1">
          {task.title}
        </h3>
        <div className="flex items-center justify-between px-3">
          {/* description */}
          <div className="flex items-center gap-3">
            {task.description && (
              <p className="text-[12px] flex gap-1 items-center">
                <DescriptionCard />
              </p>
            )}
            {task.attachments.length > 0 && (
              <p className="text-[12px] flex gap-1 items-center">
                <MyLinkIcon />
                <span className="text-inherit">{task.attachments.length}</span>
              </p>
            )}
          </div>
          {/* members */}
          <div className="pb-2">
            <div className="hover:opacity-85">
              {task.membersInfo && (
                <Image
                  src={task.membersInfo[0].imageUrl}
                  alt={task.membersInfo[0].fullName}
                  title={task.membersInfo[0].fullName}
                  width={20}
                  height={20}
                  className="rounded-full size-6 object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
