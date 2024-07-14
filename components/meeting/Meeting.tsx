/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loader from "../loader/Loader";
import MeetingRoom from "./MeetingRoom";
import MeetingSetup from "./MeetingSetup";
import "./styles.css";

function Meeting() {
  const { id } = useParams();
  const params = useSearchParams();
  const isJoinFromLink = params.get("join");
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  const notAllowed =
    !user || !call.state.members.find((m) => m.user.id === user.id);
  if (notAllowed) return <div>NOT ALLOW</div>;
  return (
    <StreamCall call={call}>
      <StreamTheme as="main">
        {!isSetupComplete && isJoinFromLink ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default Meeting;
