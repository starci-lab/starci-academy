import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Typography, type TypographySize } from "@sb-components/atoms/text/Typography/Typography"
import { GAP_CLASS, type AllowedGap } from "@sb-components/frames/_spacing"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `Section` — the frame for one region of a page: it stacks `header` / `body` / `footer` along
 * one vertical rhythm (`gap`) and nothing else. No chrome (no background, border, radius, or
 * padding) — the surface lives inside it (`SurfaceCard.*`/`SectionCard`). Distinct from
 * `SectionCard`, which is an actual card with chrome. Owns only slot combination and `gap`.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Section" } as const

// ─────────────────────────────────────────────────────────────────────────────
// Shared scale
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// .Header — eyebrow · title · description · action
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Heading rank of a section header — picks the `Typography.*` member for every
 * line at once (title + description + eyebrow move together, so a header never
 * mixes scales by hand).
 *
 * `1` = the biggest band of a page · `2` (default) = a normal section ·
 * `3` = a sub-section nested under another header.
 */
export type SectionLevel = 1 | 2 | 3

/** level -> the text size each line uses. A DATA table — the call-site never chooses it by hand. */
const TITLE_SIZE: Record<SectionLevel, TypographySize> = { 1: "lg", 2: "base", 3: "sm" }
const DESCRIPTION_SIZE: Record<SectionLevel, TypographySize> = { 1: "sm", 2: "sm", 3: "xs" }
const EYEBROW_SIZE: Record<SectionLevel, TypographySize> = { 1: "sm", 2: "xs", 3: "xs" }
/** §9b: the two top ranks read as headings (bold); the sub-section rank is only emphasized (medium). */
const TITLE_WEIGHT: Record<SectionLevel, "bold" | "medium"> = {
    1: "bold",
    2: "bold",
    3: "medium",
}

/** Props for {@link SectionHeader}. */
export interface SectionHeaderProps {
    /** The region's title. The frame wraps it in `Typography` itself (COMPOSITE-8). */
    title: string
    /** Supporting line under the title, muted. Omit when the title says it all. The frame wraps it in `Typography` itself (COMPOSITE-8). */
    description?: string
    /** Muted kicker ABOVE the title — context, not a second title (e.g. a course name). The frame wraps it in `Typography` itself (COMPOSITE-8). */
    eyebrow?: string
    /**
     * Right-aligned control slot — a COMPONENT reference (COMPOSITE-8) the frame
     * calls itself, usually rendering a `Button.*` atom node ("View all",
     * "Manage"). Rendered `shrink-0` so it never squeezes the title column. The
     * frame never decides WHAT the action does (that would be a feature, §13).
     */
    action?: ComponentTypeWithSkeleton
    /** Heading rank -> the text scale of every line. Default `2`. */
    level?: SectionLevel
    /**
     * `true` -> `title`/`description`/`eyebrow` switch to shimmer, and `action`
     * (if any) is CALLED with `isSkeleton` too (COMPOSITE-8 — `action` is a
     * component reference this frame calls itself, so the flag reaches inside
     * it the same way it reaches the text lines).
     */
    isSkeleton?: boolean
}

/**
 * The header of a section: an optional eyebrow + a title + an optional
 * description stacked on the left, an optional action pinned right.
 *
 * Carries no surface of its own — it sits directly on the page background (or
 * inside whatever surface the caller already opened).
 *
 * @param props - {@link SectionHeaderProps}
 */
const Header = ({
    title,
    description,
    eyebrow,
    action: Action,
    level = 2,
    isSkeleton = false,
    
}: SectionHeaderProps) => {
    const titleSize = TITLE_SIZE[level]
    const descriptionSize = DESCRIPTION_SIZE[level]
    const eyebrowSize = EYEBROW_SIZE[level]
    // eyebrow <-> title <-> description are ONE text unit -> tight gap={2} (§10b
    // "inside a lower-tier component"), not the grouped gap={4} used BETWEEN regions.
    return (
        // align="start": a 2-line title block keeps the action anchored at the top.
        <StackH
            align="start"
            justify="between"
            gap={4}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <StackV
                        gap={2}
                        principle="title-subtitle"
                        explain="Eyebrow/title/description stack — not label-field, because none of these lines labels a form control."
                        classNames={["min-w-0"]}
                        isSkeleton={isSkeleton}
                        items={[
                            ...(eyebrow != null ? [() => (
                                <span className="min-w-0">
                                    <Typography size={eyebrowSize} text={eyebrow} color="muted" truncate isSkeleton={isSkeleton} />
                                </span>
                            )] : []),
                            () => (
                                <span className="min-w-0">
                                    <Typography size={titleSize} text={title} weight={TITLE_WEIGHT[level]} isSkeleton={isSkeleton} />
                                </span>
                            ),
                            ...(description != null ? [() => (
                                <span className="min-w-0">
                                    <Typography size={descriptionSize} text={description} color="muted" isSkeleton={isSkeleton} />
                                </span>
                            )] : []),
                        ]}
                    />
                ),
                ...(Action != null ? [() => (
                    <div className="shrink-0"><Action isSkeleton={isSkeleton} /></div>
                )] : []),
            ]}
        />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the region frame itself
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The `header` channel of {@link Section}: either the PROPS of
 * {@link SectionHeader} (the frame builds it — the main road) or a COMPONENT
 * reference (COMPOSITE-8, an escape hatch for a header the section did not
 * author, e.g. a toolbar row) — the frame calls it itself so `isSkeleton` can
 * reach inside it.
 */
