import React from "react"
import type { ReactNode } from "react"
import { Tooltip } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL — the anatomy surfacing for a Block story.
 *
 * A Block (tier `Block/*`) is a COMPOSITE built from primitives (tier `Primitives/*`).
 * The canvas stays CLEAN (just the block); its COMPOSITION is revealed on HOVER via a
 * tooltip — which primitives it is made of (+ each one's role) and WHY that composite
 * exists (thầy 2026-07-21: bọc render bằng tooltip để "ra" primitives). A dashed ring on
 * hover signals the block is inspectable.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One composed primitive: its name (matches a `Primitives/*` leaf) + optional role. */
export interface BlockPrimitive {
    name: string
    role?: string
}

export interface BlockAnatomyProps {
    /** The primitives this block is composed from (in visual/importance order). */
    primitives: Array<BlockPrimitive | string>
    /** Why this composite exists — the rationale for combining these primitives. */
    reason: ReactNode
}

/** Tooltip body: the composition (primitive chips + roles) + the rationale. */
const AnatomyContent = ({ primitives, reason }: BlockAnatomyProps) => {
    const items = primitives.map((p) => (typeof p === "string" ? { name: p } : p))
    return (
        <div className="flex max-w-xs flex-col gap-3 p-1">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">Cấu thành từ primitives</span>
                <div className="flex flex-col gap-1">
                    {items.map((p) => (
                        <span key={p.name} className="text-xs">
                            <span className="font-semibold text-foreground">{p.name}</span>
                            {p.role ? <span className="text-muted">{` · ${p.role}`}</span> : null}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">Vì sao dùng composite này</span>
                <p className="text-xs text-foreground">{reason}</p>
            </div>
        </div>
    )
}

/**
 * Wraps a Block so HOVER reveals its {@link AnatomyContent} (composed primitives +
 * rationale) in a tooltip, keeping the canvas clean. A dashed ring on hover/focus
 * marks it inspectable.
 */
export const BlockPreview = ({ primitives, reason, children }: BlockAnatomyProps & { children: ReactNode }) => (
    <Tooltip delay={150}>
        <Tooltip.Trigger>
            <span className="inline-block rounded-3xl outline-1 outline-offset-4 outline-transparent transition-[outline-color] outline-dashed hover:outline-default focus-visible:outline-accent">
                {children}
            </span>
        </Tooltip.Trigger>
        <Tooltip.Content placement="right" showArrow className="max-w-xs">
            <Tooltip.Arrow />
            <AnatomyContent primitives={primitives} reason={reason} />
        </Tooltip.Content>
    </Tooltip>
)

/**
 * Story render shell for a Block: the block in a `p-8` canvas, wrapped in
 * {@link BlockPreview} so hover reveals its composition. Keeps every Block story
 * consistent — clean canvas, anatomy on hover.
 */
export const blockShell = (block: ReactNode, anatomy: BlockAnatomyProps) => (
    <div className="p-8">
        <BlockPreview primitives={anatomy.primitives} reason={anatomy.reason}>
            {block}
        </BlockPreview>
    </div>
)
