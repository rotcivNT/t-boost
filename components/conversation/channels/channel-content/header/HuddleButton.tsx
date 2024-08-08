"use client";
import { messageAPI } from "@/app/apis/messageAPI";
import Loader from "@/components/loader/Loader";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import { Headset } from "lucide-react";
import { useEffect, useState } from "react";
const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

interface IProps {
  receiverId: string;
  memberIds: string[];
}

function HuddleButton({ receiverId, memberIds }: IProps) {
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();
  const [newWindow, setNewWindow] = useState<any>(null);
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }
      const { calls } = await client.queryCalls({
        filter_conditions: {
          ongoing: true,
          members: { $in: [user.id] },
        },
      });

      // if (calls.length > 0) {
      //   toast({
      //     title: "You are currently in another call",
      //   });
      //   return;
      // }
      const id = crypto.randomUUID();
      const call = client.call("default", `${id}`);

      if (!call) throw new Error("Failed to create meeting");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      const members = memberIds.map((memberId) => ({
        role: memberId === user.id ? "call_member" : "user",
        user_id: memberId,
      }));
      await call.getOrCreate({
        ring: true,
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
          members,
        },
      });
      setCallDetail(call);
      const meetingWindow = window.open(
        "about:blank",
        "_blank",
        "width=800,height=600"
      );
      // Render component vào cửa sổ mới

      setNewWindow(meetingWindow);

      if (!values.description) {
        await messageAPI.newMeeting({
          channelId: receiverId,
          meetingLink: `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/meeting/${call.id}`,
          senderId: user.id,
          sender: {
            clerkUserId: user.id,
            fullName: user.fullName as string,
            imageUrl: user.imageUrl,
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create Meeting" });
    }
  };
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "closeWindow") {
        newWindow.close();
        setNewWindow(null);
      } else {
        alert(event);
        console.log(event);
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
            <iframe src="${process.env.NEXT_PUBLIC_BASE_URL}/workspace/meeting/${callDetail?.id}" frameborder="0" style="width: 100%; height: 100vh;"></iframe>
        </body>
        </html>
    `);
      newWindow.document.close();
      newWindow.addEventListener("message", handleMessage);
    }
    return () => {
      newWindow?.removeEventListener("message", handleMessage);
    };
  }, [callDetail, newWindow]);

  if (!client || !user) return <Loader />;

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger
              onClick={createMeeting}
              className="flex items-center justify-center h-7 rounded-[6px] border border-[#797c814d] p-1 hover:bg-[rgba(255,255,255,0.03)]"
            >
              <Headset {...iconStyles} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start huddle</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Dialog>
  );
}

export default HuddleButton;
