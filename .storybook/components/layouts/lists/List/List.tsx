import React from "react"
import type { ReactNode } from "react"
import { Label, Switch, cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { TitledText } from "@sb-components/layouts/text/TitledText/TitledText"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `List.*`, the ONE row/list KHUNG namespace
 * (teacher's call 2026-07-25, canon §13). Four sibling frames that used to live as
 * four loose folders (`lists/ListRow` · `lists/LabeledList` · `lists/MetaRow` ·
 * `list/SettingToggleRow`) are now MEMBERS of one namespace — same tier, same
 * job (arranging elements into a ROW / a LIST), one import.
 *
 * | Member | Shape | Content channel |
 * |---|---|---|
 * | `.Row` | 1 generic list row | data props (`leading`/`title`/`subtitle`/`meta`/`trailing`) |
 * | `.Labeled` | label + REPEATING list (+CTA) | **`items` — children FORBIDDEN** |
 * | `.Meta` | 1 inline meta row | `chip` + **`items`** (meta segments) |
 * | `.ToggleRow` | 1 settings row with a switch | data props (`label`/`description`/`checked`) |
 *
 * KHUNG API LAW (§13b):
 * - A REPEATING-LIST frame (`.Labeled`) MUST receive `items` data — children are FORBIDDEN.
 * - A single-ROW frame (`.Row` / `.Meta` / `.ToggleRow`) receives named data props, does NOT
 *   accept free-form children: the row is a FIXED shape (leading · text · meta/trailing),
 *   free-form content is the design/block tier's job.
 * - Namespace only — no bare component export.
 *
 * Each member's behaviour/skin is kept VERBATIM from the old folder; this is an API
 * refactor, not a visual refactor. Synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// .Row — the generic GitHub-style list row (was `lists/ListRow`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link List.Row}. */
export interface ListRowProps {
    /**
     * Optional leading node rendered before the text column, kept at its
     * intrinsic size (icon or avatar). Does not shrink.
     */
    leading?: ReactNode
    /**
     * Primary line of the row. Rendered as medium-weight foreground text and
     * truncated to a single line when it overflows.
     */
    title: ReactNode
    /**
     * Optional secondary line shown beneath the title in muted, smaller text and
     * truncated to a single line.
     */
    subtitle?: ReactNode
    /**
     * Optional right-aligned metadata (chips / counts / timestamps) rendered
     * before the trailing node.
     */
    meta?: ReactNode
    /**
     * Optional far-right node, typically a chevron or inline action, rendered
     * after the meta content.
     */
    trailing?: ReactNode
    /**
     * When true, adds a bottom border so consecutive same-type rows read as a
     * separated list. Omit on the final row of a group.
     */
    divider?: boolean
    /**
     * Optional press handler. When provided (or {@link ListRowProps.href} is
     * set) the row becomes interactive with a hover surface and is keyboard /
     * screen-reader accessible.
     */
    onPress?: () => void
    /**
     * Optional link target. When provided the row renders as an anchor so the
     * whole row navigates on click.
     */
    href?: string
    /**
     * `true` → render the skeleton mirror (leading tile only when `leading` is
     * passed, title bar + subtitle bar per the real text column) instead of the
     * live row. The consumer only flips the flag — same as `Button.isSkeleton`.
     */
    isSkeleton?: boolean
    /** Extra classes merged onto the root element via `cn`. */
    className?: string
    /**
     * When `true`, each composed part (leading / title-text / meta-trailing
     * cluster) emits `data-anat-part="<name>"` so a BlockAnatomy panel can badge
     * it on-render. Off by default (production).
     */
    showAnatomy?: boolean
}

/** Non-empty stand-in so `TitledText` counts the line and draws its bar. */
const SKELETON_LINE = "—"

/**
 * The row's skeleton mirror — SAME frame (`flex items-center gap-3 py-2`) and the
 * same two/three nodes as the live row, so a loading list holds the real shape.
 * Shared by {@link List.Row}'s own `isSkeleton` and by {@link List.Labeled}'s
 * loading state (which has no items yet to mirror).
 */
const RowSkeleton = ({
    hasLeading = false,
    hasSubtitle = false,
    className,
    showAnatomy = false,
}: {
    hasLeading?: boolean
    hasSubtitle?: boolean
    className?: string
    showAnatomy?: boolean
}) => (
    <div className={cn("flex min-w-0 items-center gap-3 py-2", className)}>
        {hasLeading ? (
            <HeroSkeleton className="size-5 shrink-0 rounded" data-anat-part={showAnatomy ? "Leading" : undefined} />
        ) : null}
        {/* `TitledText` mirrors per LINE PRESENCE, so the placeholder text just has
            to be non-empty — it is never rendered while `isSkeleton` is on. */}
        <TitledText
            title={SKELETON_LINE}
            subtitle={hasSubtitle ? SKELETON_LINE : undefined}
            isSkeleton
            className="flex-1"
            anatPart={showAnatomy ? "TitledText" : undefined}
        />
    </div>
)

/**
 * Generic GitHub-style list row designed to live inside a card frame or any
 * vertical list. Lays out an optional leading icon/avatar, a title + optional
 * subtitle text column, and a right-aligned meta + trailing cluster. Adapts
 * between a static `<div>`, an interactive `role="button"` row (keyboard
 * accessible), and an `<a>` anchor depending on `onPress` / `href`.
 *
 * @param props - {@link ListRowProps}
 */
const Row = ({
    leading,
    title,
    subtitle,
    meta,
    trailing,
    divider = false,
    onPress,
    href,
    isSkeleton = false,
    className,
    showAnatomy = false,
}: ListRowProps) => {
    const isPressable = Boolean(onPress || href)

    const baseClassName = cn(
        "flex min-w-0 items-center gap-3 py-2",
        divider && "border-b border-separator",
        isPressable &&
            "rounded-2xl transition-colors hover:bg-surface-secondary focus-visible:bg-surface-secondary focus-visible:outline-none",
        className,
    )

    if (isSkeleton) {
        return (
            <RowSkeleton
                hasLeading={Boolean(leading)}
                hasSubtitle={Boolean(subtitle)}
                className={cn(divider && "border-b border-separator", className)}
                showAnatomy={showAnatomy}
            />
        )
    }

    const content = (
        <>
            {leading ? (
                <div className="shrink-0" data-anat-part={showAnatomy ? "Leading" : undefined}>
                    {leading}
                </div>
            ) : null}
            {/* title (body-sm medium) + muted subtitle = one TitledText, truncated */}
            <TitledText title={title} subtitle={subtitle} truncate anatPart={showAnatomy ? "TitledText" : undefined} />
            {meta || trailing ? (
                <div
                    className="ml-auto flex shrink-0 items-center gap-2"
                    data-anat-part={showAnatomy ? "MetaTrailing" : undefined}
                >
                    {meta}
                    {trailing}
                </div>
            ) : null}
        </>
    )

    if (href) {
        return (
            <a href={href} onClick={onPress} className={baseClassName}>
                {content}
            </a>
        )
    }

    if (onPress) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onPress}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onPress()
                    }
                }}
                className={cn(baseClassName, "cursor-pointer")}
            >
                {content}
            </div>
        )
    }

    return <div className={baseClassName}>{content}</div>
}

