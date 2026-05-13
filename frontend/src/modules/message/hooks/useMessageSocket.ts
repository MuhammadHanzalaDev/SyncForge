import useSocketEvent from "@/shared/hooks/useSocketEvent";
import {
  MessageReactionEventPayload,
  MessageStatus,
  NewMessage,
} from "../message.types";
import { useQueryClient } from "@tanstack/react-query";
import {
  addMessage,
  updateMessageReaction,
  updateMessageStatus,
} from "../message.cache";
import { usePersonalInfo } from "@/modules/user/user.query";
import useRoomStore from "@/modules/room/room.store";

export default function useMessageSocket() {
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();
  const activeRoomId = useRoomStore((state) => state.roomId);

  const handleNewMessage = ({ message, roomId }: NewMessage) => {
    console.log("new message received: ", message);

    addMessage(queryClient, roomId, message, {
      currentUserId: personalInfo?.id,
      activeRoomId: activeRoomId,
    });
  };

  const handleMessageRead = ({
    messageId,
    status,
    roomId,
  }: {
    messageId: string;
    status: MessageStatus;
    roomId: string;
  }) => {
    console.log("new message read: ", { messageId, status, roomId });

    updateMessageStatus(queryClient, roomId, messageId, status);
  };

  const handleMessageReaction = (data: MessageReactionEventPayload) => {
    console.log("new message reaction: ", data);

    updateMessageReaction(queryClient, data);
  };

  // events
  useSocketEvent("message:new", handleNewMessage);
  useSocketEvent("message:read", handleMessageRead);
  useSocketEvent("message:reaction", handleMessageReaction);
}
