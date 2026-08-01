import React from "react"
import type { ComponentType, ReactNode } from "react"
import { Label, Switch, cn } from "@heroui/react"
import { TitledText } from "@sb-components/composites/text/TitledText/TitledText"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ChoiceSwitch } from "@sb-components/atoms/forms/Choice/Choice"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `List.*`, the ONE row/list FRAME namespace
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
 * FRAME API LAW (§13b):
 * - A REPEATING-LIST frame (`.Labeled`) MUST receive `items` data — children are FORBIDDEN.
 * - A single-ROW frame (`.Row` / `.Meta` / `.ToggleRow`) receives named data props, does NOT
 *   accept free-form children: the row is a FIXED shape (leading · text · meta/trailing),
 *   free-form content is the design/block tier's job.
 * - Namespace only — no bare component export.
 *
 * Each member's behaviour/skin is kept VERBATIM from the old folder; this is an API
 * refactor, not a visual refactor. Synced to `src` later.
 *
 * 2026-07-31: converted every slot the frame renders and is responsible for the
 * loading state of from `ReactNode` to a COMPONENT reference or `string`
 * (COMPOSITE-8) — `leading`/`meta`/`trailing`/`icon`/`action`/`emptyState`/`chip`
 * now take a component the frame calls itself, and `title`/`subtitle`/`label`/
 * `.Meta`'s `items` now take `string`, since the frame wraps them in its own
 * atom. See callers in this same folder's stories for the updated call shape.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "List" } as const

