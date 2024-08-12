"use client";
import { useDirectMessageStore } from "@/app/store/direct-message.store";
import BookmarkWrapper from "@/components/bookmark/BookmarkWrapper";
import HuddleButton from "@/components/conversation/channels/channel-content/header/HuddleButton";
import { ConversationType } from "@/types/conversation.type";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DMContentHeader() {
  const currentDMUser = useDirectMessageStore((state) => state.currentDMUser);
  const pathName = usePathname();
  const { user } = useUser();
  console.log(currentDMUser, user);

  return (
    currentDMUser &&
    user && (
      <div>
        <div className="h-[50px] pl-5 pr-3 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {currentDMUser && (
              <Image
                src={currentDMUser.imageUrl}
                alt={currentDMUser.fullName}
                width={24}
                height={24}
                className="size-6 rounded-[4px] object-cover"
              />
            )}
            <Link
              href={"#"}
              className="hover:bg-[rgba(255,255,255,0.06)] cursor-pointer py-[2px] px-2 rounded-[6px] text-lg font-bold"
            >
              {currentDMUser.fullName}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <HuddleButton
              receiverId={pathName.split("/home/")[1].slice(1)}
              memberIds={[currentDMUser.clerkUserId, user.id]}
            />
          </div>
        </div>
        <div className="pl-5 pr-3 h-9 flex items-center">
          <BookmarkWrapper type={ConversationType.DIRECT_MESSAGE} />
        </div>
      </div>
    )
  );
}
