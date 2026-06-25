import { Gift, Shield, Unlock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const badges = [
  { icon: Gift, title: "Free Trial", description: "Get a free trial with every mentor" },
  { icon: Unlock, title: "No Strings", description: "Cancelling is simple and can be done anytime" },
  { icon: Shield, title: "Fully Vetted", description: "We demand the highest quality from our mentors" },
];

export function TrustBadges() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-oil-gas-orange/10 text-oil-gas-orange">
                <badge.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-semibold text-oil-gas-navy">{badge.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{badge.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/mentors" variant="default" size="lg">
            Find my mentor
          </ButtonLink>
          <ButtonLink href="/apply" variant="secondary" size="lg">
            Become a mentor
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
