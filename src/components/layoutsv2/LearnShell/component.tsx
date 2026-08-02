import React from "react"
import type { ReactNode } from "react"
import { ResizableRail } from "@/components/behaviors/ResizableRail"
import { Spinner } from "@/components/atoms/display/Spinner"
import { StackH, StackV } from "@/components/frames/Stack"
import { EnrollGate, type EnrollGateProps } from "@/components/starci/blocks/learn/EnrollGate"
import { ContentAiFab } from "@/components/starci/blocks/learn/ContentAiFab"
import {
    ContentAiSelectionAsk,
    type ContentAiSelectionAskAnchor,
} from "@/components/starci/blocks/learn/ContentAiSelectionAsk"

/**
 * `_LearnShell` — the wrapper mounted once per `/learn/**` scope. It owns the chrome
 * every learn route shares: the resizable side rail (when the active surface has
 * one), the enrollment gate that can replace the whole body, and the two AI
 * triggers (chat FAB + selection-ask). Takes a mandatory `children`.
 *
 * `enrollGateProps` relays `title`/`description`/`preview`/`price` down to
 * `EnrollGate`; `onOpenAiChat`/`isAiChatOpen`/`selectionAsk`/`onOpenSelectionAsk`
 * drive the AI triggers. The gate replaces the rail+children body when
 * `isEnrollGated`; the AI triggers also suppress while an assessment is live.
 * Ported from the storybook blueprint (`.storybook/components/starci/layouts/LearnShell/LearnShell.tsx`)
 * — see {@link LearnShell} for the connected half that resolves the real
 * route/enrollment/AI-chat state into these props.
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
 * Fields `_LearnShell` relays into `EnrollGate` — see the file header's
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
 * the file header for why `_LearnShell` never tracks the selection itself.
 */
export interface LearnShellSelectionAsk {
    /** Viewport point to plant the pill at (already resolved by the caller). */
    anchor: ContentAiSelectionAskAnchor
    /** `true` → the pill carries the "New" badge. */
    isNew?: boolean
}

/** Props for {@link _LearnShell}. */
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
 * The `/learn/**` layout shell. See the file header for the full contract and
 * why the AI selection-tracking lives in the connected {@link LearnShell}
 * rather than here.
 *
 * @param props - {@link LearnShellProps}
 */
const _LearnShell = ({
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
                    pattern="sibling-stack"
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
        <div data-tier="layout" data-component="LearnShell">
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

export { _LearnShell }
