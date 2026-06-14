import { LiveRoomChrome } from "@/components/live/LiveRoomChrome";

export default function LiveRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LiveRoomChrome />
      {children}
    </>
  );
}
