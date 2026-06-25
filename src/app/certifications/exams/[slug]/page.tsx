import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fulfillExamCheckoutSession } from "@/actions/stripe";
import { getCurrentUser } from "@/lib/auth";
import { getMockExamMetaBySlug } from "@/lib/data/exams";
import { hasUserPurchasedExam } from "@/lib/exam-purchases";
import { PremiumExamLockScreen } from "@/components/exams/PremiumExamLockScreen";
import { buildDetailMetadata } from "@/lib/page-metadata";

const MockExamInterface = dynamic(
  () => import("@/components/exams/MockExamInterface").then((m) => m.MockExamInterface),
  { loading: () => <div className="p-8 text-center text-sm text-text-muted">Loading exam…</div> },
);

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
    <div className="min-h-screen bg-bg-main">
      <div className="border-b border-border-custom bg-zone-exams/5 px-4 py-3 sm:px-6">
        <Link href="/certifications" className="text-sm text-zone-exams hover:underline">
          ← Certifications
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-zone-exams">Practice exam</p>
      </div>

      {ownsExam ? (
        <MockExamInterface examSlug={slug} />
      ) : (
        <PremiumExamLockScreen exam={exam} canceled={query.canceled === "true"} />
      )}
    </div>
  );
}
