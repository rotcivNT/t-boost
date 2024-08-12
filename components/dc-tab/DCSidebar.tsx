"use client";
import { ListFilter, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import DCSearch from "./DCSearch";
import DCItem from "./DCItem";
import useSWR from "swr";
import { ConversationApiKeys } from "@/app/apis/api-key/conversation-api.key";
import { useAuth } from "@clerk/nextjs";
import { GetDirectConversation } from "@/app/apis/api-payload/conversation.payload";
import { useMemo, useState } from "react";
import { getAllDCByUser } from "@/app/services/channel.action";
import { DirectConversation } from "@/types/dc.type";

export default function DCSidebar() {
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
  const { data } = useSWR(
    ["get-direct-conversation", payload],
    ([_, payload]) => getAllDCByUser(payload),
    {
      onSuccess: (data) => {
        data && setResults(data);
      },
      refreshInterval: 1000,
    }
  );
  const [results, setResults] = useState<DirectConversation[]>([]);

  return (
    <div className="h-sidebar-height flex flex-col">
      <div className="flex items-center justify-between p-4">
        <span className="text-text-primary font-bold">Direct messages</span>
        <div className="flex items-center gap-4">
          <Button variant="icon" size="icon">
            <ListFilter
              width={20}
              height={20}
              color="#B9BABD"
              strokeWidth={1.5}
            />
          </Button>
          <Button variant="icon" size="icon">
            <SquarePen
              width={20}
              height={20}
              color="#B9BABD"
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>
      <div className="px-4">
        <DCSearch data={data || []} setResults={setResults} />
      </div>
      <Separator className="bg-[#3B3D42]" />
      <ScrollArea className="h-full">
        <div className="divide-y-[1px]">
          {results && results.map((dc) => <DCItem dc={dc} key={dc._id} />)}
        </div>
      </ScrollArea>
    </div>
  );
}
