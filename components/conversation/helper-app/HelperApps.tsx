import Image from "next/image";
import ConversationSidebarButton from "../ConversationSidebarButton";
import ConversationSidebarItem from "../ConversationSidebarItem";
import dynamic from "next/dynamic";
const CreateButton = dynamic(() => import("../CreateButton"), { ssr: false });

function HelperApps() {
  return (
    <ConversationSidebarItem title="Apps">
      <ConversationSidebarButton
        title="TBoost bot"
        href=""
        icon={
          <Image
            alt=""
            src="https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWmxZaFVQY3N1a2tNZ2ZWSXBxVHNKV3JZcWoiLCJyaWQiOiJ1c2VyXzJabG5NY1B4Y2ZzSFBNUElaQUhDNTVkVlBaNiIsImluaXRpYWxzIjoiVFYifQ?width=80"
            width={20}
            height={20}
            className="rounded-[5px] relative left-[-2px]"
          />
        }
      />
      <CreateButton title="Add apps" />
    </ConversationSidebarItem>
  );
}

export default HelperApps;
