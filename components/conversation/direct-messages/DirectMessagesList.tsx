"use client";
import { GetDirectConversation } from "@/app/apis/api-payload/conversation.payload";
import { getAllDCByUser } from "@/app/services/channel.action";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo } from "react";
import useSWR from "swr";
import { ChannelLoading } from "../channels/Channels";
import ConversationSidebarButton from "../ConversationSidebarButton";
import ConversationSidebarItem from "../ConversationSidebarItem";
const CreateButton = dynamic(() => import("../CreateButton"), { ssr: false });

function DirectMessagesList() {
  const auth = useAuth();
  const payload: GetDirectConversation = useMemo(() => {
    if (!auth.isSignedIn)
      return {
        memberClerkUserId: "",
        workspaceId: "",
      };
    return {
      memberClerkUserId: auth.userId,
      workspaceId: auth.orgId as string,
    };
  }, [auth]);
  const { data, isLoading } = useSWR(
    ["get-direct-conversation", payload],
    ([_, payload]) => getAllDCByUser(payload)
  );

  return isLoading ? (
    <>
      <ChannelLoading />
      <ChannelLoading />
      <ChannelLoading />
      <ChannelLoading />
    </>
  ) : (
    data && (
      <ConversationSidebarItem title="Direct messages">
        {data.map((item) => {
          const receiver =
            item.membersInfo[0].clerkUserId === auth.userId
              ? item.membersInfo[1]
              : item.membersInfo[0];
          return (
            <ConversationSidebarButton
              key={item._id}
              title={receiver.fullName}
              href={`/workspace/${auth.orgId}/home/D${item._id}`}
              icon={
                <Image
                  alt=""
                  src={receiver.imageUrl}
                  width={20}
                  height={20}
                  className="rounded-[5px] relative left-[-2px]"
                />
              }
            />
          );
        })}
      </ConversationSidebarItem>
    )
  );
}

export default DirectMessagesList;
