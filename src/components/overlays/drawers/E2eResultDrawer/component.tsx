import React, { useMemo, useState } from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import { StackV, StackH } from "@/components/frames/Stack"
import { Typography } from "@/components/atoms/text/Typography"
import { TabsBase } from "@/components/atoms/navigation/Tabs/TabsBase"
import { Accordion } from "@/components/atoms/navigation/Accordion"
import type { AccordionItem } from "@/components/atoms/navigation/Accordion"
import { ChipBase } from "@/components/atoms/chips/Chip/ChipBase"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"

/**
 * `_E2eResultDrawer` — the recorded Playwright E2E proof for the active lesson: a
 * per-flow pass/fail list (status chip + title) that expands to the full proof
 * markdown, with a language filter that appears only when the flows span more than
 * one stack. Passed/total counts the currently visible set, not the whole array.
 *
 * Presentational: `isOpen`/`onOpenChange` + a resolved `flows` array; the whole
 * overlay stays inert when nothing is recorded. Ported 1:1 from the storybook
 * blueprint `.storybook/components/starci/overlays/drawers/E2eResultDrawer/E2eResultDrawer.tsx`.
 */

/** One recorded Playwright proof flow (mirrors the seeded `content.e2eFlows` jsonb shape). */
export interface E2eFlow {
    /** Stable id, also used as the accordion item key. */
    id: string
    /** Flow title, e.g. "Register a new student". */
    title: string
    /** Which stack this flow ran against, e.g. `"typescript"`. Absent → grouped under the unspecified bucket. */
    lang?: string
    /** Run status, e.g. `"passed"` / `"failed"`. */
    status: string
    /** Full proof markdown (commands, real output, conclusion) from `.e2e/<lang>/flow-*.md`. */
    markdown?: string
}

interface E2eResultDrawerOwnProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** Which edge the panel slides in from. @default "right" */
    placement?: "top" | "bottom" | "left" | "right"
    /** Row count to shimmer while `isSkeleton` (no real `flows` yet). Defaults to `3`. */
    skeletonCount?: number
}

/**
 * Props for {@link _E2eResultDrawer}. `flows` is REQUIRED unless `isSkeleton`
 * (§12b) — the recorded run list hasn't loaded yet.
 */
export type E2eResultDrawerProps = E2eResultDrawerOwnProps &
    (
        | { isSkeleton: true; flows?: Array<E2eFlow> }
        | { isSkeleton?: false; flows: Array<E2eFlow> }
    )

/** Fixed, block-owned title — ported 1:1 from `content.e2e.title` (vi.json). */
const DRAWER_TITLE = "End-to-end testing (Playwright)"

/** This overlay's own identity, handed down to `DrawerShell`'s root instead of a raw wrapper `div` (BLOCK-2). See `_identity.ts`. */
const DRAWER_IDENTITY = { tier: "overlay", component: "E2eResultDrawer" } as const

/** Bucket for a flow with no recorded `lang` — mirrors the real `E2eBody` (`lang ?? "agnostic"`). */
const UNSPECIFIED_LANG = "agnostic"

/** Tab label for a lang value — the value itself is open-ended domain data, not a closed enum this block owns wording for. */
const langLabel = (lang: string) => lang.charAt(0).toUpperCase() + lang.slice(1)

/**
 * The E2E proof drawer. See the file header for why it collapses the real
 * `E2eResultDrawer`+`E2eBody` pair, and for the judgement calls on the
 * language filter and the root guard.
 *
 * @param props - {@link E2eResultDrawerProps}
 */
export const _E2eResultDrawer = ({
    isOpen,
    onOpenChange,
    flows,
    placement = "right",
    isSkeleton = false,
    skeletonCount = 3,
}: E2eResultDrawerProps) => {
    const langs = useMemo(() => {
        const set = new Set((flows ?? []).map((flow) => flow.lang ?? UNSPECIFIED_LANG))
        return Array.from(set)
    }, [flows])
    const hasLangFilter = langs.length > 1
    const [activeLang, setActiveLang] = useState<string>(langs[0] ?? UNSPECIFIED_LANG)

    // error → skeleton → empty → content (this drawer has no error state of its
    // own — the connected half never resolves one). `body` stays `null` for the
    // empty branch so the overlay mounts no drawer machinery at all rather than
    // opening onto an empty shell (see the root-guard note below).
    let body: React.ReactNode = null

    if (isSkeleton) {
        const skeletonRows = [
            () => <Skeleton className="h-4 w-64 max-w-full rounded" />,
            ...Array.from({ length: skeletonCount }, () => () => (
                <Skeleton className="h-11 w-full rounded-xl" />
            )),
        ]

        body = (
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={placement}
                title={DRAWER_TITLE}
                identity={DRAWER_IDENTITY}
                body={() => <StackV gap={4} isSkeleton={isSkeleton} items={skeletonRows} />}
            />
        )
    } else {
        // Root guard — mirrors BOTH real call-sites (see file header). Nothing
        // recorded means there is nothing to filter or expand, so the overlay
        // stays inert rather than opening onto an empty shell.
        const realFlows = flows ?? []

        if (realFlows.length > 0) {
            const visible = hasLangFilter
                ? realFlows.filter((flow) => (flow.lang ?? UNSPECIFIED_LANG) === activeLang)
                : realFlows
            const passed = visible.filter((flow) => flow.status === "passed").length

            const items: Array<AccordionItem> = visible.map((flow) => {
                const isPass = flow.status === "passed"
                const chipAndTitle = [
                    ({ isSkeleton }: SkeletonProps) => (
                        <ChipBase
                            isSkeleton={isSkeleton}
                            tone={isPass ? "success" : "danger"}
                            text={isPass ? "pass" : "fail"}

                        />
                    ),
                    ({ isSkeleton }: SkeletonProps) => (
                        <Typography
                            isSkeleton={isSkeleton}
                            text={flow.title}
                            size="sm"
                            weight="medium"

                        />
                    ),
                ]
                return {
                    key: flow.id,
                    title: (
                        <StackH
                            gap={2}
                            isSkeleton={isSkeleton}

                            items={chipAndTitle}
                        />
                    ),
                    content: flow.markdown ? (
                        <MarkdownContent
                            source={flow.markdown}
                            measure="compact"


                        />
                    ) : null,
                }
            })

            const countFilterAndAccordion = [
                ({ isSkeleton }: SkeletonProps) => (
                    <Typography
                        isSkeleton={isSkeleton}
                        text={`${passed}/${visible.length} flows passed — real logs recorded from an actual E2E run against the backend and UI.`}
                        size="sm"
                        color="muted"

                    />
                ),
                ...(hasLangFilter ? [() => (
                    <TabsBase
                        items={langs.map((lang) => ({ key: lang, label: langLabel(lang) }))}
                        selectedKey={activeLang}
                        onSelectionChange={setActiveLang}
                        ariaLabel="E2E language"
                        variant="secondary"

                    />
                )] : []),
                ({ isSkeleton }: SkeletonProps) => (
                    <Accordion
                        isSkeleton={isSkeleton}
                        items={items}

                    />
                ),
            ]

            body = (
                <DrawerShell
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement={placement}
                    title={DRAWER_TITLE}
                    identity={DRAWER_IDENTITY}
                    body={() => <StackV gap={4} isSkeleton={isSkeleton} items={countFilterAndAccordion} />}
                />
            )
        }
    }

    // `body` carries the identity itself (via `DRAWER_IDENTITY` on `DrawerShell`,
    // BLOCK-2) in every branch that renders one; the empty root-guard branch
    // renders nothing at all rather than an identity-bearing shell around it.
    return body
}
