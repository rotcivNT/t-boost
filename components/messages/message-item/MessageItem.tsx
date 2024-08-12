"use client";
import { formatedMessageTime } from "@/app/utils";
import { cn } from "@/lib/utils";
import { MessageItemProps } from "@/types";
import Image from "next/image";
import { LegacyRef, RefObject, forwardRef, useRef, useState } from "react";
import MessageItemContent from "./mesage-item-content/MessageItemContent";
import MessageItemAction from "./message-item-action/MessageItemAction";
import MessageReply from "./mesage-item-content/MessageReply";
import { MessageType } from "@/app/apis/api-payload";
import SystemMessage from "./mesage-item-content/SystemMessage";
import MeetingLinkMessage from "./mesage-item-content/MeetingLinkMessage";

interface IProps {
  message: MessageItemProps;
  onJump: (key: string) => void;
}

// eslint-disable-next-line react/display-name
const MessageItem = forwardRef(
  ({ message, onJump }: IProps, ref: LegacyRef<HTMLDivElement>) => {
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    if (message.type === MessageType.SYSTEM) {
      return (
        <div className="flex justify-center" ref={ref}>
          <SystemMessage message={message} />
        </div>
      );
    }
    if (message.type === MessageType.MEETING) {
      return (
        <div ref={ref} className="flex-1 flex gap-2 px-5 py-2">
          <MeetingLinkMessage message={message} />
        </div>
      );
    }
    return (
      !message.isDelete && (
        <div>
          <div
            className={cn(
              "relative flex items-start transition-all duration-75 gap-2 px-5 py-2 hover:bg-[rgba(255,255,255,0.06)]",
              `${isOpenDropdown ? "bg-[rgba(255,255,255,0.06)]" : ""}`,
              "[&:hover>div:last-child]:visible"
            )}
            ref={ref}
          >
            <div className="relative size-9 rounded-[8px] overflow-hidden top-1">
              {message.sender && (
                <Image src={message.sender.imageUrl} fill alt="" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 cursor-pointer">
                <p className="text-[15px] font-[600] hover:underline text-[#F8F8F8]">
                  {message.sender && message.sender.fullName}
                </p>
                <p className="text-xs text-text-secondary hover:underline">
                  {message.createdAt && formatedMessageTime(message.createdAt)}
                </p>
              </div>
              {message?.replyMessage?.length > 0 && (
                <MessageReply
                  onJump={onJump}
                  replyMessage={message.replyMessage[0]}
                />
              )}
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
                  wrapperRef={ref as RefObject<HTMLDivElement>}
                  isOpenDropdown={isOpenDropdown}
                  setIsOpenDropdown={setIsOpenDropdown}
                />
              </div>
            )}
          </div>
        </div>
      )
    );
  }
);

export default MessageItem;
