import {
  AcceptCallButton,
  CallingState,
  CancelCallButton,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

export const CallControls = () => {
  const call = useCall();

  if (!call) return null;

  return (
    !call.isCreatedByMe && (
      <div className="flex items-center justify-center gap-4">
        <AcceptCallButton
          onClick={() =>
            window.open(
              `http://localhost:3000/workspace/meeting/${call.id}`,
              "_blank"
            )
          }
        />
        <CancelCallButton onClick={() => call.leave()} />
      </div>
    )
  );
};
