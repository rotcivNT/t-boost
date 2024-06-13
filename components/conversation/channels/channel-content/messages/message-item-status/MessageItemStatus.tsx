import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import MessageItemContentStatus from "./MessageItemContentStatus";
import { MessageItemProps } from "@/types";

interface IProps {
  message: MessageItemProps;
}

function MessageItemStatus({ message }: IProps) {
  const { user } = useUser();

  return (
    user && (
      <div className="flex items-start gap-2 px-5 py-2 hover:bg-[rgba(255,255,255,0.06)]">
        <div className="relative size-9 rounded-[8px] overflow-hidden top-1">
          <Image src={user.imageUrl} fill alt="" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 cursor-pointer">
            <p className="text-[15px] font-[600] hover:underline text-[#F8F8F8]">
              {user.fullName}
            </p>
            <p className="text-xs text-text-secondary hover:underline">
              Sending ...
            </p>
          </div>

          <MessageItemContentStatus message={message} />
        </div>
      </div>
    )
  );
}

export default MessageItemStatus;
