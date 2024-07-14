/* eslint-disable react/display-name */
import { convertDateToTextName } from "@/app/utils";
import { Separator } from "@/components/ui/separator";
import { LegacyRef, forwardRef } from "react";

interface IProps {
  createdAt: string;
}

const DayDivider = forwardRef(
  ({ createdAt }: IProps, ref: LegacyRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className="flex items-center mt-2">
        <Separator className="flex-1" />
        <p className="flex-1 text-center rounded-full border border-border text-[13px] text-text-primary font-[500] py-1 cursor-default">
          {convertDateToTextName(new Date(createdAt))}
        </p>
        <Separator className="flex-1" />
      </div>
    );
  }
);

export default DayDivider;
