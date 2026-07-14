"use client"

import React, { useState } from "react"
import { Button, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { CheckIcon, CopyIcon, PlayIcon } from "@phosphor-icons/react"
import { publicEnv } from "@/resources/env/public"
import { querySystemHealthStatus } from "@/modules/api/graphql/queries/query-system-health-status"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Callout } from "@/components/blocks/feedback/Callout"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

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
 * mutation ever reachable here). Shows the exact curl command hitting the
 * real `/graphql` endpoint (copy-able) plus a "Run" button that fires the
 * SAME query client-side (reusing `querySystemHealthStatus` — the same
 * function the live poll uses, not a new fetch layer) and renders the raw
 * JSON response so a visitor can prove the platform is really answering.
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
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">{t("curl.commandLabel")}</span>
                    <Button variant="tertiary" size="sm" onPress={onCopy}>
                        {copied ? (
                            <CheckIcon aria-hidden focusable="false" className="size-4 text-success" />
                        ) : (
                            <CopyIcon aria-hidden focusable="false" className="size-4" />
                        )}
                        {copied ? t("curl.copied") : t("curl.copy")}
                    </Button>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-default p-3 font-mono text-xs text-foreground">
                    {curlCommand}
                </pre>
            </div>

            <Button variant="primary" size="sm" onPress={onRun} isPending={running} className="self-start">
                <PlayIcon aria-hidden focusable="false" className="size-4" />
                {t("curl.run")}
            </Button>

            {errorText ? <Callout status="danger" title={errorText} /> : null}

            <AsyncContent
                isLoading={running}
                skeleton={
                    <div className="rounded-xl bg-default p-3">
                        <Skeleton.Paragraph lines={4} />
                    </div>
                }
            >
                {result ? (
                    <pre className="overflow-x-auto rounded-xl bg-default p-3 font-mono text-xs text-foreground">
                        {result}
                    </pre>
                ) : null}
            </AsyncContent>
        </div>
    )
}
