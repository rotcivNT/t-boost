import { Loader2 } from "lucide-react";

interface IProps {
  file: File;
}

function VideoMessageStatus({ file }: IProps) {
  const blobURL = URL.createObjectURL(file);
  return (
    <div className="relative max-w-[420px]">
      <video controls className="max-h-[360px]">
        <source src={blobURL} />
      </video>
      <Loader2 size={17} className="absolute -top-2 -right-2 animate-spin" />
    </div>
  );
}

export default VideoMessageStatus;
