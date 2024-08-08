import { Loader2 } from "lucide-react";
import Image from "next/image";
import { SyntheticEvent, useMemo, useState } from "react";

interface IProps {
  file: File;
}

function ImageMessageStatus({ file }: IProps) {
  const [percentPaddingTop, setPercentPaddingTop] = useState(100);
  const [imgWidth, setImgWidth] = useState(340);
  const blobURL = useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);
  const onLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const aspectRadio =
      e.currentTarget.naturalHeight / e.currentTarget.naturalWidth;
    if (e.currentTarget.naturalWidth < 340)
      setImgWidth(e.currentTarget.naturalWidth);
    else if (aspectRadio >= 1.5) {
      setImgWidth(340 / aspectRadio);
    }
    setPercentPaddingTop(+Number(aspectRadio * 100).toFixed(2));
  };
  return (
    <div className="relative mt-2" style={{ width: `${imgWidth}px` }}>
      <div style={{ paddingTop: `${percentPaddingTop}%` }}>
        <Image
          alt={file.name}
          src={blobURL}
          fill
          className="rounded-[8px]"
          onLoad={onLoad}
        />
      </div>
      <Loader2 size={17} className="absolute -top-2 -right-2 animate-spin" />
    </div>
  );
}

export default ImageMessageStatus;
