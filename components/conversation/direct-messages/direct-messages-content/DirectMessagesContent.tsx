"use client";

import { ConversationApiKeys } from "@/app/apis/api-key/conversation-api.key";
import { getDCById } from "@/app/services/channel.action";
import { useDirectMessageStore } from "@/app/store/direct-message.store";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import DCMessageWrapper from "./DCMessageWrapper";
import DMContentHeader from "./header/DMContentHeader";
import Profile from "@/components/profile/Profile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface IProps {
  cid: string;
}
export default function DirectMessagesContent({ cid }: IProps) {
  const { setCurrentDMUser, isOpenProfile } = useDirectMessageStore(
    (state) => ({
      setCurrentDMUser: state.setCurrentDMUser,
      isOpenProfile: state.isOpenProfile,
    })
  );
  const auth = useAuth();
  const { data, isLoading } = useSWR(
    ConversationApiKeys.getDCByIdKey(cid),
    getDCById,
    {
      onSuccess: (data) => {
        if (data) {
          const receiver = data[0].membersInfo.find(
            (member) => member.clerkUserId !== auth.userId
          );
          if (receiver) setCurrentDMUser(receiver);
        }
      },
    }
  );
  console.log(data);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border-none"
    >
      <ResizablePanel defaultSize={65}>
        <div className="flex flex-1 flex-col h-full">
          <DMContentHeader />
          <Separator />
          <div className="flex-1 h-[calc(100%-126px)]">
            {/* <DCMessageWrapper /> */}
          </div>
        </div>
      </ResizablePanel>

      {auth.isSignedIn && isOpenProfile && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={35}>
            <div>
              <Profile clerkUserId={auth.userId} />
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
