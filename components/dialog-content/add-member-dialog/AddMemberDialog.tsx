import { sendInvitationPayload } from "@/app/apis/api-payload";
import { channelAPI } from "@/app/apis/channelAPI";
import { useChannelStore } from "@/app/store/channel.store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ChangeEvent, KeyboardEvent, useState, useTransition } from "react";
import { Label } from "../../ui/label";
import CommonDialogContent from "../CommonDialogContent";
import ContentChip from "./ContentChip";
import { ChannelSettings } from "@/types";
import { updateChannel } from "@/app/services/action";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ChipProps {
  isValid: boolean;
  content: string;
}

function AddMemberDialog() {
  const { organization, isLoaded } = useOrganization();
  const { currentChannel, setPartialDataChannel } = useChannelStore(
    (state) => ({
      currentChannel: state.currentChannel,
      setPartialDataChannel: state.setPartialDataChannel,
    })
  );
  const { user } = useUser();
  const [inputValue, setInputValue] = useState<string>("");
  const [chips, setChips] = useState<ChipProps[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isSwich, setIsSwitch] = useState<boolean>(
    !!currentChannel.settings?.autoAddNewMember
  );

  const onRemoveChip = (chipName: string) => {
    setChips((pre) => pre.filter((c) => c.content !== chipName));
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isValidEmail = emailRegex.test(inputValue);
    if (e.key === "Enter" || e.key === " ") {
      setChips((pre) => [
        ...pre,
        {
          isValid: isValidEmail,
          content: inputValue,
        },
      ]);
      setInputValue("");
    }
  };

  const onAddMember = () => {
    if (!organization || !isLoaded) return;
    startTransition(async () => {
      for await (const chip of chips) {
        if (chip.isValid) {
          try {
            const payload: sendInvitationPayload = {
              workspaceId: organization.id,
              channelId: currentChannel._id,
              senderEmail: user?.emailAddresses[0].emailAddress as string,
              receiverEmail: chip.content.trim(),
              role: "org:member",
              senderId: user?.id as string,
            };
            await channelAPI.sendInvitation(payload);
          } catch (e) {
            console.log(e);
          }
        }
      }
      const settings: ChannelSettings = {
        ...currentChannel.settings,
        autoAddNewMember: isSwich,
      };
      if (isSwich !== currentChannel.settings?.autoAddNewMember) {
        try {
          const res: any = await updateChannel(currentChannel._id, {
            settings,
          });
          if (res.code === 1) {
            setPartialDataChannel({ settings });
          }
        } catch (e) {
          console.log(e);
        }
      }

      toast.success("Email sending successfully");
    });
  };

  const handleSwitch = async (e: boolean) => {
    setIsSwitch(e);
  };

  return (
    <CommonDialogContent
      title="Add people"
      footerButtonTitle="Done"
      onClick={
        chips.length > 0 ||
        isSwich !== !!currentChannel.settings?.autoAddNewMember
          ? onAddMember
          : undefined
      }
      isPending={isPending}
    >
      <Label
        className="pb-3 block text-[15px] text-text-primary"
        htmlFor="invite-people"
      >
        People ( press Enter or Space to confirm email address )
      </Label>
      <div
        className={cn(
          "relative bg-inherit flex flex-wrap gap-2 border border-border rounded-[4px] py-1 px-2 min-h-[42px]"
        )}
      >
        {chips.length > 0 &&
          chips.map((chip) => (
            <ContentChip
              key={chip.content}
              content={chip.content}
              onClick={() => onRemoveChip(chip.content)}
              isValid={chip.isValid}
            />
          ))}

        {/* FLex input */}
        <Input
          className={cn(
            "border-transparent min-w-[50px] flex-1 h-8 outline-none text-base",
            "focus-visible:ring-offset-0 focus-visible:ring-0"
          )}
          value={inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={chips.length > 0 ? "" : "Enter a name or email"}
        />
      </div>
      <div className="relative mt-6 p-3 border border-[#1D9BD1] rounded-[6px]">
        <span className="text-xs text-[#1D9BD1] absolute bg-dark-secondary left-4 top-0 -translate-y-1/2 px-2">
          Only admins can see this setting
        </span>
        <div className="flex gap-2 items-center">
          <Switch
            checked={isSwich}
            onCheckedChange={handleSwitch}
            className="data-[state=unchecked]:bg-dark-secondary border-border data-[state=checked]:border-transparent"
          />
          <span className="text-[15px] text-text-primary">
            Add anyone who joins {organization?.name}
          </span>
        </div>
      </div>
    </CommonDialogContent>
  );
}

export default AddMemberDialog;
