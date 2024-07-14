"use client";
import { cn } from "@/lib/utils";
import {
  IconButton,
  VideoPreview,
  createSoundDetector,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "../my-ui/Alert";
import { Button } from "../ui/button";
import {
  DisabledVideoPreview,
  NoCameraPreview,
  StartingCameraPreview,
} from "./video-preview";
import {
  AudioInputDeviceSelector,
  VideoInputDeviceSelector,
} from "./video-preview/DeviceSelector";

const SpeechIndicator = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { isEnabled, mediaStream } = useMicrophoneState();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!isEnabled || !mediaStream) return;

    const disposeSoundDetector = createSoundDetector(
      mediaStream,
      ({ audioLevel }) => setPercentage(audioLevel),
      { detectionFrequencyInMs: 80, destroyStreamOnStop: false }
    );

    return () => {
      disposeSoundDetector().catch(console.error);
    };
  }, [isEnabled, mediaStream]);

  return (
    <div className="w-8 h-8 bg-zinc-800 rounded-full flex justify-center items-center">
      <div
        className="rounded-full bg-zinc-100 to-transparent w-full h-full"
        style={{ transform: `scale(${percentage / 100})` }}
      />
    </div>
  );
};

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useMicrophoneState, useCameraState, useCallEndedAt } =
    useCallStateHooks();
  const callEndedAt = useCallEndedAt();
  const callHasEnded = !!callEndedAt;
  const { isMute: isMicMute, microphone } = useMicrophoneState();
  const { isMute: isCameraMute, camera } = useCameraState();
  const call = useCall();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <>
      <p className="text-[20px] mb-8">Set up your call before joining</p>
      <div className="relative lg:w-3/5 w-full flex justify-center flex-col items-center mx-auto">
        <div className="relative">
          <VideoPreview
            DisabledVideoPreview={DisabledVideoPreview}
            NoCameraPreview={NoCameraPreview}
            StartingCameraPreview={StartingCameraPreview}
          />
          <div className="str-video__call-controls rounded-full px-6 absolute bottom-0 left-1/2 -translate-x-1/2">
            <IconButton
              icon={isMicMute ? "mic-off" : "mic"}
              onClick={() => microphone.toggle()}
              className={cn(isMicMute ? "!bg-[#dc433b]" : "")}
            />
            <IconButton
              icon={isCameraMute ? "camera-off" : "camera"}
              onClick={() => camera.toggle()}
              className={cn(isCameraMute ? "!bg-[#dc433b]" : "")}
            />
          </div>
        </div>
        <div className="flex mt-8 *:basis-1/2 *:px-2 w-[600px]">
          <div>
            <AudioInputDeviceSelector />
          </div>
          <div>
            <VideoInputDeviceSelector />
          </div>
        </div>
        <Button
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
          className="bg-[#005fff] hover:bg-[#005fff] hover:opacity-80 rounded-full py-2 px-3 mt-10 text-white min-w-[350px] h-9 gap-3"
        >
          <LogIn size={20} />
          Joining meeting
        </Button>
      </div>
    </>
  );
};

export default MeetingSetup;
