"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Breadcrumbs,
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
import {
    usePaymentOverlayState,
} from "@/hooks"
import {
    PaymentFlow,
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources"
import {
    SubPageHeader,
} from "@/components/reuseable"

/**
 * Community membership feature container.
 *
 * A single-product purchase surface ($5/month equivalent): premium tech blog,
 * private community, course discount, recruitment exposure. Opening the shared
 * payment overlay with {@link PaymentFlow.Membership} lets the user pick a
 * gateway, which then runs `purchaseMembership` + redirects to checkout.
 * Mounted by the `/profile/membership` route. `"use client"` because it reads
 * the payment overlay singleton and routes.
 */
export const Membership = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    // shared payment modal — opening it with the membership flow runs the purchase
    const { open: openPaymentModal } = usePaymentOverlayState()

    /** Navigate back to the profile page. */
    const onBack = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )

    /** Navigate to the profile page (breadcrumb parent). */
    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    /** Perk rows shown under the price — each is a translated benefit line. */
    const perks = useMemo(
        () => [
            t("membership.perks.blog"),
            t("membership.perks.community"),
            t("membership.perks.discount"),
            t("membership.perks.recruitment"),
        ],
        [
            t,
        ],
    )

    /** Open the shared payment modal for the membership flow. */
    const onSubscribe = useCallback(
        () => {
            // hand the membership flow to the modal — it creates the checkout
            // with whichever payment method the user picks, then redirects
            openPaymentModal({
                flow: PaymentFlow.Membership,
            })
        },
        [
            openPaymentModal,
        ],
    )

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("membership.title")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <SubPageHeader
                title={t("membership.title")}
                description={t("membership.subtitle")}
                onBack={onBack}
            />
            <Card className="flex flex-col">
                <Card.Content className="flex flex-col gap-6">
                    {/* product name + tagline — tight pair */}
                    <div className="flex flex-col gap-1.5">
                        <div className="text-lg font-semibold text-foreground">
                            {t("membership.card.title")}
                        </div>
                        <div className="text-sm text-muted">
                            {t("membership.card.desc")}
                        </div>
                    </div>
                    {/* price block — large monthly price + secondary hint */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-end gap-1.5">
                            <div className="text-3xl font-bold text-foreground">
                                {t("membership.price")}
                            </div>
                            <div className="pb-1 text-sm text-muted">
                                {t("membership.priceHint")}
                            </div>
                        </div>
                    </div>
                    {/* perks list — one check row per benefit */}
                    <div className="flex flex-col gap-3">
                        {perks.map((perk) => (
                            <div
                                key={perk}
                                className="flex items-start gap-1.5 text-sm text-foreground"
                            >
                                {/* inline check icon — no external icon dep */}
                                <svg
                                    className="mt-0.5 size-4 shrink-0 text-success"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4l3.3 3.29 7.3-7.3a1 1 0 0 1 1.4 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{perk}</span>
                            </div>
                        ))}
                    </div>
                    <Button
                        variant="primary"
                        fullWidth
                        onPress={onSubscribe}
                    >
                        {t("membership.cta")}
                    </Button>
                </Card.Content>
            </Card>
        </div>
    )
}
