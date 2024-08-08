"use client";
import { cn } from "@/lib/utils";
import { FileData } from "@/types";
import Image from "next/image";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import ImageActionButton from "./file-viewer-button/ImageActionButton";
import styles from "./styles.module.scss";

interface IProps {
  file: FileData;
}

function ImageViewer({ file }: IProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [percentPaddingTop, setPercentPaddingTop] = useState(0);
  const [imgWidth, setImgWidth] = useState<string>("0%");
  const onLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const wrapperWidth = wrapperRef.current?.clientWidth;
    if (!wrapperWidth) return;
    // Handle aspect ratio -> set width & height
    const aspectRatio =
      e.currentTarget.naturalHeight / e.currentTarget.naturalWidth;

    if (aspectRatio >= 1.5) {
      setImgWidth(`${e.currentTarget.naturalHeight / aspectRatio}px`);
    } else if (wrapperWidth && e.currentTarget.naturalWidth < wrapperWidth) {
      setImgWidth(`${e.currentTarget.naturalWidth}px`);
    } else setImgWidth("100%");
    setPercentPaddingTop(+Number(aspectRatio * 100).toFixed(2));
  };
  const handleZoom = (scaleVal: number) => {
    setScale((_) => scaleVal);
  };
  const handleRotate = () => {
    setRotate((pre) => pre + 90);
  };
  useEffect(() => {
    setImgWidth("0%");
  }, [file]);
  return (
    <div ref={wrapperRef} className="h-full flex justify-center items-center">
      <div className="relative h-full" style={{ width: imgWidth }}>
        <div style={{ paddingTop: `${percentPaddingTop}%` }}>
          <Image
            ref={imageRef}
            alt={file.name}
            src={file.url}
            fill
            onLoad={onLoad}
            className="object-contain transition-all duration-200"
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
            }}
          />
        </div>
      </div>

      {/* Left content */}
      <div
        className={cn(
          "absolute bottom-0 left-0 opacity-0 translate-y-5 flex gap-2 py-2 px-3 z-[11]",
          styles["footer-wrapper"]
        )}
      >
        <ImageActionButton
          scale={scale}
          handleZoom={handleZoom}
          handleRotate={handleRotate}
        />
      </div>
    </div>
  );
}

export default ImageViewer;
