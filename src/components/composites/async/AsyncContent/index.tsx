"use client"

import React from "react"
import type { SVGProps } from "react"
import { TrayIcon, WarningIcon, type Icon as PhosphorIcon } from "@phosphor-icons/react"

import { EmptyState, type EmptyStateIcon } from "@/components/composites/feedback/EmptyState"
// The ATOM `Button`, NOT the `_legacy` version (§0 + teacher, 2026-07-26):
// `AsyncContent` sits in the closure of the `CourseContents` screen, and that screen
// is FORBIDDEN from touching `_legacy` — an import at the composite tier would drag the
// whole dead branch back into the screen (caught by the 2026-07-27 deep-scan).
import { Button } from "@/components/atoms/buttons/Button"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `AsyncContent.*`, the ONE async-state FRAME
 * namespace (teacher's call, 2026-07-25). Three sibling frames that used to live as
 * three loose folders (`AsyncContent` · `EmptyContent` · `ErrorContent`) are now
 * MEMBERS of one namespace — same tier, same job (holding the lifecycle of ONE
 * async data region: error → loading → empty → content), one import.
 *
 * | Member | Role | Content channel |
 * |---|---|---|
 * | `.Base`  | the STATE-SWITCH frame (4-branch switch) | slot `content`, `skeleton`, `emptyContent`, `errorContent` |
 * | `.Empty` | the EMPTY-MESSAGE frame  | props `title`/`description`/`action` |
 * | `.Error` | the ERROR-MESSAGE frame   | props `title`/`description`/`action` |
 *
 * FRAME API LAW (§13b):
 * - `.Base` is a WRAPPER frame → the named slot (`content`) is the main path;
 *   the other three branches each get their own named slot (`skeleton` · `emptyContent` ·
 *   `errorContent`).
 * - `.Empty`/`.Error` are props-only MESSAGE frames — NO `children`: they don't
 *   wrap content, they LAY OUT a message (icon · title · description · action)
 *   already translated and passed in by the caller. They carry no domain
 *   text/semantics of their own.
 * - Namespace only — do NOT export a bare component.
 *
 * Each member's behaviour/skin stays VERBATIM from the old folders; this is an
 * API refactor, not a visual one. The one NEW thing: a general `action` slot on
 * `.Empty`/`.Error` (the `onRetry` + `retryLabel` shorthand still works exactly
 * as before). Synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared message-frame plumbing (.Empty / .Error)
// ─────────────────────────────────────────────────────────────────────────────

/** Shared props of the two MESSAGE frames `.Empty` / `.Error`. */
interface MessageProps {
    /** Main line (already translated). `string`, not `ReactNode` — the frame forwards it into `EmptyState`, which renders it (COMPOSITE-8). */
    title: string
    /** Secondary line under the title (already translated). Optional. `string` for the same reason as {@link MessageProps.title}. */
    description?: string
    /**
     * Override the default glyph — takes a **COMPONENT REF** (`icon={TrayIcon}`), NOT
     * JSX. §14b: the caller (especially a SCREEN) must not hold a pre-built node. The
     * frame owns the scale + `weight="duotone"` (§4/§5) so every empty/error in the
     * system speaks with the same glyph voice — the caller only picks "which glyph",
     * not "what it looks like".
     */
    icon?: PhosphorIcon
    /**
     * General ACTION slot below the description — a COMPONENT reference (COMPOSITE-8),
     * never a built node (a `Button`, a two-button cluster…): forwarded straight into
     * `EmptyState`'s own `action` slot, which calls it and forwards `isSkeleton`. WINS
     * over the `onRetry`/`retryLabel` shorthand when both are passed.
     */
    action?: ComponentTypeWithSkeleton
    /** Shorthand: retry handler — only renders a button when PAIRED with `retryLabel`. */
    onRetry?: () => void
    /** Shorthand: the (already translated) label of the retry button — required for the button to appear. `string`, not `ReactNode` (COMPOSITE-8). */
    retryLabel?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Force `weight="duotone"` on the message frame's glyph — §4/§5: the FRAME owns
 * how the glyph looks, the caller only picks which glyph. Before 2026-07-25 the
 * frame took `icon?: ReactNode`, so each caller decided its own weight → they had
 * already drifted (story duotone, screen not). The old `nodeAsIcon` adapter was
 * removed per its own debt note.
 */
const withDuotone = (Icon: PhosphorIcon): EmptyStateIcon => {
    const Glyph = (props: SVGProps<SVGSVGElement>) => <Icon {...props} weight="duotone" />
    return Glyph
}

/**
 * Resolve the `action` slot's COMPONENT: a free-form `action` component reference
 * wins; otherwise the `onRetry` + `retryLabel` pair is wrapped into a component
 * rendering a secondary size-sm `Button`. Returns a component reference (never a
 * built node, COMPOSITE-8) — `EmptyState` calls it itself, forwarding `isSkeleton`.
 */
const composeAction = ({ action, onRetry, retryLabel }: MessageProps): ComponentTypeWithSkeleton | undefined => {
    if (action) {
        return action
    }
    if (onRetry && retryLabel) {
        return () => (
            <Button
                variant="tertiary"
                size="sm"
                onPress={onRetry}
                label={retryLabel}
            />
        )
    }
    return undefined
}

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the 4-branch state switch (was `AsyncContent`)
// ─────────────────────────────────────────────────────────────────────────────

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "AsyncContent" } as const

/** Props for {@link AsyncContent}. */
export interface AsyncContentBaseProps {
    /**
     * True while the FIRST load is running (no cache yet). While true,
     * {@link AsyncContentBaseProps.skeleton} shows. Pass an already-reduced
     * condition, e.g. `isLoading && items.length === 0`.
     */
    isLoading: boolean
    /**
     * The LOADING branch slot: a COMPONENT reference (COMPOSITE-8), never a built
     * node — a skeleton mirroring the real layout (a `Skeleton.*` tree), so the box
     * doesn't collapse/jump when it resolves. The frame calls it itself, forwarding
     * `isSkeleton={true}`.
     */
    skeleton: ComponentTypeWithSkeleton
    /** True (after loading finishes) → the frame falls to the empty branch. */
    isEmpty?: boolean
    /**
     * The EMPTY branch slot, passed as PROPS (not a node) — forwarded straight
     * to {@link AsyncContentEmpty}. Left empty → the empty branch renders null
     * (the section hides itself).
     */
    emptyContent?: AsyncContentEmptyProps
    /**
     * Truthy → the frame falls to the error branch (HIGHEST PRIORITY, beats
     * even loading). Pass SWR's `error` (only once there's no cache left to show).
     */
    error?: unknown
    /**
     * The ERROR branch slot, passed as PROPS — forwarded straight to
     * {@link AsyncContentError}. ⚠️ Left empty, the error branch does NOT
     * activate (the frame falls through to loading/empty/content) — keeping the
     * old contract, no behaviour change in this consolidation.
     */
    errorContent?: AsyncContentErrorProps
    /**
     * The CONTENT branch slot — data has finished loading. The wrapper frame's
     * main path. A COMPONENT reference (COMPOSITE-8), never a built node — the
     * frame calls it itself, forwarding `isSkeleton={false}`.
     */
    content?: ComponentTypeWithSkeleton
    /** Dev/spec: overlay an anatomy annotation around the branch currently rendering. */
}

/**
 * The standard STATE-SWITCH frame for every async data region — the ONE place
 * holding the four branches that SWR's render contract demands. Priority order:
 *
 *   error → loading → empty → content
 *
 * The two message branches are configured via PROPS (not a node):
 * `emptyContent={{ title, description, onRetry, retryLabel }}`; `skeleton` is a
 * `Skeleton.*` tree mirroring the real layout.
 *
 * @param props - {@link AsyncContentBaseProps}
 */
const Base = ({
    isLoading,
    skeleton: Skeleton,
    isEmpty = false,
    emptyContent,
    error,
    errorContent,
    content: Content}: AsyncContentBaseProps) => {
    let branch: React.ReactNode
    if (error && errorContent) {
        branch = <ErrorMessage {...errorContent} />
    } else if (isLoading) {
        branch = <Skeleton isSkeleton />
    } else if (isEmpty) {
        branch = emptyContent ? <Empty {...emptyContent} /> : null
    } else {
        branch = Content ? <Content isSkeleton={false} /> : undefined
    }
    return <>{branch}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// .Empty — the empty-message frame (was `EmptyContent`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link AsyncContentEmpty} — the empty-message frame (props-only). */
export type AsyncContentEmptyProps = MessageProps

/**
 * A standalone EMPTY-MESSAGE frame — tray icon, title + optional description,
 * and an action slot (or the "retry" shorthand), centred. This is the standard
 * `emptyContent` for {@link AsyncContent}.
 *
 * A THIN layer over the `EmptyState` frame: it only adds the default
 * `TrayIcon` and wraps `onRetry`/`retryLabel` into a button for the `action`
 * slot — it does NOT redraw the icon + title + description + button itself.
 *
 * @param props - {@link AsyncContentEmptyProps}
 */
const Empty = (props: AsyncContentEmptyProps) => {
    const { title, description, icon, classNames} = props
    return (
        <EmptyState
            classNames={classNames}
            icon={withDuotone(icon ?? TrayIcon)}
            title={title}
            description={description}
            action={composeAction(props)}
        />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Error — the error-message frame (was `ErrorContent`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link AsyncContentError} — the error-message frame (props-only). */
export type AsyncContentErrorProps = MessageProps

/**
 * A standalone ERROR-MESSAGE frame — warning icon, title + optional description,
 * and an action slot (usually "retry"), centred. This is the standard
 * `errorContent` for {@link AsyncContent}.
 *
 * A THIN layer over the `EmptyState` frame with `tone="danger"`.
 *
 * @param props - {@link AsyncContentErrorProps}
 */
const ErrorMessage = (props: AsyncContentErrorProps) => {
    const { title, description, icon, classNames} = props
    return (
        <EmptyState
            classNames={classNames}
            tone="danger"
            icon={withDuotone(icon ?? WarningIcon)}
            title={title}
            description={description}
            action={composeAction(props)}
        />
    )
}

/**
 * The FRAME namespace for the async lifecycle — three members, one import:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base`  | `content` · `skeleton` · `emptyContent` · `errorContent` |
 * | `.Empty` | props-only (`title`/`description`/`icon`/`action`) |
 * | `.Error` | props-only (`title`/`description`/`icon`/`action`) |
 */
export { Base as AsyncContent, Empty as AsyncContentEmpty, ErrorMessage as AsyncContentError }
