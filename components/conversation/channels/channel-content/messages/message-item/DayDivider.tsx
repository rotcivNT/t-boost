import { Separator } from "@/components/ui/separator";

interface IProps {
  createdAt?: string;
}

function DayDivider({ createdAt }: IProps) {
  return (
    <div className="flex items-center">
      <Separator className="flex-1" />
      <p className="flex-1 text-center rounded-full border border-border text-[13px] text-text-primary font-[500] py-1 cursor-default">
        Sunday, May 26th
      </p>
      <Separator className="flex-1" />
    </div>
  );
}

export default DayDivider;
