import * as Sentry from "@sentry/node";
import { Integrations } from "@sentry/tracing";

if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NEXT_PUBLIC_VERCEL_ENV) {
  Sentry.init({
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations:
      typeof window === "undefined" ? [] : [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

export { Sentry };
