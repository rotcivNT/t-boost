import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo, useState } from "react";

interface IProps {
  file: File;
}

function ImagePreview({ file }: IProps) {
  const [isLoading, setIsLoading] = useState(true);

  const previewImage = useMemo(() => {
    return URL.createObjectURL(file) || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div
      className={cn(
        "size-[72px] relative border border-[#d6dbe1] rounded-[4px] overflow-hidden box-border cursor-pointer",
        `${isLoading ? "blur-2xl grayscale" : "blur-0 grayscale-0"}`
      )}
    >
      <div className="size-full">
        {previewImage ? (
          <Image
            alt=""
            fill
            quality={100}
            src={previewImage}
            id="previewImage"
            className={cn("object-cover")}
            onLoadingComplete={() => setIsLoading(false)}
          />
        ) : (
          <div className="size-full animate-pulse bg-slate-300" />
        )}
      </div>
    </div>
  );
}

export default ImagePreview;
