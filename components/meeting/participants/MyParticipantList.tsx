import { cn } from "@/lib/utils";
import { CallParticipantsList } from "@stream-io/video-react-sdk";

interface IProps {
  showParticipants: boolean;
  setShowParticipants: React.Dispatch<React.SetStateAction<boolean>>;
}

function MyParticipantList({ showParticipants, setShowParticipants }: IProps) {
  return (
    <div
      className={cn(
        "h-full ml-2 relative transition-all overflow-hidden rounded-[18px] duration-300 bg-[#101213]",
        `${showParticipants ? "w-[350px] left-0 bottom-0 opacity-100" : "w-0"}`
      )}
    >
      <div className="min-w-[350px] max-w-[350px]">
        <div className="p-4">
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
    </div>
  );
}

export default MyParticipantList;
