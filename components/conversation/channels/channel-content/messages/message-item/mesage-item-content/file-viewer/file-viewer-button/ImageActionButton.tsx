import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { RotateCw, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface IProps {
  scale: number;
  handleZoom: (scaleVal: number) => void;
  handleRotate: () => void;
}

function ImageActionButton({ scale, handleZoom, handleRotate }: IProps) {
  const onZoomIn = () => {
    const newScale = scale + 0.5;
    if (newScale >= 2) handleZoom(2);
    else handleZoom(newScale);
  };
  const onZoomOut = () => {
    const newScale = scale - 0.5;
    if (newScale <= 1) handleZoom(1);
    else handleZoom(newScale);
  };
  return (
    <>
      <Button
        variant="icon"
        className="px-[6px] py-[5px] border border-[#404040ad] h-auto bg-[#0000]"
        onClick={handleRotate}
      >
        <RotateCw {...iconStyles} />
      </Button>
      <div className="flex items-center gap-2 border border-[#404040ad] h-auto bg-[#0000] rounded-[5px]">
        <Button
          variant="icon"
          className="px-[6px] py-[5px] h-auto hover:bg-transparent [&_svg]:hover:stroke-white"
          onClick={onZoomOut}
        >
          <Minus {...iconStyles} />
        </Button>
        <Input
          type="range"
          step={0.01}
          min={1}
          max={2}
          value={scale}
          onChange={(e) => handleZoom(+e.target.value)}
          className="bg-[#35373B] w-[62px] appearance-none cursor-pointer outline-none border-none p-0 h-[2px]"
        />
        <Button
          variant="icon"
          className="px-[6px] py-[5px] h-auto hover:bg-transparent [&_svg]:hover:stroke-white"
          onClick={onZoomIn}
        >
          <Plus {...iconStyles} />
        </Button>
      </div>
    </>
  );
}

export default ImageActionButton;
