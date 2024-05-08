import { cn } from "@/lib/utils";

interface TriggerButtonIProps {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const DropdownTriggerButton = ({
  rightIcon,
  leftIcon,
  title,
  subtitle,
  className,
}: TriggerButtonIProps) => {
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 text-text-primary font-[500] text-sm",
          className
        )}
      >
        {leftIcon}
        <p className="flex flex-col text-inherit">
          <span className="block max-w-24 truncate">{title}</span>
          <span className="text-[12px] text-[#E8E8E8B3] font-[400]">
            {subtitle}
          </span>
        </p>
        {rightIcon}
      </div>
    </>
  );
};

export default DropdownTriggerButton;
