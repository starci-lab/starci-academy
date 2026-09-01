import assert from "node:assert/strict"
import test from "node:test"

import {buildSentryOptions} from "./sentry.ts"

test("enables five-percent tracing in production without default PII", () => {
    const options = buildSentryOptions({
        dsn: "https://public@example.invalid/1",
        environment: "production",
        release: " web-2026.08.15 ",
    })

    assert.equal(options.enabled, true)
    assert.equal(options.tracesSampleRate, 0.05)
    assert.equal(options.sendDefaultPii, false)
    assert.equal(options.release, "web-2026.08.15")
})

test("disables Sentry without a DSN and traces outside production", () => {
    const options = buildSentryOptions({
        dsn: "  ",
        environment: "development",
    })

    assert.equal(options.dsn, undefined)
    assert.equal(options.enabled, false)
    assert.equal(options.tracesSampleRate, 0)
})
