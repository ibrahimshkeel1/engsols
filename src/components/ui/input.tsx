import { fieldControlClassName, type FieldZone } from "@/lib/input-styles";

type ControlProps = {
  invalid?: boolean;
  zone?: FieldZone;
};

export function Input({
  className,
  invalid,
  zone,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & ControlProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid, zone })}
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
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & ControlProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={fieldControlClassName({ className, invalid, zone })}
      {...props}
    >
      {children}
    </select>
  );
}
