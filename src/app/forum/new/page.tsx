import { requireUser } from "@/lib/require-auth";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { NewForumPostForm } from "@/components/forum/NewForumPostForm";
import { Card, CardContent } from "@/components/ui/card";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewForumPostPage({ searchParams }: Props) {
  await requireUser("/forum/new");
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Ask a question</h1>
      <p className="mt-2 text-muted-foreground">Get help from mentors and the engineering community.</p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {safeDecodeURIComponent(params.error)}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <NewForumPostForm />
        </CardContent>
      </Card>
    </div>
  );
}
