import { createRoom, findRoom } from "./room.repository";

const joinDirectRoomService = async (
  workspaceId: string,
  targetUserId: string,
  currentUserId: string,
) => {
  const sorted = [currentUserId, targetUserId].sort();
  const uniqueKey = `${workspaceId}_${sorted[0]}_${sorted[1]}`;

  let room = await findRoom({ uniqueKey });

  if (!room) {
    room = await createRoom({
      workspaceId,
      type: "DIRECT",
      uniqueKey,
      name: "direct",
      roomMembers: {
        create: [{ userId: currentUserId }, { userId: targetUserId }],
      },
    });
  }

  return room.id;
};

export { joinDirectRoomService };
