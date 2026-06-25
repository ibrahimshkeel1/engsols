import { fieldControlClassName, type FieldZone } from "@/lib/input-styles";

type ControlProps = {
  invalid?: boolean;
  zone?: FieldZone;
  tone?: "default" | "search" | "searchAccent" | "searchNav";
};

export function Input({
  className,
  invalid,
  zone,
  tone,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & ControlProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid, zone, tone })}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  zone,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & ControlProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid, multiline: true, zone })}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  zone,
  tone,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & ControlProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid, zone, tone })}
      {...props}
    >
      {children}
    </select>
  );
}
