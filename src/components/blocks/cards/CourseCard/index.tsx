"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    ArrowRightIcon,
    BookOpenIcon,
    CheckCircleIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import {
    Button,
    Card,
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import {
    PriceTag,
} from "@/components/blocks/commerce/PriceTag"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import type { CourseEntity } from "@/modules/types/entities/course"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { publicEnv } from "@/resources/env/public"

/** Props for {@link CourseCard}. */
export interface CourseCardProps extends WithClassNames<undefined> {
    /** The course summarised by this card (list-item data). */
    course: CourseEntity
    /**
     * Loyalty-discounted VND price (what THIS viewer is actually charged, from
     * `coursePricePreview`). When set it takes over the price block so the catalog
     * shows the same personalised price as the rest of the app; omit for the phase
     * price (guests / not-yet-loaded).
     */
    loyaltyPriceVnd?: number | null
    /** List/original VND price struck through under the loyalty price. */
    loyaltyOriginalVnd?: number | null
    /**
     * Whether the loyalty preview is still resolving (authenticated viewer only —
     * guests never set this). Skeletons the price line instead of showing the
     * phase price and then swapping to the loyalty price a beat later.
     */
    loyaltyPending?: boolean
    /**
     * Layout: a roomy `"grid"` card (default — cover + outcomes + price) or a
     * compact `"line"` row (thumbnail + title + price + CTA on one line). Lets the
     * catalog offer a grid ⇆ list view toggle without a second card component.
     */
    layout?: "grid" | "line"
    /**
     * Optional trailing action node (e.g. an "Add to cart" button) rendered beside
     * the View CTA. The block only places it; the caller (a feature) owns its logic
     * so the card stays presentational.
     */
    action?: React.ReactNode
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
    action,
    className,
}: CourseCardProps) => {
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations()
    const [coverFailed, setCoverFailed] = useState(false)

    // display transform for ENTITY-derived (fallback) VND prices so the catalog matches
    // the rest of the app: ÷ testDivisor in non-prod (USD charm is inlined below). The
    // loyalty price (from `coursePricePreview`) is ALREADY transformed → not re-applied.
    const divisor = publicEnv().pricing.testDivisor
    const toVnd = (amount: number): number =>
        divisor === 1 ? amount : Math.max(1, Math.round(amount / divisor))

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

    // enrolled → the marketing/detail page is the wrong destination for the PRIMARY
    // action (the viewer already owns this course); route straight into the
    // learning experience instead, mirroring
    // CourseDetail's `useCourseEnrollment().onContinueLearning`. The marketing page
    // is still a legitimate secondary destination even once enrolled (re-check the
    // syllabus, share the link) — see `secondaryAction` below.
    const isEnrolled = course.isEnrolled === true
    const marketingHref = pathConfig().locale(locale).course(course.displayId).build()
    const learnHref = pathConfig().locale(locale).course(course.displayId).learn().content().build()
    const onView = useCallback(
        () => router.push(isEnrolled ? learnHref : marketingHref),
        [router, isEnrolled, learnHref, marketingHref],
    )
    const onViewDetail = useCallback(
        () => router.push(marketingHref),
        [router, marketingHref],
    )
    const viewLabel = isEnrolled ? t("course.continueLearning") : t("courses.viewCourse")
    // not enrolled → the feature-owned `action` slot (cart-add, hides itself for
    // free/enrolled courses per its own logic). Enrolled → that slot would render
    // null anyway, so replace it with a secondary "Xem khóa học" button (view the
    // marketing page) — teacher: "tiếp tục học ở card đã mua nên có 2 phần: tiếp
    // tục học (primary) và xem khóa học (secondary)", don't just drop the second
    // button once enrolled.
    const secondaryAction = isEnrolled ? (
        // no trailing arrow — arrow marks the ONE primary CTA per surface
        // (button.md §2: "nút KHÔNG icon = sub-CTA"); keeping it here as well
        // as on "Tiếp tục học" made both buttons read as equally weighted.
        <Button
            variant="secondary"
            onPress={onViewDetail}
            className="flex-1"
        >
            {t("courses.viewCourse")}
        </Button>
    ) : action

    const showCover = Boolean(course.coverImageUrl) && !coverFailed

    // price block: prefer the viewer's loyalty price (uniform with the rest of the app)
    // when supplied, else fall back to the active-phase price.
    const useLoyalty = loyaltyPriceVnd != null
    const displayPrice = useLoyalty
        ? loyaltyPriceVnd
        : (currentPrice != null ? toVnd(currentPrice) : null)
    const displayOriginal = useLoyalty
        ? loyaltyOriginalVnd ?? null
        : (course.originalPrice != null ? toVnd(course.originalPrice) : null)

    // compact LINE row (catalog list view): thumbnail + title/description, with the
    // price + view CTA on the right — one course per row for fast scanning.
    if (layout === "line") {
        return (
            <Card className={cn("overflow-hidden rounded-3xl", className)}>
                {/* plain div, NOT Card.Content — `.card__content` bakes flex-col
                    (unlayered), so `items-center` on it centers vertically instead of
                    laying the row out horizontally. The card root already insets its
                    children (baked `p-4`), so this row carries no padding of its own. */}
                <div className="flex items-center gap-3">
                    {/* thumbnail 16:9 (branded fallback); hidden on the narrowest screens.
                        rounded-2xl = the "inner" step under the card's rounded-3xl. */}
                    <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-2xl bg-surface sm:block">
                        {showCover ? (
                            <img
                                src={course.coverImageUrl ?? undefined}
                                alt={course.title}
                                className="size-full object-cover"
                                onError={() => setCoverFailed(true)}
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent/25 to-accent/5">
                                <BookOpenIcon aria-hidden className="size-8 text-accent" />
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
                                <Chip variant="secondary" color="accent" size="sm" className="shrink-0">
                                    <UsersIcon aria-hidden className="size-4" />
                                    <Chip.Label>
                                        {t("courses.learners", { count: course.enrollmentCount })}
                                    </Chip.Label>
                                </Chip>
                            ) : null}
                        </div>
                        <Typography type="body-sm" color="muted" className="line-clamp-1">
                            {course.description}
                        </Typography>
                    </div>
                    {/* price row, then a button row below — view CTA is now a real primary
                        Button (not a subtle Link), per starci-fe-block-variants round-2
                        direction "C". `size="md"` per button.md §3's compact-context
                        exception (a repeated grid card is a tight context — `lg` would
                        blow up row height across many cards). */}
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
                            >
                                {viewLabel}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
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
                {/* cover 16:9 — rounded-2xl = the "inner" step under the card's
                    rounded-3xl (was full-bleed/unrounded, mismatched the line thumb);
                    the card root already insets its children (baked `p-4`); branded
                    gradient fallback when missing/broken */}
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
                            <BookOpenIcon aria-hidden className="size-10 text-accent" />
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
                            <Chip variant="secondary" color="accent" size="sm" className="shrink-0">
                                <UsersIcon aria-hidden className="size-4" />
                                <Chip.Label>
                                    {t("courses.learners", { count: course.enrollmentCount })}
                                </Chip.Label>
                            </Chip>
                        ) : null}
                    </div>
                    <Typography type="body-sm" color="muted" className="line-clamp-2">
                        {course.description}
                    </Typography>
                    {topValueProps.length > 0 ? (
                        <ul className="mt-1 flex flex-col gap-2">
                            {topValueProps.map((valueProp, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircleIcon aria-hidden className="size-4 shrink-0 text-success" />
                                    <Typography type="body-xs" color="muted">
                                        {valueProp.text}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </Card.Content>
            <Card.Footer className="mt-auto flex flex-col gap-2">
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
                        {t("course.priceUsdHint", { amount: formattedPriceUsd })}
                    </Typography>
                ) : null}
                {/* action row — view CTA is a real primary Button (not a subtle Link), per
                    starci-fe-block-variants round-2 direction "C": the previous accent Link
                    read as a secondary "see more" action rather than the card's actual primary
                    action. `size="md"` per button.md §3's compact-context exception (a
                    repeated grid card is tight — `lg` would blow up card height across many
                    cards). Cart-add stays `action` (secondary, pairs with this primary). */}
                <div className="flex w-full items-center gap-2">
                    <Button
                        variant="primary"
                        onPress={onView}
                        className="flex-1"
                    >
                        {viewLabel}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                    </Button>
                    {secondaryAction}
                </div>
            </Card.Footer>
        </Card>
    )
}
