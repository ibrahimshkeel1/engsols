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
      <Card className="card-elevated w-full overflow-hidden border-zone-exams/30">
        <div className="bg-gradient-to-br from-zone-exams/15 via-bg-main to-zone-exams/10 px-6 py-8 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zone-exams/15 text-zone-exams">
              <Lock className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zone-exams">Premium practice exam</p>
              <h1 className="font-display mt-1 text-2xl tracking-tight text-text-main sm:text-3xl">{exam.title}</h1>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 bg-bg-surface p-6 sm:p-8">
          {canceled && (
            <p className="rounded-xl border border-zone-exams/30 bg-zone-exams/10 px-4 py-3 text-sm text-zone-exams">
              Checkout was canceled. You can try again whenever you are ready.
            </p>
          )}

          <p className="text-sm leading-relaxed text-text-muted">{exam.description}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border-custom bg-bg-main px-4 py-3">
              <p className="text-xs text-text-muted">Exam type</p>
              <p className="mt-1 text-sm font-semibold text-text-main">{exam.examType}</p>
            </div>
            <div className="rounded-xl border border-border-custom bg-bg-main px-4 py-3">
              <p className="text-xs text-text-muted">Duration</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zone-exams">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {exam.durationMinutes} min
              </p>
            </div>
            <div className="rounded-xl border border-border-custom bg-bg-main px-4 py-3">
              <p className="text-xs text-text-muted">Questions</p>
              <p className="mt-1 text-sm font-semibold text-text-main">{exam.questionCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zone-exams/25 bg-zone-exams/5 px-5 py-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-text-muted">One-time unlock</p>
                <p className="font-display mt-1 text-4xl tracking-tight text-zone-exams">
                  {formatPriceCents(exam.priceCents)}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                  <ShieldCheck className="h-3.5 w-3.5 text-zone-exams" aria-hidden />
                  Secure checkout powered by Stripe
                </p>
              </div>
              <Button
                type="button"
                variant="zoneExams"
                size="lg"
                disabled={pending}
                onClick={handleCheckout}
                className={cn("min-w-[200px] shadow-zone-exams", pending && "opacity-90")}
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

          <p className="text-center text-xs text-text-muted">
            Lifetime access to this exam for your account. Passing score: {exam.passingScore}%.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
