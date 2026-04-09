import type { Member } from "./room.types";
import { Message } from "../message/message.types";

const DUMMY_MEMBERS: Member[] = [
  { id: "1", name: "Alex Johnson", status: "ONLINE", role: "admin" },
  { id: "2", name: "Sarah Chen", status: "ONLINE", role: "member" },
  { id: "3", name: "Marcus Williams", status: "AWAY", role: "member" },
  { id: "4", name: "Priya Patel", status: "BUSY", role: "member" },
  { id: "5", name: "Tom Eriksson", status: "OFFLINE", role: "member" },
  { id: "6", name: "Layla Hassan", status: "ONLINE", role: "member" },
];

const DUMMY_MESSAGES: Message[] = [
  {
    id: "m1",
    senderId: "2",
    senderName: "Sarah Chen",
    content:
      "Hey everyone! Just pushed the latest design updates to Figma. Can someone review?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: [{ emoji: "👀", count: 3, reacted: false }],
  },
  {
    id: "m2",
    senderId: "3",
    senderName: "Marcus Williams",
    content: "On it! Give me 10 minutes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
    reactions: [{ emoji: "👍", count: 2, reacted: true }],
  },
  {
    id: "m3",
    senderId: "1",
    senderName: "Alex Johnson",
    content:
      "Reviewed! Left a few comments. The onboarding flow looks great — just one concern about mobile breakpoints on the third screen.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    replyTo: {
      id: "m1",
      senderName: "Sarah Chen",
      content: "Hey everyone! Just pushed the latest design updates...",
    },
  },
  {
    id: "m4",
    senderId: "me",
    senderName: "You",
    content:
      "I can take a look at those breakpoints. Do you have the specific screen sizes we're targeting?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: "read",
    isOwn: true,
  },
  {
    id: "m5",
    senderId: "2",
    senderName: "Sarah Chen",
    content:
      "320px, 375px, 414px for mobile. We're also targeting 768px for tablet. I've noted it all in the Figma file under the 'Specs' page.",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    reactions: [{ emoji: "✅", count: 1, reacted: false }],
  },
  {
    id: "m6",
    senderId: "4",
    senderName: "Priya Patel",
    content:
      "Quick heads up — the standup's been moved to 3pm today. Just got the calendar invite.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "m7",
    senderId: "me",
    senderName: "You",
    content: "Got it, thanks Priya! Will be there.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: "delivered",
    isOwn: true,
  },
  {
    id: "m8",
    senderId: "6",
    senderName: "Layla Hassan",
    content: "Same here 👋",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    reactions: [{ emoji: "🙌", count: 2, reacted: false }],
  },
];

const DM_MESSAGES: Message[] = [
  {
    id: "d1",
    senderId: "2",
    senderName: "Sarah Chen",
    content: "Hey! Do you have a minute to sync on the auth flow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "d2",
    senderId: "me",
    senderName: "You",
    content: "Sure, what's up?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.9),
    status: "read",
    isOwn: true,
  },
  {
    id: "d3",
    senderId: "2",
    senderName: "Sarah Chen",
    content:
      "I'm trying to figure out where the token refresh logic should live. Right now it's in the interceptor but it feels like it belongs in a dedicated service.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.8),
  },
  {
    id: "d4",
    senderId: "me",
    senderName: "You",
    content:
      "Yeah agreed. Move the refresh logic into an AuthService and have the interceptor call into it.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    status: "read",
    isOwn: true,
  },
  {
    id: "d5",
    senderId: "2",
    senderName: "Sarah Chen",
    content:
      "That makes sense! So the interceptor catches the 401, delegates to AuthService.refreshToken(), and retries?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.4),
    reactions: [{ emoji: "💡", count: 1, reacted: false }],
  },
  {
    id: "d6",
    senderId: "me",
    senderName: "You",
    content:
      "Exactly. And handle the case where refresh fails — clear the session and redirect to login.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "read",
    isOwn: true,
  },
  {
    id: "d7",
    senderId: "2",
    senderName: "Sarah Chen",
    content: "Perfect, I'll refactor it now. Thanks! 🙌",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    reactions: [{ emoji: "🎉", count: 1, reacted: true }],
  },
];

export { DUMMY_MEMBERS, DUMMY_MESSAGES, DM_MESSAGES };
