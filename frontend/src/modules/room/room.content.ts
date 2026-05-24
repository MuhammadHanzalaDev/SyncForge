import { QuickMessageReactions } from "../message/message.types";

const QUICK_REACTIONS: QuickMessageReactions[] = ["👍", "❤️", "😂", "😮"];

const roomTypeOptions = [
  {
    label: "Public (All workspace members)",
    value: "PUBLIC",
  },
  {
    label: "Private (Select specific members)",
    value: "PRIVATE",
  },
];

export { QUICK_REACTIONS, roomTypeOptions };
