"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { publicEnv } from "@/resources/env/public"
import { querySystemHealthStatus } from "@/modules/api/graphql/queries/query-system-health-status"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _CurlTester } from "./component"

/**
 * The RAW GraphQL body sent to `/graphql` — the SAME query the "Run" button
 * below fires client-side. Kept as one literal so the displayed curl command
 * and the actual request can never drift apart.
 */
const QUERY_BODY = `query SystemHealthStatus {
  systemHealthStatus {
    success
    message
    error
    data {
      components {
        name
        status
        latencyMs
        message
        checkedAt
      }
    }
  }
}`

/** Builds the copy-able curl command hitting the real public GraphQL endpoint. */
const buildCurlCommand = (): string => {
    const endpoint = publicEnv().api.graphql
    const body = JSON.stringify({ query: QUERY_BODY })
    return `curl -X POST ${endpoint} \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`
}

/** Props for {@link CurlTester}. */
export type CurlTesterProps = WithClassNames<undefined>

/**
 * "Try it yourself" panel — an MVP-scoped API explorer that whitelists ONLY
 * the public `systemHealthStatus` query (no free-form query input, no
 * mutation ever reachable here). The CONNECTED half (`tiers/split.md`): builds
 * the curl command, owns the copy/run/result/error state (reusing
 * `querySystemHealthStatus` — the same function the live poll uses, not a new
 * fetch layer), resolves every label, and hands them to the presentational
 * {@link _CurlTester}.
 *
 * @param props - {@link CurlTesterProps}
 */
export const CurlTester = ({ className }: CurlTesterProps) => {
    const t = useTranslations("architecture")
    const [copied, setCopied] = useState(false)
    const [running, setRunning] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [errorText, setErrorText] = useState<string | null>(null)

    const curlCommand = buildCurlCommand()

    const onCopy = async () => {
        await navigator.clipboard.writeText(curlCommand)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
    }

    const onRun = async () => {
        setRunning(true)
        setErrorText(null)
        try {
            const response = await querySystemHealthStatus({})
            setResult(JSON.stringify(response.data, null, 2))
        } catch (error) {
            setErrorText(error instanceof Error ? error.message : String(error))
            setResult(null)
        } finally {
            setRunning(false)
        }
    }

    return (
        <_CurlTester
            className={className}
            curlCommand={curlCommand}
            copied={copied}
            onCopy={onCopy}
            running={running}
            onRun={onRun}
            result={result}
            errorText={errorText}
            labels={{
                commandLabel: t("curl.commandLabel"),
                copy: t("curl.copy"),
                copied: t("curl.copied"),
                run: t("curl.run"),
            }}
        />
    )
}
