import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LiveSessionForm } from "@/components/live/LiveSessionForm";

export default async function NewLivePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/live/new");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <LiveSessionForm />
    </div>
  );
}
