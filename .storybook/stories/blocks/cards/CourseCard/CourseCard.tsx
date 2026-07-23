import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    ArrowRightIcon,
    BookOpenIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import {
    Card,
    Typography,
    cn,
} from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { CrossListCard, CrossListItem } from "../CrossListCard/CrossListCard"
import { Button } from "../../buttons/Button/Button"
import { PriceTag } from "../../commerce/PriceTag/PriceTag"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/cards/CourseCard`. Composed from a HeroUI `Card` frame +
 * the local `Skeleton` primitive (loading price line) + the local `PriceTag`
 * commerce block (`../../commerce/PriceTag`). The `@/` runtime deps (next-intl,
 * router, env, path builder) are replaced by local stubs so the block renders in
 * isolation. Synced to `src` later.
 */

// ── inlined `@/` runtime stubs (restored to the real deps on sync to `src`) ──

/** Inlined VI copy (mirrors the used keys in `src/messages/vi.json`). */
const T = {
    continueLearning: "Tiếp tục học",
    viewCourse: "Xem khóa học",
    learners: (count: number) => `${count} học viên`,
    priceUsdHint: (amount: string) => `≈ ${amount} khi thanh toán quốc tế`,
}

/** In storybook the catalog price transform is a no-op (`testDivisor === 1`). */
const PRICING_DIVISOR = 1

// ── local mirror of the `CourseEntity` fields this card reads ──

/** A single value-proposition bullet. */
export interface CourseCardValueProp {
    text: string
}

/** A pricing-phase row (active phase drives the current price). */
export interface CourseCardPricingPhase {
    phase: string
    price: number | null
    priceUsd: number | null
}

/** The catalog-item slice of `CourseEntity` this card renders. */
export interface CourseCardCourse {
    displayId: string
    title: string
    description: string | null
    coverImageUrl: string | null
    originalPrice: number | null
    originalPriceUsd: number | null
    pricingPhases?: Array<CourseCardPricingPhase>
    currentPhase?: string
    valuePropositions?: Array<CourseCardValueProp>
    enrollmentCount: number
    isEnrolled?: boolean | null
}

/** Props for {@link CourseCard}. */
export interface CourseCardProps {
    /** The course summarised by this card (list-item data). */
    course: CourseCardCourse
    /**
     * Loyalty-discounted VND price (what THIS viewer is actually charged). When
     * set it takes over the price block; omit for the phase price (guests).
     */
    loyaltyPriceVnd?: number | null
    /** List/original VND price struck through under the loyalty price. */
    loyaltyOriginalVnd?: number | null
    /**
     * Whether the loyalty preview is still resolving (authenticated viewer only).
     * Skeletons the price line instead of showing the phase price then swapping.
     */
    loyaltyPending?: boolean
    /**
     * Layout: a roomy `"grid"` card (default — cover + outcomes + price) or a
     * compact `"line"` row (thumbnail + title + price + CTA on one line).
     */
    layout?: "grid" | "line"
    /**
     * `true` → self-render a skeleton MIRROR of the card for the current `layout`
     * (grid mirrors the grid tree, line mirrors the row), keeping the exact
     * box/radius/padding so the catalog grid never jumps when data resolves.
     * `course` (and the other data props) are ignored. Replaces the old standalone
     * `CourseCardSkeleton` — skeleton = a PROP, not a separate component (§6).
     */
    isSkeleton?: boolean
    /**
     * Optional trailing action node (e.g. an "Add to cart" button) rendered beside
     * the View CTA. The block only places it; the caller owns its logic.
     */
    action?: React.ReactNode
    /** Extra classes on the card root. */
    className?: string
}

/**
 * Featured course card (catalog block): cover (with branded fallback), title,
 * outcome, social proof + top value propositions, and a price block (active-phase
 * price, original strikethrough + % off when discounted, optional USD hint) with a
 * view CTA. Owns its whole look so features just feed the `course`.
 *
 * @param props - {@link CourseCardProps}
 */
export const CourseCard = ({
    course,
    loyaltyPriceVnd,
    loyaltyOriginalVnd,
    loyaltyPending = false,
    layout = "grid",
    isSkeleton = false,
    action,
    className,
}: CourseCardProps) => {
    const [coverFailed, setCoverFailed] = useState(false)

    // display transform for ENTITY-derived (fallback) VND prices — no-op in
    // storybook (divisor === 1). The loyalty price is ALREADY transformed.
    const toVnd = (amount: number): number =>
        PRICING_DIVISOR === 1 ? amount : Math.max(1, Math.round(amount / PRICING_DIVISOR))

    /** Active-phase price (falls back to the list/regular price when no phase row). */
    const currentPrice = useMemo(
        () => course.pricingPhases?.find(
            (pricingPhase) => pricingPhase.phase === course.currentPhase,
        )?.price ?? course.originalPrice ?? null,
        [course.pricingPhases, course.currentPhase, course.originalPrice],
    )

    /** USD price of the active phase, falling back to the list USD price. */
    const actualPriceUsd = useMemo(
        () => course.pricingPhases?.find(
            (pricingPhase) => pricingPhase.phase === course.currentPhase,
        )?.priceUsd ?? course.originalPriceUsd ?? null,
        [course.pricingPhases, course.currentPhase, course.originalPriceUsd],
    )

    /** Formatted USD price for display, or `null` to hide the USD line. */
    const formattedPriceUsd = useMemo(
        () => actualPriceUsd != null
            // charm-round to x.99 (mirror the backend USD price)
            ? (Math.max(1, Math.ceil(actualPriceUsd)) - 0.01).toLocaleString("en-US", { style: "currency", currency: "USD" })
            : null,
        [actualPriceUsd],
    )

    /** Top three value propositions shown as a quick "what you'll learn" list. */
    const topValueProps = useMemo(
        () => (course.valuePropositions ?? []).slice(0, 3),
        [course.valuePropositions],
    )

    // enrolled → route straight into the learning experience (the viewer already
    // owns this course). storybook navigation is a no-op.
    const isEnrolled = course.isEnrolled === true
    const onView = useCallback(() => {}, [])
    const onViewDetail = useCallback(() => {}, [])
    const viewLabel = isEnrolled ? T.continueLearning : T.viewCourse
    // not enrolled → the feature-owned `action` slot; enrolled → a secondary
    // "Xem khóa học" button (view the marketing page) replaces it.
    const secondaryAction = isEnrolled ? (
        // no trailing arrow — arrow marks the ONE primary CTA per surface.
        <Button
            variant="secondary"
            onPress={onViewDetail}
            className="flex-1"
        >
            {T.viewCourse}
        </Button>
    ) : action

    const showCover = Boolean(course.coverImageUrl) && !coverFailed

    // price block: prefer the viewer's loyalty price when supplied, else the active-phase price.
    const useLoyalty = loyaltyPriceVnd != null
    const displayPrice = useLoyalty
        ? loyaltyPriceVnd
        : (currentPrice != null ? toVnd(currentPrice) : null)
    const displayOriginal = useLoyalty
        ? loyaltyOriginalVnd ?? null
        : (course.originalPrice != null ? toVnd(course.originalPrice) : null)

    // loading MIRROR — self-render the skeleton for the current layout (§6: skeleton is
    // a PROP, not a separate component). Each mirror KEEPS the real box/radius/padding
    // (same Card frame, same Card.Content/Footer, same CrossListCard bordered surface)
    // so the grid never jumps when the real card swaps in.
    if (isSkeleton) {
        // LINE mirror: horizontal row — thumbnail (16:9, hidden on narrow) · title+meta
        // + one-line description · price + a two-button action column on the right.
        if (layout === "line") {
            return (
                <Card className={cn("overflow-hidden rounded-3xl", className)}>
                    <div className="flex items-center gap-3">
                        {/* thumbnail 16:9 (rounded-2xl media step), hidden on narrow like the real row */}
                        <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-2xl @app-sm:block">
                            <Skeleton className="size-full" />
                        </div>
                        {/* title + users-meta, then a one-line description */}
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Skeleton.Typography type="body" width="1/2" />
                                <div className="flex shrink-0 items-center gap-1">
                                    <Skeleton className="size-4 shrink-0 rounded-full" />
                                    <Skeleton.Typography type="body-xs" width="w-10" />
                                </div>
                            </div>
                            <Skeleton.Typography type="body-sm" width="3/4" />
                        </div>
                        {/* price line + a two-button action row (mirrors items-end column) */}
                        <div className="flex shrink-0 flex-col items-end gap-2">
                            <Skeleton.Typography type="body" width="w-20" />
                            <div className="flex w-full items-center gap-2">
                                <Skeleton.Button width="flex-1" />
                                <Skeleton.Button width="flex-1" />
                            </div>
                        </div>
                    </div>
                </Card>
            )
        }

        // GRID mirror: cover 16:9 · title+meta · 2 description lines · the bordered
        // value-props list (CrossListCard self-skeletons its rows) · price · 2-button row.
        return (
            <Card className={cn("flex flex-col overflow-hidden rounded-3xl", className)}>
                <Card.Content className="flex flex-col gap-3">
                    {/* cover 16:9 (rounded-2xl media step) */}
                    <Skeleton className="aspect-video w-full rounded-2xl" />
                    <div className="flex flex-col gap-2">
                        {/* title + users-meta */}
                        <div className="flex items-center justify-between gap-2">
                            <Skeleton.Typography type="h6" width="1/2" />
                            <div className="flex shrink-0 items-center gap-1">
                                <Skeleton className="size-4 shrink-0 rounded-full" />
                                <Skeleton.Typography type="body-xs" width="w-10" />
                            </div>
                        </div>
                        {/* description (line-clamp-2) */}
                        <Skeleton.Typography type="body-sm" width="full" />
                        <Skeleton.Typography type="body-sm" width="3/4" />
                        {/* value-props — same bordered CrossListCard surface, self-skeletoned */}
                        <CrossListCard bordered isSkeleton className="mt-1" />
                    </div>
                </Card.Content>
                <Card.Footer className="mt-auto flex flex-col items-start gap-2">
                    {/* price line */}
                    <Skeleton.Typography type="body" width="1/3" />
                    {/* action row — primary + secondary button */}
                    <div className="flex w-full items-center gap-2">
                        <Skeleton.Button width="flex-1" />
                        <Skeleton.Button width="flex-1" />
                    </div>
                </Card.Footer>
            </Card>
        )
    }

    // compact LINE row (catalog list view): thumbnail + title/description, with the
    // price + view CTA on the right — one course per row for fast scanning.
    if (layout === "line") {
        return (
            <Card className={cn("overflow-hidden rounded-3xl", className)}>
                {/* plain div, NOT Card.Content — `.card__content` bakes flex-col, so
                    `items-center` on it would center vertically. Card root already insets
                    (baked `p-4`), so this row carries no padding of its own. */}
                <div className="flex items-center gap-3">
                    {/* thumbnail 16:9 (branded fallback); hidden on the narrowest screens.
                        rounded-2xl = the "inner" step under the card's rounded-3xl. */}
                    <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-2xl bg-surface @app-sm:block">
                        {showCover ? (
                            <img
                                src={course.coverImageUrl ?? undefined}
                                alt={course.title}
                                className="size-full object-cover"
                                onError={() => setCoverFailed(true)}
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent/25 to-accent/5">
                                <BookOpenIcon aria-hidden className="size-8 text-accent-soft-foreground" />
                            </div>
                        )}
                    </div>
                    {/* title + one-line description */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Typography type="body" weight="bold" truncate>
                                {course.title}
                            </Typography>
                            {course.enrollmentCount > 0 ? (
                                <div className="flex shrink-0 items-center gap-1 text-muted">
                                    <UsersIcon aria-hidden className="size-4" />
                                    <Typography type="body-xs" color="muted">
                                        {T.learners(course.enrollmentCount)}
                                    </Typography>
                                </div>
                            ) : null}
                        </div>
                        <Typography type="body-sm" color="muted" className="line-clamp-1">
                            {course.description}
                        </Typography>
                    </div>
                    {/* price row, then a button row below — view CTA is a real primary Button.
                        `size="md"` (grid card is a tight, repeated context — `lg` would blow up
                        row height across many cards). */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                        {loyaltyPending ? (
                            <Skeleton.Typography type="body-sm" width="1/2" />
                        ) : displayPrice != null ? (
                            <PriceTag
                                discounted={displayPrice}
                                original={displayOriginal}
                                size="sm"
                            />
                        ) : null}
                        <div className="flex w-full items-center gap-2">
                            <Button
                                variant="primary"
                                onPress={onView}
                                className="flex-1"
                                icon={<ArrowRightIcon aria-hidden focusable="false" />}
                            >
                                {viewLabel}
                            </Button>
                            {secondaryAction}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className={cn("flex flex-col overflow-hidden rounded-3xl", className)}>
            <Card.Content className="flex flex-col gap-3">
                {/* cover 16:9 — rounded-2xl = the "inner" step under the card's rounded-3xl;
                    branded gradient fallback when missing/broken */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface">
                    {showCover ? (
                        <img
                            src={course.coverImageUrl ?? undefined}
                            alt={course.title}
                            className="size-full object-cover"
                            onError={() => setCoverFailed(true)}
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent/25 to-accent/5 p-4">
                            <BookOpenIcon aria-hidden className="size-10 text-accent-soft-foreground" />
                            <Typography type="body-sm" weight="semibold" align="center" className="ml-2">
                                {course.title}
                            </Typography>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <Typography type="h6" weight="bold" truncate>
                            {course.title}
                        </Typography>
                        {course.enrollmentCount > 0 ? (
                            <div className="flex shrink-0 items-center gap-1 text-muted">
                                <UsersIcon aria-hidden className="size-4" />
                                <Typography type="body-xs" color="muted">
                                    {T.learners(course.enrollmentCount)}
                                </Typography>
                            </div>
                        ) : null}
                    </div>
                    <Typography type="body-sm" color="muted" className="line-clamp-2">
                        {course.description}
                    </Typography>
                    {topValueProps.length > 0 ? (
                        // value-props checklist = the CrossListCard primitive (bordered, mark="check",
                        // tone="muted"). NOT a hand-rolled list. Muted tick → the TEXT leads, card
                        // keeps only price-deal + CTA as the nổi points (principles.md §2). Bordered =
                        // surface-in-surface.
                        <CrossListCard bordered className="mt-1">
                            {topValueProps.map((valueProp, index) => (
                                <CrossListItem key={index} mark="check" tone="muted">
                                    <Typography type="body-sm">{valueProp.text}</Typography>
                                </CrossListItem>
                            ))}
                        </CrossListCard>
                    ) : null}
                </div>
            </Card.Content>
            {/* items-start: HeroUI `.card__footer` bakes align-items:center → short lines (USD hint)
                float to center. Force flush-left (reading-flow: từ trái). w-full children (action row)
                still stretch. */}
            <Card.Footer className="mt-auto flex flex-col items-start gap-2">
                {/* price row (informational) */}
                <div className="flex items-center gap-2">
                    {loyaltyPending ? (
                        <Skeleton.Typography type="body-sm" width="1/2" />
                    ) : displayPrice != null ? (
                        <PriceTag
                            discounted={displayPrice}
                            original={displayOriginal}
                            size="sm"
                        />
                    ) : (
                        <span />
                    )}
                </div>
                {formattedPriceUsd != null ? (
                    <Typography type="body-xs" color="muted">
                        {T.priceUsdHint(formattedPriceUsd)}
                    </Typography>
                ) : null}
                {/* action row — view CTA is a real primary Button. `size="md"` (repeated grid
                    card is tight). Cart-add stays `action` (secondary, pairs with this primary). */}
                <div className="flex w-full items-center gap-2">
                    <Button
                        variant="primary"
                        onPress={onView}
                        className="flex-1"
                        icon={<ArrowRightIcon aria-hidden focusable="false" />}
                    >
                        {viewLabel}
                    </Button>
                    {secondaryAction}
                </div>
            </Card.Footer>
        </Card>
    )
}
