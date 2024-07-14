import TBImage from "@/components/common/TBImage";
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
  return (
    <TBImage
      MAX_WIDTH={MAX_WIDTH}
      file={file}
      onClick={onClick}
      isFileAllImages={isFileAllImages}
      isMultipleImages={isMultipleImages}
    />
  );
}

export default ImageMessage;
