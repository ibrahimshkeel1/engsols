import { createForumPost } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewForumPostPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Ask a question</h1>
      <p className="mt-2 text-muted-foreground">Get help from mentors and the engineering community.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createForumPost} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" required placeholder="What's your question?" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Discipline</label>
              <Select name="discipline" required className="mt-1.5 w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Details</label>
              <Textarea name="body" required rows={6} placeholder="Describe your problem..." className="mt-1.5" />
            </div>
            <Button type="submit" variant="accent" className="w-full">Post question</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
