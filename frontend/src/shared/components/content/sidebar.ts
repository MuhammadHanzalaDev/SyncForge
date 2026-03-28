import { BookOpen, Settings2, MessageCircle, UsersRound } from "lucide-react";

const sidebarItems = [
  {
    label: "Chats",
    icon: MessageCircle,
    children: [],
    isIcons: true,
  },
  {
    label: "Rooms",
    icon: UsersRound,
    children: [],
    isIcons: true,
  },
  {
    label: "Documentation",
    icon: BookOpen,
    children: [],
    isIcons: false,
  },
  {
    label: "Settings",
    icon: Settings2,
    // no children
  },
];

export default sidebarItems;
