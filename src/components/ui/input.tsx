import { fieldControlClassName } from "@/lib/input-styles";

type ControlProps = {
  invalid?: boolean;
};

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & ControlProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid })}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & ControlProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid, multiline: true })}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & ControlProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid })}
      {...props}
    >
      {children}
    </select>
  );
}
