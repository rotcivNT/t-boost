"use client";

import { FindBy, GetUserPayload } from "@/app/apis/api-payload/auth.payload";
import { getUser } from "@/app/services/auth.action";
import useSWR from "swr";
import ProfileHeader from "./ProfileHeader";

interface IProps {
  clerkUserId: string;
}

export default function Profile({ clerkUserId }: IProps) {
  const payload: GetUserPayload = {
    field: clerkUserId,
    findBy: FindBy.CLERK_USER_ID,
  };
  const { data: user } = useSWR(["get-user", payload], ([_, payload]) =>
    getUser(payload)
  );
  return (
    user && (
      <div>
        <ProfileHeader user={user[0]} />
      </div>
    )
  );
}
