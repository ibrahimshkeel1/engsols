import { cloneElement, isValidElement, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  children: ReactElement<{ id?: string; className?: string; invalid?: boolean; "aria-invalid"?: boolean }>;
};

export function FormField({ label, id, hint, error, children }: FormFieldProps) {
  const invalid = Boolean(error);

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        invalid,
        "aria-invalid": invalid,
        className: cn("mt-0", children.props.className),
      })
    : children;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{control}</div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