// ─────────────────────────────────────────────────────────────────────────────
// .Row — the generic GitHub-style list row (was `lists/ListRow`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link ListRow}. */
export interface ListRowProps {
    /**
     * Optional leading icon/avatar rendered before the text column, kept at its
     * intrinsic size (does not shrink). A COMPONENT reference (COMPOSITE-8) —
     * the row calls it itself, forwarding `isSkeleton`, instead of receiving an
     * already-built node it cannot shimmer.
     */
    leading?: ComponentTypeWithSkeleton
    /**
     * Primary line of the row. `string` — the row wraps it in `TitledText`
     * itself (COMPOSITE-8), rendered as medium-weight foreground text and
     * truncated to a single line when it overflows.
     */
    title: string
    /**
     * Optional secondary line shown beneath the title in muted, smaller text and
     * truncated to a single line. `string` for the same reason as `title`.
     */
    subtitle?: string
    /**
     * Optional right-aligned metadata (chips / counts / timestamps) rendered
     * before the trailing node. A COMPONENT reference (COMPOSITE-8); the row
     * only shows it once loaded, so it takes no `isSkeleton`.
     */
    meta?: ComponentType
    /**
     * Optional far-right component, typically a chevron or inline action,
     * rendered after the meta content. Same COMPONENT-reference contract as
     * {@link ListRowProps.meta}.
     */
    trailing?: ComponentType
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
    /** Layout utilities merged onto the root element, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
    /**
     * When `true`, each composed part (leading / title-text / meta-trailing
     * cluster) emits `data-anat-part="<name>"` so a BlockAnatomy panel can badge
     * it on-render. Off by default (production).
     */
    showAnatomy?: boolean
}

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
    leading: Leading,
    title,
    subtitle,
    meta: MetaSlot,
    trailing: TrailingSlot,
    divider = false,
    onPress,
    href,
    isSkeleton = false,
    classNames,
    showAnatomy = false,
}: ListRowProps) => {
    // Interactivity is a LOADED-state affordance only — a loading row is inert,
    // same as the old separate `RowSkeleton` never wired a role/href/onClick.
    const isPressable = !isSkeleton && Boolean(onPress || href)

    const baseClassName = cn(
        "flex min-w-0 items-center gap-3 py-2",
        divider && "border-b border-separator",
        isPressable &&
            "rounded-2xl transition-colors hover:bg-surface-secondary focus-visible:bg-surface-secondary focus-visible:outline-none",
        classNames,
    )

    // One render path: `leading` is now a COMPONENT reference (COMPOSITE-8), so the
    // row calls it itself and forwards `isSkeleton` — it decides how to shimmer, or
    // whether to shimmer at all; `title`/`subtitle` shimmer through `TitledText`'s
    // own `isSkeleton` (COMPOSITE-10 — the atom draws its own bar, this row only
    // forwards the flag); `meta`/`trailing` are ALSO component references, but a
    // loading row still omits them entirely rather than call them — that omission is
    // this composite's own call (COMPOSITE-10: it decides WHICH parts show).
    const content = (
        <>
            {Leading ? (
                <div className="shrink-0">
                    <Leading isSkeleton={isSkeleton} />
                </div>
            ) : null}
            <TitledText
                title={title}
                subtitle={subtitle}
                isSkeleton={isSkeleton}
                truncate
                anatPart={showAnatomy ? "TitledText" : undefined}
            />
            {!isSkeleton && (MetaSlot || TrailingSlot) ? (
                <StackH
                    gap={3}
                    classNames={["shrink-0"]}
                    className="ml-auto"
                    body={
                        <>
                            {MetaSlot ? <MetaSlot /> : null}
                            {TrailingSlot ? <TrailingSlot /> : null}
                        </>
                    }
                />
            ) : null}
        </>
    )

    if (!isSkeleton && href) {
        return (
            <a href={href} onClick={onPress} className={baseClassName} data-tier="composite" data-component="ListRow" data-principles="content-row">
                {content}
            </a>
        )
    }

    if (!isSkeleton && onPress) {
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
                data-tier="composite"
                data-component="ListRow"
                data-principles="content-row"
            >
                {content}
            </div>
        )
    }

    return (
        <div className={baseClassName} data-tier="composite" data-component="ListRow" data-principles="content-row">
            {content}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Labeled — label + repeating list (+ CTA), no card frame (was `LabeledList`)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One row of a {@link ListLabeled} — the SAME data shape as {@link ListRow}
 * (which renders it), plus a stable React key. `isSkeleton`/`showAnatomy` are
 * owned by the frame, not by the item.
 */
export interface ListLabeledItem extends Omit<ListRowProps, "isSkeleton" | "showAnatomy"> {
    /** Stable React key. */
    key: string
}

/** Props for {@link ListLabeled}. */
export interface ListLabeledProps {
    /** Section label shown above the list. `string` — the frame wraps it in `Label` itself (COMPOSITE-8). */
    label: string
    /**
     * Optional leading icon before the label (e.g. a phosphor `*Icon`). A
     * COMPONENT reference (COMPOSITE-8), never a built element.
     */
    icon?: ComponentType
    /**
     * The rows, in reading order. REQUIRED — a REPEATING list is DATA, not
     * children (§13b). Empty → renders {@link ListLabeledProps.emptyState}.
     */
    items: ReadonlyArray<ListLabeledItem>
    /**
     * Optional footer action pinned below the list (e.g. a primary CTA button).
     * Rendered as the third group, `gap-3` from the list, only once loaded. A
     * COMPONENT reference (COMPOSITE-8).
     */
    action?: ComponentType
    /**
     * Shown in the list slot when `items` is empty — so empty reads as
     * intentional. Omit and an empty list simply renders nothing under the label.
     * A COMPONENT reference (COMPOSITE-8).
     */
    emptyState?: ComponentType
    /**
     * `true` → render a skeleton mirror list ({@link ListLabeledProps.skeletonRows}
     * placeholder rows) instead of the live rows. The label header + `gap-2` list
     * frame stay put, so the panel doesn't jump when data arrives.
     */
    isSkeleton?: boolean
    /** Placeholder row count while `isSkeleton`. Defaults to `3`. */
    skeletonRows?: number
    /** Layout utilities on the outer section, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
    /** Storybook-only: badge this composite's OWN direct parts for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * A labeled vertical list — NO card frame: an icon + `Label` header, a `gap-2`
 * stack of {@link ListRow}s built from `items`, and an optional footer action,
 * with the three groups spaced `gap-3` (label ↔ list ↔ action). For rail / panel
 * blocks that are a "label + short list (+ CTA)" where a full card would be too
 * heavy (e.g. the lesson rail's review / practice panels).
 *
 * @param props - {@link ListLabeledProps}
 */
const Labeled = ({
    label,
    icon: Icon,
    items,
    action: Action,
    emptyState: EmptyState,
    isSkeleton = false,
    skeletonRows = 3,
    classNames,
    showAnatomy = false,
}: ListLabeledProps) => {
    // Skeleton placeholder rows go through the SAME `Row` the live list renders —
    // no second hand-built row shape to keep in sync (COMPOSITE-10). `title`/
    // `subtitle` are non-empty stand-ins: `TitledText` never renders them while
    // `isSkeleton`, only uses their presence to decide the bar count.
    const rows = isSkeleton
        ? Array.from({ length: skeletonRows }, (_unused, index) => (
            <Row key={index} title="—" subtitle="—" isSkeleton showAnatomy={showAnatomy} />
        ))
        : items.length === 0
            ? (EmptyState ? <EmptyState /> : null)
            : items.map(({ key, ...item }) => <Row key={key} {...item} showAnatomy={showAnatomy} />)

    return (
        // `as="section"` keeps the landmark tag while still routing the seam through the
        // frame (§13z) — `Stack`'s `as` prop was added 2026-07-29 for exactly this case.
        <StackV
            as="section"
            gap={4}
            classNames={classNames}
            body={
                <>
                    <StackH
                        gap={3}
                        body={
                            <>
                                {Icon ? <Icon /> : null}
                                <Label>{label}</Label>
                            </>
                        }
                    />
                    <StackV gap={3} body={rows} />
                    {/* `isSkeleton`-gated: while loading there is no data behind the CTA yet,
                        same reasoning as the `meta`/`trailing` omission on `Row` above. */}
                    {!isSkeleton && Action ? <div><Action /></div> : null}
                </>
            }
        />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Meta — inline meta line: signal chip + dot-joined segments (was `MetaRow`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link ListMeta}. */
export interface ListMetaProps {
    /**
     * Optional leading signal chip — the ONE prominent token in the row (e.g. a
     * warning `Chip` for a deadline). Omit for a plain muted meta line. A
     * COMPONENT reference (COMPOSITE-8), never a built element.
     */
    chip?: ComponentType
    /**
     * Neutral secondary meta segments, rendered muted and joined by a middot `·`.
     * REQUIRED — a REPEATING list is data (§13b). Each entry is one segment's
     * text (e.g. `["Question 7 / 8", "Middle"]`) — `string`, since the row wraps
     * every segment in `Typography` itself (COMPOSITE-8).
     */
    items: ReadonlyArray<string>
    /** Layout utilities on the row root, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
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
 * token — e.g. a `Chip`) followed by neutral secondary meta segments joined
 * by a middot `·`, all muted. Consolidates the dot-separated meta line hand-rolled
 * across many blocks. The chip carries the ONE signal; everything after stays
 * muted (principles §2 color-prominence).
 *
 * @param props - {@link ListMetaProps}
 */
const Meta = ({ chip: Chip, items, classNames, anatPart, showAnatomy = false }: ListMetaProps) => (
    <StackH
        gap={3}
        classNames={["min-w-0", ...(classNames ?? [])]}
        anatPart={anatPart}
        body={
            <>
                {Chip ? <span className="shrink-0"><Chip /></span> : null}
                {items.length > 0 ? (
                    <Typography size="xs"
                        text={(
                            <>
                                {items.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* The breathing room around the `·` comes from the whitespace
                                            IN the string itself, NOT a hand-typed `mx-1`: a child's own
                                            margin is a two-owner seam (§10a), and the `check-padding`
                                            gate catches exactly this spot (caught 2026-07-27). */}
                                        {index > 0 ? <span aria-hidden>{" · "}</span> : null}
                                        {item}
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                        color="muted"
                        truncate
                        classNames={["min-w-0"]}
                        showAnatomy={showAnatomy}
                    />
                ) : null}
            </>
        }
    />
)

// ─────────────────────────────────────────────────────────────────────────────
// .ToggleRow — settings row with a trailing Switch (was `SettingToggleRow`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link ListToggleRow}. */
export interface ListToggleRowProps {
    /**
     * Row label — short, single line (e.g. "Lock profile").
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
    /** Layout utilities on the row root, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
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
 * PrivacySettings` (the "lock profile" lock row + the per-section
 * visibility rows).
 *
 * @param props - {@link ListToggleRowProps}
 */
const ToggleRow = ({
    label,
    description,
    checked,
    onCheckedChange,
    isDisabled = false,
    classNames,
    isSkeleton = false,
    showAnatomy = false,
}: ListToggleRowProps) => (
    // One outer shape whether loading or not: same wrapper, same `TitledText` call
    // (it forwards `isSkeleton` to its own atom — COMPOSITE-10). Only the trailing
    // control itself still branches:
    // ATOM GAP (COMPOSITE-3): the house `ChoiceSwitch` atom always couples the
    // track to its OWN adjacent label (or none) — it has no "silent track, external
    // aria-label" mode. This row already shows the label via `TitledText`, so
    // reusing `ChoiceSwitch`'s label slot would print it twice; dropping it loses
    // the switch's accessible name entirely. The vendor `Switch` stays for the
    // REAL control on purpose; the SKELETON still mirrors through `ChoiceSwitch`
    // (a plain shimmer pill has no label to duplicate).
    <div className={cn(isDisabled && "opacity-50")}>
        <StackH
            gap={4}
            classNames={classNames}
            pattern="label-field"
            body={
                <>
                    <TitledText
                        title={label}
                        subtitle={description}
                        isSkeleton={isSkeleton}
                        classNames={["flex-1"]}
                        anatPart={showAnatomy ? "TitledText" : undefined}
                    />
                    {isSkeleton ? (
                        <ChoiceSwitch
                            isSkeleton
                            isSelected={false}
                            onValueChange={() => undefined}
                            classNames={["shrink-0"]}
                            showAnatomy={showAnatomy}
                        />
                    ) : (
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
                    )}
                </>
            }
        />
    </div>
)

/**
 * The row/list FRAME namespace — every "row · list" frame in the design system,
 * one import, four members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Row` | data props (`leading`/`title`/`subtitle`/`meta`/`trailing`) |
 * | `.Labeled` | `items` (children FORBIDDEN) |
 * | `.Meta` | `chip` + `items` |
 * | `.ToggleRow` | data props (`label`/`description`/`checked`) |
 */
export { Row as ListRow, Labeled as ListLabeled, Meta as ListMeta, ToggleRow as ListToggleRow }
