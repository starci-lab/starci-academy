import React, { useMemo, useState } from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { TabsBase } from "@sb-components/atoms/navigation/Tabs/TabsBase"
import { Accordion } from "@sb-components/atoms/navigation/Accordion/Accordion"
import type { AccordionItem } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { ChipBase } from "@sb-components/atoms/chips/Chip/ChipBase"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `E2eResultDrawer`: the recorded Playwright E2E proof for the active
 * lesson, shown as a per-flow pass/fail list that expands to the full proof
 * markdown.
 *
 * COLLAPSES A REAL SRC PAIR ON PURPOSE (same call as `ContentModal`, per the
 * task brief). `src/components/drawers/E2eResultDrawer` is a thin `Drawer`
 * shell that reads `useE2eResultOverlayState()` (Zustand open-state) and
 * `state.content.entity.e2eFlows` (Redux) then renders its sibling
 * `src/components/features/learn/LessonReader/E2eBody` inside the body — a
 * PANEL, not a second concept. This port is the panel's actual shape (status
 * chip + title per flow, language filter, expandable proof) behind the SAME
 * plain-props contract Rule 13 gives every overlay: the drawer shell part and
 * the body-content part were only ever split because Redux/Zustand sat between
 * them, and that wiring is exactly what a port strips out.
 *
 * OVERLAY, PRESENTATIONAL ONLY (Rule 13). `isOpen`/`onOpenChange` are forwarded
 * straight to `DrawerShell`; the caller (the real overlay-store hook, in
 * `src`) owns opening/closing this. `flows` is the resolved array off the
 * active lesson — this block never reads Redux, never decides which lesson is
 * "active".
 *
 * ROOT GUARD MIRRORS BOTH REAL CALL-SITES. The real `E2eResultDrawer` bails
 * `if (flows.length === 0) return null` BEFORE the `<Drawer>` even mounts (its
 * trigger button is hidden in that case too), and `E2eBody`'s own empty branch
 * only exists because a caller COULD still open the drawer some other way.
 * Since this port owns both halves at once, there is only ever the outer guard
 * to honour — "nothing recorded" means the whole overlay stays inert, not a
 * drawer that opens onto an empty message.
 *
 * LANGUAGE FILTER IS A LEAF, NOT A DATA BRANCH THIS BLOCK OWNS THE WORDING OF.
 * `flow.lang` is open-ended domain data (whatever stack the lesson's flows
 * were recorded in — `"typescript"`, `"go"`, `"csharp"`…), so unlike
 * `ContentModeNav`'s closed `ContentMode` enum there is no fixed label table to
 * keep here — the tab label is just the lang value, capitalized. The filter
 * itself only renders when the flow set spans more than one distinct lang
 * (single-stack lessons never show a one-tab strip). Which language starts
 * active, and which flows are currently visible, is UI-local state (`useState`)
 * exactly like the real `E2eBody` keeps it — it is not part of the overlay's
 * open/closed contract, so it does not need to be a controlled prop.
 *
 * PASSED/TOTAL COUNTS THE VISIBLE SET, not the whole `flows` array — ported
 * 1:1 from the real `E2eBody` (`passed = visible.filter(...)`, `total =
 * visible.length`): switching the language tab is meant to answer "how did
 * THIS stack's run go", not repeat the grand total on every tab.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One recorded Playwright proof flow (mirrors the seeded `content.e2eFlows` jsonb shape). */
