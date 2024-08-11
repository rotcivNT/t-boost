import {
  AcceptCallButton,
  CancelCallButton,
  useCall,
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
              `/workspace/meeting/${call.id}`,
              "_blank",
              "width=800,height=600"
            )
          }
        />
        <CancelCallButton onClick={() => call.leave()} />
      </div>
    )
  );
};
