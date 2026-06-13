import { createNewsArticle } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const categories = ["Industry", "Careers", "Certifications", "Platform", "Events"];

export default function AdminNewNewsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Publish article</h1>
      <p className="mt-1 text-muted-foreground">Create a new news article for the community.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createNewsArticle} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" required placeholder="Article headline" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select name="category" required className="mt-1.5 w-full">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea name="excerpt" required rows={2} placeholder="Short summary for listings" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Body</label>
              <Textarea name="body" required rows={10} placeholder="Full article content..." className="mt-1.5" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="publish" value="true" defaultChecked className="rounded" />
              Publish immediately
            </label>
            <Button type="submit" variant="accent">Create article</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
