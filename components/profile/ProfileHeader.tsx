"use client";
import { User } from "@/types/user.type";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import ProfileSection from "./ProfileSection";
import { useDirectMessageStore } from "@/app/store/direct-message.store";

interface IProps {
  user: User;
}

export default function ProfileHeader({ user }: IProps) {
  const setIsOpenProfile = useDirectMessageStore(
    (state) => state.setIsOpenProfile
  );
  return (
    <div>
      <div className="px-4 h-12 flex items-center justify-between gap-2">
        <p className="font-bold text-text-primary">Profile</p>
        <Button
          onClick={() => setIsOpenProfile(false)}
          variant="icon"
          size="icon"
          className="size-9 hover:bg-[rgba(255,255,255,0.06)] rounded-[8px]"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Image */}
      <div className="w-full max-w-[288px] p-4 pb-0 mx-auto">
        <div className="relative w-full pt-[100%] rounded-[8px] overflow-hidden">
          <Image
            src={user.imageUrl}
            fill
            alt={user.fullName}
            className="object-cover"
          />
        </div>
      </div>

      <ProfileSection user={user} />
    </div>
  );
}
