"use client";
import {
  CallControls,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  StreamVideoEvent,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { UpdateMeetingProps } from "@/app/apis/api-payload";
import { updateMeeting } from "@/app/services/action";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "../loader/Loader";
import { ActiveCallHeader } from "./ActiveCallHeader";
import LayoutSelect from "./LayoutSelect";
import MyParticipantList from "./participants/MyParticipantList";

export type CallLayoutType =
  | "default"
  | "grid"
  | "speaker-top"
  | "speaker-bottom"
  | "speaker-left"
  | "speaker-right";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const call = useCall();
  const pathName = usePathname();
  const params = useSearchParams();
  const isJoinFromLink = params.get("join");

  const CallLayout = useMemo(() => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-bottom":
        return <SpeakerLayout participantsBarPosition="top" />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="right" />;
      case "speaker-top":
        return <SpeakerLayout participantsBarPosition="bottom" />;
      default:
        return <SpeakerLayout />;
    }
  }, [layout]);
  const onLeave = async () => {
    if (!call) return;
    if (participantCount === 1) {
      const payload: UpdateMeetingProps = {
        meetingLink: `${process.env.NEXT_PUBLIC_BASE_URL}${pathName}`,
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
    window.parent.postMessage("closeWindow", "*");
  };
  useEffect(() => {
    const handleJoinCall = async () => {
      if (
        !isJoinFromLink &&
        ![CallingState.JOINED, CallingState.JOINING].includes(
          call?.state.callingState as CallingState
        )
      ) {
        try {
          await call?.join();
        } catch (e) {
          console.log(e);
        }
      }
    };
    handleJoinCall();
  }, [call, isJoinFromLink]);

  if (callingState !== CallingState.JOINED) return <Loader />;
  return (
    <section className="relative w-full h-dvh overflow-hidden pt-4 text-white flex flex-col px-2 bg-black">
      <div className="">
        <ActiveCallHeader />
      </div>
      <div className="relative h-[calc(100dvh-140px)] flex size-full items-center p-4 gap-3 justify-center">
        <div className="flex flex-1 size-full items-center">{CallLayout}</div>
        <MyParticipantList
          showParticipants={showParticipants}
          setShowParticipants={setShowParticipants}
        />
      </div>
      {/* video layout and call controls */}
      <div className="flex w-full items-center justify-center gap-5">
        <CallControls onLeave={onLeave} />

        <LayoutSelect
          layouts={["Grid", "Speaker-Left", "Speaker-Right"]}
          onChangeLayout={setLayout}
        />
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] size-9 flex justify-center items-center hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default MeetingRoom;
