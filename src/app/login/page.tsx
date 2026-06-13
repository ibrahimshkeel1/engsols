import Link from "next/link";
import { signIn } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Props = { searchParams: Promise<{ message?: string; error?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="gradient-hero flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="text-center text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-center text-muted-foreground">Log in to your EngSols account</p>
        {params.message && (
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-center text-sm text-primary">{params.message}</p>
        )}
        {params.error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">Authentication failed. Try again.</p>
        )}
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <form action={signIn} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input name="email" required type="email" placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input name="password" required type="password" className="mt-1.5" />
              </div>
              <Button type="submit" variant="accent" className="w-full">Log in</Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
