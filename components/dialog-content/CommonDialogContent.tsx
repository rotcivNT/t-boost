import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter, DialogHeader } from "../ui/dialog";
import { iconStyles } from "../workspace/sidebar/sidebar-body/SidebarList";
import { useRef } from "react";

interface IProps {
  title: string;
  subTitle?: string;
  description?: string;
  footerButtonTitle?: string;
  onClick?: () => void;
  isPending?: boolean;
  children: React.ReactNode;
}

function CommonDialogContent({
  title,
  description,
  footerButtonTitle,
  children,
  onClick,
  isPending,
}: IProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onClose = async () => {
    closeButtonRef.current?.click();
  };
  if (isPending) {
    onClose();
    return null;
  }
  return (
    <div>
      <div>
        <DialogHeader>
          <span className="text-left text-[22px] font-[600] pb-3 text-text-primary">
            {title}
          </span>
          <DialogClose ref={closeButtonRef} />
        </DialogHeader>
        {children}
        <p className="mt-3 text-[13px] text-text-secondary pb-8">
          {description}
        </p>
        <DialogFooter className="flex-row justify-end gap-3">
          <Button
            variant="outline"
            className="w-20 bg-inherit border-[rgba(209,210,211,.3)]"
            onClick={onClose}
          >
            Cancle
          </Button>
          <Button
            variant="default"
            className="w-20 bg-[#007A5A] hover:bg-[#007A5A] hover:opacity-90 text-white"
            disabled={onClick ? false : true}
            onClick={onClick}
          >
            {isPending ? (
              <Loader2 size={24} className="animate-spin" />
            ) : footerButtonTitle ? (
              footerButtonTitle
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
}

export default CommonDialogContent;
