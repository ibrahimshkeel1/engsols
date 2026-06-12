"use client";

import { toast } from "sonner";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function BuildPortfolioPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Build your portfolio</h1>
        <p className="mt-2 text-slate-600">Get discovered by mentors and employers on EngSols.</p>
        <Card className="mt-8">
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Portfolio publishing is coming soon!");
              }}
            >
              <div>
                <label className="text-sm font-medium">Full name</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Headline</label>
                <Input required placeholder="e.g. Petroleum Engineering Graduate" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">University</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Discipline</label>
                <select required className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm">
                  <option value="">Select discipline</option>
                  {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <textarea required rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Skills (comma-separated)</label>
                <Input placeholder="Eclipse, Python, Reservoir Simulation" className="mt-1" />
              </div>
              <Button type="submit" variant="accent" className="w-full">Publish portfolio</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
