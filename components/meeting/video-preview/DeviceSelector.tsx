import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Camera, Mic } from "lucide-react";
import { ServerInsertedHTMLContext } from "next/navigation";

type DeviceSelectorProps = {
  devices: MediaDeviceInfo[];
  onSelect: (deviceId: string) => void;
  type: "mic" | "camera";
};

export const DeviceSelector = ({
  devices,
  onSelect,
  type,
}: DeviceSelectorProps) => {
  if (devices.length === 0) return;
  return (
    <Select
      onValueChange={(value) => onSelect(value)}
      defaultValue={devices[0].deviceId}
    >
      <SelectTrigger
        className={cn(
          "w-full border-transparent rounded-full [&_svg]:shrink-0 [&_span]:flex-1 justify-start gap-2 text-left bg-transparent hover:bg-[#323b44]",
          "outline-none focus:ring-0 focus:ring-offset-0"
        )}
      >
        {type === "mic" ? (
          <Mic size={20} className="shrink-0" />
        ) : (
          <Camera size={20} className="shrink-0" />
        )}
        <SelectValue className="text-left flex-1" />
      </SelectTrigger>
      <SelectContent className="bg-[#19232d] shadow-[0_0_24px_-4px_rgba(0,0,0,0.64)] p-4 rounded-[24px] border-none">
        {devices.map((device, index) => {
          return (
            <SelectItem
              value={device.deviceId}
              key={device.deviceId}
              className={cn(
                "hover:bg-[#323b44] focus:bg-[#323b44] rounded-full data-[state=checked]:bg-[#323b44 py-1"
              )}
            >
              {device.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export const AudioInputDeviceSelector = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, devices, selectedDevice } = useMicrophoneState();
  return (
    <DeviceSelector
      devices={devices || []}
      onSelect={(deviceId) => microphone.select(deviceId)}
      type="mic"
    />
  );
};

export const VideoInputDeviceSelector = () => {
  const { useCameraState } = useCallStateHooks();
  const { camera, devices, selectedDevice } = useCameraState();
  return (
    <DeviceSelector
      devices={devices || []}
      onSelect={(deviceId) => camera.select(deviceId)}
      type="camera"
    />
  );
};

export const AudioOutputDeviceSelector = () => {
  const { useSpeakerState } = useCallStateHooks();
  const { speaker, devices, selectedDevice, isDeviceSelectionSupported } =
    useSpeakerState();

  if (!isDeviceSelectionSupported) return null;
  return (
    <DeviceSelector
      devices={devices || []}
      onSelect={(deviceId) => speaker.select(deviceId)}
      type="mic"
    />
  );
};