export type SectionHeaderSlot = SectionHeaderProps | ComponentTypeWithSkeleton

/** Props for {@link Section}. */
export interface SectionBaseProps {
    /**
     * Top region. Pass {@link SectionHeaderProps} (`{ title, description… }`) and
     * the frame renders a {@link SectionHeader} itself; pass a COMPONENT
     * reference and the frame calls it itself, forwarding `isSkeleton`.
     */
    header?: SectionHeaderSlot
    /** Main region, as a COMPONENT reference (COMPOSITE-8) — the frame calls it itself so `isSkeleton` can reach inside it. */
    body?: ComponentTypeWithSkeleton
    /** Bottom region (a closing CTA row, a caption, a "see more" link), as a COMPONENT reference (COMPOSITE-8) — same contract as `body`. */
    footer?: ComponentTypeWithSkeleton
    /**
     * Vertical rhythm between header <-> body <-> footer, on the §10c scale ONLY.
     * Default `{6}` (`gap-6`) — the rhythm between regions of a page. Drop to
     * `{4}` (`gap-3`) when the header is just a label over a tight list.
     */
    gap?: AllowedGap
    /**
     * `true` -> forwarded into whichever of `header`/`body`/`footer` renders
     * (COMPOSITE-8 — each is a component reference this frame calls itself, so
     * the flag reaches inside every one of them).
     */
    isSkeleton?: boolean
}

/** A header slot is PROPS only when it is a plain object (not a component reference). */
const isHeaderProps = (header: SectionHeaderSlot): header is SectionHeaderProps =>
    typeof header === "object" && header !== null

/**
 * The region frame — a semantic `<section>` that stacks header / body / footer at
 * ONE typed rhythm and nothing else. No fill, no border, no radius, no padding:
 * a section is a BAND of a page, so the surfaces live INSIDE it (its body is
 * usually a `SurfaceCard.*` / `SectionCard` / a grid of them).
 *
 * @param props - {@link SectionBaseProps}
 */
const Base = ({
    header,
    body: Body,
    footer: Footer,
    gap = 6,
    isSkeleton = false,
    
}: SectionBaseProps) => {
    let headerNode: ReactNode = null
    if (header != null) {
        if (isHeaderProps(header)) {
            // props form -> the frame builds ITS OWN SectionHeader (a fixed internal
            // choice, not arbitrary caller content) — badge that real component
            // directly rather than the generic wrapping div below.
            headerNode = <Header {...header} isSkeleton={isSkeleton} />
        } else {
            const HeaderSlot = header
            headerNode = <HeaderSlot isSkeleton={isSkeleton} />
        }
    }
    return (
        <section
            className={cn("flex flex-col", GAP_CLASS[gap])}

            data-tier="composite"
            data-component="Section"
            data-principle={gap === 6 ? "block-boundary" : undefined}
        >
            {headerNode != null ? (
                <div>{headerNode}</div>
            ) : null}
            {Body != null ? (
                <div><Body isSkeleton={isSkeleton} /></div>
            ) : null}
            {Footer != null ? (
                <div><Footer isSkeleton={isSkeleton} /></div>
            ) : null}
        </section>
    )
}

/**
 * The section frame namespace — the frame of a region inside a page, two members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `header`/`body`/`footer` slots, `gap` on the §10 scale |
 * | `.Header` | `eyebrow`/`title`/`description`/`action` + `level` (no children) |
 */
export { Base as Section, Header as SectionHeader }
