import useSocketEvent from "@/shared/hooks/useSocketEvent";
import { MessageStatus, NewMessage } from "../message.types";
import { useQueryClient } from "@tanstack/react-query";
import { addMessage, updateMessageStatus } from "../message.cache";

export default function useMessageSocket() {
  const queryClient = useQueryClient();

  const handleNewMessage = ({ message, roomId }: NewMessage) => {
    console.log("new message received: ", message);

    addMessage(queryClient, roomId, message);
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

  // events
  useSocketEvent("message:new", handleNewMessage);
  useSocketEvent("message:read", handleMessageRead);
}
