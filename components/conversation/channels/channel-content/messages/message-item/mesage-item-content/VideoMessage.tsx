import { Loader2 } from "lucide-react";

interface IProps {
  content: string;
}
function VideoMessage({ content }: IProps) {
  return (
    <div className="relative max-w-[420px]">
      <video controls>
        <source src={content} />
      </video>
    </div>
  );
}

export default VideoMessage;
