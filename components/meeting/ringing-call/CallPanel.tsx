import { CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { CallCallingStateLabel } from "./CallCallingStateLabel";
import { CallControls } from "./CallControl";

export const MyRingingCall = () => {
  return (
    <div className="min-w-[450px] max-w-full border-2 border-border bg-[#F4F4F5] rounded-[12px] py-8 px-4">
      <CallCallingStateLabel />
      <CallControls />
    </div>
  );
};

export const CallPanel = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState === CallingState.RINGING) {
    return <MyRingingCall />;
  }
  return null;
};
