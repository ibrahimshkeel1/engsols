import { createVideoListing } from "@/actions/content";
import { disciplines } from "@/data/disciplines";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminNewVideoPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Add video</h1>
      <p className="mt-1 text-muted-foreground">Publish a new video to the library.</p>
      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createVideoListing} className="space-y-5">
            <FormField label="Title" id="video-title">
              <Input name="title" required placeholder="Introduction to reservoir simulation" />
            </FormField>
            <FormField label="Description" id="video-description">
              <Textarea name="description" required rows={4} placeholder="What will viewers learn?" />
            </FormField>
            <FormField label="Author mentor slug" id="video-author" hint="Slug of the mentor who created this video">
              <Input name="authorSlug" placeholder="jane-doe-abc123" />
            </FormField>
            <FormField label="Discipline" id="video-discipline">
              <Select name="discipline" required className="w-full">
                {disciplines.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Duration" id="video-duration">
                <Input name="duration" required placeholder="12:30" />
              </FormField>
              <FormField label="Video URL" id="video-url">
                <Input name="videoUrl" type="url" required placeholder="https://..." />
              </FormField>
            </div>
            <FormField label="Tags" id="video-tags" hint="Comma-separated">
              <Input name="tags" placeholder="careers, reservoir, interview" />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" value="true" defaultChecked className="rounded" />
              Publish immediately
            </label>
            <SubmitButton variant="accent" pendingLabel="Creating...">
              Create video
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
