"use client";

import { toast } from "sonner";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplyPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Mentor applications are coming soon!");
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Become a mentor</h1>
        <p className="mt-2 text-slate-600">
          Share your engineering expertise with the next generation. Applications are reviewed manually.
        </p>
        <Card className="mt-8">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <Input required placeholder="Jane Smith" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input required type="email" placeholder="jane@example.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Discipline</label>
                <select required className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm">
                  <option value="">Select discipline</option>
                  {disciplines.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
                <Input placeholder="https://linkedin.com/in/..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Years of experience</label>
                <Input required type="number" min={1} placeholder="10" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your background and what you can help mentees with..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
              <Button type="submit" variant="accent" className="w-full">
                Submit application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
