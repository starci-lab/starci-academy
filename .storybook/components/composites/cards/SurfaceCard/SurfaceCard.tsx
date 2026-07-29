import React, { useCallback, useEffect, useRef, useState } from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import Link from "next/link"
import { Accordion, Card, cn, Radio, RadioGroup, Skeleton as HeroSkeleton } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import { CaretDownIcon, CheckCircleIcon, CircleIcon, PlusIcon, XCircleIcon } from "@phosphor-icons/react"
import { type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { SurfaceCardHeader, surfaceSectionGap, surfaceFrame, type SurfaceLabelProps, type SurfaceCardVariant } from "@sb-components/composites/cards/SurfaceCard/surface-card-header"
import { type VerdictBand, type VerdictBandVariant, verdictBandClassName } from "@sb-components/composites/cards/verdict-band"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PADDING_CLASS, type SeamScale, type InsetScale } from "@sb-components/frames/_spacing"
import { Grid, type GridColumns } from "@sb-components/frames/Grid/Grid"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `SurfaceCard.*`, the ONE card KHUNG namespace
 * (instructor's call, 2026-07-25). Eight sibling card frames that used to live as eight loose
 * folders (`SurfaceCard` · `NestedCard` · `PressableCard` · `GroupPressableCard`
 * · `SurfaceListCard` · `SurfaceAccordionCard` · `CrossListCard` ·
 * `DashedPlaceholderCard`) are now MEMBERS of one namespace — same tier, same
 * job (laying out content within one card face), one import.
 *
 * KHUNG API LAW:
 * - Named slots are the main road: `header` / `body` / `footer`.
 * - `children` stays allowed on WRAPPER frames (`.Base` / `.Nested`) — it is
 *   shorthand for `body`.
 * - A REPEATING LIST must take DATA via `items`; children are forbidden there
 *   (`.List` · `.PressableGroup` · `.SelectableGroup` · `.Accordion` · `.CrossList`).
 * - Namespace only — no bare component export.
 *
 * Behaviour/skin of every member is carried over VERBATIM from its old folder;
 * this is an API refactor, not a visual one. Synced to `src` later.
 *
 * ⭐ `.Pressable` REMOVED, FOLDED INTO `.Base` (thầy 2026-07-29: "sao còn
 * .Pressable, thành isPressable là prop hết rồi mà?"). `Base` derives
 * `isPressable = Boolean(onPress || href)` internally — same convention
 * `List.Row` already used — instead of forcing the caller to import a second,
 * separate component for the exact same card face plus a press target. Every
 * `onPress`/`href`/`isDisabled`/`isSelected`/`actions`/`ariaLabel` capability
 * `.Pressable` used to own now lives on `SurfaceCardBaseProps`, unchanged in
 * behaviour (ripple, `active:scale-[0.97]`, the stretched-link `actions`
 * pattern) — only the entry point moved. `.PressableGroup` (the GRID of
 * press-target tiles) still exists — a repeating list is a genuinely different
 * shape (§13b) — but each tile now renders straight off `.Base`, not a
 * bespoke sibling.
 *
 * ⭐ NINTH MEMBER (decided 2026-07-26): `.SelectableGroup` — moved in from the
 * atom tier (`atoms/navigation/SelectableCardGroup`). It composes several cards
 * into ONE bounded, laid-out cluster, which is a layout-tier job, not an atom's
 * (§12a/§6b — an atom is a single leaf, not a composed grid). It is the SIBLING
 * of `.PressableGroup` — same "grid of cards" shape — differing in exactly one
 * axis: `.PressableGroup` is an ACTIONS grid of independent press targets
 * (`role="group"`, each tile its own `<button>`/`<a>`, optional decorative
 * `selected` ring with no enforced exclusivity); `.SelectableGroup` is a REAL
 * single-select control (`role="radiogroup"` via HeroUI `RadioGroup`/`Radio` —
 * React Aria roving tabindex + arrow-key navigation + enforced one-of-N value).
 * That is a DOM/interaction-contract difference, not a stylistic one, so it is
 * its own member (option A over folding a `selectedKey` prop into
 * `.PressableGroup` — the two can't share one underlying element shape).
 *
 * ⚠️ KNOWN DRIFT (do not fix in this pass): `.SelectableGroup` calls HeroUI
 * `Radio`/`RadioGroup` directly instead of going through the design system's
 * own `ChoiceRadio`/`ChoiceRadioGroup` atom
 * (`.storybook/components/atoms/forms/Choice/Choice.tsx`, which has its own
 * story). Every other member of this namespace composes lower-tier atoms; this
 * one reaches past them straight to HeroUI. Left as-is per instruction —
 * flagged here for a future pass.
 *
 * ⭐ THREE INDEPENDENT AXES (decided 2026-07-26) — three old `boolean` props that
 * looked like one idea ("smaller/lighter card") turned out to be THREE UNRELATED
 * dimensions. Merging them would kill real combinations (a nested card WITH a
 * bleed-edge image is a valid combo):
 *
 * | Old prop | New prop | Union | Default | Present on member |
 * |---|---|---|---|---|
 * | `bordered?: boolean` | `variant` | `"surface" \| "nested"` | `"surface"` | `.Base` `.Nested` `.List` `.Accordion` `.CrossList` |
 * | `flushContent?: boolean` | `padding` | `InsetScale` (from `_spacing`) | `3` | `.Base` |
 * | `compact?: boolean` | `radius` | `"xl" \| "3xl"` | `"3xl"` | `.Nested` |
 *
 * 1-1 mapping: `bordered` → `variant="nested"` · `flushContent` → `padding="flush"` ·
 * `compact` → `radius="xl"`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
// ─────────────────────────────────────────────────────────────────────────────
// Shared slot plumbing
// ─────────────────────────────────────────────────────────────────────────────
/** The named content slots every WRAPPER frame of this namespace accepts. */
interface SlotProps {
    /** Top slot INSIDE the frame (a title row, a toolbar). Optional. */
    header?: ReactNode
    /** Main slot. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /** Bottom slot INSIDE the frame (a CTA row, a caption). Optional. */
    footer?: ReactNode
    /** Shorthand for {@link SlotProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
}
/**
 * Resolves `header`/`body`/`footer`/`children` into ONE node. With neither
 * `header` nor `footer` the body is returned RAW, so a `children`-only call
 * renders the exact same DOM as before this refactor (no extra wrapper div).
 */
const composeSlots = ({ header, body, footer, children }: SlotProps): ReactNode => {
    const main = body ?? children
    if (header == null && footer == null) {
        return main
    }
    return (
        <StackV gap="grouped">
            {header != null ? <div>{header}</div> : null}
            {main != null ? <div>{main}</div> : null}
            {footer != null ? <div>{footer}</div> : null}
        </StackV>
    )
}
/**
 * Interactive anchor for a clickable row: an INTERNAL route (`/…`) → Next `<Link>`
 * (client-side push, keeps history); a protocol / external href → native `<a>`.
 */
const RowAnchor = ({
    href,
    onClick,
    ariaCurrent,
    className,
    children,
    anatPart,
}: {
    href: string
    onClick?: () => void
    ariaCurrent?: boolean
    className?: string
    children: ReactNode
    anatPart?: string
}) => {
    if (href.startsWith("/")) {
        return <Link href={href} onClick={onClick} aria-current={ariaCurrent ? "true" : undefined} className={className} data-anat-part={anatPart}>{children}</Link>
    }
    return <a href={href} onClick={onClick} aria-current={ariaCurrent ? "true" : undefined} className={className} data-anat-part={anatPart}>{children}</a>
}
/**
 * Discriminates the two accessible-name contracts for a PRESSABLE card: without
 * `actions` the content IS the card's label (optional `ariaLabel` only when the
 * content carries no readable text — an icon-only tile); WITH `actions` the
 * whole-card target becomes a transparent overlay with no visible text of its
 * own, so `ariaLabel` becomes REQUIRED.
 *
 * Named `ariaLabel` here (not `label`, thầy 2026-07-29 merge) — `SurfaceCardBaseProps`
 * already owns `label` for the VISIBLE section header above the card
 * ({@link SurfaceLabelProps.label}); reusing that name for the invisible
 * accessible-name of a pressable card would collide two unrelated concepts.
 */
type PressableActionsProps =
    | {
        /** No secondary controls — the whole card is ONE press target. */
        actions?: undefined
        /** Accessible name for the whole-card press target — only when content carries no readable text. */
        ariaLabel?: string
    }
    | {
        /**
         * Secondary interactive controls (buttons / menus) that live INSIDE the card
         * but act INDEPENDENTLY of the whole-card press — e.g. a "Continue" button +
         * an overflow menu on a course-progress card.
         *
         * Providing this switches the card to the accessible **stretched-link**
         * pattern: the whole-card target becomes a TRANSPARENT overlay that covers
         * the card, and these actions sit ABOVE it (later in source order + `z-10`)
         * so each stays separately clickable — instead of illegally nesting a
         * `<button>` inside the card's own `<button>`/`<a>`.
         */
        actions: ReactNode
        /** Accessible name for the whole-card press target. REQUIRED — the stretched overlay covers the card but has no visible text of its own. */
        ariaLabel: string
    }
// ─────────────────────────────────────────────────────────────────────────────
// .Base — the generic `bg-surface` content card (was `SurfaceCard`)
// ─────────────────────────────────────────────────────────────────────────────
/** Props for {@link SurfaceCard}. */
interface SurfaceCardBaseOwnProps extends SurfaceLabelProps, SlotProps {
    /**
     * Caption text placed OUTSIDE (below) the card, `gap-2` — a hint/note, not
     * chrome inside the card.
     *
     * This is the DATA PATH (§4): the caller passes a string, the FRAME wraps
     * `Typography` itself and picks the size + tone (`xs` muted). Before 2026-07-26
     * it took a `ReactNode`, so the call-site had to hand-write
     * `<Typography type="body-xs" color="muted">…` — the caller holding
     * scale/tone is exactly what §4 forbids, and it also blocked `isSkeleton`
     * from flowing through (the frame had to branch off to build a separate
     * shimmer bar instead of passing the flag down to the very atom rendering
     * this text).
     */
    description?: string
    /**
     * Face frame: `"surface"` (default) `shadow-surface`, or `"nested"` — border
     * INSTEAD OF shadow when this face sits INSIDE another face (§1a).
     *
     * 2026-07-26 (instructor): changed from `bordered?: boolean`. `bordered=true` → `variant="nested"`.
     */
    variant?: SurfaceCardVariant
    /**
     * Padding around the content, §10c scale. Default `3`. Set `0` when the child
     * hugs the edge itself (a bleed-edge cover image) — still keeps
     * `overflow-hidden` so rounding clips a bleeding child correctly.
     *
     * 2026-07-26 (instructor): changed from `flushContent?: boolean` (`flushContent=true` →
     * `padding="flush"`). An INDEPENDENT axis from `variant` — a `nested` card AND
     * `padding="flush"` is a real combination (a bleed-edge image inside a nested
     * card); merging them would kill that combo.
     */
    padding?: InsetScale
    /**
     * `true` → the parts the frame OWNS ITSELF (`label` · right slot ·
     * `description`) switch to shimmer. `children`/`body` are NOT drawn for you
     * by the frame.
     *
     * ⭐ A COMPOSITE'S FLAG, NOT its own separate shape (decided 2026-07-26). The
     * frame is only responsible for what IT ITSELF renders (§12c) — content is
     * built by the caller, and the caller already holds that flag so it passes
     * it on to its own children:
     *
     * ```tsx
     * <SurfaceCard isSkeleton={loading} label="My courses">
     *   <ProfileRow isSkeleton={loading} />
     * </SurfaceCard>
     * ```
     *
     * Since the flag only changes the STATE of an already-existing tree (not the
     * structure), the story does NOT split a separate `leaf` for it — it sits
     * beside the real version inside the `Default` leaf (§11f).
     */
    isSkeleton?: boolean
    /**
     * `true` → an accent arc SWEEPS around the card face, sitting on a SEPARATE
     * layer BEHIND it (peeking out 2px past the edge). Pure "featured"
     * decoration, NOT a data signal.
     *
     * Use on EXACTLY ONE card that needs to stand out on a face — two cards
     * both highlighted cancel each other's emphasis out.
     *
     * ⭐ 2026-07-26 (instructor: "just add isHighlight"): this used to be a
     * separate component, `HighlightCard`, wrapping OUTSIDE the card. But it
     * built no card chrome of its own — it just inserted an effect `div` — so
     * filing it under the `Cards` family meant filing a *decorator* under the
     * *card-face frame* family, and the caller had to nest two layers for one
     * thing. As a prop, the outer layer disappears.
     *
     * ⚠️ The visual lives in the GLOBAL class `.highlight-card-sweep`
     * (`src/app/globals.css`), not in this file — fixing the sweep effect means
     * going to `src` (§0). This is the only node in the `SurfaceCard` tree in
     * that situation.
     */
    isHighlight?: boolean
    /**
     * Press handler — set (with or without `href`) to render the WHOLE CARD as a
     * `<button>`/`<a>` instead of a plain `<div>` (§ "isPressable" convention,
     * thầy 2026-07-29 merge — matches `List.Row`'s own `const isPressable =
     * Boolean(onPress || href)`; was a separate component `SurfaceCard.Pressable`
     * before this). Ripple + `active:scale-[0.97]` press feedback, no hover
     * effect at rest (hover is inert by design — the only feedback IS the
     * press). Ignored when `href` is also set.
     */
    onPress?: () => void
    /**
     * Navigation target — renders the whole card as a link instead of a plain
     * `<div>`. Wins over `onPress` when both are set.
     */
    href?: string
    /**
     * Dims the card and blocks the press — only meaningful once the card IS
     * pressable (`onPress`/`href` set); has no effect on a plain card.
     */
    isDisabled?: boolean
    /**
     * `true` → mark this card as the CHOSEN one in a selectable grid — an accent
     * `ring-2` around the face. Use when a group of these cards is a
     * single/multi-select chooser instead of a fire-and-forget action grid.
     */
    isSelected?: boolean
    /** Extra classes on the section wrapper. */
    className?: string
    /** Extra classes on the surface (content) wrapper. */
    contentClassName?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * Storybook-only: when true, each composed part (`SurfaceCardHeader` / the
     * surface content wrapper / `description`) emits a `data-anat-part` so the
     * anatomy panel can anchor badges. No visual effect.
     */
    showAnatomy?: boolean
}
export type SurfaceCardBaseProps = SurfaceCardBaseOwnProps & PressableActionsProps
/**
 * The generic `bg-surface` content card of the namespace, with an OPTIONAL section
 * header baked in — pass `label` and it renders a `Label` OUTSIDE (above) the card,
 * plus one optional right slot (`action` ▸ `onSeeMore` ▸ `labelEnd`). Omit `label`
 * and the card renders bare. Content comes in via `header`/`body`/`footer` or the
 * `children` shorthand.
 *
 * @param props - {@link SurfaceCardBaseProps}
 */
const Base = ({
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
    header,
    body,
    footer,
    children,
    description,
    variant = "surface",
    padding = "cozy",
    isSkeleton = false,
    isHighlight = false,
    onPress,
    href,
    isDisabled = false,
    isSelected = false,
    actions,
    ariaLabel,
    className,
    contentClassName,
    anatPart,
    showAnatomy = false,
}: SurfaceCardBaseProps) => {
    const { ripples, add: addRipple, clear: clearRipple } = useRipple()
    const content = composeSlots({ header, body, footer, children })
    const paddingCls = padding === "flush" ? "overflow-hidden" : PADDING_CLASS[padding]
    // A card is PRESSABLE the moment it gets `onPress`/`href` — same derived-not-
    // passed convention `List.Row` already uses (`const isPressable = Boolean(onPress
    // || href)`). Was a SEPARATE component, `SurfaceCard.Pressable` (thầy 2026-07-29:
    // "sao còn .Pressable, thành isPressable là prop hết rồi mà?") — folded in here so
    // every card face (bare or pressable) shares ONE frame/padding/variant path.
    const isPressable = !isSkeleton && Boolean(onPress || href)
    // A PRESSABLE card's `isSkeleton` means something DIFFERENT from a plain card's:
    // a plain `SurfaceCard` shimmers only the parts it OWNS (label/description) and
    // renders `children` for real (§12c, flows down to whatever the caller composed);
    // `.Pressable`'s old `isSkeleton` instead swapped in a GENERIC tile mirror (leading
    // tile + two text bars) INSTEAD of children entirely — carried over VERBATIM here
    // so `FlashcardDeckList`/`SummaryCard` (which pass `isSkeleton` straight through,
    // `children={isSkeleton ? null : realBody}`) keep the exact shimmer they already
    // render, not an empty box.
    if (isSkeleton && Boolean(onPress || href)) {
        return (
            <StackH gap="grouped" padding="cozy" className={cn("rounded-3xl bg-surface shadow-surface", className)}>
                <HeroSkeleton className="size-10 shrink-0 rounded-xl" />
                <StackV gap="related" className="min-w-0 flex-1">
                    <Typography size="sm" isSkeleton className="w-2/3" />
                    <Typography size="xs" isSkeleton className="w-1/3" />
                </StackV>
            </StackH>
        )
    }
    let card: ReactNode
    if (!isPressable) {
        // `relative` — WITHOUT it this div is `static`, and `.highlight-card-sweep`
        // (`position: absolute`) paints ABOVE any `static` sibling regardless of DOM
        // order, covering the card's own content instead of sitting behind it
        // (thầy 2026-07-29, caught live: the sweep visibly cut across the CTA
        // button). The Pressable branch below already carries `relative` for the
        // same reason — this branch had simply dropped it.
        card = (
            <div
                className={cn("relative", surfaceFrame(variant), paddingCls, isSelected && "ring-2 ring-accent", contentClassName)}
            >
                {content}
            </div>
        )
    } else if (!actions) {
        // Whole card IS the press target. TWO different hover languages, thầy
        // 2026-07-29: a real navigation LINK (`href`) reads as a link, not an
        // action button — no ripple/press-scale, just `.group` so the content
        // can opt into the quiet `underlineOnGroupHover` convention
        // (`Typography`'s own prop, shared with `SurfaceCardListItem.hover=
        // "underline"`). An in-place ACTION (`onPress`, no `href`) keeps the
        // ripple + `active:scale-[0.97]` push-in carried over VERBATIM from the
        // old `.Pressable` "simple" branch — no hover effect at rest, the press
        // IS the only feedback.
        const isLink = Boolean(href) && !isDisabled
        const frameCls = cn(
            "relative block w-full overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-accent [-webkit-tap-highlight-color:transparent]",
            surfaceFrame(variant),
            paddingCls,
            isSelected && "ring-2 ring-accent",
            isLink
                ? "group"
                : cn(
                    "transition-[scale] duration-200 ease-out motion-reduce:transition-none",
                    isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-[0.97]",
                ),
            contentClassName,
        )
        const inner = isLink ? (
            <span className="relative z-10 block">{content}</span>
        ) : (
            <>
                <span className="relative z-10 block">{content}</span>
                {!isDisabled ? <Ripple ripples={ripples} onClear={clearRipple} /> : null}
            </>
        )
        card = href && !isDisabled ? (
            <a href={href} aria-label={ariaLabel} aria-current={isSelected ? "true" : undefined} className={frameCls}>
                {inner}
            </a>
        ) : (
            <button
                type="button"
                onClick={onPress}
                onPointerDown={isDisabled ? undefined : addRipple}
                disabled={isDisabled}
                aria-label={ariaLabel}
                aria-pressed={isSelected || undefined}
                className={cn(frameCls, !isDisabled && "cursor-pointer")}
            >
                {inner}
            </button>
        )
    } else {
        // Card WITH its own secondary actions — stretched-link pattern, carried
        // over VERBATIM from the old `.Pressable` "actions" branch: a transparent
        // overlay covers the card, actions sit ABOVE it so they stay independently
        // clickable, and only the OVERLAY press scales the whole card (`:has()`
        // scopes it — a plain `active:scale` would fire on any inner action too).
        const overlayCls = cn(
            "absolute inset-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        )
        card = (
            <div
                className={cn(
                    "relative w-full",
                    surfaceFrame(variant),
                    paddingCls,
                    isSelected && "ring-2 ring-accent",
                    !isDisabled && "has-[[data-card-press]:active]:scale-[0.97]",
                    contentClassName,
                )}
            >
                <StackH gap="grouped">
                    <div className="min-w-0 flex-1">{content}</div>
                    <StackH gap="related" className="relative z-10 shrink-0">{actions}</StackH>
                </StackH>
                {href && !isDisabled ? (
                    <a href={href} data-card-press aria-label={ariaLabel} aria-current={isSelected ? "true" : undefined} className={overlayCls} />
                ) : (
                    <button
                        type="button"
                        data-card-press
                        onClick={onPress}
                        disabled={isDisabled}
                        aria-label={ariaLabel}
                        aria-pressed={isSelected || undefined}
                        className={overlayCls}
                    />
                )}
            </div>
        )
    }
    // The sweep sits on a SEPARATE layer BEHIND the card face (peeking out 2px past
    // the edge), so it needs a `relative` wrapper to anchor to. Off while
    // `isSkeleton`: at rest there's nothing worth emphasizing yet — running the
    // sweep around a shimmer block would just be noise.
    const highlighted = isHighlight ? (
        <div className="relative">
            {isSkeleton ? null : <div aria-hidden className="highlight-card-sweep" />}
            {card}
        </div>
    ) : card
    // The frame owns this text so it wraps the atom (§4) — and so the flag simply
    // flows straight into that same atom, instead of branching off to build a
    // separate shimmer bar.
    const caption = <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={description} />
    const cardWithCaption = description != null ? (
        <StackV gap="related">
            {highlighted}
            {showAnatomy ? <div data-anat-part="Typography">{caption}</div> : caption}
        </StackV>
    ) : highlighted
    const labelRow = (
        <SurfaceCardHeader
            label={label}
            labelEnd={labelEnd}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            action={action}
            subtleLabel={subtleLabel}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
        />
    )
    return (
        <section data-anat-part={anatPart} className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            {label != null && showAnatomy ? <div data-anat-part="SurfaceCardHeader">{labelRow}</div> : labelRow}
            {cardWithCaption}
        </section>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .Nested — card-inside-card with a quiet header (was `NestedCard`)
// ─────────────────────────────────────────────────────────────────────────────
/** One inner section of a {@link SurfaceCardNested} (`items` row). */
export interface SurfaceCardNestedSection {
    /** Stable React key. */
    key: string
    /** Section header title. */
    title: ReactNode
    /** Optional muted sub-label above the title (context, e.g. a course/module name). */
    eyebrow?: ReactNode
    /** Optional body under the header (description text, meta rows). */
    content?: ReactNode
    /** Press handler — renders the row as a native `<button>` (nav-link affordance). */
    onPress?: () => void
    /** Destination — renders the row as a native `<a>` (nav-link affordance). Wins over `onPress`. */
    href?: string
    /** Extra classes on the section. */
    className?: string
    /** Anatomy tag: names this row so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}
/** Props for {@link SurfaceCardNested}. */
export interface SurfaceCardNestedProps extends SlotProps {
    /** Header title (quiet eyebrow label, e.g. "Related posts"). Omit when passing `header`. */
    title?: ReactNode
    /** Optional leading eyebrow icon in the header (passed BARE — the card owns its size-4, §4/§5). */
    icon?: ReactNode
    /** Optional trailing header slot (e.g. a count) — right-aligned beside the title. */
    meta?: ReactNode
    /**
     * Inner sections rendered as the divided body. Preferred over `children` when
     * the body IS a repeating list of sections.
     */
    items?: ReadonlyArray<SurfaceCardNestedSection>
    /**
     * Corner radius: `"3xl"` (default) or `"xl"` (tighter, for cramped contexts
     * like a chat bubble).
     *
     * 2026-07-26 (instructor): changed from `compact?: boolean` (`compact=true` → `radius="xl"`).
     */
    radius?: "xl" | "3xl"
    /**
     * Surface-in-surface: `variant="nested"` → `border border-default bg-transparent`
     * — when the parent ALREADY has its own face (a `bg-surface` panel, a
     * `bg-surface-secondary` bubble, a modal/page card). Only leave
     * `variant="surface"` (default) when rendering DIRECTLY on
     * `bg-background`, with no parent face.
     *
     * 2026-07-26 (instructor): changed from `bordered?: boolean`. `bordered=true` → `variant="nested"`.
     */
    variant?: SurfaceCardVariant
    /**
     * `true` → `title` in the header bar and the rows built from `items` switch
     * to shimmer. `children`/`body` are NOT drawn for you by the frame — the
     * caller passes the flag on to its own children.
     *
     * ⭐ This branch is a hybrid of two shapes: going via `items`, the frame
     * KNOWS the row shape so it passes the flag straight down; going via
     * `children`, the child belongs to the caller. NEITHER path spawns a new
     * `leaf` — this is a STATE of the already-existing tree (§11f, §12c).
     */
    isSkeleton?: boolean
    /** Extra classes on the card root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each composed part so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
}
/**
 * One inner section row — a flush row (no own border/radius) with an optional
 * muted eyebrow, a title, and optional body below.
 *
 * ROW ≠ CARD (principles §7b): when interactive (`href`/`onPress`) it renders as
 * a native `<a>`/`<button>` (a11y — focusable + keyboard) with a hover-underline
 * title (nav-link affordance) — NO press-scale/ripple. Non-interactive → plain
 * `<div>` with no `cursor-pointer` (no false click affordance).
 */
const NestedSection = ({ title, eyebrow, content, onPress, href, className, anatPart, isSkeleton = false }: Omit<SurfaceCardNestedSection, "key"> & { isSkeleton?: boolean }) => {
    const interactive = Boolean(onPress || href)
    // §10: parent owns the gap (tight) — eyebrow/title/content no longer self-margin.
    const body = (
        <StackV gap="tight" className="min-w-0">
            {eyebrow ? (
                <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={eyebrow} />
            ) : null}
            <Typography size="sm"
                weight="medium"
                truncate
                isSkeleton={isSkeleton}
                className={cn(
                    "underline-offset-4 decoration-[var(--separator-tertiary)]",
                    interactive && "group-hover:underline",
                )}
                text={title}
            />
            {content ? <div>{content}</div> : null}
        </StackV>
    )
    if (href) {
        return (
            <a
                href={href}
                data-anat-part={anatPart}
                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    className,
                )}
            >
                {body}
            </a>
        )
    }
    if (onPress) {
        return (
            <button
                type="button"
                onClick={onPress}
                data-anat-part={anatPart}
                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    className,
                )}
            >
                {body}
            </button>
        )
    }
    return (
        <div data-anat-part={anatPart} className={cn("p-3", className)}>
            {body}
        </div>
    )
}
/**
 * Card-inside-card WITH HEADERS: quiet header (optional eyebrow icon + title-only
 * label + optional trailing meta) + a flush stack of sections separated by dividers
 * (no per-row rounded borders) + an optional footer row. Parent context drives the
 * shell: any filled parent surface → `variant="nested"`; bare `bg-background` only
 * → omit `variant` (defaults `"surface"`) → `bg-surface shadow-surface`.
 *
 * @param props - {@link SurfaceCardNestedProps}
 */
const Nested = ({
    title,
    icon,
    meta,
    header,
    items,
    body,
    children,
    footer,
    radius = "3xl",
    variant = "surface",
    isSkeleton = false,
    className,
    anatPart,
    showAnatomy,
}: SurfaceCardNestedProps) => {
    const hasHeader = header != null || title != null || icon != null || meta != null
    // The `items` path = the frame builds the row ⇒ the flag FLOWS ON straight into
    // that row (the row switches its own text to shimmer). The `children` path =
    // the caller builds it ⇒ the frame passes it back unchanged, and the flag is
    // the caller's own to pass on. No second row shape is built anywhere.
    const innerBody = items != null
        ? items.map(({ key, ...section }) => <NestedSection key={key} {...section} isSkeleton={isSkeleton} />)
        : (body ?? children)
    return (
        <div
            data-anat-part={anatPart}
            className={cn(
                "overflow-hidden",
                radius === "xl" ? "rounded-xl" : "rounded-3xl",
                variant === "nested" ? "border border-default bg-transparent" : "bg-surface shadow-surface",
                className,
            )}
        >
            {hasHeader ? (
                // ⚠️ Padding stays literal (`px-3 py-2`, ASYMMETRIC): `InsetScale` only
                // covers a symmetric `p-*` step, so there is no scale value for a
                // separate x/y pair — flagged to the teacher, not converted (only the
                // `flex`/`gap` layout below is routed through the frame).
                <StackH gap="related" justify="between" className="min-w-0 border-b border-default px-3 py-2">
                    {header ?? (
                        // leading eyebrow: card owns icon size-4 (§4/§5); icon inherits muted via this row
                        <StackH gap="related" className="min-w-0 text-muted [&_svg]:size-4">
                            {icon}
                            {isSkeleton
                                ? <Typography size="xs" isSkeleton className="w-28" />
                                : <Typography size="xs" color="muted" truncate text={title} />}
                        </StackH>
                    )}
                    {meta ? <span className="shrink-0">{meta}</span> : null}
                </StackH>
            ) : null}
            <div className="flex flex-col divide-y divide-default">{innerBody}</div>
            {footer ? (
                <div className="border-t border-default px-3 py-2">
                    {footer}
                </div>
            ) : null}
        </div>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .Pressable — whole-card press target (was `PressableCard`)
// ─────────────────────────────────────────────────────────────────────────────
// Ripple — ported from HeroUI v2 `@heroui/ripple` (MIT). ADAPTED: HeroUI reads
// press coords from react-aria's `PressEvent` (`event.x/y`); we use a real
// `<button>`/`<a>`, so we compute the origin from the native `pointerdown`
// position relative to the pressed element. Same animation: a circle grows from
// scale 0 → 2 at the press point while fading out, then self-clears.
type RippleItem = { key: number; x: number; y: number; size: number }
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
/** Track ripples + expose `add` (on pointerdown) and `clear` (on anim end). */
const useRipple = () => {
    const idRef = useRef(0)
    const [ripples, setRipples] = useState<Array<RippleItem>>([])
    const clear = useCallback((key: number) => {
        setRipples((prev) => prev.filter((ripple) => ripple.key !== key))
    }, [])
    const add = useCallback(
        (event: React.PointerEvent<HTMLElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const size = Math.max(rect.width, rect.height)
            idRef.current += 1
            const key = idRef.current
            setRipples((prev) => [
                ...prev,
                {
                    key,
                    size,
                    // Centre the size×size circle on the exact press point.
                    x: event.clientX - rect.left - size / 2,
                    y: event.clientY - rect.top - size / 2,
                },
            ])
            // Safety net: guarantee removal even if `onAnimationComplete` never
            // fires (e.g. tab hidden mid-animation → rAF paused). Idempotent with
            // the anim-complete clear. Max ripple duration is 0.75s.
            window.setTimeout(() => clear(key), 800)
        },
        [clear],
    )
    return { ripples, add, clear }
}
/** Renders one fading, growing circle per active ripple. Sits BEHIND content (`z-0`). */
/** Props for the local {@link Ripple} layer. */
interface RippleProps {
    /** Ripples currently animating. */
    ripples: Array<RippleItem>
    /** Called when one ripple finishes so the caller can drop it. */
    onClear: (key: number) => void
}
const Ripple = ({ ripples, onClear }: RippleProps) => (
    <AnimatePresence mode="popLayout">
        {ripples.map((ripple) => {
            // Bigger ripple → longer travel (HeroUI's clamp curve).
            const duration = clamp(0.01 * ripple.size, 0.2, ripple.size > 100 ? 0.75 : 0.5)
            return (
                <motion.span
                    key={ripple.key}
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-foreground"
                    style={{ width: ripple.size, height: ripple.size }}
                    initial={{ x: ripple.x, y: ripple.y, scale: 0, opacity: 0.18 }}
                    animate={{ x: ripple.x, y: ripple.y, scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration }}
                    onAnimationComplete={() => onClear(ripple.key)}
                />
            )
        })}
    </AnimatePresence>
)
// ⭐ `SurfaceCard.Pressable` REMOVED (thầy 2026-07-29, "isPressable là prop hết rồi
// mà?") — its whole render tree (ripple + active:scale simple branch, the
// stretched-link actions branch) now lives INSIDE `Base` above, reached the same
// way `List.Row` already reaches it: passing `onPress`/`href` derives
// `isPressable` internally instead of importing a separate component. Callers
// that used to write `<SurfaceCardPressable href={x}>` now write
// `<SurfaceCard href={x}>` — same card, same props, one fewer name to import.
// ─────────────────────────────────────────────────────────────────────────────
// .PressableGroup — a grid of press targets (was `GroupPressableCard`)
// ─────────────────────────────────────────────────────────────────────────────
// Columns by container step: use {@link GridColumns} from `Grid` directly —
// the ONE grid system of the frame tier (§13).
//
// 2026-07-26 (instructor): removed the local `SurfaceCardPressableGroupColumns`
// table (7 steps `base/sm/md/lg/xl/xl3/xl4`, built with `@sm:`/`@md:`…) — that
// was Tailwind's HALF-SIZE container scale (`@sm` = 24rem), completely
// different from the `@app-*` scale (`@app-sm` = 40rem) that `Container`/
// `Grid` and the rest of the system use. Every breakpoint in the old table
// was silently firing at the wrong point compared to the rest of the app.
/** One pressable card inside a {@link SurfaceCardPressableGroup}. */
export interface SurfaceCardPressableGroupItem {
    /** Stable React key. Also fixes the item's position for the 1–N shortcut. */
    key: string
    /**
     * Named icon slot — TRẦN (no size/color className). The frame owns sizing
     * (§4/§5a: tile body defaults to `body-sm`/`text-sm` → `size-5`) + muted color
     * in ONE place, instead of every call-site hand-setting `className="size-5
     * text-muted"` on its own icon.
     */
    icon?: ReactNode
    /** Where {@link SurfaceCardPressableGroupItem.icon} sits relative to `content`. Defaults to `"leading"`. */
    iconPosition?: "leading" | "trailing"
    /** Card body — composed freely by the caller (text, chips…). */
    content: ReactNode
    /** Press handler. Ignored when {@link SurfaceCardPressableGroupItem.href} is set. */
    onPress?: () => void
    /** Navigation target — renders this card as an anchor. */
    href?: string
    /** Dims the card and blocks both pressing and the keyboard shortcut. */
    isDisabled?: boolean
    /** Accessible name — needed only when {@link SurfaceCardPressableGroupItem.content} carries no readable text. */
    label?: string
    /**
     * Forwarded to this card's own `className` — for grid placement (`@lg:col-start-2`)
     * and for tile-level tweaks on top of the `.Pressable` surface. Placement
     * classes must use the **container** variant (`@lg:`), NOT the viewport one.
     */
    className?: string
    /**
     * Verdict variant: a LEFT band marking this tile with a signal that comes from
     * DATA (`card.md` §3i) — the canonical {@link VerdictBand}, SAME shape as
     * `SectionCard`/`SurfaceCardList`.
     */
    withVerdict?: VerdictBand
    /**
     * `true` → mark this tile as the CHOSEN one in a selectable grid — an accent
     * `ring-2` around the card (via `.Pressable`'s `isSelected`). Use when the grid
     * is a single/multi-select chooser instead of a fire-and-forget action grid.
     */
    selected?: boolean
}
/** Props for {@link SurfaceCardPressableGroup}. */
export interface SurfaceCardPressableGroupProps {
    /** The cards, in reading order (also the 1–N shortcut order). REQUIRED — repeat list = data. */
    items: Array<SurfaceCardPressableGroupItem>
    /**
     * Accessible name for the whole group — REQUIRED. Without it a screen reader
     * hears N loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /**
     * Responsive column count — grid built with `Grid` (§13). Defaults to a
     * single column.
     *
     * 2026-07-26 (instructor): changed from the local `SurfaceCardPressableGroupColumns`
     * (7 steps, half-size container scale) to the shared {@link GridColumns}
     * used tier-wide (4 steps `base/sm/md/lg`, `@app-*` scale).
     */
    columns?: GridColumns
    /**
     * Gap between cards, §10c scale. Defaults to `3`.
     *
     * 2026-07-26 (instructor): changed the type from a local `2 | 3` to the shared {@link InsetScale}.
     */
    gap?: SeamScale
    /**
     * Binds number keys `1`–`N` to the items in order, so the group can be driven
     * without the mouse. Off by default — only opt in where the group IS the
     * screen's primary action (e.g. a flashcard rating bar).
     */
    keyboardShortcut?: boolean
    /**
     * `true` → render a skeleton mirror grid (same columns/gap/tile chrome, one
     * placeholder tile per item) instead of live cards. Consumer just flips the
     * flag — same as base Button/ButtonGroup's `isSkeleton`.
     */
    isSkeleton?: boolean
    /** Extra classes on the container wrapper. */
    className?: string
    /**
     * Dev/spec: tag each direct tile (`SurfaceCard` / `SkeletonTile`) with an
     * {@link AnatomyOverlay} anchor so a BlockAnatomy panel can badge it on-render.
     */
    showAnatomy?: boolean
}
// Compact grid cell, not a standalone top-level card: one step down from
// `.Pressable`'s own `rounded-3xl`/`shadow-surface` default (concentric
// radius: card 24px − 1 step → 16px) and one step UP from the flat button.
const TILE_CHROME = "rounded-2xl shadow-field"
// §5a: tile body defaults to body-sm/text-sm → icon size-5, muted (list-icon convention).
// Forced HERE (descendant selector) so no call-site ever hand-sets icon size/color again.
const ITEM_ICON_CLS = "shrink-0 [&_svg]:size-5 [&_svg]:shrink-0 text-muted"
/** Composes the named `icon` slot (if any) with `content`, owning layout + icon sizing. */
const itemBody = (item: SurfaceCardPressableGroupItem) => {
    if (!item.icon) {
        return item.content
    }
    const iconSlot = <span className={ITEM_ICON_CLS}>{item.icon}</span>
    return (
        <StackH gap="grouped">
            {item.iconPosition === "trailing" ? null : iconSlot}
            <div className="min-w-0 flex-1">{item.content}</div>
            {item.iconPosition === "trailing" ? iconSlot : null}
        </StackH>
    )
}
/**
 * One skeleton placeholder tile — mirrors {@link TILE_CHROME} + the standard
 * ProfileCard content shape (avatar + title + description), so the loading grid
 * holds the real shape these card-grids carry (decided 2026-07-22: skeleton
 * follows the ProfileCard pattern).
 */
/** Props for the local {@link PressableGroupSkeletonTile}. */
interface PressableGroupSkeletonTileProps {
    /** Placement class only. */
    className?: string
    /** Storybook-only: names the Avatar mirror so a BlockAnatomy panel can badge/link it. Avatar has no anatPart of its own, so the frame wraps it instead. */
    showAnatomy?: boolean
}
const PressableGroupSkeletonTile = ({ className, showAnatomy }: PressableGroupSkeletonTileProps) => (
    <div className={cn(TILE_CHROME, "flex items-center gap-3 p-3", className)}>
        <div className="shrink-0" data-anat-part={showAnatomy ? "Avatar" : undefined}>
            <Avatar isSkeleton size="md" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
            <Typography size="sm" isSkeleton className="w-1/3" />
            <Typography size="xs" isSkeleton className="w-2/3" />
        </div>
    </div>
)
/**
 * A grid of `.Pressable` cards that act and then get out of the way — the whole
 * group is ONE labelled unit (`role="group"` + `aria-label`), each cell is a
 * canonical `.Pressable`, and the cards' bodies stay the caller's to compose.
 * Reflows on the CONTAINER's width, not the viewport's ({@link GridColumns}) — grid
 * built via `Grid` (§13, the tier's ONE grid khung).
 *
 * **Two modes.** Default = ACTIONS (press a card and the surface acts — grade, open
 * a page — nothing stays "chosen"). Opt into SELECTION by passing `item.selected`:
 * the chosen tile gets an accent `ring-2` (the card-equivalent of a list row's
 * trailing check) — for a single/multi-select grid (pick a plan, an avatar…).
 *
 * @param props - {@link SurfaceCardPressableGroupProps}
 */
const PressableGroup = ({
    items,
    ariaLabel,
    columns = {},
    gap = "grouped",    keyboardShortcut = false,
    isSkeleton = false,
    className,
    showAnatomy = false,
}: SurfaceCardPressableGroupProps) => {
    // Reading `items` through a ref keeps the window listener subscribed ONCE
    // instead of tearing down and re-adding on each render.
    const itemsRef = useRef(items)
    useEffect(() => {
        itemsRef.current = items
    }, [items])
    // Press 1–N to act without reaching for the mouse. Opt-in: the listener is on
    // `window`, so a group that isn't the screen's main action would steal digits.
    // Also off while `isSkeleton` — nothing underneath can act yet.
    useEffect(() => {
        if (!keyboardShortcut || isSkeleton) {
            return
        }
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return
            }
            const position = Number(event.key) - 1
            const current = itemsRef.current
            if (!Number.isInteger(position) || position < 0 || position >= current.length) {
                return
            }
            const item = current[position]
            if (item.isDisabled || !item.onPress) {
                return
            }
            event.preventDefault()
            item.onPress()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [keyboardShortcut, isSkeleton])
    // an empty group would announce a label with nothing under it
    if (items.length === 0) {
        return null
    }
    if (isSkeleton) {
        return (
            <div role="group" aria-label={ariaLabel} className={className} data-anat-part={showAnatomy ? "Grid" : undefined}>
                <Grid
                    columns={columns}
                    gap={gap}
                    items={items.map((item) => ({
                        key: item.key,
                        content: showAnatomy ? (
                            <div className="relative" data-anat>
                                <PressableGroupSkeletonTile className={item.className} showAnatomy={showAnatomy} />
                                <AnatomyOverlay label="SkeletonTile" tier="composite" />
                            </div>
                        ) : (
                            <PressableGroupSkeletonTile className={item.className} />
                        ),
                    }))}
                />
            </div>
        )
    }
    // 2026-07-26 (instructor): removed the self-opened `<div className="@container">`
    // — from now on `Container` is where the frame tier OPENS a container
    // (one frame, not every frame opening its own). Grid built with `Grid`
    // (§13, the tier's ONE grid system) instead of hand-declaring `grid`/`grid-cols-*`.
    return (
        <div role="group" aria-label={ariaLabel} className={className} data-anat-part={showAnatomy ? "Grid" : undefined}>
            <Grid
                columns={columns}
                gap={gap}
                items={items.map((item) => {
                    const tile = (
                        <Base
                            onPress={item.onPress}
                            href={item.href}
                            isDisabled={item.isDisabled}
                            isSelected={item.selected}
                            ariaLabel={item.label}
                            contentClassName={cn(
                                TILE_CHROME,
                                verdictBandClassName(item.withVerdict),
                                item.className,
                            )}
                        >
                            {itemBody(item)}
                        </Base>
                    )
                    return {
                        key: item.key,
                        content: showAnatomy ? (
                            <div className="relative" data-anat>
                                {tile}
                                <AnatomyOverlay label="SurfaceCard" tier="composite" />
                            </div>
                        ) : tile,
                    }
                })}
            />
        </div>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .SelectableGroup — single-select grid of surface cards (was `SelectableCardGroup`)
// ─────────────────────────────────────────────────────────────────────────────
/** One selectable card in a {@link SurfaceCardSelectableGroup}. */
export interface SurfaceCardSelectableGroupItem<T extends string> {
    /** Value selected when this card is chosen. */
    value: T
    /** Primary label (text / icon + text). */
    label: ReactNode
    /** Optional secondary line under the label. */
    description?: ReactNode
    /** Optional leading icon (rendered decorative). */
    icon?: ReactNode
    /** When true the card is dimmed and not selectable. */
    isDisabled?: boolean
    /** Optional trailing node (e.g. a "coming soon" tag) shown on the right. */
    badge?: ReactNode
}
/** Props for {@link SurfaceCardSelectableGroup}. */
export interface SurfaceCardSelectableGroupProps<T extends string> {
    /** The selectable cards (2+). */
    items: Array<SurfaceCardSelectableGroupItem<T>>
    /** Currently selected value. */
    value: T
    /** Fired with the chosen value when a card is selected. */
    onChange: (value: T) => void
    /** Accessible label for the group. */
    ariaLabel: string
    /** Grid column count. Defaults to `2`. */
    columns?: 1 | 2 | 3
    /** Extra classes on the grid. */
    className?: string
    /**
     * Dev/spec: tag each card's own direct parts (`Icon` / `Label` / `Badge`) so a
     * BlockAnatomy panel can badge them.
     */
    showAnatomy?: boolean
}
/**
 * Fixed column count → the responsive {@link GridColumns} step-set that reads as that count
 * from `@app-sm` up. `columns` here is a caller DECISION (not a breakpoint), so every step is
 * pinned to the same number — except `3`, which `GridColumns.base` cannot express (capped at
 * `1 | 2`, §13z on `Grid`), so the narrowest container gets `2` and `3` lands from `@app-sm`.
 */
const SELECTABLE_GROUP_COLUMNS: Record<1 | 2 | 3, GridColumns> = {
    1: { base: 1, sm: 1, md: 1, lg: 1 },
    2: { base: 2, sm: 2, md: 2, lg: 2 },
    3: { base: 2, sm: 3, md: 3, lg: 3 },
}
/**
 * A single-select group of surface cards: each option is a canonical HeroUI `Card`;
 * choosing one draws an accent OUTLINE ring around it (never a fill / colour change,
 * so the card stays neutral `bg-surface`). Built on HeroUI `RadioGroup`/`Radio`
 * (React Aria) so it is a real radio group — arrow-key roving, single-select
 * semantics, focus ring — not a hand-rolled toggle-button grid. This is the
 * SELECTION sibling of `.PressableGroup` (§ note at the top of this file):
 * `.PressableGroup`'s `selected` flag is a decorative ring with no enforced
 * exclusivity; this member enforces true one-of-N via a controlled `value`.
 *
 * Selection/focus use `outline` (its own CSS property) rather than a Tailwind
 * `ring-*` — the `.card` base bakes an unlayered `shadow-surface` box-shadow that
 * would swallow a box-shadow ring, but never touches `outline`. That same shadow is
 * dropped (`!shadow-none`) while the ring is up so the two don't stack.
 *
 * ⚠️ Calls HeroUI `Radio`/`RadioGroup` directly rather than the design system's
 * `ChoiceRadio`/`ChoiceRadioGroup` atom — known drift, carried over verbatim
 * from `atoms/navigation/SelectableCardGroup` (not refactored in this move).
 *
 * @param props - {@link SurfaceCardSelectableGroupProps}
 */
const SelectableGroup = <T extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    columns = 2,
    className,
    showAnatomy = false,
}: SurfaceCardSelectableGroupProps<T>) => (
        <RadioGroup
            aria-label={ariaLabel}
            value={value}
            onChange={(next) => onChange(next as T)}
        >
            <Grid
                gap="related"
                columns={SELECTABLE_GROUP_COLUMNS[columns]}
                className={className}
                items={items.map((item) => ({
                    key: item.value,
                    content: (
                        <Radio value={item.value} isDisabled={item.isDisabled} className="w-full">
                            <Radio.Content className="block w-full">
                                {({ isSelected, isDisabled, isFocusVisible }) => (
                                    <Card
                                        variant="default"
                                        className={cn(
                                            "w-full text-sm text-foreground transition-colors",
                                            // selection & keyboard focus = an accent OUTLINE ring, NO
                                            // fill / colour change. Drop the card's `shadow-surface`
                                            // while the ring is up so the two elevations don't stack.
                                            (isSelected || isFocusVisible) &&
                                            "outline outline-2 outline-accent outline-offset-0 !shadow-none",
                                            !isSelected && !isDisabled && "hover:bg-default",
                                            isDisabled && "opacity-60",
                                        )}
                                    >
                                        <StackH gap="related" className="w-full">
                                            {item.icon ? (
                                                <span className="shrink-0" aria-hidden>
                                                    {item.icon}
                                                </span>
                                            ) : null}
                                            <span className="flex min-w-0 flex-col">
                                                <span className="truncate">{item.label}</span>
                                                {item.description ? (
                                                    <span className="truncate text-xs text-muted">{item.description}</span>
                                                ) : null}
                                            </span>
                                            {item.badge ? (
                                                <span className="ml-auto shrink-0">
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </StackH>
                                    </Card>
                                )}
                            </Radio.Content>
                        </Radio>
                    ),
                }))}
            />
        </RadioGroup>
    )
// ─────────────────────────────────────────────────────────────────────────────
// .List — bounded surface list of rows (was `SurfaceListCard` + its two rows)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * One row of a {@link SurfaceCardList}.
 *
 * TWO SHAPES, one type: pass `title` for the FIXED row (leading · title+subtitle ·
 * meta+trailing), or `content` for a FREE-FORM row (the frame still owns padding +
 * the inset separator). `content` wins when both are given.
 */
export interface SurfaceCardListItem {
    /** Stable React key. */
    key: string
    /** Primary line — foreground, single-line truncate. Required for the FIXED row shape. */
    title?: ReactNode
    /** Optional secondary line — muted, smaller, single-line truncate. */
    subtitle?: ReactNode
    /** Optional leading node (thumbnail/icon), kept at intrinsic size. */
    leading?: ReactNode
    /**
     * Leading icon as a COMPONENT REF — the frame builds it and forces
     * `size-5`, colour follows the text (foreground), NOT downgraded to muted.
     * The path for callers who must NOT hold an atom/JSX (SCREEN, §"only block":
     * decided 2026-07-25). Loses to `leading` when both are passed; other
     * blocks still use `leading`.
     */
    leadingIcon?: ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>
    /**
     * Set → the leading icon carries a STATUS meaning (a checklist "done", a
     * pass/fail row) instead of following the label's colour — reuses `Alert`'s
     * own `AlertStatus` (§5.0/`Alert.Base`, thầy 2026-07-29) rather than a
     * bespoke enum, so this row's status vocabulary never drifts from Alert's.
     * Omit → unchanged existing behaviour (icon follows the label/foreground).
     */
    leadingIconColor?: AlertStatus
    /** Optional right-aligned metadata (chips/counts) before the trailing node. */
    meta?: ReactNode
    /**
     * Meta as TEXT — the frame wraps `Typography` accent itself. The data path
     * parallel to `meta` (node), same reasoning as {@link SurfaceCardListItem.leadingIcon}.
     */
    metaText?: string
    /** Optional far-right node (caret / inline action). */
    trailing?: ReactNode
    /**
     * Trailing icon as a COMPONENT REF — the frame forces `size-4 text-muted`.
     * The data path parallel to `trailing` (node).
     */
    trailingIcon?: ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>
    /** FREE-FORM row body — replaces the fixed leading/title/subtitle slots entirely. */
    content?: ReactNode
    /** Link target → renders an `<a>`/`<Link>` row that navigates on click. */
    href?: string
    /** Press handler → renders an interactive `<button>` row. */
    onPress?: () => void
    /** Disables the row (dimmed, non-interactive). */
    isDisabled?: boolean
    /**
     * Marks the row as the CHOSEN option in a single-select group — a trailing
     * accent `CheckCircleIcon` (NOT a full-row tint). The row keeps its normal
     * surface so text stays readable and the check is the one clear signal.
     * (Fixed row shape only.)
     */
    selected?: boolean
    /**
     * Left-edge DATA-signal band (`card.md` §3i) — shorthand for
     * `withVerdict={{ enable: true, variant: tone }}`.
     */
    tone?: VerdictBandVariant
    /** Full {@link VerdictBand} escape hatch (raw palette `color`). Wins over `tone`. */
    withVerdict?: VerdictBand
    /** `"fill"` (default) tints the whole row on hover; `"underline"` underlines the TITLE (row-as-link). */
    hover?: "fill" | "underline"
    /** Extra className on the title's own Typography (e.g. a selected-row colour). */
    titleClassName?: string
    /** Extra classes on the row. */
    className?: string
    /** Anatomy tag: names this row so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}
/** Props for {@link SurfaceCardList}. */
export interface SurfaceCardListProps extends SurfaceLabelProps {
    /** The rows. REQUIRED — repeat list = data, never children. Empty → renders `emptyState`. */
    items: ReadonlyArray<SurfaceCardListItem>
    /** Shown (padded) INSIDE the surface when there are no rows — so empty reads as intentional. */
    emptyState?: ReactNode
    /**
     * `"surface"` (default) `shadow-surface`, or `"nested"` — border INSTEAD OF
     * shadow when this face sits INSIDE another face (§1a).
     *
     * 2026-07-26 (instructor): changed from `bordered?: boolean`. `bordered=true` → `variant="nested"`.
     */
    variant?: SurfaceCardVariant
    /** Caption text under the list, `gap-2` — the DATA path, the frame wraps `Typography` itself (§4). */
    description?: string
    /**
     * `true` → the frame SELF-renders its own mirror (same face, same row box,
     * same divider) INSTEAD OF `items`, and `label`/`description` also switch to
     * shimmer.
     *
     * ⭐ This branch receives `items` as DATA so the frame builds the row — the
     * flag FLOWS ON straight into that row, the row keeps its box/padding/divider
     * and only its text switches to shimmer. There's no second skeleton tree
     * anywhere (§12c), so no row-count prop is needed either: the row count IS
     * `items.length`.
     */
    isSkeleton?: boolean
    /** Extra classes on the outer section / surface. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Storybook-only: badge this composite's OWN direct parts (Header/Surface/Description) for a BlockAnatomy panel. */
    showAnatomy?: boolean
}
/** Resolves an item's left DATA band — `withVerdict` (full shape) wins over the `tone` shorthand. */
/**
 * The two fields {@link itemVerdict} reads. Kept as its OWN shape rather than the whole item:
 * the helper works for any row carrying a verdict, and naming only what it touches says so.
 */
interface VerdictBearingItem {
    /** Tone shorthand a row may carry. */
    tone?: VerdictBandVariant
    /** Explicit verdict band, wins over `tone`. */
    withVerdict?: VerdictBand
}
const itemVerdict = (item: VerdictBearingItem): VerdictBand | undefined =>
    item.withVerdict ?? (item.tone != null ? { enable: true, variant: item.tone } : undefined)
/**
 * `leadingIconColor` → text class, reusing `Alert`'s own status vocabulary
 * (same tokens Alert's `STATUS_CLOSE_TONE` paints its icon/× with, minus the
 * hover-only classes that don't apply to a static leading icon).
 */
const LEADING_ICON_COLOR_CLASS: Record<AlertStatus, string> = {
    default: "text-muted",
    accent: "text-accent-soft-foreground",
    success: "text-success-soft-foreground",
    warning: "text-warning-soft-foreground",
    danger: "text-danger-soft-foreground",
}
/**
 * One FIXED row: leading · title+subtitle · meta+trailing, with a full-bleed inset
 * separator auto-hidden on the last row. STATIC by default (a plain `<div>`);
 * `onPress`/`href` make the whole row a tappable `<button>`/`<a>` with
 * `hover:bg-default` + focus ring.
 */
/** Props for the local {@link ListRow}. */
interface ListRowProps {
    /** The row's data. */
    item: SurfaceCardListItem
    /** Resting state — the row keeps its box and divider, only the text shimmers. */
    isSkeleton?: boolean
}
const ListRow = ({ item, isSkeleton = false }: ListRowProps) => {
    const {
        leading,
        leadingIcon: LeadingIcon,
        leadingIconColor,
        title,
        titleClassName,
        subtitle,
        meta,
        metaText,
        trailing,
        trailingIcon: TrailingIcon,
        onPress,
        href,
        selected = false,
        isDisabled = false,
        hover = "fill",
        className,
        anatPart,
    } = item
    const withVerdict = itemVerdict(item)
    const interactive = Boolean(onPress || href)
    const underlineHover = hover === "underline"
    const rowClassName = cn(
        "relative flex w-full items-center gap-3 p-3 text-left",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-['']",
        "last:after:hidden",
        interactive && "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        interactive && (underlineHover ? "group" : "hover:bg-default"),
        interactive && !isDisabled && "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-60",
        verdictBandClassName(withVerdict),
        withVerdict?.enable && "first:rounded-t-3xl last:rounded-b-3xl",
        className,
    )
    // §4/§5: when the caller goes the DATA path (`leadingIcon`/`metaText`/`trailingIcon`),
    // the frame owns scale + tone — the caller doesn't paint classes, doesn't hold an atom.
    // The leading icon matches the TEXT COLOUR (foreground) by default — decided: an icon
    // paired with a label follows the label's colour, it doesn't drop to muted on its own
    // (otherwise it reads as dim/disabled) — UNLESS `leadingIconColor` says the icon carries
    // its own status meaning (a checklist "done", a pass/fail row), in which case that status
    // wins over the label's colour.
    const leadingSlot = leading ?? (LeadingIcon ? (
        <LeadingIcon
            aria-hidden
            focusable="false"
            className={cn("size-5", leadingIconColor && LEADING_ICON_COLOR_CLASS[leadingIconColor])}
        />
    ) : null)
    const metaSlot = meta ?? (metaText != null
        ? <Typography size="sm" weight="medium" className="text-accent-soft-foreground" text={metaText} />
        : null)
    // DIV position (icon §1c/§4.2): the row is a control with FIXED `p-3` padding (not
    // hug-content), and its title is `text-sm` ⇒ line-height size = `size-5` — the SAME
    // formula the row's own `LeadingIcon` (line above) and the `selected` `CheckCircleIcon`
    // below already use. The previous `size-4` + forced `weight="bold"` was compensating
    // for the WRONG size (comparing against `size-5` neighbours in the same row) rather
    // than fixing the size itself (thầy chốt 2026-07-29) — at `size-5`, weight defaults
    // to Phosphor's `regular` (§3.2), matching `LeadingIcon`.
    const trailingSlot = trailing ?? (TrailingIcon ? <TrailingIcon aria-hidden focusable="false" className="size-5 text-muted" /> : null)
    const content = (
        <>
            {leadingSlot ? <div className="shrink-0">{leadingSlot}</div> : null}
            <StackV gap="flush" className="min-w-0">
                <Typography size="sm"
                    truncate
                    isSkeleton={isSkeleton}
                    className={cn(underlineHover && "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline", titleClassName)}
                    text={title}
                />
                {subtitle ? (
                    <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={subtitle} />
                ) : null}
            </StackV>
            {metaSlot || trailingSlot || selected ? (
                <StackH gap="related" className="ml-auto shrink-0">
                    {metaSlot}
                    {trailingSlot}
                    {/* Single-select indicator — trailing accent CheckCircleIcon (B). */}
                    {selected ? (
                        <CheckCircleIcon className="size-5 shrink-0 text-accent-soft-foreground" aria-hidden focusable="false" />
                    ) : null}
                </StackH>
            ) : null}
        </>
    )
    if (href) {
        return <RowAnchor href={href} onClick={onPress} ariaCurrent={selected} className={rowClassName} anatPart={anatPart}>{content}</RowAnchor>
    }
    if (onPress) {
        return <button type="button" onClick={onPress} disabled={isDisabled} aria-current={selected ? "true" : undefined} className={rowClassName} data-anat-part={anatPart}>{content}</button>
    }
    return <div aria-current={selected ? "true" : undefined} className={rowClassName} data-anat-part={anatPart}>{content}</div>
}
/**
 * One FREE-FORM row (`item.content`) — bespoke content instead of the fixed
 * leading/title/subtitle slots. The frame owns the padding + inset bottom
 * separator; the caller lays out whatever it needs inside.
 */
/** Props for the local {@link ListFreeRow} — a row with no surrounding card face. */
interface ListFreeRowProps {
    /** The row's data. */
    item: SurfaceCardListItem
}
const ListFreeRow = ({ item }: ListFreeRowProps) => {
    const { content, onPress, href, isDisabled = false, hover = "fill", className, anatPart } = item
    const withVerdict = itemVerdict(item)
    const interactive = Boolean(onPress || href)
    const itemClassName = cn(
        "relative block w-full p-3 text-left",
        verdictBandClassName(withVerdict),
        withVerdict?.enable && "first:rounded-t-3xl last:rounded-b-3xl",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-['']",
        "last:after:hidden",
        interactive && "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        interactive && (hover === "underline" ? "group" : "hover:bg-default"),
        interactive && !isDisabled && "cursor-pointer",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )
    if (href) {
        return <RowAnchor href={href} onClick={onPress} className={itemClassName} anatPart={anatPart}>{content}</RowAnchor>
    }
    if (onPress) {
        return <button type="button" onClick={onPress} disabled={isDisabled} className={itemClassName} data-anat-part={anatPart}>{content}</button>
    }
    return <div className={itemClassName} data-anat-part={anatPart}>{content}</div>
}
/**
 * Bounded SURFACE list card: one `bg-surface` container with a large radius holding
 * rows edge-to-edge, each with a full-bleed separator (the last row hides its own).
 * Pass `label` for a section header baked in above the list.
 *
 * @param props - {@link SurfaceCardListProps}
 */
const List = ({
    items,
    emptyState,
    variant = "surface",
    description,
    isSkeleton = false,
    className,
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
    anatPart,
    showAnatomy = false,
}: SurfaceCardListProps) => {
    const isEmpty = items.length === 0
    // The flag FLOWS ON straight into the real row — the row keeps its box/padding/
    // divider and only its text switches to shimmer, so there's no second row to
    // keep in sync (§12c).
    const rows = items.map((item) => (
        item.content != null
            ? <ListFreeRow key={item.key} item={item} />
            : <ListRow key={item.key} item={item} isSkeleton={isSkeleton} />
    ))
    const inner = !isSkeleton && isEmpty && emptyState != null ? <div className="p-8">{emptyState}</div> : rows
    const bare = label == null && description == null
    const surface = (
        <div
            data-anat-part={bare ? anatPart : undefined}
            className={cn(
                "overflow-hidden",
                surfaceFrame(variant),
                bare && className,
            )}
        >
            {inner}
        </div>
    )
    if (bare) return surface
    const caption = <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={description} />
    const withCaption = description != null ? (
        <StackV gap="related">
            {surface}
            <div data-anat-part={showAnatomy ? "Typography" : undefined}>{caption}</div>
        </StackV>
    ) : surface
    return (
        <section data-anat-part={anatPart} className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <div>
                <SurfaceCardHeader
                    label={label}
                    labelEnd={labelEnd}
                    onSeeMore={onSeeMore}
                    seeMoreLabel={seeMoreLabel}
                    action={action}
                    subtleLabel={subtleLabel}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            </div>
            {withCaption}
        </section>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .Accordion — bounded surface of collapsible rows (was `SurfaceAccordionCard`)
// ─────────────────────────────────────────────────────────────────────────────
/** One collapsible section of a {@link SurfaceCardAccordion}. */
export interface SurfaceCardAccordionItem {
    /** Stable id — also the expand key. */
    id: string
    /**
     * Trigger headline (the always-visible row). Plain string — goes through
     * `Typography.parseInlineCode` (`` `backtick` `` only), never bold/italic/link
     * (thầy chốt 2026-07-29: title tier stays plain, markdown-tier-rules.html).
     */
    title: string
    /** Optional muted second line in the trigger. */
    subtitle?: ReactNode
    /**
     * Optional leading node before the title text (e.g. a status icon with its
     * own colour) — kept OUTSIDE `Typography` so it never inherits `currentColor`
     * from the title text, mirroring `titleEnd` on the trailing side.
     */
    titleStart?: ReactNode
    /** Optional trailing node in the trigger, left of the caret (a chip/count). */
    titleEnd?: ReactNode
    /** Panel content, revealed when the item expands. */
    body: ReactNode
}
/** Props for {@link SurfaceCardAccordion}. */
export interface SurfaceCardAccordionProps extends SurfaceLabelProps {
    /** The collapsible sections, in order. REQUIRED — repeat list = data, never children. */
    items: ReadonlyArray<SurfaceCardAccordionItem>
    /** Allow more than one section open at once. Default `false`. */
    allowsMultipleExpanded?: boolean
    /** Sections expanded on mount, keyed by item `id` (a `Set`). */
    defaultExpandedKeys?: Set<string>
    /**
     * `"surface"` (default) `shadow-surface`, or `"nested"` — border INSTEAD OF
     * shadow when this face sits INSIDE another face (§1a).
     *
     * 2026-07-26 (instructor): changed from `bordered?: boolean`. `bordered=true` → `variant="nested"`.
     */
    variant?: SurfaceCardVariant
    /**
     * Shown (padded, centered) INSIDE the surface when `items` is empty — so an empty
     * accordion reads as an intentional empty state, not a blank card.
     */
    emptyState?: ReactNode
    /**
     * Caption text placed OUTSIDE (below) the card, `gap-2` — a hint/note, not
     * chrome inside the card.
     *
     * This is the DATA PATH (§4): the caller passes a string, the FRAME wraps
     * `Typography` itself and picks the size + tone (`xs` muted). Before 2026-07-26
     * it took a `ReactNode`, so the call-site had to hand-write
     * `<Typography type="body-xs" color="muted">…` — the caller holding
     * scale/tone is exactly what §4 forbids, and it also blocked `isSkeleton`
     * from flowing through (the frame had to branch off to build a separate
     * shimmer bar instead of passing the flag down to the very atom rendering
     * this text).
     */
    description?: string
    /**
     * `true` → SELF-render this card's own mirror (same surface frame, same trigger
     * row, row count = `items.length` — 3 when empty) INSTEAD of the real accordion:
     * the owner of the shape is the owner of the skeleton (§12c). Consumer just flips the flag; there is
     * NO shared skeleton component to place outside (mirrors `Button.isSkeleton`).
     */
    isSkeleton?: boolean
    /** Extra classes on the outer section / surface. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Storybook-only: badge this composite's OWN direct parts (Header/Surface/Row) for a BlockAnatomy panel. */
    showAnatomy?: boolean
}
/**
 * Divider colour between two accordion rows — SHARED SSOT for the REAL row and the
 * skeleton row, so the two never drift apart (§12c).
 */
const ACCORDION_SEPARATOR_STYLE = {
    "--separator": "color-mix(in oklab, var(--surface-foreground) 6%, transparent)",
} as React.CSSProperties
/** The bounded `bg-surface` frame of full-bleed collapsible rows. */
const AccordionFrame = ({
    items,
    allowsMultipleExpanded,
    defaultExpandedKeys,
    variant,
    showAnatomy,
    anatPart,
}: Pick<SurfaceCardAccordionProps, "items" | "allowsMultipleExpanded" | "defaultExpandedKeys" | "variant" | "showAnatomy"> & { anatPart?: string }) => (
    <div className={cn("overflow-hidden", surfaceFrame(variant))} data-anat-part={anatPart}>
        <Accordion
            variant="default"
            style={ACCORDION_SEPARATOR_STYLE}
            allowsMultipleExpanded={allowsMultipleExpanded}
            defaultExpandedKeys={defaultExpandedKeys}
        >
            {items.map((item) => (
                <Accordion.Item
                    key={item.id}
                    id={item.id}
                    aria-label={item.title}
                    data-anat-part={showAnatomy ? "Accordion.Item" : undefined}
                >
                    <Accordion.Heading>
                        <Accordion.Trigger>
                            <StackH gap="tight" className="min-w-0 flex-1">
                                {item.titleStart}
                                <StackV gap="flush" className="min-w-0 flex-1 text-left">
                                    {/* Trigger is a <button> — full block-level MarkdownContent can't nest
                                        here, so `` `code` `` segments in the title go through
                                        `parseInlineCode` instead (span-only, no other markdown syntax). */}
                                    <Typography size="sm" weight="medium" truncate parseInlineCode text={item.title} />
                                    {item.subtitle != null ? (
                                        <Typography size="xs" color="muted" truncate text={item.subtitle} />
                                    ) : null}
                                </StackV>
                            </StackH>
                            <StackH gap="grouped" className="shrink-0">
                                {item.titleEnd}
                                {/* Vendor draws its OWN `IconChevronDown` glyph when this slot is left
                                    empty (verified: `@heroui/react/dist/components/accordion/accordion.js`
                                    — a second icon set with no `import` to grep, icon §1a.1) — override
                                    with Phosphor. `cloneElement` keeps `data-expanded`/`data-slot` so the
                                    180° rotation (`accordion.css` `.accordion__indicator[data-expanded]`)
                                    still runs off the SAME class, unaffected by the swap. `cloneElement`
                                    also REPLACES the child's own `className` with the slot's — so the
                                    size override goes on the WRAPPER, not the icon (same convention as
                                    `Alert.Base`'s `HeroAlert.Indicator className={GLYPH_SCALE}`).
                                    DIV position (icon §1c/§4.2): trigger has fixed `px-4 py-4` (not
                                    hug-content) — `text-sm` title → `size-5` line-height, not the flat
                                    `size-4` vendor default (thầy chốt 2026-07-29). Weight omitted →
                                    Phosphor default `regular`, correct at `size-5` (§3.2). */}
                                <Accordion.Indicator className="size-5">
                                    <CaretDownIcon aria-hidden focusable="false" />
                                </Accordion.Indicator>
                            </StackH>
                        </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                        <Accordion.Body className={cn("pt-0")}>{item.body}</Accordion.Body>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
)
/**
 * Mirror skeleton of {@link AccordionFrame} ITSELF — the owner of the shape is
 * the owner of the skeleton (§12c), it doesn't borrow a shared skeleton component.
 *
 * MATCHES THE REAL RENDER: same `surfaceFrame(variant)` + `overflow-hidden`, same
 * trigger row (`p-3`, row box height matching the real text's line-height),
 * same `h-px` divider between rows (the last row has none) — ONLY the text and
 * caret turn into shimmer bars.
 *
 * Row count comes from the real `items` when present (the mirror always mirrors
 * each row's `subtitle` line too, so the height matches the real version); with no
 * `items` yet, defaults to 3 rows.
 */
const AccordionFrameSkeleton = ({
    items,
    variant,
    showAnatomy,
    anatPart,
}: Pick<SurfaceCardAccordionProps, "items" | "variant" | "showAnatomy"> & { anatPart?: string }) => {
    // No data yet → default 3 rows; once there is, mirror each row exactly.
    const rows: ReadonlyArray<SurfaceCardAccordionItem | undefined> =
        items.length > 0 ? items : Array.from({ length: 3 }, () => undefined)
    return (
        <div
            className={cn("overflow-hidden", surfaceFrame(variant))}
            style={ACCORDION_SEPARATOR_STYLE}
            data-anat-part={anatPart}
        >
            {rows.map((item, index) => (
                <div key={item?.id ?? index} className="relative">
                    <div className="flex items-center p-3">
                        <StackV gap="flush" className="min-w-0 flex-1 text-left">
                            {/* Row box height EXACTLY matches the real text's line-height (sm=20px · xs=16px) —
                                the shimmer bar is only glyph-height, so without this wrapper the
                                loading row would sit shorter than the real row. */}
                            <span className="flex h-5 items-center">
                                <Typography size="sm" isSkeleton className="w-2/5" />
                            </span>
                            {item?.subtitle != null ? (
                                <span className="flex h-4 items-center">
                                    <Typography size="xs" isSkeleton className="w-1/4" />
                                </span>
                            ) : null}
                        </StackV>
                        {/* Caret: the real row ALWAYS has `Accordion.Indicator` (`ml-auto size-5`,
                            thầy chốt 2026-07-29 — was `size-4`) → the mirror keeps the exact same slot. */}
                        <HeroSkeleton className="ml-auto size-5 shrink-0 rounded" />
                    </div>
                    {index < rows.length - 1 ? (
                        <div className="absolute bottom-0 left-0 h-px w-full rounded-xs bg-[var(--separator)]" />
                    ) : null}
                </div>
            ))}
        </div>
    )
}
/**
 * An "Accordion Card": one bounded `bg-surface` frame holding collapsible sections
 * whose separators run FULL-BLEED to the card edge — the same skin as
 * {@link SurfaceCardList}, but each row expands. Pass `label` for a section header
 * baked in above the card; omit it and the card renders bare (for a pane that
 * already has a tab/heading).
 *
 * @param props - {@link SurfaceCardAccordionProps}
 */
const AccordionCard = ({
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
    items,
    allowsMultipleExpanded = false,
    defaultExpandedKeys,
    variant = "surface",
    emptyState,
    description,
    isSkeleton = false,
    className,
    anatPart,
    showAnatomy = false,
}: SurfaceCardAccordionProps) => {
    const bare = label == null && description == null
    // isSkeleton → self-render the mirror (same frame, items.length rows); never a bare accordion.
    // else no items → show the empty state in the same bg-surface frame (never a bare, broken accordion)
    const frame = isSkeleton ? (
        <AccordionFrameSkeleton
            items={items}
            variant={variant}
            showAnatomy={showAnatomy}
            anatPart={bare ? anatPart : undefined}
        />
    ) : items.length === 0 && emptyState != null ? (
        <div
            className={cn("overflow-hidden p-8", surfaceFrame(variant))}
            data-anat-part={bare ? anatPart : undefined}
        >
            {emptyState}
        </div>
    ) : (
        <AccordionFrame
            items={items}
            allowsMultipleExpanded={allowsMultipleExpanded}
            defaultExpandedKeys={defaultExpandedKeys}
            variant={variant}
            showAnatomy={showAnatomy}
            anatPart={bare ? anatPart : undefined}
        />
    )
    // bare = no header AND no caption → render the frame directly
    if (bare) return <div className={cn(className)}>{frame}</div>
    // description sits OUTSIDE (below) the card, gap-2 — never surface-in-surface
    const withCaption = description != null ? (
        <StackV gap="related">
            {frame}
            <div>{description}</div>
        </StackV>
    ) : frame
    return (
        <section data-anat-part={anatPart} className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <div>
                <SurfaceCardHeader
                    label={label}
                    labelEnd={labelEnd}
                    onSeeMore={onSeeMore}
                    seeMoreLabel={seeMoreLabel}
                    action={action}
                    subtleLabel={subtleLabel}
                />
            </div>
            {withCaption}
        </section>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .CrossList — static marked (✓/✗) list card (was `CrossListCard`)
// ─────────────────────────────────────────────────────────────────────────────
/** Per-row mark: success check · muted cross · NEUTRAL pending (not yet decided) · none. */
export type ListMark = "check" | "cross" | "pending" | "none"
/**
 * Tone of the mark — prominence climbs by TONE, the element stays (§2d):
 * `success` (green ✓ signal) · `muted` (recede, text leads) · `danger` (red — a hard
 * NEGATIVE signal: lost/blocked/warning row, not just "not included") · `neutral`
 * (`text-foreground`, same weight as body text — "not decided yet", NOT "unimportant";
 * §5a.3, teacher 2026-07-29: an icon carrying STATUS meaning must read the status, and
 * `muted` reads as the latter).
 */
export type MarkTone = "success" | "muted" | "danger" | "neutral"
const TONE_CLS: Record<MarkTone, string> = {
    success: "text-success-soft-foreground",
    muted: "text-muted",
    danger: "text-danger-soft-foreground",
    neutral: "text-foreground",
}
/** {@link markIcon} — exported so a caller (e.g. a progress row) can reuse the ONE
 * icon-per-status mapping instead of hand-rolling a parallel one (thầy chốt 2026-07-29). */
export const markIcon = (mark: ListMark, tone: MarkTone | undefined, anatPart: string | undefined): ReactNode => {
    if (mark === "check") {
        return (
            <CheckCircleIcon
                aria-hidden
                focusable="false"
                data-anat-part={anatPart}
                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "success"])}
            />
        )
    }
    if (mark === "cross") {
        return (
            <XCircleIcon
                aria-hidden
                focusable="false"
                data-anat-part={anatPart}
                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "muted"])}
            />
        )
    }
    if (mark === "pending") {
        return (
            <CircleIcon
                aria-hidden
                focusable="false"
                data-anat-part={anatPart}
                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "neutral"])}
            />
        )
    }
    return null
}
/** One row of a {@link SurfaceCardCrossList}. */
export interface SurfaceCardCrossListItem {
    /** Stable React key. */
    key: string
    /** Row body — plain text (`<Typography>`) or markdown. */
    text: ReactNode
    /**
     * Leading mark: `"check"` (✓ included/done), `"cross"` (muted ✗ excluded), or `"none"`
     * (plain row). Default `"check"`.
     */
    mark?: ListMark
    /**
     * Tone of the mark. Defaults per mark: `check` → `"success"` (green ✓ — a real
     * included/done SIGNAL, e.g. PricingTable), `cross` → `"muted"` (excluded, recede).
     * `"muted"` on a check makes the TEXT lead (value-props INSIDE another card, see
     * `principles.md` §2); `"danger"` marks a hard NEGATIVE row (lost/blocked/warning —
     * e.g. a red ✗ "lost all progress"), not mere absence. Ignored for `none`.
     */
    tone?: MarkTone
    /** Anatomy tag: names this row so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Anatomy tag for the leading mark ICON slot (per-slot — the icon is internal, not a prop). */
    markAnatPart?: string
}
/** Props for {@link SurfaceCardCrossList}. */
export interface SurfaceCardCrossListProps {
    /** The rows. REQUIRED — repeat list = data, never children. Ignored when `isSkeleton`. */
    items: ReadonlyArray<SurfaceCardCrossListItem>
    /**
     * `"surface"` (default) `shadow-surface`, or `"nested"` — border INSTEAD OF
     * shadow when this list sits INSIDE another face (modal/drawer/panel) —
     * where shadow is invisible (§1a).
     *
     * 2026-07-26 (instructor): changed from `bordered?: boolean`. `bordered=true` → `variant="nested"`.
     */
    variant?: SurfaceCardVariant
    /** `true` → self-render `skeletonRows` placeholder rows (mark + text mirror) instead of `items`. */
    isSkeleton?: boolean
    /** Number of placeholder rows when `isSkeleton`. Default `3`. */
    skeletonRows?: number
    /** Extra classes on the list root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * When on, every row (real or self-generated skeleton) emits
     * `data-anat-part="CrossListItem"` for the anatomy panel — unless the item
     * carries its own `anatPart`.
     */
    showAnatomy?: boolean
}
/**
 * One row of a {@link SurfaceCardCrossList}: an optional leading mark + a free body,
 * `p-3` with a full-bleed separator (the last row hides it).
 *
 * `isSkeleton` self-renders a mirror row (dot sized to the real mark icon + a `body-sm`
 * text bar) inside the SAME `<li>` box, so layout never shifts once data arrives.
 */
const CrossListRow = ({
    mark = "check",
    tone,
    text,
    isSkeleton = false,
    anatPart,
    markAnatPart,
}: Omit<SurfaceCardCrossListItem, "key" | "text"> & { text?: ReactNode; isSkeleton?: boolean }) => (
    <StackH
        as="li"
        gap="grouped"
        align="start"
        padding="cozy"
        className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        anatPart={anatPart}
    >
        {isSkeleton ? (
            <>
                <HeroSkeleton className="size-5 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                    <Typography size="sm" isSkeleton className="w-3/4" />
                </div>
            </>
        ) : (
            <>
                {markIcon(mark, tone, markAnatPart)}
                <div className="min-w-0 flex-1">{text}</div>
            </>
        )}
    </StackH>
)
/**
 * Static "brief list" of MARKED rows (✓ / ✗ / none) in a bounded `bg-surface` card with
 * full-bleed dividers — a single list can mix marks (e.g. a plan's included ✓ and excluded
 * ✗ features). Read-only; for CLICKABLE rows use {@link SurfaceCardList}.
 *
 * `isSkeleton` self-renders `skeletonRows` mirror rows (each row in its own skeleton
 * state) — consumer just flips the flag, no manual `<Skeleton>` assembly.
 *
 * @param props - {@link SurfaceCardCrossListProps}
 */
const CrossList = ({
    items,
    variant = "surface",
    isSkeleton = false,
    skeletonRows = 3,
    className,
    anatPart,
    showAnatomy,
}: SurfaceCardCrossListProps) => (
    <ul className={cn("overflow-hidden", surfaceFrame(variant), className)} data-anat-part={anatPart}>
        {isSkeleton
            ? Array.from({ length: skeletonRows }).map((_, index) => (
                <CrossListRow key={index} isSkeleton />
            ))
            : items.map((item) => (
                <CrossListRow
                    key={item.key}
                    mark={item.mark}
                    tone={item.tone}
                    text={item.text}
                    anatPart={item.anatPart}
                    markAnatPart={item.markAnatPart}
                />
            ))}
    </ul>
)
// ─────────────────────────────────────────────────────────────────────────────
// .Placeholder — dashed "add new" tile (was `DashedPlaceholderCard`)
// ─────────────────────────────────────────────────────────────────────────────
/** Props for {@link SurfaceCardPlaceholder}. */
export interface SurfaceCardPlaceholderProps {
    /**
     * Decorative leading icon (a Phosphor icon), rendered TRẦN — the frame
     * forces it to `size-8` (§4) to match the label's tile-scale footprint.
     * Defaults to {@link PlusIcon}.
     */
    icon?: ReactNode
    /** Caption under the icon (e.g. "Create new CV"). */
    label: ReactNode
    /** Press handler — creates/opens the new item. */
    onPress: () => void
    /**
     * `true` → mark this tile as the CHOSEN one in a selectable grid — an
     * accent `ring-2 ring-accent`, same contract as `.Pressable`'s `isSelected`.
     * Rare (most callers just press it); available for parity with the rest
     * of the card family.
     */
    isSelected?: boolean
    /** Disables interaction and dims the tile (e.g. while the create mutation is in flight). */
    isDisabled?: boolean
    /**
     * `true` → render a generic skeleton mirror (same dashed-tile footprint,
     * icon + label swapped for shimmer) instead of the real press target.
     */
    isSkeleton?: boolean
    /** Extra classes on the tile. */
    className?: string
}
/**
 * Generic "add new" tile — a pressable, dashed-border `rounded-3xl` card with
 * a centered icon + label, muted. Fills the available height of its grid cell
 * (the tile itself is `h-full w-full`; the caller's grid row sets the height).
 *
 * Press contract §7: `active:scale` only, NO hover-bg — a dashed tile stays
 * quiet at rest and on hover, the only feedback is the press itself.
 *
 * @param props - {@link SurfaceCardPlaceholderProps}
 */
const Placeholder = ({
    icon,
    label,
    onPress,
    isSelected = false,
    isDisabled = false,
    isSkeleton = false,
    className,
}: SurfaceCardPlaceholderProps) => {
    // Generic skeleton mirror (§8) — same dashed frame, icon + label swapped
    // for shimmer placeholders so the loading tile shares the real footprint.
    if (isSkeleton) {
        return (
            <div
                className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-default p-6",
                    className,
                )}
            >
                <HeroSkeleton className="size-8 rounded-xl" />
                <Typography size="sm" isSkeleton className="w-1/3" />
            </div>
        )
    }
    return (
        <button
            type="button"
            onClick={onPress}
            disabled={isDisabled}
            aria-pressed={isSelected || undefined}
            className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-default p-6 text-center text-muted outline-none",
                "[-webkit-tap-highlight-color:transparent] transition-[scale] duration-200 ease-out motion-reduce:transition-none",
                "focus-visible:ring-2 focus-visible:ring-accent",
                isSelected && "ring-2 ring-accent",
                isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer active:scale-[0.97]",
                className,
            )}
        >
            {/* §4: the frame owns icon sizing — force the caller's bare icon to size-8. */}
            <span aria-hidden className="[&>svg]:size-8">
                {icon ?? <PlusIcon />}
            </span>
            <Typography size="sm" weight="medium" color="muted" text={label} />
        </button>
    )
}
/**
 * The card KHUNG namespace — every bounded card surface of the design system,
 * one import, nine members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `header`/`body`/`footer` slots (+ `children` = body) |
 * | `.Nested` | slots + `children`, or `items` (sections) |
 * | `.Pressable` | slots + `children` |
 * | `.PressableGroup` | `items` |
 * | `.SelectableGroup` | `items` (single-select, `value`/`onChange`) |
 * | `.List` | `items` |
 * | `.Accordion` | `items` |
 * | `.CrossList` | `items` |
 * | `.Placeholder` | none (`icon`/`label`/`onPress`) |
 */
export { Base as SurfaceCard, Nested as SurfaceCardNested, PressableGroup as SurfaceCardPressableGroup, SelectableGroup as SurfaceCardSelectableGroup, List as SurfaceCardList, AccordionCard as SurfaceCardAccordion, CrossList as SurfaceCardCrossList, Placeholder as SurfaceCardPlaceholder }