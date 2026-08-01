import React from "react"
import type { ReactNode } from "react"
import { ResizableRail } from "@sb-components/behaviors/ResizableRail/ResizableRail"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { EnrollGate, type EnrollGateProps } from "@sb-components/starci/blocks/learn/EnrollGate/EnrollGate"
import { ContentAiFab } from "@sb-components/starci/blocks/learn/ContentAiFab/ContentAiFab"
import {
    ContentAiSelectionAsk,
    type ContentAiSelectionAskAnchor,
} from "@sb-components/starci/blocks/learn/ContentAiSelectionAsk/ContentAiSelectionAsk"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT — `LearnShell`: the wrapper mounted once per `/learn/**` scope (maps
 * 1:1 to the real `courses/[courseId]/learn/layout.tsx`, per canon
 * `D:/Repositories/starci-academy-backend/.claude/fe/steps/11-overlays-layouts-brainstorm.md`
 * §4/§7 — layouts answer "what wraps every route in this scope", take a
 * mandatory `children`, and outlive the route that mounts under them). It never
 * decides what a route SHOWS — that is every child screen's job — it only
 * decides the CHROME every `/learn/**` route shares: the resizable side rail
 * (when the active surface has one), the enrollment gate that can replace the
 * whole body, and the two AI triggers.
 *
 * ⭐ FOLDER, NOT `blocks/<group>` — confirmed against `components/README.md`
 * (updated 2026-07-28, the same day this was built): `layouts/` is the sibling
 * of `blocks/pages/overlays` under each app, not a subfolder of `blocks`. The
 * task brief's own generic path example predates that split; Rule 12 in the
 * brief and the README agree this is a `layouts/` citizen.
 *
 * ⛔ `LeaderboardCategoryNav` was NOT reused here, despite the inventory hint
 * saying to. Read its own file header first: it explicitly states it is only
 * HALF of the real `LeaderboardCategoryRail` fetch — the MOBILE chip strip
 * (`variant="chips"`), rendered directly inside `Leaderboard/index.tsx`. The
 * DESKTOP `ListBox` half (`variant="rail"`) is the one that actually lives in
 * the shared `learn/layout.tsx` rail slot this component owns, and that half is
 * explicitly flagged OUT OF SCOPE in that same file — i.e. not built yet.
 * Forcing the chip strip (a flex-WRAP row of buttons) into a narrow vertical
 * rail slot would be the exact `ContentTabBar` mistake this run's brief opens
 * with: reusing a real component in the WRONG shape reads as correct at a
 * glance and is worse than a documented gap.
 *
 * ⛔ SCOPE GAP (§B3) — the rail BODY. None of `ContentMap` / `OnThisPage` /
 * `MilestoneOutline` / `LeaderboardCategoryRail`'s desktop half are in this
 * task's compose list, so this layout cannot draw any of them. What it CAN
 * responsibly decide is WHETHER a rail exists for the active surface
 * (`content`/`leaderboard` do, per the real layout; `personalProject`/`other`
 * don't — the personal-project workspace is a full-bleed area with, if
 * anything, its own internal chrome, and `other` is the safe unknown-surface
 * default). Where a rail exists, its body is `Spinner` — the one leaf the task
 * names for exactly this — never a bare placeholder `div`.
 *
 * ⛔ `GithubLinkGate` (the real layout's third gate, alongside `EnrollGate` and
 * `PersonalProjectGatePreview`) is NOT composed here — it is not in this task's
 * compose list, so it is left out rather than guessed at.
 *
 * ⭐ `preview` IS A RELAYED SLOT, NOT A NEW VIOLATION. `EnrollGate` already
 * owns a `preview?: ReactNode` prop (a whole teaser block, e.g.
 * `PersonalProjectGatePreview` — confirmed by THAT block's own file header:
 * "fed into `EnrollGate`'s `preview` slot inside `LearnShell`"). This layout
 * does not construct that node — the real page under the gated route does,
 * exactly the way any `EnrollGate` caller already would — `LearnShell` only
 * forwards it one layer further up, because the gate itself now mounts here
 * instead of directly in the screen. `enrollGateProps` also relays `price`
 * (`EnrollGate`'s own optional resolved-price shape) alongside the
 * `title`/`description`/`preview` the task brief names explicitly, plus the
 * `onEnroll` callback `EnrollGate` requires to function at all — leaving
 * `price` out would strand the price region in `EnrollGate`'s permanent
 * "unresolved" shimmer for every gated route.
 *
 * ⭐ `onOpenAiChat` / `isAiChatOpen` / `selectionAsk` / `onOpenSelectionAsk` are
 * additions beyond the task brief's literal five props — necessary because
 * `ContentAiFab` and `ContentAiSelectionAsk` cannot render at all without them.
 * `ContentAiSelectionAsk`'s OWN file header assigns tracking + positioning the
 * live text selection to "the SCREEN (`ContentArticle`'s owner)", explicitly
 * OUT of that block's own scope — so this layout does not run a
 * `selectionchange` listener either; `selectionAsk` arrives as a plain,
 * already-resolved value (`null` → nothing selected), the same "store/DOM
 * wiring lives in the real `src` layout, this design-system component only
 * takes the resolved prop" discipline Rule 13 already applies to overlays.
 *
 * ONE GATE REPLACES THE WHOLE BODY. `isEnrollGated` does not sit beside the
 * rail+children row — per `EnrollGate`'s own header ("shown IN PLACE OF an
 * enrollment-required learn surface"), it REPLACES it. The two AI triggers
 * suppress alongside it (a locked surface has nothing to ask AI about yet), on
 * top of `isAssessmentLive`'s own suppression the task brief already names.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which `/learn/**` surface is currently active — drives whether a rail mounts. */
export type LearnSurface = "content" | "personalProject" | "leaderboard" | "other"

/** Surfaces whose real rail body (out of scope here, see file header) exists in the real app. */
const RAIL_SURFACES: ReadonlySet<LearnSurface> = new Set(["content", "leaderboard"])

/** Rail persistence + bounds — mirrors the real `learn/layout.tsx` rail's own defaults. */
const RAIL_STORAGE_KEY = "learn-shell-rail-width"
const RAIL_DEFAULT_WIDTH = 320
const RAIL_MIN_WIDTH = 256
const RAIL_MAX_WIDTH = 480
const RAIL_ARIA_LABEL = "Drag to resize the side panel"
const RAIL_LOADING_LABEL = "Loading side panel"

/**
 * Fields `LearnShell` relays into `EnrollGate` — see the file header's
 * "`preview` IS A RELAYED SLOT" note for why `preview`/`price` ride along with
 * `title`/`description`, plus the `onEnroll` callback the gate needs to fire.
 */
export interface LearnShellEnrollGateProps
    extends Pick<EnrollGateProps, "title" | "description" | "preview" | "price"> {
    /** Fired when the learner takes the gate's enroll CTA. */
    onEnroll: () => void
}

/**
 * A resolved, already-positioned "ask AI about this selection" request — see
 * the file header for why `LearnShell` never tracks the selection itself.
 */
export interface LearnShellSelectionAsk {
    /** Viewport point to plant the pill at (already resolved by the caller). */
    anchor: ContentAiSelectionAskAnchor
    /** `true` → the pill carries the "New" badge. */
    isNew?: boolean
}

/** Props for {@link LearnShell}. */
export interface LearnShellProps {
    /** Which `/learn/**` surface is mounted right now — drives which rail body would mount. */
    activeSurface: LearnSurface
    /** `true` → the active surface requires enrollment the viewer does not have; replaces the whole body with `EnrollGate`. */
    isEnrollGated: boolean
    /** `true` → a timed/live assessment is running; suppresses BOTH AI triggers regardless of `isEnrollGated`. */
    isAssessmentLive: boolean
    /** `title`/`description`/`preview`/`price` relayed into `EnrollGate`, plus its `onEnroll`. Required only while `isEnrollGated`. */
    enrollGateProps?: LearnShellEnrollGateProps
    /** Fired when the floating AI trigger is pressed — the real layout opens the AI chat rail/drawer in response. */
    onOpenAiChat: () => void
    /** `true` → that chat surface is already open, so `ContentAiFab` hides instead of floating on top of it. */
    isAiChatOpen?: boolean
    /** The current text-selection ask request, already resolved+positioned by the caller. `null`/omitted → no selection to react to. */
    selectionAsk?: LearnShellSelectionAsk | null
    /** Fired when the selection-ask pill is pressed. */
    onOpenSelectionAsk: () => void
    /** The active route's own content — the one place `ReactNode` is valid above frame tier (§12). */
    children: ReactNode
}

/**
 * The `/learn/**` layout shell. See the file header for the full contract, the
 * scope gaps left deliberately open, and why `LeaderboardCategoryNav` was not
 * reused despite the inventory hint.
 *
 * @param props - {@link LearnShellProps}
 */
const LearnShell = ({
    activeSurface,
    isEnrollGated,
    isAssessmentLive,
    enrollGateProps,
    onOpenAiChat,
    isAiChatOpen = false,
    selectionAsk = null,
    onOpenSelectionAsk,
    children,
}: LearnShellProps) => {
    // A locked surface has nothing real to ask AI about yet, on top of the
    // brief's own `isAssessmentLive` suppression.
    const showAiTriggers = !isEnrollGated && !isAssessmentLive

    const railAndContent = (
        <>
            {RAIL_SURFACES.has(activeSurface) ? (
                <ResizableRail
                    storageKey={RAIL_STORAGE_KEY}
                    defaultWidth={RAIL_DEFAULT_WIDTH}
                    minWidth={RAIL_MIN_WIDTH}
                    maxWidth={RAIL_MAX_WIDTH}
                    ariaLabel={RAIL_ARIA_LABEL}
                    handleSide="right"
                    className="h-full shrink-0 border-r border-default"

                >
                    <StackV
                        gap={1}
                        align="center"
                        justify="center"
                        classNames={["h-full"]}

                        body={<Spinner label={RAIL_LOADING_LABEL} />}
                    />
                </ResizableRail>
            ) : null}

            <div className="min-w-0 flex-1">
                {children}
            </div>
        </>
    )

    return (
        <div>
            {isEnrollGated && enrollGateProps != null ? (
                <EnrollGate
                    title={enrollGateProps.title}
                    description={enrollGateProps.description}
                    preview={enrollGateProps.preview}
                    price={enrollGateProps.price}
                    onEnroll={enrollGateProps.onEnroll}


                />
            ) : (
                <StackH
                    gap={1}
                    className="min-h-[calc(100dvh-4rem)]"

                    body={railAndContent}
                />
            )}

            {showAiTriggers ? (
                <>
                    <ContentAiFab
                        onOpen={onOpenAiChat}
                        isOpen={isAiChatOpen}


                    />
                    {selectionAsk != null ? (
                        <ContentAiSelectionAsk
                            onOpen={onOpenSelectionAsk}
                            anchor={selectionAsk.anchor}
                            isNew={selectionAsk.isNew}


                        />
                    ) : null}
                </>
            ) : null}
        </div>
    )
}

export { LearnShell }
