import { Gift, Layers, MessageCircle, Phone, Star, Users } from "lucide-react";
import { valueProps } from "@/data/valueProps";

const icons = {
  users: Users,
  layers: Layers,
  gift: Gift,
  message: MessageCircle,
  phone: Phone,
  star: Star,
};

export function ValueProps() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            At your fingertips: a dedicated engineering mentor
          </h2>
          <p className="mt-4 text-slate-600">
            Want to break into oil & gas? Pass the FE or PE exam? Land your first engineering role?
            Work smart with an online mentor who offers expert advice matched to your goals.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((prop) => {
            const Icon = icons[prop.icon];
            return (
              <div key={prop.label} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-800">{prop.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
