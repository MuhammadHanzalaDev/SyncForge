import { Socket } from "socket.io";
import * as callService from "./call.service";
import { getIO } from "@/lib/socket";
import {
  CallActionPayload,
  CallInvitePayload,
  SignalPayload,
} from "./call.types";
import { socketHandler } from "@/utils/Error";

export function registerCallEvents(socket: Socket) {
  const io = getIO();
  const userId = socket.user?.userId;

  // Caller starts a call
  socket.on(
    "call:invite",
    socketHandler(async (payload: CallInvitePayload) => {
      console.log("call invire run: ", payload);
      // 1. Create DB record (RINGING)
      const call = await callService.createCall({
        id: payload.callId,
        roomId: payload.roomId,
        initiatorId: userId,
        type: payload.type,
        participantIds: [userId, payload.toUserId],
      });

      // 2. Ring the callee
      io.to(`user:${payload.toUserId}`).emit("call:incoming", {
        callId: call.id,
        roomId: payload.roomId,
        from: userId,
        type: payload.type,
      });
    }),
  );

  // SDP offer/answer relay — server does NOT inspect, just forwards
  socket.on("call:offer", (payload: SignalPayload) => {
    io.to(`user:${payload.toUserId}`).emit("call:offer", {
      callId: payload.callId,
      from: userId,
      data: payload.data,
    });
  });

  socket.on("call:answer", (payload: SignalPayload) => {
    io.to(`user:${payload.toUserId}`).emit("call:answer", {
      callId: payload.callId,
      from: userId,
      data: payload.data,
    });
  });

  // ICE candidates trickle — relay each one
  socket.on("call:ice-candidate", (payload: SignalPayload) => {
    io.to(`user:${payload.toUserId}`).emit("call:ice-candidate", {
      callId: payload.callId,
      from: userId,
      data: payload.data,
    });
  });

  // Callee accepted — mark active
  socket.on("call:accept", async (payload: CallActionPayload) => {
    await callService.markActive(payload.callId, userId);
    io.to(`user:${payload.toUserId}`).emit("call:accepted", {
      callId: payload.callId,
      from: userId,
    });
  });

  // Callee declined
  socket.on("call:reject", async (payload: CallActionPayload) => {
    await callService.markEnded(payload.callId, "DECLINED");
    io.to(`user:${payload.toUserId}`).emit("call:rejected", {
      callId: payload.callId,
      from: userId,
    });
  });

  // Either side hangs up
  socket.on("call:hangup", async (payload: CallActionPayload) => {
    await callService.markEnded(payload.callId, "ENDED");
    io.to(`user:${payload.toUserId}`).emit("call:hangup", {
      callId: payload.callId,
      from: userId,
    });
  });
}
