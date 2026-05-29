"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Button,
    Card,
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
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources/path"
import {
    Spacer,
} from "@/components/reuseable"

/** Props for {@link CourseCard}. */
export interface CourseCardProps {
    /** The course summarised by this card. */
    course: CourseEntity
}

/**
 * Featured course card: cover, title, description and a view CTA with pricing.
 *
 * Presentational with a thin navigation handler. `"use client"` for the router
 * and the interactive HeroUI `Card`/`Button`.
 * @param props - the course to display
 */
export const CourseCard = ({
    course,
}: CourseCardProps) => {
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations()

    /** Price of the currently active pricing phase, if any. */
    const actualPrice = useMemo(
        () => course.pricingPhases?.find(
            (pricingPhase) => pricingPhase.phase === course.currentPhase,
        )?.price,
        [course.pricingPhases, course.currentPhase],
    )

    /**
     * USD price of the active phase, falling back to the course list USD price.
     * `null` when the course has no USD price (international gateways disabled).
     */
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

    const onView = useCallback(
        () => router.push(
            pathConfig().locale(locale).course(course.displayId).build(),
        ),
        [router, locale, course.displayId],
    )

    return (
        <Card>
            <Card.Content>
                <img src={course.coverImageUrl ?? undefined} alt={course.title} />
                <Spacer y={4} />
                <div className="font-bold">{course.title}</div>
                <Spacer y={4} />
                <div className="text-sm text-muted text-justify italic line-clamp-3">{course.description}</div>
            </Card.Content>
            <Card.Footer>
                <div className="w-full">
                    <Button variant="primary" size="lg" className="w-full" onPress={onView}>{t("courses.viewCourse")}</Button>
                    <Spacer y={2} />
                    <div className="text-sm text-justify flex gap-2">
                        <span className="line-through text-muted">{course.originalPrice} VND</span>
                        <span>{actualPrice} VND</span>
                    </div>
                    {/* secondary USD line — only when the course exposes a USD price */}
                    {formattedPriceUsd != null && (
                        <div className="text-xs text-muted">
                            {t("course.priceUsdHint", { amount: formattedPriceUsd })}
                        </div>
                    )}
                </div>
            </Card.Footer>
        </Card>
    )
}
