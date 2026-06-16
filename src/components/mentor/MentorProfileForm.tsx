"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMentorProfile } from "@/actions/mentor";
import { disciplines } from "@/data/disciplines";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

type Profile = {
  headline: string;
  company: string;
  discipline: string;
  bio: string;
  monthly_rate: number;
  years_experience: number;
  skills: string[];
  calendly_url?: string | null;
};

export function MentorProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateMentorProfile(formData);
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Profile updated");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Headline" id="edit-headline">
        <Input name="headline" required defaultValue={profile.headline} />
      </FormField>
      <FormField label="Company" id="edit-company">
        <Input name="company" required defaultValue={profile.company} />
      </FormField>
      <FormField label="Discipline" id="edit-discipline">
        <Select name="discipline" required className="w-full" defaultValue={profile.discipline}>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </FormField>
      <FormField label="Bio" id="edit-bio">
        <Textarea name="bio" required rows={5} defaultValue={profile.bio} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Monthly rate ($)" id="edit-rate">
          <Input name="monthlyRate" type="number" required defaultValue={profile.monthly_rate} />
        </FormField>
        <FormField label="Years experience" id="edit-years">
          <Input name="yearsExperience" type="number" required defaultValue={profile.years_experience} />
        </FormField>
      </div>
      <FormField label="Skills (comma-separated)" id="edit-skills">
        <Input name="skills" defaultValue={profile.skills.join(", ")} />
      </FormField>
      <FormField label="Calendly / Cal.com link" id="edit-calendly" hint="Students can book intro calls directly.">
        <Input name="calendlyUrl" type="url" placeholder="https://calendly.com/your-link" defaultValue={profile.calendly_url ?? ""} />
      </FormField>
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
