import { cloneElement, isValidElement, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  id: string;
  hint?: string;
  children: ReactElement<{ id?: string; className?: string }>;
};

export function FormField({ label, id, hint, children }: FormFieldProps) {
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        className: cn("mt-0", children.props.className),
      })
    : children;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{control}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
