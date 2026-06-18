"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCompany, deleteCompany } from "@/actions/content";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

const companyTypes = [
  { value: "operator", label: "Operator" },
  { value: "service-company", label: "Service company" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "consultancy", label: "Consultancy" },
  { value: "epc", label: "EPC" },
] as const;

type Company = {
  id: string;
  name: string;
  type: string;
  headquarters: string;
  country: string;
  website: string;
  disciplines: string[];
  description: string;
  verified: boolean;
  published: boolean;
};

export function AdminCompanyEditForm({ company }: { company: Company }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    await updateCompany(company.id, formData);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this company? Related jobs may be affected.")) return;
    setPending(true);
    const result = await deleteCompany(company.id);
    if (result?.error) {
      alert(result.error);
      setPending(false);
    } else {
      router.push("/admin/companies");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Company name" id="company-name">
        <Input name="name" required defaultValue={company.name} />
      </FormField>
      <FormField label="Type" id="company-type">
        <Select name="type" required className="w-full" defaultValue={company.type}>
          {companyTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Headquarters" id="company-hq">
          <Input name="headquarters" required defaultValue={company.headquarters} />
        </FormField>
        <FormField label="Country" id="company-country">
          <Input name="country" required defaultValue={company.country} />
        </FormField>
      </div>
      <FormField label="Website" id="company-website">
        <Input name="website" type="url" required defaultValue={company.website} />
      </FormField>
      <FormField label="Disciplines" id="company-disciplines">
        <Input name="disciplines" required defaultValue={company.disciplines.join(", ")} />
      </FormField>
      <FormField label="Description" id="company-description">
        <Textarea name="description" required rows={5} defaultValue={company.description} />
      </FormField>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="verified" value="true" defaultChecked={company.verified} className="rounded" />
        Verified
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="true" defaultChecked={company.published} className="rounded" />
        Published
      </label>
      <div className="flex gap-3">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" disabled={pending} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </form>
  );
}
