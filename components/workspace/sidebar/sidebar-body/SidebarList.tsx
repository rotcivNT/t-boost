import {
  Bell,
  Bookmark,
  ContactRound,
  Files,
  Headset,
  Home,
  ListTodo,
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
    title: "Tasks",
    icon: <ListTodo {...iconStyles} />,
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
