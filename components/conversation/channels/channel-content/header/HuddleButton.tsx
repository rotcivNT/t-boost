"use client";
import { messageAPI } from "@/app/apis/messageAPI";
import { useChannelStore } from "@/app/store/channel.store";
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
import { ClerkProvider, useClerk, useUser } from "@clerk/nextjs";
import {
  Call,
  StreamCallProvider,
  StreamVideoClient,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";

import { createRoot } from "react-dom/client";
import { Headset } from "lucide-react";
import { useEffect, useState } from "react";
import Meeting from "@/components/meeting/Meeting";
import StreamVideoProvider from "@/providers/StreamClientProvider";
const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

function HuddleButton() {
  const channel = useChannelStore((state) => state.currentChannel);
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
      const members = channel.members.map((member) => ({
        role: member.userID === user.id ? "call_member" : "user",
        user_id: member.userID,
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
          channelId: channel._id,
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
      }
    };
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log(callDetail?.state.participants);
      event.preventDefault();
    };
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Embedded Iframe</title>
        </head>
        <body style="margin: 0; overflow: hidden;">
            <iframe src="${process.env.NEXT_PUBLIC_BASE_URL}/workspace/meeting/${callDetail?.id}" frameborder="0" style="width: 100%; height: 100vh;"></iframe>
        </body>
        </html>
    `);
      newWindow.document.close();
      newWindow.addEventListener("message", handleMessage);
      // newWindow.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      newWindow?.removeEventListener("message", handleMessage);
      // newWindow?.removeEventListener("beforeunload", handleBeforeUnload);
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
