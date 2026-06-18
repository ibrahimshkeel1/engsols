"use client";

import { useState } from "react";
import { createMarketplaceListing } from "@/actions/content";
import { disciplines } from "@/data/disciplines";
import type { Seller } from "@/types";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function MarketplaceSellForm({ sellers }: { sellers: Seller[] }) {
  const [imageUrl, setImageUrl] = useState<string[]>([]);

  return (
    <form action={createMarketplaceListing} className="space-y-5">
      <input type="hidden" name="imageUrl" value={imageUrl[0] ?? ""} />
      <FormField label="Seller account" id="sell-seller">
        <Select name="sellerSlug" required className="w-full">
          {sellers.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </Select>
      </FormField>
      <ImageUpload folder="marketplace" value={imageUrl} onChange={setImageUrl} label="Listing photo" />
      <FormField label="Category" id="sell-category">
        <Select name="category" required className="w-full">
          <option value="equipment">Equipment</option>
          <option value="materials">Materials</option>
          <option value="services">Services</option>
        </Select>
      </FormField>
      <FormField label="Title" id="sell-title">
        <Input name="title" required />
      </FormField>
      <FormField label="Description" id="sell-desc">
        <Textarea name="description" required rows={5} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Price" id="sell-price">
          <Input name="price" type="number" step="0.01" required />
        </FormField>
        <FormField label="Price unit" id="sell-unit">
          <Input name="priceUnit" defaultValue="per unit" />
        </FormField>
      </div>
      <FormField label="Discipline" id="sell-discipline">
        <Select name="discipline" className="w-full">
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </FormField>
      <FormField label="Condition" id="sell-condition">
        <Input name="condition" placeholder="e.g. New, Used" />
      </FormField>
      <FormField label="Location" id="sell-location">
        <Input name="location" />
      </FormField>
      <SubmitButton variant="accent" className="w-full" pendingLabel="Submitting...">
        Submit listing
      </SubmitButton>
    </form>
  );
}
