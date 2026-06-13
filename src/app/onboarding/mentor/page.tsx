import Link from "next/link";
import { completeMentorOnboarding } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MentorOnboardingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="section-label">Mentor onboarding</p>
      <h1 className="font-display mt-2 text-3xl tracking-tight">Share your expertise</h1>
      <p className="mt-2 text-muted-foreground">
        You&apos;re joining 200+ engineers helping the next generation. Complete your application next.
      </p>
      <Card className="card-elevated mt-8">
        <CardContent className="space-y-4 p-6">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>✓ Set your own monthly rate</li>
            <li>✓ Free intro calls to match with mentees</li>
            <li>✓ Host live Q&A sessions for the community</li>
            <li>✓ Profile reviewed within 48 hours</li>
          </ul>
          <form action={completeMentorOnboarding}>
            <Button type="submit" variant="accent" className="w-full">Continue to application →</Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            Already applied? <Link href="/mentor" className="text-accent hover:underline">Go to mentor panel</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
