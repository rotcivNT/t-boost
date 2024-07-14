import {
  CallingState,
  useCall,
  useCallStateHooks,
  useI18n,
} from "@stream-io/video-react-sdk";
import Image from "next/image";

const CALLING_STATE_TO_LABEL: Record<CallingState, string> = {
  [CallingState.JOINING]: "Joining",
  [CallingState.RINGING]: "Ringing",
  [CallingState.RECONNECTING]: "Re-connecting",
  [CallingState.RECONNECTING_FAILED]: "Failed",
  [CallingState.OFFLINE]: "No internet connection",
  [CallingState.IDLE]: "",
  [CallingState.UNKNOWN]: "",
  [CallingState.JOINED]: "Joined",
  [CallingState.LEFT]: "Left call",
  [CallingState.MIGRATING]: "",
};

export const CallCallingStateLabel = () => {
  const { t } = useI18n();

  const { useCallCallingState, useCallCreatedBy } = useCallStateHooks();
  const callingState = useCallCallingState();
  const createdBy = useCallCreatedBy();

  const callingStateLabel = CALLING_STATE_TO_LABEL[callingState];
  return (
    createdBy && (
      <div className="flex flex-col items-center text-black">
        <Image
          src={createdBy.image as string}
          alt={createdBy.name as string}
          width={80}
          height={80}
          className="size-10 rounded-full object-contain"
        />
        <p className="text-inherit">{createdBy.name}</p>
        <span className="my-10 inline-block text-inherit">
          {t(callingStateLabel)}
        </span>
      </div>
    )
  );
};
