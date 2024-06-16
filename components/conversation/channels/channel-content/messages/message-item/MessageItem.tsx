"use client";
import { formatedMessageTime } from "@/app/utils";
import { cn } from "@/lib/utils";
import { MessageItemProps } from "@/types";
import Image from "next/image";
import { useRef, useState } from "react";
import MessageItemContent from "./mesage-item-content/MessageItemContent";
import MessageItemAction from "./message-item-action/MessageItemAction";

interface IProps {
  message: MessageItemProps;
}

// eslint-disable-next-line react/display-name
const MessageItem = ({ message }: IProps) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    !message.isDelete && (
      <div>
        <div
          className={cn(
            "relative flex items-start transition-all duration-75 gap-2 px-5 py-2 hover:bg-[rgba(255,255,255,0.06)]",
            `${isOpenDropdown ? "bg-[rgba(255,255,255,0.06)]" : ""}`,
            "[&:hover>div:last-child]:visible"
          )}
          ref={wrapperRef}
        >
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

            <MessageItemContent message={message} />
          </div>
          {/* Actions */}
          {!message.isRecall && (
            <div
              className={cn(
                "absolute invisible top-2 right-2 bg-dark-primary border border-border rounded-[8px]",
                isOpenDropdown ? "visible" : ""
              )}
            >
              <MessageItemAction
                reactions={message.reactions}
                message={message}
                wrapperRef={wrapperRef}
                isOpenDropdown={isOpenDropdown}
                setIsOpenDropdown={setIsOpenDropdown}
              />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default MessageItem;
