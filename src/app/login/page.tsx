"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Authentication is coming soon!");
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <h1 className="text-center text-3xl font-bold text-slate-900">Log in</h1>
        <Card className="mt-8">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input required type="email" placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Input required type="password" className="mt-1" />
              </div>
              <Button type="submit" variant="accent" className="w-full">
                Log in
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-amber-600 hover:text-amber-700">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
