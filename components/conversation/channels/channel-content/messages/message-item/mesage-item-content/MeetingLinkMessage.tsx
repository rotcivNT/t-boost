import { formatedMessageTime } from "@/app/utils";
import { cn } from "@/lib/utils";
import { MessageItemProps } from "@/types";
import { Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  message: MessageItemProps;
}

function MeetingLinkMessage({ message }: IProps) {
  return (
    message.sender && (
      <>
        <div className="relative size-9 rounded-[8px] overflow-hidden top-1">
          <Image src={message.sender.imageUrl} fill alt="" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 cursor-pointer">
            <p className="text-[15px] font-[600] hover:underline text-[#F8F8F8]">
              {message.sender.fullName}
            </p>
            <p className="text-xs text-text-secondary hover:underline">
              {message?.updatedAt && formatedMessageTime(message.updatedAt)}
            </p>
          </div>
          <Link
            href={{
              query: `m_id=${message._id}&join=true`,
              pathname: message.content,
            }}
            target="_blank"
            className={cn(
              "inline-flex mt-2 gap-3 bg-[#303030] hover:bg-[#454545] w-1/2 max-w-[400px] p-2 rounded-[16px]",
              {
                "pointer-events-none": message.isDelete,
              }
            )}
          >
            <p className="bg-[#45BD62] size-9 flex justify-center items-center rounded-full">
              <Video size={20} />
            </p>
            <div>
              <p className="text-text-primary text-sm font-[600] mb-1">
                Meeting
              </p>
              <p className="text-text-secondary text-[13px]">
                {message.isDelete ? "Ended" : "Click to join the meeting"}
              </p>
            </div>
          </Link>
        </div>
      </>
    )
  );
}

export default MeetingLinkMessage;
