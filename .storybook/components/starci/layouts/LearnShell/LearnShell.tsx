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
 * `LearnShell` — the wrapper mounted once per `/learn/**` scope. Five
 * structural leaves, each gaining or losing a whole node:
 *   - `RailSurface`        — rail mounted beside `children`, one floating FAB.
 *   - `NoRailSurface`      — no rail; `children` fills the width.
 *   - `SelectionAskActive` — gains the `ContentAiSelectionAsk` pill alongside
 *     the FAB.
 *   - `AiSuppressed`       — `isAssessmentLive` loses both AI trigger nodes.
 *   - `EnrollGated`        — the whole rail+children row is replaced by
 *     `EnrollGate`.
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

    const railAndContent = [
        ...(RAIL_SURFACES.has(activeSurface) ? [() => (
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

                    items={[() => <Spinner label={RAIL_LOADING_LABEL} />]}
                />
            </ResizableRail>
        )] : []),
        () => (
            <div className="min-w-0 flex-1">
                {children}
            </div>
        ),
    ]

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
                <div className="min-h-[calc(100dvh-4rem)]">
                    <StackH
                        gap={1}
                        items={railAndContent}
                    />
                </div>
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
