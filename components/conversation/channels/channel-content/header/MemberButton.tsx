import { FindBy, GetUserPayload } from "@/app/apis/api-payload/auth.payload";
import { getUser } from "@/app/services/auth.action";
import { useChannelStore } from "@/app/store/channel.store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useSWR from "swr";
import ChannelDetails from "./channel-button/ChannelDetails";

const displayMemberCount = 3;

function MemberButton() {
  const channel = useChannelStore().currentChannel;
  const payload: GetUserPayload = {
    field: channel.members
      ?.slice(0, displayMemberCount - 1)
      .map((member) => member.userID),
    findBy: FindBy.CLERK_USER_ID,
  };
  const { data: membersData } = useSWR(["get-user", payload], ([_, payload]) =>
    getUser(payload)
  );

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="flex items-center justify-center h-7 rounded-[6px] border border-[#797c814d] p-1 hover:bg-[rgba(255,255,255,0.03)]">
              {membersData &&
                membersData.map((member, index) => (
                  <Image
                    key={member._id}
                    src={member.imageUrl}
                    alt={member.fullName}
                    width={20}
                    height={20}
                    className="rounded-[4px] size-5 relative object-cover"
                    style={{
                      zIndex: displayMemberCount - index,
                      left: -index * 8,
                    }}
                  />
                ))}
              <span
                className={cn(
                  "text-[13px] text-[#E8E8E8B3] font-[500] pr-[2px]",
                  {
                    "pl-[6px]": channel.members?.length === 1,
                  }
                )}
              >
                {channel.members?.length}
              </span>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View all members of this channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="bg-dark-primary border-border rounded-[8px] p-0">
        <ChannelDetails channel={channel} defaultTab="members" />
      </DialogContent>
    </Dialog>
  );
}

export default MemberButton;
