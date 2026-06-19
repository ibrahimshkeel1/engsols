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
  responds_within_hours?: number | null;
  intro_slots_this_week?: number | null;
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
      <FormField label="Calendly / Cal.com link (intro & monthly)" id="edit-calendly" hint="Students can book intro calls directly.">
        <Input name="calendlyUrl" type="url" placeholder="https://calendly.com/your-link" defaultValue={profile.calendly_url ?? ""} />
      </FormField>
      <FormField label="Study plan session link" id="edit-study-calendly" hint="Optional paid Calendly link for study-plan sessions.">
        <Input name="studyPlanCalendlyUrl" type="url" placeholder="https://calendly.com/study-plan" defaultValue={(profile as { study_plan_calendly_url?: string }).study_plan_calendly_url ?? ""} />
      </FormField>
      <FormField label="Interview prep session link" id="edit-interview-calendly">
        <Input name="interviewCalendlyUrl" type="url" placeholder="https://calendly.com/interview-prep" defaultValue={(profile as { interview_calendly_url?: string }).interview_calendly_url ?? ""} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Response time (hours)" id="edit-responds" hint="Shown to students e.g. Responds within 48h">
          <Input name="respondsWithinHours" type="number" min={1} max={168} placeholder="48" defaultValue={profile.responds_within_hours ?? ""} />
        </FormField>
        <FormField label="Intro slots this week" id="edit-slots" hint="Leave blank if none">
          <Input name="introSlotsThisWeek" type="number" min={0} max={20} placeholder="3" defaultValue={profile.intro_slots_this_week ?? ""} />
        </FormField>
      </div>
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
