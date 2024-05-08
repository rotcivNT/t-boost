import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

function ConversationSidebarButton({ title, icon, href }: IProps) {
  const pathName = usePathname();
  const isActive = href && pathName.includes(href);
  // console.table({ title, href, pathName, isActive });
  return (
    <Link
      href={href}
      // Active ->  bg-[rgba(50,53,56,1)]
      className={cn(
        "flex items-center px-3 gap-2 text-sm text-[#B9BABD] h-7 w-full hover:bg-[rgba(33,36,40,0.4)] rounded-[5px]",
        `${isActive ? "bg-[rgba(50,53,56,1)] hover:bg-[rgba(50,53,56,1)]" : ""}`
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

export default ConversationSidebarButton;