"use client";
import { FindBy, GetUserPayload } from "@/app/apis/api-payload/auth.payload";
import { getUser } from "@/app/services/auth.action";
import { useChannelStore } from "@/app/store/channel.store";
import AddMemberDialog from "@/components/dialog-content/add-member-dialog/AddMemberDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import useSWR from "swr";
import MemberButton, { MemberButtonLoading } from "./MemberButton";
import Search from "./Search";
import { User } from "@/types/user.type";

function MemberContent() {
  const channel = useChannelStore((state) => state.currentChannel);
  const [isPending, startTransition] = useTransition();
  const payload: GetUserPayload = {
    field: channel.members.map((member) => member.userID),
    findBy: FindBy.CLERK_USER_ID,
  };
  const { data: membersInfo } = useSWR(["get-user", payload], ([_, payload]) =>
    getUser(payload)
  );
  return (
    <Dialog>
      <div>
        <Search />
        <div className="mt-4">
          <DialogTrigger className="w-full">
            <MemberButton
              name="Add people"
              leftIcon={
                <UserRoundPlus
                  {...iconStyles}
                  strokeWidth={2}
                  color="#1D9BD1"
                />
              }
            />
          </DialogTrigger>
          {isPending ? (
            <MemberButtonLoading />
          ) : (
            membersInfo &&
            membersInfo.map((member: User) => (
              <MemberButton
                name={`${member.firstName} ${member.lastName}`}
                key={member.clerkUserId}
                userId={member.clerkUserId}
                creatorId={channel.creatorID}
                channelId={channel._id}
                leftIcon={
                  <Image
                    src={member.imageUrl}
                    alt="profile"
                    className="w-9 h-9 rounded-[4px] object-cover"
                    width={36}
                    height={36}
                  />
                }
              />
            ))
          )}
        </div>
      </div>
      <DialogContent className="bg-dark-secondary rounded-[8px]">
        <AddMemberDialog />
      </DialogContent>
    </Dialog>
  );
}

export default MemberContent;
