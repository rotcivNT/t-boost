import { SystemMessageContent } from "@/app/apis/api-payload";
import { MessageItemProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface IProps {
  message: MessageItemProps;
}

function SystemMessage({ message }: IProps) {
  const content = useMemo(() => {
    switch (message.content) {
      case SystemMessageContent.MEMBER_JOINED:
        return "joined the channel";
    }
  }, [message]);

  return (
    message.sender && (
      <div className="flex items-center gap-3 pl-2 pr-3 py-[6px] bg-[rgba(255,255,255,0.06)] rounded-[16px] mt-2">
        <Link className="flex items-center gap-3" href="#">
          <Image
            src={message.sender.imageUrl}
            alt=""
            width={20}
            height={20}
            className="size-6 object-cover rounded-full"
          />
        </Link>
        <p className="text-sm text-text-primary">
          <Link href="#" className="text-text-primary hover:underline">
            {message.sender.fullName}{" "}
          </Link>
          {content}
        </p>
      </div>
    )
  );
}

export default SystemMessage;
