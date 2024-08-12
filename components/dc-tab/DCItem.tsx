/* eslint-disable react-hooks/exhaustive-deps */
import { MessageType } from "@/app/apis/api-payload";
import { DCDateFormat } from "@/app/helpers/date";
import { cn } from "@/lib/utils";
import { DirectConversation } from "@/types/dc.type";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface IProps {
  dc: DirectConversation;
}

const contentMapMsgType = {
  [MessageType.FILE]: "sended a file.",
  [MessageType.TEXT]: "sended a message.",
  [MessageType.IMAGE]: "sended an image.",
  [MessageType.VIDEO]: "sended a video.",
  [MessageType.LINK]: "sended a link.",
  [MessageType.SYSTEM]: "sended a voice message.",
  [MessageType.MEETING]: "sended a link.",
};

export default function DCItem({ dc }: IProps) {
  const auth = useAuth();
  const pathName = usePathname();
  const receiver = useMemo(() => {
    return dc.membersInfo[0].clerkUserId === auth.userId
      ? dc.membersInfo[1]
      : dc.membersInfo[0];
  }, []);
  const content =
    dc.lastMessage.type === MessageType.TEXT
      ? dc.lastMessage.content
      : contentMapMsgType[dc.lastMessage.type];
  return (
    <Link
      href={`/workspace/${auth.orgId}/message/home/D${dc._id}`}
      className={cn("p-4 flex items-stretch gap-2", {
        "bg-[rgba(255,255,255,0.1)]": pathName.includes(dc._id),
      })}
    >
      <Image
        src={receiver.imageUrl}
        alt={receiver.fullName}
        width={36}
        height={36}
        className="rounded-[6px] size-9"
      />
      <div className="flex flex-col justify-between flex-1">
        <p className="text-text-primary leading-none flex justify-between">
          <span className="font-medium text-sm">{receiver.fullName}</span>
          <span className="text-xs">
            {DCDateFormat(dc.lastMessage.createdAt)}
          </span>
        </p>
        <p
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-xs text-text-secondary"
        />
      </div>
    </Link>
  );
}
