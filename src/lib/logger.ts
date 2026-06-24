type LogContext = Record<string, unknown>;

function formatMessage(scope: string, message: string, context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) return `[${scope}] ${message}`;
  return `[${scope}] ${message} ${JSON.stringify(context)}`;
}

/** Structured logging — dev console only; extend with Sentry in production later. */
export const logger = {
  error(scope: string, message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "production") return;
    console.error(formatMessage(scope, message, context));
  },
  warn(scope: string, message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "production") return;
    console.warn(formatMessage(scope, message, context));
  },
};
