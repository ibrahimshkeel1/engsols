import { NewForumPostForm } from "@/components/forum/NewForumPostForm";
import { Card, CardContent } from "@/components/ui/card";

export default function NewForumPostPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Ask a question</h1>
      <p className="mt-2 text-muted-foreground">Get help from mentors and the engineering community.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <NewForumPostForm />
        </CardContent>
      </Card>
    </div>
  );
}
