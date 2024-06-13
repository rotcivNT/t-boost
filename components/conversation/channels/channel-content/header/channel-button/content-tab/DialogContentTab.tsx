import { UpdateChannelProps } from "@/app/apis/api-payload";
import { updateChannel } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { ChannelIcon } from "@/assets/images/ChannelIcon";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pusher } from "@/configs/pusher";
import { ChannelProps } from "@/types";
import { Loader2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";

interface IProps {
  title: string;
  label: string;
  description: string;
  defaultValue?: string;
  channelId: string;
}

function DialogContentTab({
  title,
  label,
  description,
  defaultValue,
  channelId,
}: IProps) {
  const [inputValue, setInputValue] = useState(
    defaultValue ? defaultValue : ""
  );
  const onChange = (value: string) => {
    setInputValue(value);
  };
  const setPartialDataChannel = useChannelStore(
    (state) => state.setPartialDataChannel
  );
  const [isPending, startTransition] = useTransition();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onClose = () => {
    closeButtonRef.current && closeButtonRef.current.click();
  };
  const onEdit = () => {
    startTransition(async () => {
      const payload: UpdateChannelProps = {
        [label.toLowerCase()]: inputValue,
        socketId: pusher.connection.socket_id,
      };

      const res = await updateChannel(channelId, payload);
      if (res?.code === 1) {
        setPartialDataChannel({ [label.toLowerCase()]: inputValue });
        onClose();
      }
    });
  };

  return (
    <div>
      <DialogHeader>
        <span className="text-left text-[22px] font-[600] pb-3 text-text-primary">
          {title}
        </span>
        <DialogClose ref={closeButtonRef} />
      </DialogHeader>
      <div>
        {label && (
          <Label
            className="pb-3 block text-[15px] text-text-primary"
            htmlFor="input"
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-3">
            <ChannelIcon />
          </div>
          <Input
            id="input"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            className="pl-8 pr-5 text-base text-text-primary bg-inherit border-[rgba(209,210,211,.3)]"
          />
        </div>
      </div>
      <p className="mt-3 text-[13px] text-text-secondary pb-8">{description}</p>
      <DialogFooter className="flex-row justify-end gap-3">
        <Button
          variant="outline"
          className="w-20 bg-inherit border-[rgba(209,210,211,.3)]"
          onClick={onClose}
        >
          Cancle
        </Button>
        <Button
          onClick={onEdit}
          variant="default"
          className="w-20 bg-[#007A5A] hover:bg-[#007A5A] hover:opacity-90 text-white"
        >
          {isPending ? <Loader2 size={20} className="animate-spin" /> : "Save"}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default DialogContentTab;
