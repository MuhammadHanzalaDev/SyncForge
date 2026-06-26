import prisma from "@/lib/prisma";
import { createCallSchema } from "./call.schema";
import { CallType } from "./call.types";

async function createCall(input: {
  id: string;
  roomId: string;
  initiatorId: string;
  type: CallType;
  participantIds: string[];
}) {
  const parsed = createCallSchema.parse(input);

  return prisma.call.create({
    data: {
      id: parsed.id,
      roomId: parsed.roomId,
      initiatorId: parsed.initiatorId,
      type: parsed.type,
      status: "RINGING",
      participants: {
        create: parsed.participantIds.map((userId) => ({ userId })),
      },
    },
  });
}

async function markActive(callId: string, userId: string) {
  // mark call active + record this participant joined
  await prisma.$transaction([
    prisma.call.update({
      where: { id: callId },
      data: { status: "ACTIVE", startedAt: new Date() },
    }),
    prisma.callParticipant.update({
      where: { callId_userId: { callId, userId } },
      data: { joinedAt: new Date() },
    }),
  ]);
}

async function markEnded(
  callId: string,
  status: "ENDED" | "DECLINED" | "MISSED",
) {
  return prisma.call.update({
    where: { id: callId },
    data: { status, endedAt: new Date() },
  });
}

export { createCall, markActive, markEnded };