// ─────────────────────────────────────────────────────────────────────────────
// .Labeled — label + repeating list (+ CTA), no card frame (was `LabeledList`)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One row of a {@link List.Labeled} — the SAME data shape as {@link List.Row}
 * (which renders it), plus a stable React key. `isSkeleton`/`showAnatomy` are
 * owned by the frame, not by the item.
 */
export interface ListLabeledItem extends Omit<ListRowProps, "isSkeleton" | "showAnatomy"> {
    /** Stable React key. */
    key: string
}

/** Props for {@link List.Labeled}. */
export interface ListLabeledProps {
    /** Section label (text) shown above the list. */
    label: ReactNode
    /** Optional leading icon before the label (e.g. a phosphor `*Icon`). */
    icon?: ReactNode
    /**
     * The rows, in reading order. REQUIRED — a REPEATING list is DATA, not
     * children (§13b). Empty → renders {@link ListLabeledProps.emptyState}.
     */
    items: ReadonlyArray<ListLabeledItem>
    /**
     * Optional footer action pinned below the list (e.g. a primary CTA button).
     * Rendered as the third group, `gap-3` from the list.
     */
    action?: ReactNode
    /**
     * Shown in the list slot when `items` is empty — so empty reads as
     * intentional. Omit and an empty list simply renders nothing under the label.
     */
    emptyState?: ReactNode
    /**
     * `true` → render a skeleton mirror list ({@link ListLabeledProps.skeletonRows}
     * placeholder rows) instead of the live rows. The label header + `gap-2` list
     * frame stay put, so the panel doesn't jump when data arrives.
     */
    isSkeleton?: boolean
    /** Placeholder row count while `isSkeleton`. Defaults to `3`. */
    skeletonRows?: number
    /** Extra classes on the outer section. */
    className?: string
    /** Storybook-only: badge this composite's OWN direct parts for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * A labeled vertical list — NO card frame: an icon + `Label` header, a `gap-2`
 * stack of {@link List.Row}s built from `items`, and an optional footer action,
 * with the three groups spaced `gap-3` (label ↔ list ↔ action). For rail / panel
 * blocks that are a "label + short list (+ CTA)" where a full card would be too
 * heavy (e.g. the lesson rail's review / practice panels).
 *
 * @param props - {@link ListLabeledProps}
 */
const Labeled = ({
    label,
    icon,
    items,
    action,
    emptyState,
    isSkeleton = false,
    skeletonRows = 3,
    className,
    showAnatomy = false,
}: ListLabeledProps) => {
    const rows = isSkeleton
        ? Array.from({ length: skeletonRows }, (_unused, index) => (
            <RowSkeleton key={index} hasSubtitle showAnatomy={showAnatomy} />
        ))
        : items.length === 0
            ? emptyState ?? null
            : items.map(({ key, ...item }) => <Row key={key} {...item} showAnatomy={showAnatomy} />)

    return (
        <section className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center gap-2" data-anat-part={showAnatomy ? "Header" : undefined}>
                {icon}
                <Label>{label}</Label>
            </div>
            <div className="flex flex-col gap-2" data-anat-part={showAnatomy ? "List" : undefined}>{rows}</div>
            {action ? <div data-anat-part={showAnatomy ? "Action" : undefined}>{action}</div> : null}
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Meta — inline meta line: signal chip + dot-joined segments (was `MetaRow`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link List.Meta}. */
export interface ListMetaProps {
    /**
     * Optional leading signal chip — the ONE prominent token in the row (e.g. a
     * warning `Chip.Base` for a deadline). Omit for a plain muted meta line.
     */
    chip?: ReactNode
    /**
     * Neutral secondary meta segments, rendered muted and joined by a middot `·`.
     * REQUIRED — a REPEATING list is data (§13b). Each entry is one segment
     * (e.g. `["Question 7 / 8", "Middle"]`).
     */
    items: ReadonlyArray<ReactNode>
    /** Extra classes on the row root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * Dev/spec: tag this row's own direct parts (`Chip` / `Meta`) so a
     * BlockAnatomy panel can badge them.
     */
    showAnatomy?: boolean
}

/**
 * A single inline META ROW: an optional leading SIGNAL chip (the one prominent
 * token — e.g. a `Chip.Base`) followed by neutral secondary meta segments joined
 * by a middot `·`, all muted. Consolidates the dot-separated meta line hand-rolled
 * across many blocks. The chip carries the ONE signal; everything after stays
 * muted (principles §2 color-prominence).
 *
 * @param props - {@link ListMetaProps}
 */
const Meta = ({ chip, items, className, anatPart, showAnatomy = false }: ListMetaProps) => (
    <div className={cn("flex min-w-0 items-center gap-2", className)} data-anat-part={anatPart}>
        {chip ? <span className="shrink-0" data-anat-part={showAnatomy ? "Chip" : undefined}>{chip}</span> : null}
        {items.length > 0 ? (
            <Typography.Base size="xs"
                text={(
                    <>
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 ? <span aria-hidden className="mx-1">·</span> : null}
                                {item}
                            </React.Fragment>
                        ))}
                    </>
                )}
                color="muted"
                truncate
                className="min-w-0"
                showAnatomy={showAnatomy}
            />
        ) : null}
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// .ToggleRow — settings row with a trailing Switch (was `SettingToggleRow`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link List.ToggleRow}. */
export interface ListToggleRowProps {
    /**
     * Row label — short, single line (e.g. "Khoá hồ sơ").
     */
    label: string
    /**
     * Optional muted hint under the label explaining what the toggle does.
     */
    description?: string
    /**
     * Current toggle state (controlled).
     */
    checked: boolean
    /**
     * Fires with the next state when the switch is toggled.
     */
    onCheckedChange: (checked: boolean) => void
    /**
     * Disables the switch (e.g. a lock row overriding a whole group). The row
     * also dims to signal it's inert, matching the hand-roll's
     * `aria-disabled` + opacity treatment on the gated section-visibility group.
     */
    isDisabled?: boolean
    /** Extra classes on the row root. */
    className?: string
    /** `true` → render the skeleton mirror (label + desc bars, switch pill). Consumer just flips the flag. */
    isSkeleton?: boolean
    /**
     * Storybook-only: when true, each composed part (`TitledText` / `Switch`)
     * emits a `data-anat-part` so the anatomy panel can anchor badges. No
     * visual effect.
     */
    showAnatomy?: boolean
}

