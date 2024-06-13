import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { FileData } from "@/types";
import NextImage from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Blurhash } from "react-blurhash";

interface IProps {
  file: FileData;
  onClick: () => void;
  isFileAllImages: boolean;
  isMultipleImages: boolean;
}

function ImageMessage({
  file,
  onClick,
  isFileAllImages,
  isMultipleImages,
}: IProps) {
  const isLaptop = useMediaQuery(1080);
  const isPC = useMediaQuery(1200);
  const MAX_WIDTH = useMemo(() => {
    if (isFileAllImages && isMultipleImages) {
      return isLaptop ? 320 : isPC ? 340 : 182;
    }
    return 340;
  }, [isFileAllImages, isLaptop, isMultipleImages, isPC]);
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
        `${isFileAllImages && isMultipleImages ? "h-full" : "h-auto"}`
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

export default ImageMessage;
