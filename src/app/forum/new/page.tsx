"use client";

import { toast } from "sonner";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewForumPostPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Ask a question</h1>
        <Card className="mt-8">
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Posting questions is coming soon!");
              }}
            >
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input required placeholder="What's your question?" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Discipline</label>
                <select required className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm">
                  <option value="">Select discipline</option>
                  {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Details</label>
                <textarea required rows={6} placeholder="Describe your problem..." className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <Button type="submit" variant="accent" className="w-full">Post question</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
