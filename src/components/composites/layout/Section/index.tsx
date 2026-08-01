import { isValidElement } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography, type TypographySize } from "@/components/atoms/text/Typography"
import { GAP_CLASS, type AllowedGap } from "@/components/frames/_spacing"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE TIER (§13) — `Section.*`, the frame of a REGION inside a page.
 *
 * A section is the region between a page and a card: a titled band of a route
 * ("My courses", "Recent activity") that owns NO chrome of its own — no
 * surface fill, no border, no radius, no padding. It only stacks a header, a
 * body and an optional footer at ONE rhythm (§10).
 *
 * ⚠️ NOT `SectionCard` (design tier, `blocks/cards/SectionCard`): that one IS a
 * card — HeroUI `Card` chrome (border + radius + padding), an `accent` skin, a
 * `withVerdict` DATA band and its own `isSkeleton` mirror. `SectionCard` is the
 * SURFACE a section's body may sit ON; `Section` is the bare frame AROUND it.
 * Rule of thumb: needs a bounded surface ⇒ `SectionCard`/`SurfaceCard.*`; only
 * needs "title + content in one vertical rhythm" ⇒ `Section.*`.
 *
 * ⚠️ NOT `PageHeader` either: that is the chrome of a whole ROUTE (breadcrumb +
 * H3 title + meta strip), ONE per page. `SectionHeader` is the header of a
 * region INSIDE that page, many per page, and scales down via `level`.
 *
 * KHUNG API LAW (§13b):
 * - `.Base` is a WRAPPER frame → named slots `header`/`body`/`footer` are the
 *   main road; `children` stays as shorthand for `body`.
 * - `.Header` is NOT a generic wrapper — it owns semantic slots
 *   (`eyebrow`/`title`/`description`/`action`) and takes no `children`.
 * - No repeating list here, so no `items` member (§13b list clause N/A).
 * - Namespace only — no bare component export.
 *
 * §10: the vertical rhythm is a TYPED token ({@link AllowedGap}), not a free number —
 * the frame cannot be asked for an off-scale step.
 * §13c: text goes through the `Typography.*` ATOM, never a hand-rolled `<p>`;
 * `action` takes a `Button.*` atom node from the caller (the frame stays
 * feature-less — it never decides WHAT the action is).
 * ─────────────────────────────────────────────────────────────────────────────
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

/** level → the text size each line uses. A DATA table — the call-site never chooses it by hand. */
const TITLE_SIZE: Record<SectionLevel, TypographySize> = { 1: "lg", 2: "base", 3: "sm" }
const DESCRIPTION_SIZE: Record<SectionLevel, TypographySize> = { 1: "sm", 2: "sm", 3: "xs" }
const EYEBROW_SIZE: Record<SectionLevel, TypographySize> = { 1: "sm", 2: "xs", 3: "xs" }
/** §9b: the two top ranks read as headings (bold); the sub-section rank is only emphasized (medium). */
const TITLE_WEIGHT: Record<SectionLevel, "bold" | "medium"> = {
    1: "bold",
    2: "bold",
    3: "medium"}

