/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { UpdateMeetingProps } from "@/app/apis/api-payload";
import { updateMeeting } from "@/app/services/action";
import { formatedMessageTime } from "@/app/utils";
import { cn } from "@/lib/utils";
import { MessageItemProps } from "@/types";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  message: MessageItemProps;
}

function MeetingLinkMessage({ message }: IProps) {
  const [newWindow, setNewWindow] = useState<any>(null);
  const client = useStreamVideoClient();
  const onJoinMeeting = async () => {
    const meetingWindow = window.open(
      "about:blank",
      "_blank",
      "width=800,height=600"
    );
    setNewWindow(meetingWindow);
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data === "closeWindow") {
        newWindow.close();
        setNewWindow(null);
      }
    };
    const handleBeforeUnload = async () => {
      if (!client) return;
      const { calls } = await client.queryCalls({
        filter_conditions: { id: message.content.split("/meeting/")[1] },
      });
      if (calls.length > 0) {
        const call = calls[0];
        if (call.state.participantCount === 0) {
          const payload: UpdateMeetingProps = {
            meetingLink: message.content,
            sender: {
              clerkUserId: call.state.createdBy?.id as string,
              imageUrl: call.state.createdBy?.image as string,
              fullName: call.state.createdBy?.name as string,
            },
            isDelete: true,
          };
          await updateMeeting(payload);
          await call.endCall();
        }
      }
    };
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TBoost Call</title>
        </head>
        <body style="margin: 0; overflow: hidden;">
            <iframe src="${message.content}?m_id=${message._id}&join=true" frameborder="0" style="width: 100%; height: 100vh;"></iframe>
        </body>
        </html>
    `);
      newWindow.document.close();
      newWindow.addEventListener("message", handleMessage);
      newWindow.addEventListener("unload", handleBeforeUnload);

      return () => {
        newWindow.removeEventListener("message", handleMessage);
        newWindow.removeEventListener("unload", handleBeforeUnload);
      };
    }
  }, [message, newWindow]);

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
          <div
            onClick={onJoinMeeting}
            className={cn(
              "cursor-pointer inline-flex mt-2 gap-3 bg-[#303030] hover:bg-[#454545] w-1/2 max-w-[400px] p-2 rounded-[16px]",
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
          </div>
        </div>
      </>
    )
  );
}

export default MeetingLinkMessage;
