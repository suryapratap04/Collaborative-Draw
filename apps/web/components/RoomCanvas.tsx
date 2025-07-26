"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useSelector } from "react-redux";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  //@ts-ignore
  let tokenVal = useSelector((state) => state.user.token);
  if (!tokenVal) {
    tokenVal =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${tokenVal}`);

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId,
      });
      // console.log(data);
      ws.send(data);
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
