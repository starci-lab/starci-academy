/** Public runtime values used to initialize every Next.js Sentry runtime. */
export interface SentryRuntimeConfig {
    dsn: string
    environment: string
    release?: string
}

/** Builds the shared privacy and tracing policy for a Sentry runtime. */
export const buildSentryOptions = ({
    dsn,
    environment,
    release,
}: SentryRuntimeConfig) => ({
    dsn: dsn.trim() || undefined,
    enabled: dsn.trim().length > 0,
    environment,
    release: release?.trim() || undefined,
    sendDefaultPii: false,
    tracesSampleRate: environment === "production" ? 0.05 : 0,
})

/** Reads the browser-safe environment variables exposed by the deployment. */
export const readSentryRuntimeConfig = (): SentryRuntimeConfig => ({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
    environment:
        process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
        ?? process.env.NODE_ENV
        ?? "development",
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
})
