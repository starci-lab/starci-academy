import React, { useCallback, useEffect, useRef, useState } from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import Link from "next/link"
import { cn } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircleIcon, CircleIcon, PlusIcon, XCircleIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Card } from "@sb-components/atoms/display/Card/Card"
import { type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Radio, RadioContent } from "@sb-components/atoms/forms/Radio/Radio"
import { RadioGroup } from "@sb-components/atoms/forms/RadioGroup/RadioGroup"
import { Accordion as AccordionAtom, type AccordionItem as AccordionAtomItem } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { SurfaceCardHeader, surfaceSectionGap, surfaceFrame, type SurfaceLabelProps, type SurfaceCardVariant } from "@sb-components/composites/cards/SurfaceCard/surface-card-header"
import { type VerdictBand, type VerdictBandVariant, verdictBandClassName } from "@sb-components/composites/cards/verdict-band"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { RichText } from "@sb-components/composites/viewers/RichText/RichText"
import { PADDING_CLASS, type AllowedPadding } from "@sb-components/frames/_spacing"
import { Grid, type GridColumns } from "@sb-components/frames/Grid/Grid"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import { Box } from "@sb-components/frames/Box/Box"
import type { PrincipleToken } from "@sb-components/frames/_principles"
/**
 * `SurfaceCard` — the general wrapper frame of the card family. Owns the header section
 * (`SurfaceCardHeader`: label/labelEnd/see-more/action/subtleLabel), the `header`/`body`/`footer`
 * slot set, the `description` outside the card, and two independent frame axes `variant`
 * (`"surface" | "nested"`) and `padding`. Each slot is a component reference the frame calls
 * itself, so `isSkeleton` can reach inside it.
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "SurfaceCard" } as const

// ─────────────────────────────────────────────────────────────────────────────
// Shared slot plumbing
// ─────────────────────────────────────────────────────────────────────────────
/**
 * The named content slots every WRAPPER frame of this namespace accepts. Each is a
 * COMPONENT reference the frame itself calls (COMPOSITE-8) — never an already-built
 * node — so `isSkeleton` can reach inside it the same way it reaches every atom this
 * composite renders directly.
 */
interface SlotProps {
    /** Top slot INSIDE the frame (a title row, a toolbar). Optional. */
    header?: ComponentTypeWithSkeleton
    /** Main slot. */
    body?: ComponentTypeWithSkeleton
    /** Bottom slot INSIDE the frame (a CTA row, a caption). Optional. */
    footer?: ComponentTypeWithSkeleton
}
/**
 * Resolves `header`/`body`/`footer` into ONE node, calling each with `isSkeleton`
 * (COMPOSITE-8: a slot is a reference the frame calls, never a node already built).
 * With neither `header` nor `footer` the body is returned RAW, so a `body`-only call
 * renders the exact same DOM as before this refactor (no extra wrapper div).
 */
const composeSlots = ({ header: Header, body: Body, footer: Footer, isSkeleton }: SlotProps & { isSkeleton?: boolean }): ReactNode => {
    const main = Body ? <Body isSkeleton={isSkeleton} /> : null
    if (Header == null && Footer == null) {
        return main
    }
    return (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            items={[
                ...(Header != null ? [() => <div><Header isSkeleton={isSkeleton} /></div>] : []),
                ...(main != null ? [() => <div>{main}</div>] : []),
                ...(Footer != null ? [() => <div><Footer isSkeleton={isSkeleton} /></div>] : []),
            ]}
        />
    )
}
/**
 * Interactive anchor for a clickable row: an INTERNAL route (`/…`) → Next `<Link>`
 * (client-side push, keeps history); a protocol / external href → native `<a>`.
 */
/** Internal link/anchor chrome — not a public prop door (COMPOSITE-4). */
interface RowAnchorConfig {
    href: string
    onClick?: () => void
    ariaCurrent?: boolean
    /** Pre-composed frame classes applied to the link element. */
    chrome?: string
    children: ReactNode
}

