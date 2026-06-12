"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SellListingPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">List on EngSols Marketplace</h1>
        <p className="mt-2 text-slate-600">Sell equipment, materials, or services to engineers and operators worldwide.</p>
        <Card className="mt-8">
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Listing products is coming soon!");
              }}
            >
              <div>
                <label className="text-sm font-medium">Business name</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select required className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm">
                  <option value="">Select category</option>
                  <option value="equipment">Equipment</option>
                  <option value="materials">Materials</option>
                  <option value="services">Services</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea required rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Contact email</label>
                <Input required type="email" className="mt-1" />
              </div>
              <Button type="submit" variant="accent" className="w-full">Submit listing</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
