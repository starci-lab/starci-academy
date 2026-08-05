import type { ComponentType, SVGProps } from "react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import {
    SurfaceCardNested,
    type SurfaceCardNestedSection,
} from "@/components/composites/cards/SurfaceCard"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "NestedCard" } as const

/**
 * One inner section of a {@link NestedCard}, in display order. Re-exported under
 * this folder's own name so a caller building item data doesn't have to reach
 * into `composites/cards/SurfaceCard` directly — same shape either way.
 */
export type { SurfaceCardNestedSection as NestedCardItem }

/** Props for {@link NestedCard}. */
export interface NestedCardProps {
    /** Header title (quiet eyebrow label, e.g. "Related lessons"). */
    title: string
    /** Optional leading icon before the title, signalling the group kind — a component reference, not a built element. */
    icon?: ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>
    /** The card's inner sections, in display order. REQUIRED — a repeating list is data. */
    items: ReadonlyArray<SurfaceCardNestedSection>
    /**
     * Surface-in-surface: border instead of shadow — when the parent already has a
     * fill (a `bg-surface` panel, a `bg-surface-secondary` bubble, a modal/page
     * card). Pass `bordered` only when rendering directly on `bg-background` with
     * no parent surface underneath.
     */
    bordered?: boolean
    /** `true` → every part this card owns mirrors itself as a shimmer. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * Card-inside-card WITH HEADERS: quiet header (icon + title) + a flush stack of
 * sections separated by dividers (no per-row rounded borders).
 *
 * Thin adapter over `SurfaceCardNested` (`composites/cards/SurfaceCard`) — the
 * ONE canon frame this shape lives under (eight sibling card frames folded into
 * one namespace, instructor's call, 2026-07-25). Kept as its own named export
 * under `blocks/cards/NestedCard` for the call sites that still reach for
 * `NestedCard` by that name.
 *
 * @param props - See {@link NestedCardProps}.
 */
export const NestedCard = ({ title, icon, items, bordered = false, isSkeleton = false, classNames }: NestedCardProps) => (
    <SurfaceCardNested
        title={title}
        icon={icon}
        items={items}
        variant={bordered ? "nested" : "surface"}
        isSkeleton={isSkeleton}
        classNames={classNames}
    />
)
