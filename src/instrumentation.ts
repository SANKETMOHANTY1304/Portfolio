export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0,
      beforeSend(event) {
        delete event.request;
        delete event.user;
        return event;
      },
    });
  }
}
export { captureRequestError as onRequestError } from "@sentry/nextjs";
