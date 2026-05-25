import { QueryClient } from "@tanstack/react-query";
import { ChatsAndRoomsData, Room } from "./room.types";

const addRoomToCache = ({
  queryClient,
  workspaceId,
  room,
}: {
  queryClient: QueryClient;
  workspaceId: string;
  room: Room;
}) => {
  queryClient.setQueryData<ChatsAndRoomsData>(
    ["chatsRooms", workspaceId],
    (oldData) => {
      // if cache does not exist yet
      if (!oldData) {
        return {
          chats: [],
          rooms: [room],
        };
      }

      return {
        ...oldData,
        rooms: [room, ...oldData.rooms],
      };
    },
  );
};

export { addRoomToCache };
