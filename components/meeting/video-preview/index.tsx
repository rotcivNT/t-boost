import Loader from "@/components/loader/Loader";
import {
  DefaultVideoPlaceholder,
  LoadingIndicatorProps,
  StreamVideoParticipant,
  useConnectedUser,
} from "@stream-io/video-react-sdk";
import { Video } from "lucide-react";

export const DisabledVideoPreview = () => {
  const connectedUser = useConnectedUser();
  if (!connectedUser) return null;

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          image: connectedUser.image,
          name: connectedUser.name,
        } as StreamVideoParticipant
      }
    />
  );
};

export const NoCameraPreview = () => (
  <div>
    <Video />
  </div>
);

export const StartingCameraPreview = () => (
  <div>
    <Loader />
  </div>
);
