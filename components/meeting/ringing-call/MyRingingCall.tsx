"use client";
import {
  CallingState,
  StreamCall,
  StreamTheme,
  useCalls,
} from "@stream-io/video-react-sdk";

import { CallPanel } from "./CallPanel";
import { useEffect, useRef, useState } from "react";

export const MyRingingCall = () => {
  const calls = useCalls();
  const incomingCalls = calls.filter(
    (call) =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING
  );
  const audioRef = useRef(
    new Audio("https://rotciv.me/mixkit-waiting-ringtone-1354.wav")
  );
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // useEffect(() => {
  //   const handleUserInteraction = () => {
  //     setIsUserInteracted(true);
  //     window.removeEventListener("click", handleUserInteraction);
  //     window.removeEventListener("keydown", handleUserInteraction);
  //   };

  //   window.addEventListener("click", handleUserInteraction);
  //   window.addEventListener("keydown", handleUserInteraction);

  //   return () => {
  //     window.removeEventListener("click", handleUserInteraction);
  //     window.removeEventListener("keydown", handleUserInteraction);
  //   };
  // }, []);

  useEffect(() => {
    if (incomingCalls.length > 0) {
      audioRef.current.loop = true;
      audioRef.current.play().catch((error: any) => {
        console.error("Failed to play the ringing sound:", error);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [incomingCalls]);
  if (incomingCalls.length === 0) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)]" />
      <div className="fixed inset-0 flex justify-center items-center">
        {incomingCalls.map((call) => (
          <StreamCall call={call} key={call.cid}>
            <StreamTheme>
              <CallPanel />
            </StreamTheme>
          </StreamCall>
        ))}
      </div>
    </>
  );
};
