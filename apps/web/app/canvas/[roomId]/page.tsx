import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({ params }: any) {
  const roomId = await params?.roomId;
  // console.log("CanvasPage roomId:", roomId);
  //   // console.log("CanvasPage params:", params);
  if (!params || !params.roomId) {
    console.error("Room ID is missing in the parameters.");
    return <div>Error: Room ID is required.</div>;
  }
  return <RoomCanvas roomId={params.roomId as string} />;
}
