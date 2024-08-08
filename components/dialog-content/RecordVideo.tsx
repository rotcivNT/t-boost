/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { cn } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Pause,
  Play,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const MAX_RECORDING_TIME = 300; // 5 minutes

export default function RecordVideo() {
  const [isShareScreen, setIsShareScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(MAX_RECORDING_TIME);
  const [isOpenMic, setIsOpenMic] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const toggleMic = async () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
      setIsOpenMic(false);
    } else {
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setIsOpenMic(true);
    }
  };

  const shareScreen = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      if (!micStreamRef.current && !isOpenMic) {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      if (screenStreamRef.current.getAudioTracks().length > 0) {
        const screenSource = audioContext.createMediaStreamSource(
          screenStreamRef.current
        );
        screenSource.connect(destination);
      }
      if (micStreamRef.current) {
        const micSource = audioContext.createMediaStreamSource(
          micStreamRef.current
        );

        micSource.connect(destination);
      }

      combinedStreamRef.current = new MediaStream([
        ...screenStreamRef.current.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);

      // Not include microphone + audio screen for preview
      const displayStream = new MediaStream([
        ...screenStreamRef.current.getVideoTracks(),
      ]);
      videoRef.current.srcObject = displayStream;
      setIsShareScreen(true);

      screenStreamRef.current
        .getVideoTracks()[0]
        .addEventListener("ended", stopSharing);
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  }, []);

  const stopSharing = useCallback(() => {
    if (!videoRef.current || !combinedStreamRef.current) return;

    videoRef.current.srcObject = null;

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (combinedStreamRef.current) {
      combinedStreamRef.current.getTracks().forEach((track) => track.stop());
      combinedStreamRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setIsShareScreen(false);
    stopRecording();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          stopRecording();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, []);

  const startRecording = useCallback(() => {
    if (!combinedStreamRef.current) {
      alert("Please share your screen before starting the recording.");
      return;
    }

    recorderRef.current = new RecordRTC(combinedStreamRef.current, {
      type: "video",
    });
    recorderRef.current.startRecording();
    setIsRecording(true);
    setRemainingTime(MAX_RECORDING_TIME);
    startTimer();
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current!.getBlob();
      invokeSaveAsDialog(blob);
      recorderRef.current!.destroy();
      recorderRef.current = null;
      setIsRecording(false);
      stopSharing();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(false);
    });
  }, [stopSharing]);

  const pauseResumeRecording = useCallback(() => {
    if (!recorderRef.current) return;

    if (isPaused) {
      recorderRef.current.resumeRecording();
      startTimer();
    } else {
      recorderRef.current.pauseRecording();
      if (timerRef.current) clearInterval(timerRef.current);
    }
    setIsPaused(!isPaused);
  }, [isPaused, startTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setIsShareScreen(false);
      }}
    >
      <DialogTrigger>
        <Button
          variant="icon"
          size="icon"
          className="hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
        >
          <Video size={20} className="text-inherit" strokeWidth={1.6} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-secondary rounded-[8px] p-0 h-[80vh] max-h-[640px]">
        <DialogTitle className="font-bold text-[22px] text-text-primary">
          <p className="h-[76px] p-5">Record video clip</p>
          <Separator />
        </DialogTitle>
        <div className="h-full flex items-center relative">
          {countdown > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center size-full bg-[rgba(0,0,0,0.4)]">
              <h2 className="text-2xl text-center mb-4 font-bold text-text-primary">
                Starting in {countdown}...
              </h2>
            </div>
          )}
          <div
            className={cn(
              "flex items-center justify-center h-[300px] w-full bg-[#222529]",
              {
                "mx-8 rounded-[16px]": !isShareScreen,
              }
            )}
          >
            {!isShareScreen && (
              <div className="size-full flex items-center justify-center relative">
                <Image
                  className="size-[115px] rounded-[16px]"
                  width={115}
                  height={115}
                  src="https://ca.slack-edge.com/T06FW3SK3MH-U06G8RS0317-2d5da6c4fb79-192"
                  alt="Profile"
                />
                <Button
                  onClick={toggleMic}
                  className="absolute left-4 bottom-2"
                  variant="icon"
                  size="icon"
                >
                  {isOpenMic ? (
                    <Mic color="#e8e8e8b1" size={18} />
                  ) : (
                    <MicOff color="#e8e8e8b1" size={18} />
                  )}
                </Button>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={!isShareScreen ? "hidden" : "w-full h-full"}
            />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          {isRecording && (
            <div className="mb-6 flex items-center gap-3 px-8">
              <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(1 - remainingTime / MAX_RECORDING_TIME) * 100}%`,
                  }}
                />
              </div>
              <span>{formatTime(remainingTime)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-end items-center p-5 gap-3">
            {!isRecording ? (
              <Button
                variant="icon"
                onClick={isShareScreen ? stopSharing : shareScreen}
                className="text-[#e8e8e8b1] gap-2 hover:bg-transparent hover:text-text-primary h-9"
              >
                {isShareScreen ? (
                  <MonitorOff size={20} className="text-inherit" />
                ) : (
                  <Monitor size={20} className="text-inherit" />
                )}
                {isShareScreen ? "Stop Sharing" : "Share Screen"}
              </Button>
            ) : (
              <Button
                variant="icon"
                onClick={pauseResumeRecording}
                className="text-[#e8e8e8b1] gap-2 hover:bg-transparent hover:text-text-primary h-9"
              >
                {isPaused ? "Resume" : "Pause"}
                {isPaused ? (
                  <Play size={20} className="text-inherit" />
                ) : (
                  <Pause size={20} className="text-inherit" />
                )}
              </Button>
            )}
            <Button
              onClick={
                isRecording
                  ? stopRecording
                  : isShareScreen
                  ? startCountdown
                  : undefined
              }
              className={cn(
                "bg-[#b41541] hover:bg-[#b41541] hover:opacity-90 text-text-primary font-bold h-9",
                !isShareScreen &&
                  "cursor-default bg-[#212428] hover:bg-[#212428] hover:opacity-100 text-[#b9babd]"
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{isRecording ? "Stop" : "Record"}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isShareScreen
                        ? "Start to record"
                        : "Select a screen to share"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