const RowAnchor = ({
    href,
    onClick,
    ariaCurrent,
    chrome,
    children,
}: RowAnchorConfig) => {
    if (href.startsWith("/")) {
        return <Link href={href} onClick={onClick} aria-current={ariaCurrent ? "true" : undefined} className={chrome}>{children}</Link>
    }
    return <a href={href} onClick={onClick} aria-current={ariaCurrent ? "true" : undefined} className={chrome}>{children}</a>
}
/**
 * Discriminates the two accessible-name contracts for a PRESSABLE card: without
 * `actions` the content IS the card's label (optional `ariaLabel` only when the
 * content carries no readable text — an icon-only tile); WITH `actions` the
 * whole-card target becomes a transparent overlay with no visible text of its
 * own, so `ariaLabel` becomes REQUIRED.
 *
 * Named `ariaLabel` here (not `label`) — `SurfaceCardBaseProps`
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
     * `Typography` itself and picks the size + tone (`xs` muted); it takes a string, not
     * a `ReactNode`, so the call-site had to hand-write
     * `<Typography type="body-xs" color="muted">…` — the caller holding
     * scale/tone is exactly what §4 forbids, and it also blocked `isSkeleton`
     * from flowing through (the frame had to branch off to build a separate
     * shimmer bar instead of passing the flag down to the very atom rendering
     * this text).
     */
    description?: string
    /**
     * Face frame: `"surface"` (default) `shadow-surface`, or `"nested"` — border
     * INSTEAD OF shadow when this face sits INSIDE another face.
     */
    variant?: SurfaceCardVariant
    /**
     * Padding around the content. Default `{4}`. Set `{1}` when the child
     * hugs the edge itself (a bleed-edge cover image) — still keeps
     * `overflow-hidden` so rounding clips a bleeding child correctly.
     *
     * An INDEPENDENT axis from `variant` — a `nested` card AND
     * `padding={1}` is a real combination (a bleed-edge image inside a nested
     * card); merging them would kill that combo.
     */
    padding?: AllowedPadding
    /**
     * `true` → the parts the frame OWNS ITSELF (`label` · right slot ·
     * `description`) switch to shimmer, AND every slot it renders (`header` /
     * `body` / `footer`) is CALLED with `isSkeleton` too (COMPOSITE-8 — a slot
     * is a component reference this frame calls itself, so the flag reaches
     * inside it the same way it reaches the label and the caption).
     *
     * ```tsx
     * <SurfaceCard isSkeleton={loading} label="My courses" body={ProfileRow} />
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
     * NOTE: The visual lives in the GLOBAL class `.highlight-card-sweep`
     * (`src/app/globals.css`), not in this file — fixing the sweep effect means
     * going to `src`. This is the only node in the `SurfaceCard` tree in
     * that situation.
     */
    isHighlight?: boolean
    /**
     * Press handler — set (with or without `href`) to render the WHOLE CARD as a
     * `<button>`/`<a>` instead of a plain `<div>`. Ripple + `active:scale-[0.97]` press feedback, no hover
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
    /**
     * Where the section wrapper sits inside its parent. Appearance is not passable —
     * it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /** Extra classes on the surface (content) wrapper. */
    contentClassName?: string
}
/** Shared label, press, highlight and placement props for every SurfaceCard variant. */
export type SurfaceCardBaseProps = SurfaceCardBaseOwnProps & PressableActionsProps
/**
 * The generic `bg-surface` content card of the namespace, with an OPTIONAL section
 * header baked in — pass `label` and it renders a `Label` OUTSIDE (above) the card,
 * plus one optional right slot (`action` ▸ `onSeeMore` ▸ `labelEnd`). Omit `label`
 * and the card renders bare. Content comes in via the `header`/`body`/`footer` slots.
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
    description,
    variant = "surface",
    padding = 4,
    isSkeleton = false,
    isHighlight = false,
    onPress,
    href,
    isDisabled = false,
    isSelected = false,
    actions,
    ariaLabel,
    classNames,
    contentClassName,
}: SurfaceCardBaseProps) => {
    const { ripples, add: addRipple, clear: clearRipple } = useRipple()
    const content = composeSlots({ header, body, footer, isSkeleton })
    const paddingCls = padding === 1 ? "overflow-hidden" : PADDING_CLASS[padding]
    // A card is PRESSABLE the moment it gets `onPress`/`href` — same derived-not-
    // passed convention `List.Row` already uses (`const isPressable = Boolean(onPress
    // || href)`).
    //
    // NEVER pressable while `isSkeleton`, though: nothing underneath can be
    // pressed yet, so a loading card falls through to the plain (non-interactive)
    // `!isPressable` branch below and simply renders `content` — the caller's own
    // tree, already carrying `isSkeleton` down to whatever atoms it composed.
    // This frame does not own a second "generic tile"
    // shimmer of its own for the pressable case — same frame, same padding,
    // flag forwarded, exactly like the non-pressable path.
    const isPressable = !isSkeleton && Boolean(onPress || href)
    let card: ReactNode
    if (!isPressable) {
        // `relative` — WITHOUT it this div is `static`, and `.highlight-card-sweep`
        // (`position: absolute`) paints ABOVE any `static` sibling regardless of DOM
        // order, covering the card's own content instead of sitting behind it.
        // The Pressable branch below carries `relative` for the same reason.
        card = (
            <div
                className={cn("relative", surfaceFrame(variant), paddingCls, isSelected && "ring-2 ring-accent", contentClassName)}
            >
                {content}
            </div>
        )
    } else if (!actions) {
        // Whole card IS the press target. TWO different hover languages: a real
        // navigation LINK (`href`) reads as a link, not an action button — no
        // ripple/press-scale, just `.group` so the content can opt into the quiet
        // `underlineOnGroupHover` convention (`Typography`'s own prop, shared with
        // `SurfaceCardListItem.hover="underline"`). An in-place ACTION (`onPress`, no
        // `href`) keeps the ripple + `active:scale-[0.97]` push-in — no hover effect
        // at rest, the press IS the only feedback.
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
                <StackH
                    gap={4}
                    isSkeleton={isSkeleton}
                    items={[
                        () => <div className="min-w-0 flex-1">{content}</div>,
                        () => (
                            <div className="relative z-10">
                                <StackH isSkeleton={isSkeleton} gap={3} classNames={["shrink-0"]} items={[() => actions]} />
                            </div>
                        ),
                    ]}
                />
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
    // The frame owns this text so it wraps the atom — and so the flag simply
    // flows straight into that same atom, instead of branching off to build a
    // separate shimmer bar. Description is a "small richtext" tier, so it renders
    // as RichText, not bare Typography; isSkeleton flows straight down as a prop,
    // no branching into two components.
    const caption = <RichText size="body-xs" color="muted" isSkeleton={isSkeleton} text={description ?? ""} />
    const cardWithCaption = description != null ? (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => highlighted,
                () => caption,
            ]}
        />
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
        />
    )
    return (
        <section
            data-principle={subtleLabel ? "sublabel-field" : "label-field"}
            className={cn("flex flex-col", surfaceSectionGap(subtleLabel), classNames)}
            data-tier="composite"
            data-component="SurfaceCard"
        >
            {labelRow}
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
    /** Section header title. The composite wraps it in `Typography` itself (COMPOSITE-8). */
    title: string
    /** Optional muted sub-label above the title (context, e.g. a course/module name). Text — same reasoning as {@link SurfaceCardNestedSection.title}. */
    eyebrow?: string
    /** Optional body under the header (description text, meta rows) — a component reference (COMPOSITE-8), never an already-built node, so `isSkeleton` can reach it. */
    content?: ComponentTypeWithSkeleton
    /** Press handler — renders the row as a native `<button>` (nav-link affordance). */
    onPress?: () => void
    /** Destination — renders the row as a native `<a>` (nav-link affordance). Wins over `onPress`. */
    href?: string
    /**
     * Where this section sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
}
/** Props for {@link SurfaceCardNested}. */
export interface SurfaceCardNestedProps extends SlotProps {
    /** Header title (quiet eyebrow label, e.g. "Related posts"). Omit when passing `header`. The composite wraps it in `Typography` itself (COMPOSITE-8). */
    title?: string
    /**
     * Optional leading eyebrow icon in the header — a COMPONENT reference
     * (COMPOSITE-8), never an already-built element; the card owns its size-4 (§4/§5).
     */
    icon?: ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>
    /**
     * Optional trailing header slot (e.g. a count) — right-aligned beside the title.
     * A COMPONENT reference (COMPOSITE-8), not an already-built node.
     */
    meta?: ComponentType
    /**
     * Inner sections rendered as the divided body. Preferred over `body` when
     * the body IS a repeating list of sections.
     */
    items?: ReadonlyArray<SurfaceCardNestedSection>
    /**
     * Corner radius: `"3xl"` (default) or `"xl"` (tighter, for cramped contexts
     * like a chat bubble).
     */
    radius?: "xl" | "3xl"
    /**
     * Surface-in-surface: `variant="nested"` → `border border-default bg-transparent`
     * — when the parent ALREADY has its own face (a `bg-surface` panel, a
     * `bg-surface-secondary` bubble, a modal/page card). Only leave
     * `variant="surface"` (default) when rendering DIRECTLY on
     * `bg-background`, with no parent face.
     */
    variant?: SurfaceCardVariant
    /**
     * `true` → `title` in the header bar and the rows built from `items` switch
     * to shimmer, and the `body` slot (when passed instead of `items`) is CALLED
     * with `isSkeleton` too (COMPOSITE-8 — `body` is a component this frame calls
     * itself, so the flag reaches inside it the same way it reaches every other
     * part this frame renders).
     */
    isSkeleton?: boolean
    /**
     * Where the card root sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
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
const NestedSection = ({ title, eyebrow, content: Content, onPress, href, classNames, isSkeleton = false }: Omit<SurfaceCardNestedSection, "key"> & { isSkeleton?: boolean }) => {
    const interactive = Boolean(onPress || href)
    // §10: parent owns the gap (tight) — eyebrow/title/content no longer self-margin.
    const body = (
        <StackV
            gap={2}
            classNames={["min-w-0"]}
            isSkeleton={isSkeleton}
            items={[
                ...(eyebrow ? [() => (
                    <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={eyebrow} />
                )] : []),
                () => (
                    <Typography size="sm"
                        weight="medium"
                        truncate
                        isSkeleton={isSkeleton}
                        underlineOnGroupHover={interactive}
                        text={title}
                    />
                ),
                ...(Content ? [() => <div><Content isSkeleton={isSkeleton} /></div>] : []),
            ]}
        />
    )
    if (href) {
        return (
            <a
                href={href}

                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    classNames,
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

                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    classNames,
                )}
            >
                {body}
            </button>
        )
    }
    return (
        <div className={cn("p-3", classNames)}>
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
    icon: Icon,
    meta: Meta,
    header: Header,
    items,
    body: Body,
    footer: Footer,
    radius = "3xl",
    variant = "surface",
    isSkeleton = false,
    classNames,
}: SurfaceCardNestedProps) => {
    const hasHeader = Header != null || title != null || Icon != null || Meta != null
    // The `items` path = the frame builds the row ⇒ the flag FLOWS ON straight into
    // that row (the row switches its own text to shimmer). The `body` slot is a
    // COMPONENT this frame calls itself (COMPOSITE-8), so the flag reaches it the
    // same way. No second row shape is built anywhere.
    const innerBody = items != null
        ? items.map(({ key, ...section }) => <NestedSection key={key} {...section} isSkeleton={isSkeleton} />)
        : (Body ? <Body isSkeleton={isSkeleton} /> : null)
    return (
        <div

            className={cn(
                "overflow-hidden",
                radius === "xl" ? "rounded-xl" : "rounded-3xl",
                variant === "nested" ? "border border-default bg-transparent" : "bg-surface shadow-surface",
                classNames,
            )}
            data-tier="composite"
            data-component="SurfaceCardNested"
        >
            {hasHeader ? (
                // NOTE: The header's own border chrome (`border-b border-default`) is not a
                // positioning token, so it wraps a div; the `px-3 py-2` padding threads
                // through the frame's own `padding` prop (asymmetric x/y shape).
                <div className="border-b border-default">
                    <StackH
                        gap={3}
                        justify="between"
                        principle="content-row"
                        classNames={["min-w-0"]}
                        padding={{ x: 4, y: 3 }}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (Header != null ? <Header isSkeleton={isSkeleton} /> : (
                                // leading eyebrow: card owns icon size-4 (§4/§5); icon inherits muted via this row
                                <div className="text-muted [&_svg]:size-4">
                                    <StackH
                                        gap={3}
                                        classNames={["min-w-0"]}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            ...(Icon ? [() => <Icon aria-hidden focusable="false" />] : []),
                                            () => (isSkeleton
                                                ? <Typography size="xs" isSkeleton />
                                                : <Typography size="xs" color="muted" truncate text={title} />),
                                        ]}
                                    />
                                </div>
                            )),
                            ...(Meta ? [() => <span className="shrink-0"><Meta /></span>] : []),
                        ]}
                    />
                </div>
            ) : null}
            <div className="flex flex-col divide-y divide-default">{innerBody}</div>
            {Footer ? (
                <Box principle="control-pad" className="border-t border-default px-3 py-2">
                    <Footer isSkeleton={isSkeleton} />
                </Box>
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
// `SurfaceCard` derives `isPressable` internally from `onPress`/`href` — the
// same way `List.Row` does — instead of a separate component. Its render tree
// (ripple + active:scale simple branch, the stretched-link actions branch)
// lives INSIDE `Base` above.
// ─────────────────────────────────────────────────────────────────────────────
// .PressableGroup — a grid of press targets
// ─────────────────────────────────────────────────────────────────────────────
// Columns by container step: use {@link GridColumns} from `Grid` directly —
// the ONE grid system of the frame tier. Use the `@app-*` container scale
// (`@app-sm` = 40rem), not Tailwind's half-size `@sm` = 24rem scale, so
// breakpoints fire at the same points as the rest of the system.
/** One pressable card inside a {@link SurfaceCardPressableGroup}. */
export interface SurfaceCardPressableGroupItem {
    /** Stable React key. Also fixes the item's position for the 1–N shortcut. */
    key: string
    /**
     * Named icon slot — a COMPONENT reference (COMPOSITE-8), never an already-built
     * element. BARE (no size/color className) — the frame owns sizing (§4/§5a: tile
     * body defaults to `body-sm`/`text-sm` → `size-5`) + muted color in ONE place,
     * instead of every call-site hand-setting `className="size-5 text-muted"` on its
     * own icon.
     */
    icon?: ComponentType
    /** Where {@link SurfaceCardPressableGroupItem.icon} sits relative to `content`. Defaults to `"leading"`. */
    iconPosition?: "leading" | "trailing"
    /**
     * Card body — a component reference (COMPOSITE-8), never an already-built node,
     * so `isSkeleton` could reach inside it the same way every other slot in this
     * namespace does. Composed freely by the caller (text, chips…).
     */
    content: ComponentTypeWithSkeleton
    /** Press handler. Ignored when {@link SurfaceCardPressableGroupItem.href} is set. */
    onPress?: () => void
    /** Navigation target — renders this card as an anchor. */
    href?: string
    /** Dims the card and blocks both pressing and the keyboard shortcut. */
    isDisabled?: boolean
    /** Accessible name — needed only when {@link SurfaceCardPressableGroupItem.content} carries no readable text. */
    label?: string
    /**
     * Where this tile sits inside the grid (e.g. `@lg:col-start-2`) and any
     * tile-level tweaks on top of the `.Pressable` surface. Appearance is not
     * passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
     * Responsive column count — grid built with `Grid`. Defaults to a
     * single column.
     */
    columns?: GridColumns
    /**
     * Peer-card seam for the grid. Default `content-row` (12px). Use
     * `sibling-stack` for a denser peer tile grid (8px). Owns gap — do not pass `gap`.
     */
    principle?: PrincipleToken
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
    /**
     * Dev/spec: tag each direct tile (`SurfaceCard` / `SkeletonTile`) with an
     * {@link AnatomyOverlay} anchor so a BlockAnatomy panel can badge it on-render.
     */
    /** Where the grid sits inside its parent. */
    classNames?: Array<AllowedClassName>
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
    const Content = item.content
    if (!item.icon) {
        return <Content />
    }
    const Icon = item.icon
    const iconSlot = <span className={ITEM_ICON_CLS}><Icon /></span>
    return (
        <StackH
            gap={4}
            items={[
                ...(item.iconPosition === "trailing" ? [] : [() => iconSlot]),
                () => <div className="min-w-0 flex-1"><Content /></div>,
                ...(item.iconPosition === "trailing" ? [() => iconSlot] : []),
            ]}
        />
    )
}
/**
 * One skeleton placeholder tile — mirrors {@link TILE_CHROME} + the standard
 * ProfileCard content shape (avatar + title + description), so the loading grid
 * holds the real shape these card-grids carry.
 */
/** Props for the local {@link PressableGroupSkeletonTile}. */
interface PressableGroupSkeletonTileProps {
    /**
     * Where this tile sits inside the grid. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
}
const PressableGroupSkeletonTile = ({ classNames }: PressableGroupSkeletonTileProps) => (
    <div className={cn(TILE_CHROME, "flex items-center gap-3 p-3", classNames)}>
        <div className="shrink-0">
            <Avatar isSkeleton size="md" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
            <Typography size="sm" isSkeleton />
            <Typography size="xs" isSkeleton />
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
    principle = "content-row",
    keyboardShortcut = false,
    isSkeleton = false,
    classNames,
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
            <div
                role="group"
                aria-label={ariaLabel}
                className={cn(classNames)}

                data-tier="composite"
                data-component="SurfaceCardPressableGroup"
            >
                <Grid
                    columns={columns}
                    principle={principle}
                    items={items.map((item) => ({
                        key: item.key,
                        content: () => <PressableGroupSkeletonTile classNames={item.classNames} />,
                    }))}
                />
            </div>
        )
    }
    // `Container` is where the frame tier OPENS a container (one frame, not every
    // frame opening its own). Grid built with `Grid`, the tier's ONE grid system,
    // instead of hand-declaring `grid`/`grid-cols-*`.
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={cn(classNames)}

            data-tier="composite"
            data-component="SurfaceCardPressableGroup"
        >
            <Grid
                columns={columns}
                principle={principle}
                items={items.map((item) => {
                    // A component reference, not a built node (COMPOSITE-8) — `Base`'s
                    // `body` slot calls this itself; the closure keeps the item's own
                    // content available without freezing it into an element up front.
                    const ItemBody = () => itemBody(item)
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
                                item.classNames,
                            )}
                            body={ItemBody}
                        />
                    )
                    return {
                        key: item.key,
                        content: () => tile,
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
    /** Primary label — the composite wraps it in `Typography` itself (COMPOSITE-8). */
    label: string
    /** Optional secondary line under the label — text, same reasoning as {@link SurfaceCardSelectableGroupItem.label}. */
    description?: string
    /** Optional leading icon — a COMPONENT reference (COMPOSITE-8), rendered decorative, never an already-built element. */
    icon?: ComponentType
    /** When true the card is dimmed and not selectable. */
    isDisabled?: boolean
    /** Optional trailing tag (e.g. a "coming soon" tag) shown on the right — a COMPONENT reference (COMPOSITE-8), never an already-built node. */
    badge?: ComponentType
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
    /**
     * Where the grid sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * Dev/spec: tag each card's own direct parts (`Icon` / `Label` / `Badge`) so a
     * BlockAnatomy panel can badge them.
     */
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
 * A single-select group of surface cards: each option is a house `Card`;
 * choosing one draws an accent OUTLINE ring around it (never a fill / colour change,
 * so the card stays neutral `bg-surface`). Built on house `RadioGroup`/`Radio`
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
 * NOTE: Uses house `Radio`/`RadioGroup`/`Card` rather than `ChoiceRadio`/
 * `ChoiceRadioGroup` — known drift, carried over from
 * `atoms/navigation/SelectableCardGroup` (not refactored in this move).
 *
 * @param props - {@link SurfaceCardSelectableGroupProps}
 */
const SelectableGroup = <T extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    columns = 2,
    classNames,
}: SurfaceCardSelectableGroupProps<T>) => (
        <RadioGroup
            aria-label={ariaLabel}
            value={value}
            onChange={(next) => onChange(next as T)}
            data-tier="composite"
            data-component="SurfaceCardSelectableGroup"
        >
            <Grid
                principle="sibling-stack"
                columns={SELECTABLE_GROUP_COLUMNS[columns]}
                classNames={classNames}
                items={items.map((item) => ({
                    key: item.value,
                    content: () => (
                        // House `Radio`/`Card` omit `className` from their public props —
                        // width and selection chrome ride plain wrappers around them.
                        <div className="w-full">
                            <Radio value={item.value} isDisabled={item.isDisabled}>
                                <RadioContent className="block w-full">
                                    {({ isSelected, isDisabled, isFocusVisible }) => {
                                        const optionRow = (
                                            <>
                                                {item.icon ? (
                                                    <span className="shrink-0" aria-hidden>
                                                        <item.icon />
                                                    </span>
                                                ) : null}
                                                <span className="flex min-w-0 flex-col">
                                                    <Typography size="sm" truncate text={item.label} />
                                                    {item.description != null ? (
                                                        <Typography size="xs" color="muted" truncate text={item.description} />
                                                    ) : null}
                                                </span>
                                                {item.badge ? (
                                                    <Box as="span" principle="push-end" className="shrink-0">
                                                        <item.badge />
                                                    </Box>
                                                ) : null}
                                            </>
                                        )
                                        return (
                                            <div
                                                className={cn(
                                                    "w-full text-sm text-foreground transition-colors",
                                                    // selection & keyboard focus = an accent OUTLINE ring, NO
                                                    // fill / colour change. Drop the card's `shadow-surface`
                                                    // while the ring is up so the two elevations don't stack.
                                                    (isSelected || isFocusVisible) &&
                                                "outline outline-2 outline-accent outline-offset-0 [&>*]:!shadow-none",
                                                    !isSelected && !isDisabled && "hover:bg-default",
                                                    isDisabled && "opacity-60",
                                                )}
                                            >
                                                <Card variant="default">
                                                    <StackH gap={3} items={[() => optionRow]} />
                                                </Card>
                                            </div>
                                        )
                                    }}
                                </RadioContent>
                            </Radio>
                        </div>
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
    /** Primary line — foreground, single-line truncate. Required for the FIXED row shape. The composite wraps it in `Typography` itself (COMPOSITE-8). */
    title?: string
    /** Optional secondary line — muted, smaller, single-line truncate. Text, same reasoning as {@link SurfaceCardListItem.title}. */
    subtitle?: string
    /**
     * Optional leading slot (thumbnail/icon), kept at intrinsic size — a COMPONENT
     * reference (COMPOSITE-8), never an already-built node. Loses to `leadingIcon`'s
     * simpler icon-only path when both would apply — this is for richer content
     * (an avatar, a thumbnail) the icon-only path can't express.
     */
    leading?: ComponentType
    /**
     * Leading icon as a COMPONENT REF — the frame builds it and forces
     * `size-5`, colour follows the text (foreground), NOT downgraded to muted.
     * The path for callers who must NOT hold an atom/JSX. Loses to `leading`
     * when both are passed; other blocks still use `leading`.
     */
    leadingIcon?: ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>
    /**
     * Set → the leading icon carries a STATUS meaning (a checklist "done", a
     * pass/fail row) instead of following the label's colour — reuses `Alert`'s
     * own `AlertStatus` rather than a bespoke enum, so this row's status
     * vocabulary never drifts from Alert's.
     * Omit → unchanged existing behaviour (icon follows the label/foreground).
     */
    leadingIconColor?: AlertStatus
    /** Optional right-aligned metadata (chips/counts) before the trailing node — a COMPONENT reference (COMPOSITE-8), never an already-built node. */
    meta?: ComponentType
    /**
     * Meta as TEXT — the frame wraps `Typography` accent itself. The data path
     * parallel to `meta` (node), same reasoning as {@link SurfaceCardListItem.leadingIcon}.
     */
    metaText?: string
    /** Optional far-right slot (caret / inline action) — a COMPONENT reference (COMPOSITE-8), never an already-built node. */
    trailing?: ComponentType
    /**
     * Trailing icon as a COMPONENT REF — the frame forces `size-4 text-muted`.
     * The data path parallel to `trailing` (node).
     */
    trailingIcon?: ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>
    /**
     * FREE-FORM row body — replaces the fixed leading/title/subtitle slots entirely.
     * A component reference (COMPOSITE-8), never an already-built node, so
     * `isSkeleton` could reach inside it the same way every other slot does.
     */
    content?: ComponentTypeWithSkeleton
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
    /**
     * Where this row sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
}
/** Props for {@link SurfaceCardList}. */
export interface SurfaceCardListProps extends SurfaceLabelProps {
    /** The rows. REQUIRED — repeat list = data, never children. Empty → renders `emptyState`. */
    items: ReadonlyArray<SurfaceCardListItem>
    /**
     * Shown (padded) INSIDE the surface when there are no rows — so empty reads as
     * intentional. A COMPONENT reference (COMPOSITE-8) — only ever called outside
     * the loading state (`items` empty implies nothing is loading).
     */
    emptyState?: ComponentType
    /**
     * Truthy → the frame falls to the ERROR branch, which OUTRANKS every other
     * (it beats the loading skeleton too). Pass the fetch error, and only once
     * there is no cached list left to show. Left empty — or with no `errorState`
     * — the frame falls through to skeleton/empty/content, the same fall-through
     * `AsyncContent` keeps.
     */
    error?: unknown
    /**
     * The ERROR branch slot — a COMPONENT reference (COMPOSITE-8), the shared
     * `AsyncContentError` frame or another, rendered padded inside the surface the
     * exact way `emptyState` is. Only ever called when `error` is truthy.
     */
    errorState?: ComponentType
    /**
     * `"surface"` (default) `shadow-surface`, or `"nested"` — border INSTEAD OF
     * shadow when this face sits INSIDE another face (§1a).
     *     */
    variant?: SurfaceCardVariant
    /** Caption text under the list, `gap-2` — the DATA path, the frame wraps `Typography` itself (§4). */
    description?: string
    /**
     * `true` → the frame SELF-renders its own mirror (same face, same row box,
     * same divider) INSTEAD OF `items`, and `label`/`description` also switch to
     * shimmer.
     *
     * NOTE: This branch receives `items` as DATA so the frame builds the row — the
     * flag FLOWS ON straight into that row, the row keeps its box/padding/divider
     * and only its text switches to shimmer. There's no second skeleton tree
     * anywhere (§12c), so no row-count prop is needed either: the row count IS
     * `items.length`.
     */
    isSkeleton?: boolean
    /**
     * Where the outer section / surface sits inside its parent. Appearance is not
     * passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
    info: "text-info-soft-foreground",
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
        leading: Leading,
        leadingIcon: LeadingIcon,
        leadingIconColor,
        title,
        titleClassName,
        subtitle,
        meta: Meta,
        metaText,
        trailing: Trailing,
        trailingIcon: TrailingIcon,
        onPress,
        href,
        selected = false,
        isDisabled = false,
        hover = "fill",
        classNames,
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
        classNames,
    )
    // §4/§5: when the caller goes the DATA path (`leadingIcon`/`metaText`/`trailingIcon`),
    // the frame owns scale + tone — the caller doesn't paint classes, doesn't hold an atom.
    // The leading icon matches the TEXT COLOUR (foreground) by default — decided: an icon
    // paired with a label follows the label's colour, it doesn't drop to muted on its own
    // (otherwise it reads as dim/disabled) — UNLESS `leadingIconColor` says the icon carries
    // its own status meaning (a checklist "done", a pass/fail row), in which case that status
    // wins over the label's colour.
    const leadingSlot = Leading ? <Leading /> : (LeadingIcon ? (
        <LeadingIcon
            aria-hidden
            focusable="false"
            className={cn("size-5", leadingIconColor && LEADING_ICON_COLOR_CLASS[leadingIconColor])}
        />
    ) : null)
    const metaSlot = Meta ? <Meta /> : (metaText != null
        ? <Typography size="sm" weight="medium"
            color="accent-soft" text={metaText} />
        : null)
    // DIV position (icon): the row is a control with FIXED `p-3` padding (not
    // hug-content), and its title is `text-sm` ⇒ line-height size = `size-5` — the
    // SAME formula the row's own `LeadingIcon` (line above) and the `selected`
    // `CheckCircleIcon` below use. At `size-5`, weight defaults to Phosphor's
    // `regular`, matching `LeadingIcon`.
    const trailingSlot = Trailing ? <Trailing /> : (TrailingIcon ? <TrailingIcon aria-hidden focusable="false" className="size-5 text-muted" /> : null)
    const content = (
        <>
            {leadingSlot ? <div className="shrink-0">{leadingSlot}</div> : null}
            <StackV
                gap={1}
                classNames={["min-w-0"]}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <div className={titleClassName}>
                            <Typography size="sm"
                                truncate
                                isSkeleton={isSkeleton}
                                underlineOnGroupHover={underlineHover}
                                text={title}
                            />
                        </div>
                    ),
                    ...(subtitle ? [() => (
                        <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={subtitle} />
                    )] : []),
                ]}
            />
            {metaSlot || trailingSlot || selected ? (
                <Box principle="push-end">
                    <StackH
                        gap={3}
                        classNames={["shrink-0"]}
                        isSkeleton={isSkeleton}
                        items={[
                            () => metaSlot,
                            () => trailingSlot,
                            // Single-select indicator — trailing accent CheckCircleIcon (B).
                            ...(selected ? [() => (
                                <CheckCircleIcon className="size-5 shrink-0 text-accent-soft-foreground" aria-hidden focusable="false" />
                            )] : []),
                        ]}
                    />
                </Box>
            ) : null}
        </>
    )
    if (href) {
        return <RowAnchor href={href} onClick={onPress} ariaCurrent={selected} chrome={rowClassName}>{content}</RowAnchor>
    }
    if (onPress) {
        return <button type="button" onClick={onPress} disabled={isDisabled} aria-current={selected ? "true" : undefined} className={rowClassName}>{content}</button>
    }
    return <div aria-current={selected ? "true" : undefined} className={rowClassName}>{content}</div>
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
    const { content: Content, onPress, href, isDisabled = false, hover = "fill", classNames } = item
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
        classNames,
    )
    if (!Content) {
        return null
    }
    if (href) {
        return <RowAnchor href={href} onClick={onPress} chrome={itemClassName}><Content /></RowAnchor>
    }
    if (onPress) {
        return <button type="button" onClick={onPress} disabled={isDisabled} className={itemClassName}><Content /></button>
    }
    return <div className={itemClassName}><Content /></div>
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
    emptyState: EmptyState,
    error,
    errorState: ErrorState,
    variant = "surface",
    description,
    isSkeleton = false,
    classNames,
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
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
    // Priority mirrors `AsyncContent`: error → skeleton → empty → content. Error
    // outranks the skeleton (a failed fetch is not a loading state); empty only
    // reads once loading is done.
    const inner = error && ErrorState != null
        ? <Box principle="page-pad"><ErrorState /></Box>
        : !isSkeleton && isEmpty && EmptyState != null ? <Box principle="page-pad"><EmptyState /></Box> : rows
    const bare = label == null && description == null
    const surface = (
        <div

            className={cn(
                "overflow-hidden",
                surfaceFrame(variant),
                bare && cn(classNames),
            )}
            data-tier="composite"
            data-component="SurfaceCardList"
        >
            {inner}
        </div>
    )
    if (bare) return surface
    // RichText, not bare Typography — same reasoning as the caption above.
    const caption = <RichText size="body-xs" color="muted" isSkeleton={isSkeleton} text={description ?? ""} />
    const withCaption = description != null ? (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => surface,
                () => <div>{caption}</div>,
            ]}
        />
    ) : surface
    return (
        <section

            data-principle={subtleLabel ? "sublabel-field" : "label-field"}
            className={cn("flex flex-col", surfaceSectionGap(subtleLabel), classNames)}
            data-tier="composite"
            data-component="SurfaceCardList"
        >
            <div>
                <SurfaceCardHeader
                    label={label}
                    labelEnd={labelEnd}
                    onSeeMore={onSeeMore}
                    seeMoreLabel={seeMoreLabel}
                    action={action}
                    subtleLabel={subtleLabel}
                    isSkeleton={isSkeleton}

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
     * Trigger headline (the always-visible row). Plain string, no markdown at
     * all — not even backtick code.
     */
    title: string
    /** Optional muted second line in the trigger. Text, same reasoning as {@link SurfaceCardAccordionItem.title}. */
    subtitle?: string
    /**
     * Optional leading slot before the title text (e.g. a status icon with its
     * own colour) — a COMPONENT reference (COMPOSITE-8), kept OUTSIDE `Typography`
     * so it never inherits `currentColor` from the title text, mirroring `titleEnd`
     * on the trailing side.
     */
    titleStart?: ComponentType
    /** Optional trailing slot in the trigger, left of the caret (a chip/count) — a COMPONENT reference (COMPOSITE-8), never an already-built node. */
    titleEnd?: ComponentType
    /**
     * Panel content, revealed when the item expands. A component reference
     * (COMPOSITE-8), never an already-built node, so `isSkeleton` could reach
     * inside it the same way every other slot does.
     */
    body: ComponentTypeWithSkeleton
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
     *     */
    variant?: SurfaceCardVariant
    /**
     * Shown (padded, centered) INSIDE the surface when `items` is empty — so an empty
     * accordion reads as an intentional empty state, not a blank card. A COMPONENT
     * reference (COMPOSITE-8) — only ever called outside the loading state (`items`
     * empty implies nothing is loading).
     */
    emptyState?: ComponentType
    /**
     * Caption text placed OUTSIDE (below) the card, `gap-2` — a hint/note, not
     * chrome inside the card.
     *
     * This is the DATA PATH (§4): the caller passes a string, the FRAME wraps
     * `Typography` itself and picks the size + tone (`xs` muted); it takes a string, not
     * a `ReactNode`, so the call-site had to hand-write
     * `<Typography type="body-xs" color="muted">…` — the caller holding
     * scale/tone is exactly what §4 forbids, and it also blocked `isSkeleton`
     * from flowing through (the frame had to branch off to build a separate
     * shimmer bar instead of passing the flag down to the very atom rendering
     * this text).
     */
    description?: string
    /**
     * `true` → forwarded straight into the house `Accordion` atom (COMPOSITE-3),
     * which self-renders its own collapsed-row mirror (COMPOSITE-10: the SHAPE of
     * that shimmer is the atom's, this layer only decides to ask for it).
     */
    isSkeleton?: boolean
    /**
     * Where the outer section / surface sits inside its parent. Appearance is not
     * passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}
/**
 * An "Accordion Card": one bounded `bg-surface` frame holding collapsible sections,
 * the same skin as {@link SurfaceCardList} but each row expands. Pass `label` for a
 * section header baked in above the card; omit it and the card renders bare (for a
 * pane that already has a tab/heading).
 *
 * Rendering is delegated to the house `Accordion` atom (COMPOSITE-3) instead of the
 * vendor's `Accordion` — this member's own job shrinks to composing each row's
 * trigger content (leading node + title + subtitle + trailing node) as DATA handed
 * to the atom's `items`, and forwarding `isSkeleton` straight into it so the atom
 * draws its own collapsed-row shimmer (COMPOSITE-10) — this layer never draws a bar.
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
    emptyState: EmptyState,
    description,
    isSkeleton = false,
    classNames,
}: SurfaceCardAccordionProps) => {
    const bare = label == null && description == null
    const atomItems: Array<AccordionAtomItem> = items.map((item) => ({
        key: item.id,
        title: (
            <StackH
                gap={2}
                classNames={["min-w-0", "flex-1"]}
                isSkeleton={isSkeleton}
                items={[
                    ...(item.titleStart ? [() => {
                        const TitleStart = item.titleStart
                        return TitleStart ? <TitleStart /> : null
                    }] : []),
                    () => (
                        <div className="text-left">
                            <StackV
                                gap={1}
                                classNames={["min-w-0", "flex-1"]}
                                isSkeleton={isSkeleton}
                                items={[
                                    // title does NOT render markdown, not even backtick-only via `parseInlineCode`.
                                    // Title tier is plain, absolutely.
                                    () => <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} text={item.title} />,
                                    ...(item.subtitle != null ? [() => (
                                        <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={item.subtitle} />
                                    )] : []),
                                ]}
                            />
                        </div>
                    ),
                    ...(item.titleEnd ? [() => {
                        const TitleEnd = item.titleEnd
                        return TitleEnd ? <TitleEnd /> : null
                    }] : []),
                ]}
            />
        ),
        content: <item.body isSkeleton={isSkeleton} />,
    }))
    // isSkeleton → the atom self-renders its own collapsed-row mirror (COMPOSITE-10:
    // the shape of the shimmer is the atom's, this layer only forwards the flag).
    // else no items → show the empty state in the same bg-surface frame (never a
    // bare, broken accordion).
    const frame = !isSkeleton && items.length === 0 && EmptyState != null ? (
        <div
            className={cn("overflow-hidden p-8", surfaceFrame(variant))}

        >
            <EmptyState />
        </div>
    ) : (
        <div className={cn("overflow-hidden", surfaceFrame(variant))}>
            <AccordionAtom
                items={atomItems}
                allowsMultiple={allowsMultipleExpanded}
                defaultExpandedKeys={defaultExpandedKeys ? Array.from(defaultExpandedKeys) : undefined}
                isSkeleton={isSkeleton}

            />
        </div>
    )
    // bare = no header AND no caption → render the frame directly
    if (bare) return <div className={cn(classNames)} data-tier="composite" data-component="SurfaceCardAccordion">{frame}</div>
    // description sits OUTSIDE (below) the card, gap-2 — never surface-in-surface
    const withCaption = description != null ? (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => frame,
                () => <div>{description}</div>,
            ]}
        />
    ) : frame
    return (
        <section

            data-principle={subtleLabel ? "sublabel-field" : "label-field"}
            className={cn("flex flex-col", surfaceSectionGap(subtleLabel), classNames)}
            data-tier="composite"
            data-component="SurfaceCardAccordion"
        >
            <div>
                <SurfaceCardHeader
                    label={label}
                    labelEnd={labelEnd}
                    onSeeMore={onSeeMore}
                    seeMoreLabel={seeMoreLabel}
                    action={action}
                    subtleLabel={subtleLabel}
                    isSkeleton={isSkeleton}

                />
            </div>
            {withCaption}
        </section>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .CrossList — static marked (check/cross) list card (was `CrossListCard`)
// ─────────────────────────────────────────────────────────────────────────────
/** Per-row mark: success check · muted cross · NEUTRAL pending (not yet decided) · none. */
export type ListMark = "check" | "cross" | "pending" | "none"
/**
 * Tone of the mark — prominence climbs by TONE, the element stays:
 * `success` (green check signal) · `muted` (recede, text leads) · `danger` (red — a hard
 * NEGATIVE signal: lost/blocked/warning row, not just "not included") · `neutral`
 * (`text-foreground`, same weight as body text — "not decided yet", NOT "unimportant";
 * an icon carrying STATUS meaning must read the status, and
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
 * icon-per-status mapping instead of hand-rolling a parallel one. */
export const markIcon = (mark: ListMark, tone: MarkTone | undefined): ReactNode => {
    if (mark === "check") {
        return (
            <CheckCircleIcon
                aria-hidden
                focusable="false"

                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "success"])}
            />
        )
    }
    if (mark === "cross") {
        return (
            <XCircleIcon
                aria-hidden
                focusable="false"

                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "muted"])}
            />
        )
    }
    if (mark === "pending") {
        return (
            <CircleIcon
                aria-hidden
                focusable="false"

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
    /** Row body — plain text. The composite wraps it in `Typography` itself (COMPOSITE-8). */
    text: string
    /**
     * Leading mark: `"check"` (check included/done), `"cross"` (muted cross excluded), or `"none"`
     * (plain row). Default `"check"`.
     */
    mark?: ListMark
    /**
     * Tone of the mark. Defaults per mark: `check` → `"success"` (green check — a real
     * included/done SIGNAL, e.g. PricingTable), `cross` → `"muted"` (excluded, recede).
     * `"muted"` on a check makes the TEXT lead (value-props INSIDE another card, see
     * `principles.md` §2); `"danger"` marks a hard NEGATIVE row (lost/blocked/warning —
     * e.g. a red cross "lost all progress"), not mere absence. Ignored for `none`.
     */
    tone?: MarkTone
}
/** Props for {@link SurfaceCardCrossList}. */
export interface SurfaceCardCrossListProps {
    /** The rows. REQUIRED — repeat list = data, never children. Ignored when `isSkeleton`. */
    items: ReadonlyArray<SurfaceCardCrossListItem>
    /**
     * `"surface"` (default) `shadow-surface`, or `"nested"` — border INSTEAD OF
     * shadow when this list sits INSIDE another face (modal/drawer/panel) —
     * where shadow is invisible.
     */
    variant?: SurfaceCardVariant
    /** `true` → self-render `skeletonRows` placeholder rows (mark + text mirror) instead of `items`. */
    isSkeleton?: boolean
    /** Number of placeholder rows when `isSkeleton`. Default `3`. */
    skeletonRows?: number
    /** Where the list root sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}
/**
 * One row of a {@link SurfaceCardCrossList}: an optional leading mark + a free body,
 * `p-3` with a full-bleed separator (the last row hides it).
 *
 * `isSkeleton` keeps the SAME `<li>` frame and only swaps the two pieces of content —
 * no second row shape is built anywhere (COMPOSITE-10). The body text always goes
 * through `Typography`'s own `isSkeleton` (§12c, atom draws its own bar). The leading
 * MARK is the one exception: unlike the caret/plus-icon chrome elsewhere in this file,
 * `mark` (check/cross/pending) is genuinely DATA — unknown until `items` loads — so a
 * neutral placeholder dot has to stand in for it. No house atom draws an icon-shaped
 * shimmer yet (documented ATOM GAP), so a plain static circle stands in instead of
 * reaching for the vendor's `Skeleton` (COMPOSITE-10) — not a licence to reach for
 * the vendor anywhere else in this member.
 */
const CrossListRow = ({
    mark = "check",
    tone,
    text,
    isSkeleton = false,
}: Omit<SurfaceCardCrossListItem, "key" | "text"> & { text?: string; isSkeleton?: boolean }) => (
    // The full-bleed inset separator (`after:*`) is chrome, not a positioning token, so it
    // wraps the `<li>` itself (a plain `<div>` here would break `<ul>`/`<li>` nesting) — the
    // frame inside stays a plain `div` and only lays out the row's two children.
    <li className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden">
        <StackH
            gap={4}
            align="start"
            principle="content-row"
            padding={4}
            isSkeleton={isSkeleton}
            items={
                isSkeleton ? [
                    () => <div aria-hidden className="size-5 shrink-0 rounded-full bg-default" />,
                    () => (
                        <div className="min-w-0 flex-1">
                            <Typography size="sm" isSkeleton />
                        </div>
                    ),
                ] : [
                    () => markIcon(mark, tone),
                    () => <div className="min-w-0 flex-1"><Typography size="sm" text={text ?? ""} /></div>,
                ]
            }
        />
    </li>
)
/**
 * Static "brief list" of MARKED rows (check / cross / none) in a bounded `bg-surface` card with
 * full-bleed dividers — a single list can mix marks (e.g. a plan's included check and excluded
 * cross features). Read-only; for CLICKABLE rows use {@link SurfaceCardList}.
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
    classNames,
}: SurfaceCardCrossListProps) => (
    <ul
        className={cn("overflow-hidden", surfaceFrame(variant), classNames)}

        data-tier="composite"
        data-component="SurfaceCardCrossList"
    >
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
     * Decorative leading icon — a COMPONENT reference (COMPOSITE-8), never an
     * already-built element; the frame forces it to `size-8` (§4) to match the
     * label's tile-scale footprint. Defaults to {@link PlusIcon}.
     */
    icon?: ComponentType<SVGProps<SVGSVGElement>>
    /** Caption under the icon (e.g. "Create new CV"). The composite wraps it in `Typography` itself (COMPOSITE-8). */
    label: string
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
    /** Where the tile sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
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
    icon: Icon = PlusIcon,
    label,
    onPress,
    isSelected = false,
    isDisabled = false,
    isSkeleton = false,
    classNames,
}: SurfaceCardPlaceholderProps) => {
    // COMPOSITE-10: ONE render path — the tile keeps the same dashed frame, gap and
    // padding in both states; only the interactivity (button vs plain div, since
    // nothing is pressable yet while loading) and the label's shimmer differ. The
    // icon is CHROME the caller already picked at call-time (defaults to a plain
    // `PlusIcon`), not data arriving later, so it renders as-is unchanged either
    // way — the same convention `Nested`'s header `icon` uses elsewhere in this file.
    const shellClassName = cn(
        "flex h-full w-full flex-col items-center justify-center gap-1 rounded-3xl border-2 border-dashed border-default p-6",
        !isSkeleton && "text-center text-muted outline-none [-webkit-tap-highlight-color:transparent] transition-[scale] duration-200 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-accent",
        !isSkeleton && isSelected && "ring-2 ring-accent",
        !isSkeleton && (isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-[0.97]"),
        classNames,
    )
    const tileBody = (
        <>
            {/* §4: the frame owns icon sizing — force the caller's bare icon to size-8. */}
            <span aria-hidden className="[&>svg]:size-8">
                <Icon />
            </span>
            <Typography size="sm" weight="medium" color="muted" isSkeleton={isSkeleton} text={label} />
        </>
    )
    if (isSkeleton) {
        return (
            <div
                data-principle="icon-text"
                className={shellClassName}
                data-tier="composite"
                data-component="SurfaceCardPlaceholder"
            >
                {tileBody}
            </div>
        )
    }
    return (
        <button
            type="button"
            onClick={onPress}
            disabled={isDisabled}
            aria-pressed={isSelected || undefined}
            data-tier="composite"
            data-component="SurfaceCardPlaceholder"
            data-principle="icon-text"
            className={shellClassName}
        >
            {tileBody}
        </button>
    )
}
/**
 * The card FRAME namespace — every bounded card surface of the design system,
 * one import, eight members. `.Pressable` isn't a separate member — `Base`
 * derives `isPressable` from `onPress`/`href` internally (see the file header).
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `header`/`body`/`footer` slots (each a component reference, COMPOSITE-8) |
 * | `.Nested` | slots, or `items` (sections) |
 * | `.PressableGroup` | `items` |
 * | `.SelectableGroup` | `items` (single-select, `value`/`onChange`) |
 * | `.List` | `items` |
 * | `.Accordion` | `items` |
 * | `.CrossList` | `items` |
 * | `.Placeholder` | none (`icon`/`label`/`onPress`) |
 */
export { Base as SurfaceCard, Nested as SurfaceCardNested, PressableGroup as SurfaceCardPressableGroup, SelectableGroup as SurfaceCardSelectableGroup, List as SurfaceCardList, AccordionCard as SurfaceCardAccordion, CrossList as SurfaceCardCrossList, Placeholder as SurfaceCardPlaceholder }