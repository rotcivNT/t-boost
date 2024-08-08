import { User } from "@/types/user.type";
import { Button } from "../ui/button";
import { Copy, Headset, Mail, MessageCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";

interface IProps {
  user: User;
}
export default function ProfileSection({ user }: IProps) {
  return (
    <div className="p-4">
      <p className="font-bold text-text-primary text-[20px]">{user.fullName}</p>
      <div className="flex gap-3 my-5">
        <Button variant="myCustomOutline" className="h-9 w-1/2 gap-2">
          <MessageCircle size={20} />
          Message
        </Button>
        <Button variant="myCustomOutline" className="h-9 w-1/2 gap-2">
          <Headset size={20} />
          Huddle
        </Button>
      </div>
      <Separator className="w-full" />
      {/* Contact infomation */}
      <div className="p-4">
        <h3 className="mb-4 font-bold text-text-primary">Contact infomation</h3>
        <div className="flex items-center gap-3">
          <Mail color="#E8E8E8B3" size={20} />
          <p className="text-xs">
            <span className="text-[#E8E8E8B3] font-bold block mb-[2px]">
              Email address
            </span>
            <Button variant="link" className="text-[#1d9bd1] p-0 h-auto">
              <Link href={`mailto:${user.email}`}>{user.email}</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
