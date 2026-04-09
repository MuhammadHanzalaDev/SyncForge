interface JoinDirectRoom {
  workspaceId: string;
  targetUserId: string;
}

interface getRoomsRequest {
  Params: {
    workspaceId: string;
  };
}

export type { JoinDirectRoom, getRoomsRequest };