/**
 * Generic settings row: a label (+ optional muted description) on the left, a
 * HeroUI `Switch` pinned to the right. Presentational — the caller owns
 * persistence/state; this row only reports the next boolean via
 * {@link ListToggleRowProps.onCheckedChange}.
 *
 * Grounded in the hand-roll toggle rows in `src/components/features/profile/
 * PrivacySettings` (the "Khoá hồ sơ" lock row + the per-section visibility rows).
 *
 * @param props - {@link ListToggleRowProps}
 */
const ToggleRow = ({
    label,
    description,
    checked,
    onCheckedChange,
    isDisabled = false,
    className,
    isSkeleton = false,
    showAnatomy = false,
}: ListToggleRowProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                {/* title↔description stack = TitledText (skeleton mirror delegated) */}
                <TitledText
                    title={label}
                    subtitle={description}
                    isSkeleton
                    className="flex-1"
                    anatPart={showAnatomy ? "TitledText" : undefined}
                />
                <Choice.Switch
                    isSkeleton
                    isSelected={false}
                    onValueChange={() => undefined}
                    className="shrink-0"
                    anatPart={showAnatomy ? "Choice.Switch" : undefined}
                />
            </div>
        )
    }
    return (
        <div className={cn("flex items-center gap-3", isDisabled && "opacity-50", className)}>
            {/* label (body-sm medium) + muted description = one TitledText row */}
            <TitledText
                title={label}
                subtitle={description}
                className="flex-1"
                anatPart={showAnatomy ? "TitledText" : undefined}
            />
            <Switch
                className="shrink-0"
                isSelected={checked}
                isDisabled={isDisabled}
                onChange={onCheckedChange}
                aria-label={label}
                data-anat-part={showAnatomy ? "Switch" : undefined}
            >
                <Switch.Content>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                </Switch.Content>
            </Switch>
        </div>
    )
}

/**
 * The row/list KHUNG namespace — every "row · list" frame in the design system,
 * one import, four members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Row` | data props (`leading`/`title`/`subtitle`/`meta`/`trailing`) |
 * | `.Labeled` | `items` (children FORBIDDEN) |
 * | `.Meta` | `chip` + `items` |
 * | `.ToggleRow` | data props (`label`/`description`/`checked`) |
 */
export const List = {
    Row,
    Labeled,
    Meta,
    ToggleRow,
}
