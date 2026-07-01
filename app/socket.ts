// socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export function createSocket(token: string): Socket {
  return io(SOCKET_URL, { auth: { token } });
}
