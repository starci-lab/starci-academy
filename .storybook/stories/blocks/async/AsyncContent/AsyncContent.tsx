"use client"

import React from "react"
import type { ReactNode } from "react"

import { EmptyContent } from "../EmptyContent/EmptyContent"
import type { EmptyContentProps } from "../EmptyContent/EmptyContent"
import { ErrorContent } from "../ErrorContent/ErrorContent"
import type { ErrorContentProps } from "../ErrorContent/ErrorContent"
import { AnatomyOverlay } from "../../layout/AnatomyOverlay/AnatomyOverlay"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — PRIMITIVE ported from
 * `@/components/blocks/async/AsyncContent`. Synced to `src` later.
 *
 * Promoted to `Primitives/Async` (ruling 2026-07-22): the async-state switch is
 * the ONE place the error → loading → empty → content contract lives, so every
 * data-backed region composes THIS primitive instead of hand-rolling branches.
 */

/** Props for the {@link AsyncContent} primitive. */
export interface AsyncContentProps {
    /**
     * True while the first load is in flight (no cached data yet). While true the
     * {@link AsyncContentProps.skeleton} is shown. Pass the resolved condition,
     * e.g. `isLoading && items.length === 0`.
     */
    isLoading: boolean
    /**
     * Layout-matching skeleton shown while loading (e.g. a tree of `Skeleton.*`
     * mirroring the real layout), so the box never collapses or jumps on resolve.
     */
    skeleton: ReactNode
    /**
     * When true (after loading resolves), the {@link EmptyContent} is shown
     * instead of children.
     */
    isEmpty?: boolean
    /**
     * Props for the empty state — passed straight to {@link EmptyContent}. Omit to
     * render nothing when empty (self-hiding section).
     */
    emptyContent?: EmptyContentProps
    /**
     * Truthy → the {@link ErrorContent} is shown (takes priority over loading).
     * Pass the SWR `error` (only when there is no cached data to fall back to).
     */
    error?: unknown
    /** Props for the error state — passed straight to {@link ErrorContent}. */
    errorContent?: ErrorContentProps
    /** The loaded content, shown once loading resolves with non-empty data. */
    children: ReactNode
    /** Dev/spec: overlay the anatomy annotation around whichever branch renders. */
    showAnatomy?: boolean
}

/**
 * Standard async-state switch for any data-backed region — the single source for
 * the error / loading / empty / content branches the SWR render contract
 * requires. Renders, in priority order:
 *
 *   error → loading → empty → content
 *
 * The empty/error states are configured by passing their PROPS (not nodes):
 * `emptyContent={{ title, onRetry, retryLabel }}`. The `skeleton` is a tree of
 * `Skeleton.*` that mirrors the real layout.
 *
 * @param props - {@link AsyncContentProps}
 */
export const AsyncContent = ({
    isLoading,
    skeleton,
    isEmpty = false,
    emptyContent,
    error,
    errorContent,
    children,
    showAnatomy = false,
}: AsyncContentProps) => {
    let content: React.ReactNode
    if (error && errorContent) {
        content = <ErrorContent {...errorContent} />
    } else if (isLoading) {
        content = skeleton
    } else if (isEmpty) {
        content = emptyContent ? <EmptyContent {...emptyContent} /> : null
    } else {
        content = children
    }
    return showAnatomy ? (
        <div className="relative" data-anat>
            {content}
            <AnatomyOverlay label="AsyncContent" tier="primitive" href="/?path=/docs/primitives-async-asynccontent--docs" />
        </div>
    ) : <>{content}</>
}
