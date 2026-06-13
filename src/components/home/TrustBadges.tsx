import Link from "next/link";
import { Gift, Shield, Unlock } from "lucide-react";

const badges = [
  { icon: Gift, title: "Free Trial", description: "Get a free trial with every mentor" },
  { icon: Unlock, title: "No Strings", description: "Cancelling is simple and can be done anytime" },
  { icon: Shield, title: "Fully Vetted", description: "We demand the highest quality from our mentors" },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <badge.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">{badge.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/mentors"
            className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Find my mentor
          </Link>
          <Link
            href="/apply"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50"
          >
            Become a mentor
          </Link>
        </div>
      </div>
    </section>
  );
}
