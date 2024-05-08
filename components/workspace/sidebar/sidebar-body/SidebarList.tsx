import {
  Bell,
  Bookmark,
  ContactRound,
  Files,
  Headset,
  Home,
  MessageCircle,
  Play,
  Tv,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

export const iconStyles = {
  width: 20,
  height: 20,
  strokeWidth: 1.5,
  color: "#F8F8F8",
};

const sidebarData = [
  {
    title: "Home",
    icon: <Home {...iconStyles} />,
  },
  {
    title: "Message",
    icon: <MessageCircle {...iconStyles} />,
  },
  {
    title: "Activity",
    icon: <Bell {...iconStyles} />,
  },
  {
    title: "Later",
    icon: <Bookmark {...iconStyles} />,
  },
  {
    title: "Automations",
    icon: <Play {...iconStyles} />,
  },
  {
    title: "Huddles",
    icon: <Headset {...iconStyles} />,
  },
  {
    title: "Files",
    icon: <Files {...iconStyles} />,
  },
  {
    title: "Channels",
    icon: <Tv {...iconStyles} />,
  },
  {
    title: "People",
    icon: <ContactRound {...iconStyles} />,
  },
];

function SidebarList() {
  return (
    <div className="flex flex-col gap-3 items-center pt-3">
      {sidebarData.map((sidebarItem) => (
        <SidebarItem
          key={sidebarItem.title}
          icon={sidebarItem.icon}
          title={sidebarItem.title}
        />
      ))}
    </div>
  );
}

export default SidebarList;
