"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    BookOpenIcon,
    CaretRightIcon,
    CheckCircleIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import {
    Card,
    Chip,
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import type {
    CourseEntity,
    WithClassNames,
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources/path"

/** Format a VND amount with vi-VN thousands separators + the ₫ symbol (e.g. 1.500.000₫). */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/** Props for {@link CourseCard}. */
export interface CourseCardProps extends WithClassNames<undefined> {
    /** The course summarised by this card (list-item data). */
    course: CourseEntity
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
    className,
}: CourseCardProps) => {
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations()
    const [coverFailed, setCoverFailed] = useState(false)

    /** Active-phase price (falls back to the list/regular price when no phase row). */
    const currentPrice = useMemo(
        () => course.pricingPhases?.find(
            (pricingPhase) => pricingPhase.phase === course.currentPhase,
        )?.price ?? course.originalPrice ?? null,
        [course.pricingPhases, course.currentPhase, course.originalPrice],
    )

    /** Whether the active price is a genuine discount off the list price. */
    const hasDiscount = useMemo(
        () => currentPrice != null
            && course.originalPrice != null
            && currentPrice < course.originalPrice,
        [currentPrice, course.originalPrice],
    )

    /** Percent off the list price, for the discount chip. */
    const percentOff = useMemo(
        () => hasDiscount && course.originalPrice
            ? Math.round((1 - (currentPrice as number) / course.originalPrice) * 100)
            : 0,
        [hasDiscount, currentPrice, course.originalPrice],
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
            ? actualPriceUsd.toLocaleString("en-US", { style: "currency", currency: "USD" })
            : null,
        [actualPriceUsd],
    )

    /** Top three value propositions shown as a quick "what you'll learn" list. */
    const topValueProps = useMemo(
        () => (course.valuePropositions ?? []).slice(0, 3),
        [course.valuePropositions],
    )

    const onView = useCallback(
        () => router.push(
            pathConfig().locale(locale).course(course.displayId).build(),
        ),
        [router, locale, course.displayId],
    )

    const showCover = Boolean(course.coverImageUrl) && !coverFailed

    return (
        <Card className={cn("flex flex-col overflow-hidden", className)}>
            <Card.Content className="flex flex-col gap-3 p-0">
                {/* cover 16:9 — full-bleed (card rounds the top); branded gradient fallback when missing/broken */}
                <div className="relative aspect-video w-full overflow-hidden bg-surface">
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

                <div className="flex flex-col gap-2 px-3">
                    <div className="flex items-center justify-between gap-2">
                        <Typography type="h6" weight="bold" truncate>
                            {course.title}
                        </Typography>
                        {course.enrollmentCount > 0 ? (
                            <Chip variant="secondary" color="accent" size="sm">
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
                                    <CheckCircleIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
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
                {/* price block: active price + (strikethrough list + % off) when discounted */}
                <div className="flex flex-wrap items-baseline gap-2">
                    {currentPrice != null ? (
                        <Typography type="h6" weight="bold">
                            {formatVnd(currentPrice)}
                        </Typography>
                    ) : null}
                    {hasDiscount && course.originalPrice != null ? (
                        <>
                            <Typography type="body-sm" color="muted" className="line-through">
                                {formatVnd(course.originalPrice)}
                            </Typography>
                            <Chip variant="secondary" color="danger" size="sm">
                                <Chip.Label>{`-${percentOff}%`}</Chip.Label>
                            </Chip>
                        </>
                    ) : null}
                </div>
                {formattedPriceUsd != null ? (
                    <Typography type="body-xs" color="muted">
                        {t("course.priceUsdHint", { amount: formattedPriceUsd })}
                    </Typography>
                ) : null}
                {/* see-more style CTA: accent Link with a caret that slides right on
                    hover (per starci-card.md) — the card itself is not pressable */}
                <Link
                    onPress={onView}
                    className="group inline-flex w-fit items-center gap-1 text-accent"
                >
                    {t("courses.viewCourse")}
                    <CaretRightIcon
                        aria-hidden
                        focusable="false"
                        className="size-4 transition-transform group-hover:translate-x-1"
                    />
                </Link>
            </Card.Footer>
        </Card>
    )
}
