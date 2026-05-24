interface JoinDirectRoom {
  workspaceId: string;
  targetUserId: string;
}

interface JoinRoom {
  workspaceId: string;
  roomId: string;
}

interface getRoomsRequest {
  Params: {
    workspaceId: string;
  };
}

type RoomType = "PUBLIC" | "PRIVATE" | "DIRECT";

interface CreateRoomData {
  workspaceId: string;
  name: string;
  type: RoomType;
  memberIds?: string[];
}

export type {
  JoinDirectRoom,
  getRoomsRequest,
  CreateRoomData,
  RoomType,
  JoinRoom,
};