export interface E2eFlow {
    /** Stable id, also used as the accordion item key. */
    id: string
    /** Flow title, e.g. "Đăng ký học viên mới". */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Props for {@link E2eResultDrawer}. `flows` is REQUIRED unless `isSkeleton`
 * (§12b) — the recorded run list hasn't loaded yet.
 */
export type E2eResultDrawerProps = E2eResultDrawerOwnProps &
    (
        | { isSkeleton: true; flows?: Array<E2eFlow> }
        | { isSkeleton?: false; flows: Array<E2eFlow> }
    )

/** Fixed, block-owned title — ported 1:1 from `content.e2e.title` (vi.json). */
const DRAWER_TITLE = "Kiểm thử end-to-end (Playwright)"

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
const E2eResultDrawer = ({
    isOpen,
    onOpenChange,
    flows,
    placement = "right",
    isSkeleton = false,
    skeletonCount = 3,
    showAnatomy = false,
    anatPart,
}: E2eResultDrawerProps) => {
    const langs = useMemo(() => {
        const set = new Set((flows ?? []).map((flow) => flow.lang ?? UNSPECIFIED_LANG))
        return Array.from(set)
    }, [flows])
    const hasLangFilter = langs.length > 1
    const [activeLang, setActiveLang] = useState<string>(langs[0] ?? UNSPECIFIED_LANG)

    // Checked AFTER every hook above has run (rules of hooks). Distinct from the
    // root guard below: `isSkeleton` means "still fetching", the guard means
    // "fetch finished, genuinely nothing recorded".
    if (isSkeleton) {
        return (
            <div data-anat-part={anatPart}>
                <DrawerShell isOpen={isOpen} onOpenChange={onOpenChange} placement={placement} title={DRAWER_TITLE} showAnatomy={showAnatomy}>
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV (root)" : undefined}>
                        <HeroSkeleton className="h-4 w-64 max-w-full rounded" />
                        {Array.from({ length: skeletonCount }, (_unused, index) => (
                            <HeroSkeleton key={index} className="h-11 w-full rounded-xl" />
                        ))}
                    </StackV>
                </DrawerShell>
            </div>
        )
    }

    // Root guard — mirrors BOTH real call-sites (see file header). Nothing
    // recorded means there is nothing to filter or expand, so the overlay
    // stays inert rather than opening onto an empty shell.
    const realFlows = flows ?? []
    if (realFlows.length === 0) return null

    const visible = hasLangFilter
        ? realFlows.filter((flow) => (flow.lang ?? UNSPECIFIED_LANG) === activeLang)
        : realFlows
    const passed = visible.filter((flow) => flow.status === "passed").length

    const items: Array<AccordionItem> = visible.map((flow) => {
        const isPass = flow.status === "passed"
        return {
            key: flow.id,
            title: (
                <StackH
                    gap="tight"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "StackH (flow title)" : undefined}
                >
                    <ChipBase
                        tone={isPass ? "success" : "danger"}
                        text={isPass ? "pass" : "fail"}
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "Chip" : undefined}
                    />
                    <Typography
                        text={flow.title}
                        size="sm"
                        weight="medium"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "Typography (flow title)" : undefined}
                    />
                </StackH>
            ),
            content: flow.markdown ? (
                <MarkdownContent
                    source={flow.markdown}
                    measure="compact"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "MarkdownContent" : undefined}
                />
            ) : null,
        }
    })

    return (
        <div data-anat-part={anatPart}>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={placement}
                title={DRAWER_TITLE}
                showAnatomy={showAnatomy}
            >
                <StackV
                    gap="grouped"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "StackV (root)" : undefined}
                >
                    <Typography
                        text={`${passed}/${visible.length} luồng pass, log thật ghi lại từ lần chạy E2E trên backend và UI thật.`}
                        size="sm"
                        color="muted"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "Typography (count)" : undefined}
                    />
                    {hasLangFilter ? (
                        <div data-anat-part={showAnatomy ? "Tabs" : undefined}>
                            <TabsBase
                                items={langs.map((lang) => ({ key: lang, label: langLabel(lang) }))}
                                selectedKey={activeLang}
                                onSelectionChange={setActiveLang}
                                ariaLabel="Ngôn ngữ E2E"
                                variant="secondary"
                                showAnatomy={showAnatomy}
                            />
                        </div>
                    ) : null}
                    <Accordion
                        items={items}
                        showAnatomy={showAnatomy}
                    />
                </StackV>
            </DrawerShell>
        </div>
    )
}

export { E2eResultDrawer }
