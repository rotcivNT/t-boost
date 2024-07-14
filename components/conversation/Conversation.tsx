/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { pusher } from "@/configs/pusher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSWRConfig } from "swr";

function Conversation() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const { mutate } = useSWRConfig();
  useEffect(() => {
    if (!user?.id) return;
    const handleOutGroup = (data: any) => {
      // Send to user who was deleted
      console.log("REMOVED DATA");

      mutate(`?workspaceId=${organization?.id}&userId=${user?.id}`);
    };
    const userEvent = pusher.subscribe(user?.id as string);
    userEvent.bind("remove-user", handleOutGroup);
    return () => {
      userEvent.unbind("remove-user", handleOutGroup);
    };
  }, [user]);
  return <div>a</div>;
}

export default Conversation;
