import Link from "next/link";
import { signUp } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="gradient-hero flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="text-center text-3xl font-bold">Join EngSols</h1>
        <p className="mt-2 text-center text-muted-foreground">Create your account to get started</p>
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <form action={signUp} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full name</label>
                <Input name="fullName" required placeholder="Your name" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input name="email" required type="email" placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input name="password" required type="password" minLength={8} className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">I am a...</label>
                <Select name="role" required className="mt-1.5 w-full" defaultValue="student">
                  <option value="student">Student / Graduate</option>
                  <option value="mentor">Mentor / Professional</option>
                </Select>
              </div>
              <Button type="submit" variant="accent" className="w-full">Create account</Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
