import { LiveSessionForm } from "@/components/live/LiveSessionForm";

export default function MentorNewLivePage() {
  return (
    <LiveSessionForm
      title="Schedule live session"
      next="/mentor/live/new"
      defaultCallType="group_qa"
    />
  );
}
