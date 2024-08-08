"use client";
import { getAllChannelsById } from "@/app/services/action";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import ChannelTaskListSearch from "./ChannelTaskListSearch";
import { useChannelStore } from "@/app/store/channel.store";
import Task from "./Task";

export default function ChannelTaskList() {
  const auth = useAuth();
  const { data, isLoading } = useSWR(
    auth.isSignedIn ? `?workspaceId=${auth.orgId}&userId=${auth.userId}` : null,
    getAllChannelsById
  );
  const { showTask, setShowTask } = useChannelStore((state) => ({
    showTask: state.showTask,
    setShowTask: state.setShowTask,
  }));

  return showTask?.isShowTask ? (
    <Task />
  ) : (
    <div className="py-5 px-4">
      <h3 className="font-bold text-text-primary text-[18px]">All channels</h3>
      <ChannelTaskListSearch />
      <ul className="bg-dark-secondary divide-y border rounded-[10px] list-none">
        {data &&
          data.map((item) => (
            <li
              onClick={() =>
                setShowTask({ channelId: item._id, isShowTask: true })
              }
              key={item._id}
              className="py-5 px-4 cursor-pointer space-y-2"
            >
              <p className="font-bold text-sm text-text-primary">
                # {item.name}
              </p>
              <p className="text-[13px] text-text-secondary">
                {item.members.length} members
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
