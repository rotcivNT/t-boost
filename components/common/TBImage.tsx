import { FileData } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Blurhash } from "react-blurhash";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface IProps {
  file: FileData;
  onClick?: () => void;
  isFileAllImages?: boolean;
  isMultipleImages?: boolean;
  MAX_WIDTH: number;
  className?: string;
}

function TBImage({
  file,
  onClick,
  isFileAllImages,
  isMultipleImages,
  MAX_WIDTH,
  className,
}: IProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgWidth, setImgWidth] = useState(MAX_WIDTH);
  const handleImageSize = () => {
    const { originalWidth, originalHeight } = file;
    if (!originalWidth || !originalHeight) return;
    let newImgWidth = MAX_WIDTH;
    let aspectRatio = originalHeight / originalWidth;

    if (aspectRatio >= 1.5) {
      if (originalWidth > MAX_WIDTH) newImgWidth = MAX_WIDTH;
      else if (originalWidth * aspectRatio > MAX_WIDTH) {
        newImgWidth = MAX_WIDTH / aspectRatio;
      } else newImgWidth = originalWidth;
    } else {
      if (originalWidth < MAX_WIDTH) newImgWidth = originalWidth;
    }

    if (
      (newImgWidth * +Number(aspectRatio * 100).toFixed(2)) / 100 >
      MAX_WIDTH
    ) {
      newImgWidth = MAX_WIDTH / aspectRatio;
    }
    setImgWidth(newImgWidth);

    return +Number(aspectRatio * 100).toFixed(2);
  };
  const percentPaddingTop = useMemo(() => {
    return handleImageSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
    };
    img.src = file.url;
  }, [file.url]);

  return (
    <div
      className={cn(
        "relative cursor-zoom-in border border-border rounded-[8px]",
        `${isFileAllImages && isMultipleImages ? "h-full" : "h-auto"}`,
        className
      )}
      style={{
        width: `${imgWidth}px`,
      }}
      onClick={onClick}
    >
      {isLoading ? (
        <Blurhash
          hash={file.blurHash as string}
          width={imgWidth}
          style={{ paddingTop: `${percentPaddingTop}%` }}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      ) : (
        <div style={{ paddingTop: `${percentPaddingTop}%` }}>
          <NextImage
            className="transition-all duration-300 object-cover rounded-[8px]"
            alt={file.name}
            src={file.url}
            fill
          />
        </div>
      )}
    </div>
  );
}

export default TBImage;
