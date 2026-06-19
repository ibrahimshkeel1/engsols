"use client";

import { useTransition } from "react";
import { Clock, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { createExamCheckoutSession } from "@/actions/stripe";
import type { MockExamMeta } from "@/lib/data/exams";
import { formatPriceCents } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  exam: MockExamMeta;
  canceled?: boolean;
};

export function PremiumExamLockScreen({ exam, canceled }: Props) {
  const [pending, startTransition] = useTransition();

  function handleCheckout() {
    startTransition(async () => {
      const result = await createExamCheckoutSession(exam.slug);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl items-center px-4 py-10 sm:px-6">
      <Card className="card-elevated w-full overflow-hidden border-border/80">
        <div className="bg-gradient-to-br from-primary/10 via-background to-amber-500/10 px-6 py-8 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Lock className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Premium practice exam</p>
              <h1 className="font-display mt-1 text-2xl tracking-tight sm:text-3xl">{exam.title}</h1>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 p-6 sm:p-8">
          {canceled && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              Checkout was canceled. You can try again whenever you are ready.
            </p>
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">{exam.description}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground">Exam type</p>
              <p className="mt-1 text-sm font-semibold">{exam.examType}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {exam.durationMinutes} min
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="mt-1 text-sm font-semibold">{exam.questionCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">One-time unlock</p>
                <p className="font-display mt-1 text-4xl tracking-tight text-foreground">
                  {formatPriceCents(exam.priceCents)}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  Secure checkout powered by Stripe
                </p>
              </div>
              <Button
                type="button"
                variant="accent"
                size="lg"
                disabled={pending}
                onClick={handleCheckout}
                className={cn("min-w-[200px]", pending && "opacity-90")}
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Redirecting...
                  </>
                ) : (
                  "Unlock access now"
                )}
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Lifetime access to this exam for your account. Passing score: {exam.passingScore}%.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
