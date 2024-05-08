import { Button } from "@/components/ui/button";
import {
  LegacyRef,
  MutableRefObject,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { createChannel } from "@/app/services/action";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

interface IProps {
  title: string;
  onClick?: any;
}

enum STEP {
  STEP_1 = 1,
  STEP_2 = 2,
}

enum TYPE_CHANGE_STEP {
  NEXT = "next",
  BACK = "back",
}

interface Step2IProps {
  setIsPublic: (value: boolean) => void;
  isPublic: boolean;
}

const AddChannelStep2Content = ({ setIsPublic, isPublic }: Step2IProps) => {
  const onChange = (e: any) => {
    e.target.value === "public" ? setIsPublic(true) : setIsPublic(false);
  };
  return (
    <RadioGroup
      onClick={onChange}
      defaultValue={isPublic ? "public" : "private"}
      className="h-[87px]"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="public" id="r1" className="size-[13px]" />
        <Label
          htmlFor="r1"
          className="text-[15px] text-text-primary cursor-pointer"
        >
          Public - anyone in Dev
        </Label>
      </div>
      <div className="flex space-x-2">
        <RadioGroupItem value="private" id="r2" className="size-[13px]" />
        <Label
          htmlFor="r2"
          className="flex flex-col text-[15px] text-text-primary cursor-pointer"
        >
          <span>Private - Only specific people</span>
          <span className="text-[#ABABAD] font-[400]">
            Can only be viewed or joined by invitation
          </span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export const AddChannelModal = () => {
  const [channelName, setChannelname] = useState("");
  const [step, setStep] = useState<STEP>(STEP.STEP_1);
  const [isPublic, setIsPublic] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const { organization } = useOrganization();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const closeButtonRef = useRef<any>(null);

  const onChangeStep = (type: TYPE_CHANGE_STEP) => {
    type === TYPE_CHANGE_STEP.NEXT
      ? setStep(STEP.STEP_2)
      : setStep(STEP.STEP_1);
  };

  const onCreate = () => {
    const payload = {
      name: channelName,
      isPublic,
      creatorID: user?.id,
      workspaceID: organization?.id,
      members: [user?.id],
    };
    startTransition(async () => {
      try {
        const channel = await createChannel(payload);
        mutate(
          `?workspaceID=${channel.workspaceID}&creatorID=${channel.creatorID}`
        );
        closeButtonRef.current.click();
        router.push(`/workspace/${channel.workspaceID}/home/C/${channel._id}`);
      } catch (e) {}
    });
  };

  return (
    <>
      <DialogClose hidden ref={closeButtonRef} />
      <DialogHeader className="text-left">
        <DialogTitle className="pb-3 text-lg">
          <span>Create a channel</span>
          <p className="text-[13px] text-[#E8E8E8B3] flex items-center">
            <span className="w-4">
              {isPublic ? (
                "#"
              ) : (
                <LockKeyhole size={13} color="#E8E8E8B3" strokeWidth={1.5} />
              )}
            </span>
            <span>{channelName}</span>
          </p>
        </DialogTitle>
        <DialogDescription className="text-[15px] text-text-primary">
          {step === STEP.STEP_1 ? "Name" : "Visibility"}
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        {step === STEP.STEP_2 ? (
          <AddChannelStep2Content
            setIsPublic={setIsPublic}
            isPublic={isPublic}
          />
        ) : (
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              placeholder="e.g. plan-budget"
              value={channelName}
              onChange={(e) => setChannelname(e.target.value)}
            />

            <DialogDescription className="text-[13px] text-text-primary">
              Channels are where conversations happen around a topic. Use a name
              that is easy to find and understand.
            </DialogDescription>
          </div>
        )}
      </div>
      <DialogFooter className="flex-row justify-between items-center">
        <span className="text-[15px] text-[#ABABAD]">Step {step} of 2</span>
        <div className="flex items-center">
          {step === STEP.STEP_2 && (
            <Button
              onClick={() => onChangeStep(TYPE_CHANGE_STEP.BACK)}
              disabled={channelName === ""}
              variant="outline"
              className="w-20 mr-3"
            >
              Back
            </Button>
          )}
          {step === STEP.STEP_1 ? (
            <Button
              onClick={() => onChangeStep(TYPE_CHANGE_STEP.NEXT)}
              disabled={channelName === ""}
              variant="default"
              className="bg-[#007A5A] text-white font-[500] w-20 hover:opacity-90 hover:bg-[#007A5A] hover:text-white 
            hover:font-[500]"
            >
              Next
            </Button>
          ) : (
            <Button
              disabled={channelName === ""}
              onClick={() => onCreate()}
              variant="default"
              className="bg-[#007A5A] text-white font-[500] w-20 hover:opacity-90 hover:bg-[#007A5A] hover:text-white 
            hover:font-[500]"
            >
              {isPending ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin z-10 relative"
                />
              ) : (
                "Create"
              )}
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
};
