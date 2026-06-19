import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fulfillExamCheckoutSession } from "@/actions/stripe";
import { getCurrentUser } from "@/lib/auth";
import { getMockExamMetaBySlug } from "@/lib/data/exams";
import { hasUserPurchasedExam } from "@/lib/exam-purchases";
import { MockExamInterface } from "@/components/exams/MockExamInterface";
import { PremiumExamLockScreen } from "@/components/exams/PremiumExamLockScreen";
import { buildDetailMetadata } from "@/lib/page-metadata";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string; canceled?: string; session_id?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const exam = await getMockExamMetaBySlug(slug);
  if (!exam) return { title: "Exam not found" };
  return buildDetailMetadata({
    title: `${exam.title} | EngSols Practice Exam`,
    description: exam.description.slice(0, 160),
    path: `/certifications/exams/${slug}`,
  });
}

export default async function MockExamPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const [user, exam] = await Promise.all([getCurrentUser(), getMockExamMetaBySlug(slug)]);

  if (!exam) notFound();
  if (!user) redirect(`/login?next=/certifications/exams/${slug}`);

  if (query.success === "true" && query.session_id) {
    await fulfillExamCheckoutSession(query.session_id, user.id);
  }

  const ownsExam = !exam.isPremium || (await hasUserPurchasedExam(user.id, exam.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-2 sm:px-6">
        <Link href="/certifications" className="text-sm text-muted-foreground hover:text-primary">
          ← Certifications
        </Link>
      </div>

      {ownsExam ? (
        <MockExamInterface examSlug={slug} />
      ) : (
        <PremiumExamLockScreen exam={exam} canceled={query.canceled === "true"} />
      )}
    </div>
  );
}