/** Props for {@link SectionHeader}. */
export interface SectionHeaderProps {
    /** The region's title. Plain text, or any inline node (e.g. a title + chip row). */
    title: ReactNode
    /** Supporting line under the title, muted. Omit when the title says it all. */
    description?: ReactNode
    /** Muted kicker ABOVE the title — context, not a second title (e.g. a course name). */
    eyebrow?: ReactNode
    /**
     * Right-aligned control slot — pass a `Button.*` atom node ("View all",
     * "Manage"). Rendered `shrink-0` so it never squeezes the title column. The
     * frame never decides WHAT the action does (that would be a feature, §13).
     */
    action?: ReactNode
    /** Heading rank → the text scale of every line. Default `2`. */
    level?: SectionLevel
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /** Anatomy tag: names this part so a parent's BlockAnatomy panel can badge it. */
    /** `true` → each part emits `data-anat-part` for a BlockAnatomy panel. No visual effect. */
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
    action,
    level = 2,
    classNames}: SectionHeaderProps) => {
    const titleSize = TITLE_SIZE[level]
    const descriptionSize = DESCRIPTION_SIZE[level]
    const eyebrowSize = EYEBROW_SIZE[level]
    // eyebrow ↔ title ↔ description are ONE text unit → tight gap={2} (§10b
    // "inside a lower-tier component"), not the grouped gap={4} used BETWEEN regions.
    const titleBlock = (
        <>
            {eyebrow != null ? (
                <span className="min-w-0">
                    <Typography size={eyebrowSize} text={eyebrow} color="muted" truncate />
                </span>
            ) : null}
            <span className="min-w-0">
                <Typography size={titleSize} text={title} weight={TITLE_WEIGHT[level]} />
            </span>
            {description != null ? (
                <span className="min-w-0">
                    <Typography size={descriptionSize} text={description} color="muted" />
                </span>
            ) : null}
        </>
    )
    return (
        // align="start": a 2-line title block keeps the action anchored at the top.
        <StackH
            align="start"
            justify="between"
            gap={4}
            classNames={classNames}
            body={
                <>
                    <StackV gap={2} pattern="title-subtitle" classNames={["min-w-0"]} body={titleBlock} />
                    {action != null ? (
                        <div className="shrink-0">{action}</div>
                    ) : null}
                </>
            }
        />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the region frame itself
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The `header` channel of {@link Section}: either the PROPS of
 * {@link SectionHeader} (the frame builds it — the main road) or a ready node
 * (an escape hatch for a header the section did not author, e.g. a toolbar row).
 */
export type SectionHeaderSlot = SectionHeaderProps | ReactNode

/** Props for {@link Section}. */
export interface SectionBaseProps {
    /**
     * Top region. Pass {@link SectionHeaderProps} (`{ title, description… }`) and
     * the frame renders a {@link SectionHeader} itself; pass a node and it is
     * rendered as-is.
     */
    header?: SectionHeaderSlot
    /** Main region. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /** Bottom region (a closing CTA row, a caption, a "see more" link). */
    footer?: ReactNode
    /** Shorthand for {@link SectionBaseProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
    /**
     * Vertical rhythm between header ↔ body ↔ footer, on the §10c scale ONLY.
     * Default `{6}` (`gap-6`) — the rhythm between regions of a page. Drop to
     * `{4}` (`gap-3`) when the header is just a label over a tight list.
     */
    gap?: AllowedGap
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /** Anatomy tag: names this part so a parent's BlockAnatomy panel can badge it. */
    /** `true` → each region emits `data-anat-part` for a BlockAnatomy panel. No visual effect. */
}

/** A header slot is PROPS only when it is a plain object (not an element/array/string). */
const isHeaderProps = (header: SectionHeaderSlot): header is SectionHeaderProps =>
    typeof header === "object"
    && header !== null
    && !isValidElement(header)
    && !Array.isArray(header)

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
    body,
    footer,
    children,
    gap = 6,
    classNames}: SectionBaseProps) => {
    const main = body ?? children
    const headerNode = header == null
        ? null
        : isHeaderProps(header)
            // props form → the frame builds ITS OWN SectionHeader (a fixed internal
            // choice, not arbitrary caller content) — badge that real component
            // directly rather than the generic wrapping div below.
            ? <Header {...header} />
            : header
    return (
        <section
            className={cn("flex flex-col", GAP_CLASS[gap], classNames)}
            data-tier="composite"
            data-component="Section"
            data-principles={gap === 6 ? "block-boundary" : undefined}
        >
            {headerNode != null ? (
                <div>{headerNode}</div>
            ) : null}
            {main != null ? (
                <div>{main}</div>
            ) : null}
            {footer != null ? (
                <div>{footer}</div>
            ) : null}
        </section>
    )
}

/**
 * The section frame namespace — the frame of a region inside a page, two members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `header`/`body`/`footer` slots (+ `children` = body), `gap` on the §10 scale |
 * | `.Header` | `eyebrow`/`title`/`description`/`action` + `level` (no children) |
 */
export { Base as Section, Header as SectionHeader }
