"use client";

import { toast } from "sonner";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function PostJobPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Post a job</h1>
        <p className="mt-2 text-muted-foreground">Reach engineering students and professionals on EngSols.</p>
        <Card className="mt-8">
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Job posting is coming soon!");
              }}
            >
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Job title</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select required className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm">
                  <option value="full-time">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="graduate-program">Graduate program</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Discipline</label>
                <select required className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm">
                  {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea required rows={5} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <Button type="submit" variant="accent" className="w-full">Post job</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
