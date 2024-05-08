"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IProps {
  icon: React.ReactNode;
  title: string;
}

function SidebarItem({ icon, title }: IProps) {
  const { orgId } = useAuth();
  const pathName = usePathname();
  const isActive = pathName.includes(title.toLocaleLowerCase());
  return (
    <Link
      href={`/workspace/${orgId}/${title.toLowerCase()}`}
      className="flex flex-col items-center gap-[2px]"
    >
      <Button
        variant="icon"
        size="icon"
        className={cn(
          "flex flex-col",
          "lg:size-9",
          `${isActive ? "bg-[rgba(248,248,248,0.25)]" : ""}`
        )}
      >
        {icon}
      </Button>
      <span className="text-[11px] text-[#F8F8F8]">{title}</span>
    </Link>
  );
}

export default SidebarItem;
