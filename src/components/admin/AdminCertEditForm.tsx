"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCertification } from "@/actions/admin";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

type Props = {
  cert: {
    id: string;
    name: string;
    short_name: string;
    discipline: string;
    description: string;
    eligibility: string;
    exam_format: string;
    avg_prep_months: number;
    pass_rate: string | null;
    related_mentor_slugs: string[];
    published: boolean;
  };
};

export function AdminCertEditForm({ cert }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const result = await updateCertification(cert.id, new FormData(e.currentTarget));
        if (result?.error) setError(result.error);
        else router.push("/admin/certifications");
        setPending(false);
      }}
    >
      <Input name="name" required defaultValue={cert.name} />
      <Input name="shortName" required defaultValue={cert.short_name} />
      <Select name="discipline" defaultValue={cert.discipline} className="w-full">
        {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
      </Select>
      <Textarea name="description" required rows={4} defaultValue={cert.description} />
      <Textarea name="eligibility" required rows={3} defaultValue={cert.eligibility} />
      <Input name="examFormat" required defaultValue={cert.exam_format} />
      <Input name="avgPrepMonths" type="number" defaultValue={cert.avg_prep_months} />
      <Input name="passRate" defaultValue={cert.pass_rate ?? ""} />
      <Input name="mentorSlugs" defaultValue={cert.related_mentor_slugs.join(", ")} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="true" defaultChecked={cert.published} className="rounded" />
        Published
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="accent" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    </form>
  );
}
