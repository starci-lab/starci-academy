import React, { useCallback, useEffect, useRef, useState } from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import Link from "next/link"
import { Accordion, Card, cn, Radio, RadioGroup, Skeleton as HeroSkeleton } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircleIcon, PlusIcon, XCircleIcon } from "@phosphor-icons/react"
import { SurfaceCardHeader, surfaceSectionGap, surfaceFrame, type SurfaceLabelProps, type SurfaceCardVariant } from "@sb-components/composites/cards/surface-card-header"
import { type VerdictBand, type VerdictBandVariant, verdictBandClassName } from "@sb-components/composites/cards/verdict-band"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PADDING_CLASS, type SeamScale, type InsetScale } from "@sb-components/frames/_spacing"
import { Grid, type GridColumns } from "@sb-components/frames/Grid/Grid"

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
 * - `children` stays allowed on WRAPPER frames (`.Base` / `.Nested` /
 *   `.Pressable`) — it is shorthand for `body`.
 * - A REPEATING LIST must take DATA via `items`; children are forbidden there
 *   (`.List` · `.PressableGroup` · `.SelectableGroup` · `.Accordion` · `.CrossList`).
 * - Namespace only — no bare component export.
 *
 * Behaviour/skin of every member is carried over VERBATIM from its old folder;
 * this is an API refactor, not a visual one. Synced to `src` later.
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
 * own `Choice.Radio`/`Choice.RadioGroup` atom
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
const composeSlots = ({ header, body, footer, children, showAnatomy }: SlotProps & { showAnatomy?: boolean }): ReactNode => {
    const main = body ?? children
    if (header == null && footer == null) {
        return main
    }
    return (
        <div className="flex flex-col gap-3">
            {header != null ? <div data-anat-part={showAnatomy ? "Header" : undefined}>{header}</div> : null}
            {main != null ? <div data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div> : null}
            {footer != null ? <div data-anat-part={showAnatomy ? "Footer" : undefined}>{footer}</div> : null}
        </div>
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

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the generic `bg-surface` content card (was `SurfaceCard`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link SurfaceCard.Base}. */
export interface SurfaceCardBaseProps extends SurfaceLabelProps, SlotProps {
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
     * <SurfaceCard.Base isSkeleton={loading} label="My courses">
     *   <ProfileRow isSkeleton={loading} />
     * </SurfaceCard.Base>
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
    className,
    contentClassName,
    anatPart,
    showAnatomy = false,
}: SurfaceCardBaseProps) => {
    const content = composeSlots({ header, body, footer, children, showAnatomy })
    const card = (
        <div
            className={cn(
                surfaceFrame(variant),
                padding === "flush" ? "overflow-hidden" : PADDING_CLASS[padding],
                contentClassName,
            )}
            data-anat-part={showAnatomy ? "Content" : undefined}
        >
            {content}
        </div>
    )
    // The sweep sits on a SEPARATE layer BEHIND the card face (peeking out 2px past
    // the edge), so it needs a `relative` wrapper to anchor to. Off while
    // `isSkeleton`: at rest there's nothing worth emphasizing yet — running the
    // sweep around a shimmer block would just be noise.
    const highlighted = isHighlight ? (
        <div className="relative" data-anat-part={showAnatomy ? "Highlight" : undefined}>
            {isSkeleton ? null : <div aria-hidden className="highlight-card-sweep" />}
            {card}
        </div>
    ) : card
    // The frame owns this text so it wraps the atom (§4) — and so the flag simply
    // flows straight into that same atom, instead of branching off to build a
    // separate shimmer bar.
    const caption = <Typography.Base size="xs" color="muted" isSkeleton={isSkeleton} text={description} />
    const cardWithCaption = description != null ? (
        <div className="flex flex-col gap-2">
            {highlighted}
            {showAnatomy ? <div data-anat-part="Description">{caption}</div> : caption}
        </div>
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

/** One inner section of a {@link SurfaceCard.Nested} (`items` row). */
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

/** Props for {@link SurfaceCard.Nested}. */
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
        <div className="flex min-w-0 flex-col gap-1">
            {eyebrow ? (
                <Typography.Base size="xs" color="muted" truncate isSkeleton={isSkeleton} text={eyebrow} />
            ) : null}
            <Typography.Base size="sm"
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
        </div>
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
                <div className="flex min-w-0 items-center justify-between gap-2 border-b border-default px-3 py-2">
                    {header ?? (
                        // leading eyebrow: card owns icon size-4 (§4/§5); icon inherits muted via the span
                        <span
                            className="flex min-w-0 items-center gap-2 text-muted [&_svg]:size-4"
                            data-anat-part={showAnatomy ? "Header" : undefined}
                        >
                            {icon}
                            {isSkeleton
                                ? <Typography.Base size="xs" isSkeleton className="w-28" />
                                : <Typography.Base size="xs" color="muted" truncate text={title} />}
                        </span>
                    )}
                    {meta ? <span className="shrink-0" data-anat-part={showAnatomy ? "Meta" : undefined}>{meta}</span> : null}
                </div>
            ) : null}
            <div className="flex flex-col divide-y divide-default" data-anat-part={showAnatomy ? "Body" : undefined}>{innerBody}</div>
            {footer ? (
                <div className="border-t border-default px-3 py-2" data-anat-part={showAnatomy ? "Footer" : undefined}>
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

/** Props shared by both press-target shapes of {@link SurfaceCard.Pressable}. */
interface PressableBaseProps extends SlotProps {
    /**
     * Press handler for an action card (select / toggle). Ignored when
     * {@link SurfaceCardPressableProps.href} is set. One of `onPress` / `href`
     * should be provided for the card to be interactive.
     */
    onPress?: () => void
    /** Navigation target — renders the card as an anchor when provided. */
    href?: string
    /** Disables interaction and dims the card (action cards only). */
    isDisabled?: boolean
    /**
     * `true` → mark this card as the CHOSEN one in a selectable grid — an accent
     * `ring-2 ring-accent` around the card (the card-equivalent of a list row's
     * trailing check). Sets `aria-pressed`/`aria-current` so it's announced.
     */
    isSelected?: boolean
    /**
     * `true` → render a generic skeleton mirror (tile-shaped placeholder) instead
     * of the real press target. The consumer just flips the flag — the mirror
     * doesn't depend on the real `children`/`actions` (same as base `Button`).
     */
    isSkeleton?: boolean
    /** Extra classes on the card surface. */
    className?: string
    /** When on, emit `data-anat-part` on this block's parts for a BlockAnatomy panel to badge on-render. */
    showAnatomy?: boolean
}

/**
 * Discriminates the two accessible-name contracts: without `actions` the
 * content IS the card's label (optional `label` only for icon-only tiles);
 * WITH `actions` the whole-card target becomes a transparent overlay with no
 * visible text of its own, so `label` becomes REQUIRED.
 */
type PressableActionsProps =
    | {
        /** No secondary controls — the whole card is ONE press target. */
        actions?: undefined
        /**
         * Accessible name for the whole-card press target. Optional here —
         * without `actions` the content IS the card's accessible name, so pass
         * this only when it carries no readable text (an icon-only tile).
         */
        label?: string
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
        /**
         * Accessible name for the whole-card press target. REQUIRED — the stretched
         * overlay covers the card but has no visible text of its own.
         */
        label: string
    }

/** Props for {@link SurfaceCard.Pressable}. */
export type SurfaceCardPressableProps = PressableBaseProps & PressableActionsProps

/**
 * A whole-card press target with the default surface card look (surface fill,
 * concentric `rounded-3xl`, fixed `p-3` padding, `shadow-surface` elevation AT
 * REST — per `card.md` §0) plus a hover affordance and keyboard focus ring.
 * Exists because HeroUI v3 `Card` is a non-interactive `<div>` — this frame owns
 * the card styling on a real `<button>` / `<a>`. Hover tints the surface; PRESS
 * scales it to 0.97 (subtle push-in) via native `:active`. Use for navigation
 * tiles, selectable option cards, and bookmark rows.
 *
 * When the card also needs its OWN buttons (a "Continue" CTA, an overflow menu),
 * pass them via `actions` + `label` (TypeScript enforces `label` once `actions`
 * is set): the card renders as the accessible stretched-link pattern.
 *
 * @param props - {@link SurfaceCardPressableProps}
 */
const Pressable = ({
    header,
    body,
    footer,
    children,
    onPress,
    href,
    isDisabled = false,
    isSelected = false,
    isSkeleton = false,
    actions,
    label,
    className,
    showAnatomy,
}: SurfaceCardPressableProps) => {
    const { ripples, add: addRipple, clear: clearRipple } = useRipple()
    const content = composeSlots({ header, body, footer, children, showAnatomy })

    // Skeleton mirror — generic tile shape (leading tile + 2 text bars), same
    // outer frame/padding as the real card, regardless of actions/content.
    if (isSkeleton) {
        return (
            <div
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
                className={cn("flex items-center gap-3 rounded-3xl bg-surface p-3 shadow-surface", className)}
            >
                <HeroSkeleton className="size-10 shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Typography.Base size="sm" isSkeleton className="w-2/3" />
                    <Typography.Base size="xs" isSkeleton className="w-1/3" />
                </div>
            </div>
        )
    }

    // Shared card surface + disabled dim, identical across both render paths.
    // NO hover effect (like a HeroUI pressable card — hover is inert); the ONLY
    // feedback is the PRESS: a `active:scale-[0.97]` push-in + ripple. ⚠️ Tailwind
    // v4: `scale-*` sets the `scale:` property (NOT `transform:`), so the
    // transition MUST list `scale` — listing `transform` instead makes scale
    // change instantly (a jump cut). `duration-200 ease-out` for a smooth
    // push-in; `motion-reduce` turns it off; tap-highlight hidden on mobile.
    // Shared LOOK only — press-scale is added PER-VARIANT below (simple = element's
    // own `:active`; stretched = only when the OVERLAY is pressed, NOT the inner
    // actions — a Continue/menu click must NOT scale the whole card).
    const surface = cn(
        "rounded-3xl bg-surface p-3 text-left shadow-surface [-webkit-tap-highlight-color:transparent]",
        "transition-[scale] duration-200 ease-out motion-reduce:transition-none",
        // Selected = accent ring around the card (the card-equivalent of a row's check).
        isSelected && "ring-2 ring-accent",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )

    // ── Simple whole-card target (no secondary actions) — the whole card is ONE
    // <button>/<a> and its content is its label. ───────────────────────────────
    if (!actions) {
        // `relative overflow-hidden` so the ripple clips to the rounded card shape.
        // Simple variant = the whole element IS the press target → its own `:active`.
        const base = cn(
            "relative block w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent",
            surface,
            !isDisabled && "active:scale-[0.97]",
        )
        // Content sits ABOVE the ripple layer (ripple is absolute `z-0`).
        const inner = (
            <>
                <span className="relative z-10 block" data-anat-part={showAnatomy ? "Content" : undefined}>{content}</span>
                {!isDisabled ? <Ripple ripples={ripples} onClear={clearRipple} /> : null}
            </>
        )
        if (href && !isDisabled) {
            return (
                <a href={href} aria-label={label} aria-current={isSelected ? "true" : undefined} className={base} onPointerDown={addRipple}>
                    {inner}
                </a>
            )
        }
        return (
            <button
                type="button"
                onClick={onPress}
                onPointerDown={isDisabled ? undefined : addRipple}
                disabled={isDisabled}
                aria-label={label}
                aria-pressed={isSelected || undefined}
                className={cn(base, !isDisabled && "cursor-pointer")}
            >
                {inner}
            </button>
        )
    }

    // ── Card WITH its own buttons — stretched-link pattern. The card is a plain
    // relative <div>; a transparent overlay <a>/<button> covers it, and the
    // actions sit ABOVE the overlay so they stay clickable. ────────────────────
    const overlay = cn(
        "absolute inset-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    )
    return (
        // Scale the WHOLE card ONLY when the stretched overlay (`data-card-press`) is
        // pressed — NOT when an inner action is. Plain `active:scale` would fire on
        // ANY descendant press (Continue/menu → whole card zooms, wrong). `:has()`
        // scopes it to just the card region.
        <div
            className={cn(
                "relative w-full",
                surface,
                !isDisabled && "has-[[data-card-press]:active]:scale-[0.97]",
            )}
        >
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1" data-anat-part={showAnatomy ? "Content" : undefined}>
                    {content}
                </div>
                {/* Secondary actions — later in source order than the overlay AND
                    `relative z-10`, so they hit-test ABOVE the stretched overlay. */}
                <div className="relative z-10 flex shrink-0 items-center gap-2" data-anat-part={showAnatomy ? "Actions" : undefined}>
                    {actions}
                </div>
            </div>
            {href && !isDisabled ? (
                <a href={href} data-card-press aria-label={label} aria-current={isSelected ? "true" : undefined} className={overlay} />
            ) : (
                <button
                    type="button"
                    data-card-press
                    onClick={onPress}
                    disabled={isDisabled}
                    aria-label={label}
                    aria-pressed={isSelected || undefined}
                    className={overlay}
                />
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .PressableGroup — a grid of press targets (was `GroupPressableCard`)
// ─────────────────────────────────────────────────────────────────────────────

// Columns by container step: use {@link GridColumns} from `Grid.Base` directly —
// the ONE grid system of the frame tier (§13).
//
// 2026-07-26 (instructor): removed the local `SurfaceCardPressableGroupColumns`
// table (7 steps `base/sm/md/lg/xl/xl3/xl4`, built with `@sm:`/`@md:`…) — that
// was Tailwind's HALF-SIZE container scale (`@sm` = 24rem), completely
// different from the `@app-*` scale (`@app-sm` = 40rem) that `Container.Base`/
// `Grid.Base` and the rest of the system use. Every breakpoint in the old table
// was silently firing at the wrong point compared to the rest of the app.

/** One pressable card inside a {@link SurfaceCard.PressableGroup}. */
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
     * `SectionCard`/`SurfaceCard.List`.
     */
    withVerdict?: VerdictBand
    /**
     * `true` → mark this tile as the CHOSEN one in a selectable grid — an accent
     * `ring-2` around the card (via `.Pressable`'s `isSelected`). Use when the grid
     * is a single/multi-select chooser instead of a fire-and-forget action grid.
     */
    selected?: boolean
}

/** Props for {@link SurfaceCard.PressableGroup}. */
export interface SurfaceCardPressableGroupProps {
    /** The cards, in reading order (also the 1–N shortcut order). REQUIRED — repeat list = data. */
    items: Array<SurfaceCardPressableGroupItem>
    /**
     * Accessible name for the whole group — REQUIRED. Without it a screen reader
     * hears N loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /**
     * Responsive column count — grid built with `Grid.Base` (§13). Defaults to a
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
     * Dev/spec: tag each direct tile (`Item` / `SkeletonTile`) with an
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
        <div className="flex items-center gap-3">
            {item.iconPosition === "trailing" ? null : iconSlot}
            <div className="min-w-0 flex-1">{item.content}</div>
            {item.iconPosition === "trailing" ? iconSlot : null}
        </div>
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
            <Avatar.Base isSkeleton size="md" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
            <Typography.Base size="sm" isSkeleton className="w-1/3" />
            <Typography.Base size="xs" isSkeleton className="w-2/3" />
        </div>
    </div>
)

/**
 * A grid of `.Pressable` cards that act and then get out of the way — the whole
 * group is ONE labelled unit (`role="group"` + `aria-label`), each cell is a
 * canonical `.Pressable`, and the cards' bodies stay the caller's to compose.
 * Reflows on the CONTAINER's width, not the viewport's ({@link GridColumns}) — grid
 * built via `Grid.Base` (§13, the tier's ONE grid khung).
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
                <Grid.Base
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
    // — from now on `Container.Base` is where the frame tier OPENS a container
    // (one frame, not every frame opening its own). Grid built with `Grid.Base`
    // (§13, the tier's ONE grid system) instead of hand-declaring `grid`/`grid-cols-*`.
    return (
        <div role="group" aria-label={ariaLabel} className={className} data-anat-part={showAnatomy ? "Grid" : undefined}>
            <Grid.Base
                columns={columns}
                gap={gap}
                items={items.map((item) => {
                    const tile = (
                        <Pressable
                            onPress={item.onPress}
                            href={item.href}
                            isDisabled={item.isDisabled}
                            isSelected={item.selected}
                            label={item.label}
                            className={cn(
                                TILE_CHROME,
                                verdictBandClassName(item.withVerdict),
                                item.className,
                            )}
                        >
                            {itemBody(item)}
                        </Pressable>
                    )
                    return {
                        key: item.key,
                        content: showAnatomy ? (
                            <div className="relative" data-anat>
                                {tile}
                                <AnatomyOverlay label="Item" tier="composite" />
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

/** One selectable card in a {@link SurfaceCard.SelectableGroup}. */
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

/** Props for {@link SurfaceCard.SelectableGroup}. */
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

/** Tailwind grid-template class per supported column count. */
const SELECTABLE_GROUP_COLUMNS_CLASS: Record<1 | 2 | 3, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
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
 * `Choice.Radio`/`Choice.RadioGroup` atom — known drift, carried over verbatim
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
            className={cn("grid gap-2", SELECTABLE_GROUP_COLUMNS_CLASS[columns], className)}
        >
            {items.map((item) => (
                <Radio key={item.value} value={item.value} isDisabled={item.isDisabled} className="w-full">
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
                                <div className="flex w-full items-center gap-2">
                                    {item.icon ? (
                                        <span className="shrink-0" aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined}>
                                            {item.icon}
                                        </span>
                                    ) : null}
                                    <span className="flex min-w-0 flex-col" data-anat-part={showAnatomy ? "Label" : undefined}>
                                        <span className="truncate">{item.label}</span>
                                        {item.description ? (
                                            <span className="truncate text-xs text-muted">{item.description}</span>
                                        ) : null}
                                    </span>
                                    {item.badge ? (
                                        <span className="ml-auto shrink-0" data-anat-part={showAnatomy ? "Badge" : undefined}>
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </div>
                            </Card>
                        )}
                    </Radio.Content>
                </Radio>
            ))}
        </RadioGroup>
    )

// ─────────────────────────────────────────────────────────────────────────────
// .List — bounded surface list of rows (was `SurfaceListCard` + its two rows)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One row of a {@link SurfaceCard.List}.
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

/** Props for {@link SurfaceCard.List}. */
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
    // The leading icon matches the TEXT COLOUR (foreground) — decided: an icon
    // paired with a label follows the label's colour, it doesn't drop to muted on
    // its own (otherwise it reads as dim/disabled).
    const leadingSlot = leading ?? (LeadingIcon ? <LeadingIcon aria-hidden focusable="false" className="size-5" /> : null)
    const metaSlot = meta ?? (metaText != null
        ? <Typography.Base size="sm" weight="medium" className="text-accent-soft-foreground" text={metaText} />
        : null)
    // §5.0a: `size-4` < `size-5` ⇒ the stroke gets thinner, so `weight="bold"` must be
    // forced to compensate — otherwise the trailing glyph reads noticeably fainter
    // than the `LeadingIcon` (`size-5`, regular) at the start of the same row.
    const trailingSlot = trailing ?? (TrailingIcon ? <TrailingIcon aria-hidden focusable="false" weight="bold" className="size-4 text-muted" /> : null)
    const content = (
        <>
            {leadingSlot ? <div className="shrink-0">{leadingSlot}</div> : null}
            <div className="flex min-w-0 flex-col gap-0">
                <Typography.Base size="sm"
                    truncate
                    isSkeleton={isSkeleton}
                    className={cn(underlineHover && "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline", titleClassName)}
                    text={title}
                />
                {subtitle ? (
                    <Typography.Base size="xs" color="muted" truncate isSkeleton={isSkeleton} text={subtitle} />
                ) : null}
            </div>
            {metaSlot || trailingSlot || selected ? (
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {metaSlot}
                    {trailingSlot}
                    {/* Single-select indicator — trailing accent CheckCircleIcon (B). */}
                    {selected ? (
                        <CheckCircleIcon className="size-5 shrink-0 text-accent-soft-foreground" aria-hidden focusable="false" />
                    ) : null}
                </div>
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
            data-anat-part={showAnatomy ? "Surface" : bare ? anatPart : undefined}
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
    const caption = <Typography.Base size="xs" color="muted" isSkeleton={isSkeleton} text={description} />
    const withCaption = description != null ? (
        <div className="flex flex-col gap-2">
            {surface}
            <div data-anat-part={showAnatomy ? "Description" : undefined}>{caption}</div>
        </div>
    ) : surface
    return (
        <section data-anat-part={anatPart} className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <div data-anat-part={showAnatomy && label != null ? "Header" : undefined}>
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

/** One collapsible section of a {@link SurfaceCard.Accordion}. */
export interface SurfaceCardAccordionItem {
    /** Stable id — also the expand key. */
    id: string
    /** Trigger headline (the always-visible row). */
    title: ReactNode
    /** Optional muted second line in the trigger. */
    subtitle?: ReactNode
    /** Optional trailing node in the trigger, left of the caret (a chip/count). */
    titleEnd?: ReactNode
    /** Panel content, revealed when the item expands. */
    body: ReactNode
}

/** Props for {@link SurfaceCard.Accordion}. */
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
                    aria-label={typeof item.title === "string" ? item.title : item.id}
                    data-anat-part={showAnatomy ? "Row" : undefined}
                >
                    <Accordion.Heading>
                        <Accordion.Trigger>
                            <div className="flex min-w-0 flex-1 flex-col gap-0 text-left">
                                <Typography.Base size="sm" weight="medium" truncate text={item.title} />
                                {item.subtitle != null ? (
                                    <Typography.Base size="xs" color="muted" truncate text={item.subtitle} />
                                ) : null}
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                {item.titleEnd}
                                <Accordion.Indicator />
                            </div>
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
 * trigger row (`px-4 py-4`, row box height matching the real text's line-height),
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
                <div key={item?.id ?? index} className="relative" data-anat-part={showAnatomy ? "Row" : undefined}>
                    <div className="flex items-center p-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-0 text-left">
                            {/* Row box height EXACTLY matches the real text's line-height (sm=20px · xs=16px) —
                                the shimmer bar is only glyph-height, so without this wrapper the
                                loading row would sit shorter than the real row. */}
                            <span className="flex h-5 items-center">
                                <Typography.Base size="sm" isSkeleton className="w-2/5" />
                            </span>
                            {item?.subtitle != null ? (
                                <span className="flex h-4 items-center">
                                    <Typography.Base size="xs" isSkeleton className="w-1/4" />
                                </span>
                            ) : null}
                        </div>
                        {/* Caret: the real row ALWAYS has `Accordion.Indicator` (`ml-auto size-4`) → the mirror keeps the exact same slot. */}
                        <HeroSkeleton className="ml-auto size-4 shrink-0 rounded" />
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
 * {@link SurfaceCard.List}, but each row expands. Pass `label` for a section header
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
            anatPart={showAnatomy ? "Surface" : bare ? anatPart : undefined}
        />
    ) : items.length === 0 && emptyState != null ? (
        <div
            className={cn("overflow-hidden p-8", surfaceFrame(variant))}
            data-anat-part={showAnatomy ? "Surface" : bare ? anatPart : undefined}
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
            anatPart={showAnatomy ? "Surface" : bare ? anatPart : undefined}
        />
    )
    // bare = no header AND no caption → render the frame directly
    if (bare) return <div className={cn(className)}>{frame}</div>
    // description sits OUTSIDE (below) the card, gap-2 — never surface-in-surface
    const withCaption = description != null ? (
        <div className="flex flex-col gap-2">
            {frame}
            <div data-anat-part={showAnatomy ? "Description" : undefined}>{description}</div>
        </div>
    ) : frame
    return (
        <section data-anat-part={anatPart} className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <div data-anat-part={showAnatomy && label != null ? "Header" : undefined}>
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

/** Per-row mark: success check · muted cross · none. */
export type ListMark = "check" | "cross" | "none"

/**
 * Tone of the mark — prominence climbs by TONE, the element stays (§2d):
 * `success` (green ✓ signal) · `muted` (recede, text leads) · `danger` (red — a hard
 * NEGATIVE signal: lost/blocked/warning row, not just "not included").
 */
export type MarkTone = "success" | "muted" | "danger"

const TONE_CLS: Record<MarkTone, string> = {
    success: "text-success-soft-foreground",
    muted: "text-muted",
    danger: "text-danger-soft-foreground",
}

const markIcon = (mark: ListMark, tone: MarkTone | undefined, anatPart: string | undefined): ReactNode => {
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
    return null
}

/** One row of a {@link SurfaceCard.CrossList}. */
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

/** Props for {@link SurfaceCard.CrossList}. */
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
 * One row of a {@link SurfaceCard.CrossList}: an optional leading mark + a free body,
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
    <li
        className="relative flex items-start gap-3 p-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        data-anat-part={anatPart}
    >
        {isSkeleton ? (
            <>
                <HeroSkeleton className="size-5 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                    <Typography.Base size="sm" isSkeleton className="w-3/4" />
                </div>
            </>
        ) : (
            <>
                {markIcon(mark, tone, markAnatPart)}
                <div className="min-w-0 flex-1">{text}</div>
            </>
        )}
    </li>
)

/**
 * Static "brief list" of MARKED rows (✓ / ✗ / none) in a bounded `bg-surface` card with
 * full-bleed dividers — a single list can mix marks (e.g. a plan's included ✓ and excluded
 * ✗ features). Read-only; for CLICKABLE rows use {@link SurfaceCard.List}.
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
                <CrossListRow key={index} isSkeleton anatPart={showAnatomy ? "CrossListItem" : undefined} />
            ))
            : items.map((item) => (
                <CrossListRow
                    key={item.key}
                    mark={item.mark}
                    tone={item.tone}
                    text={item.text}
                    anatPart={item.anatPart ?? (showAnatomy ? "CrossListItem" : undefined)}
                    markAnatPart={item.markAnatPart}
                />
            ))}
    </ul>
)

// ─────────────────────────────────────────────────────────────────────────────
// .Placeholder — dashed "add new" tile (was `DashedPlaceholderCard`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link SurfaceCard.Placeholder}. */
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
                <Typography.Base size="sm" isSkeleton className="w-1/3" />
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
            <Typography.Base size="sm" weight="medium" color="muted" text={label} />
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
export const SurfaceCard = {
    Base,
    Nested,
    Pressable,
    PressableGroup,
    SelectableGroup,
    List,
    Accordion: AccordionCard,
    CrossList,
    Placeholder,
}
