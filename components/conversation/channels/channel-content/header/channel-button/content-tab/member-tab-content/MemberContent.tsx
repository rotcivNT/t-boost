"use client";
import { getUserInfo } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import AddMemberDialog from "@/components/dialog-content/add-member-dialog/AddMemberDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { iconStyles } from "@/components/workspace/sidebar/sidebar-body/SidebarList";
import { UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import MemberButton, { MemberButtonLoading } from "./MemberButton";
import Search from "./Search";
import { clerkClient } from "@/configs/clerkClient";

function MemberContent() {
  const channel = useChannelStore((state) => state.currentChannel);

  const [membersInfo, setMembersInfo] = useState<any>([] as any);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const fetchUser = async (userId: string) => {
      try {
        const resJson = await getUserInfo(clerkClient, userId);
        return JSON.parse(resJson as string);
      } catch (e) {
        console.log(e);
      }
    };
    if (channel) {
      startTransition(async () => {
        const membersInfo: any = [];
        for (const member of channel.members) {
          const userInfo = await fetchUser(member.userID);
          membersInfo.push(userInfo);
        }
        setMembersInfo(membersInfo);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

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
            membersInfo.length &&
            membersInfo.map((member: any) => (
              <MemberButton
                name={`${member.firstName} ${member.lastName}`}
                key={member.id}
                userId={member.id}
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
