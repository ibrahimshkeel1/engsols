import { cn } from "@/lib/utils";
import { getCompanyStyle } from "@/lib/company-logos";

type CompanyLogoProps = {
  company: string;
  size?: "sm" | "md";
  className?: string;
};

export function CompanyLogo({ company, size = "md", className }: CompanyLogoProps) {
  const style = getCompanyStyle(company);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-bold",
        style.bg,
        style.text,
        size === "sm" ? "h-7 min-w-7 px-1 text-[10px]" : "h-9 min-w-9 px-1.5 text-xs",
        className,
      )}
      title={company}
    >
      {style.abbr}
    </div>
  );
}
