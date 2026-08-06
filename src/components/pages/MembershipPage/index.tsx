"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Button,
    Card,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    SettingsBreadcrumb,
} from "@/components/blocks/settings/SettingsBreadcrumb"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

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
export const MembershipPage = () => {
    const t = useTranslations()
    // shared payment modal — opening it with the membership flow runs the purchase
    const { open: openPaymentModal } = usePaymentOverlayState()


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

    const cardItems = [
        () => (
            <StackV
                gap={3}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                items={[
                    () => (
                        <Typography type="h5" weight="semibold">
                            {t("membership.card.title")}
                        </Typography>
                    ),
                    () => (
                        <Typography type="body-sm" color="muted">
                            {t("membership.card.desc")}
                        </Typography>
                    ),
                ]}
            />
        ),
        () => (
            <div className="flex flex-col gap-0">
                <StackH
                    gap={3}
                    align="end"
                    principle="value-row"
                    explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
                    items={[
                        () => (
                            <Typography type="h3" weight="bold">
                                {t("membership.price")}
                            </Typography>
                        ),
                        () => (
                            <Typography type="body-sm" color="muted" className="pb-1">
                                {t("membership.priceHint")}
                            </Typography>
                        ),
                    ]}
                />
                <Typography type="body-xs" color="muted">
                    {t("membership.priceApprox")}
                </Typography>
            </div>
        ),
        () => (
            <CheckListCard>
                {perks.map((perk) => (
                    <CheckListItem key={perk}>
                        <Typography type="body-sm">{perk}</Typography>
                    </CheckListItem>
                ))}
            </CheckListCard>
        ),
        () => (
            <Button
                variant="primary"
                fullWidth
                onPress={onSubscribe}
            >
                {t("membership.cta")}
            </Button>
        ),
    ]

    return (
        <Box identity={{ tier: "page", component: "MembershipPage" }} principle="center-measure" className="mx-auto max-w-2xl"
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
            <Box principle="page-pad" className="p-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <div className="flex flex-col gap-10">
                    <PageHeader
                        breadcrumb={<SettingsBreadcrumb current={t("membership.title")} />}
                        title={t("membership.title")}
                        description={t("membership.subtitle")}
                    />
                    <Card className="flex flex-col">
                        <Card.Content>
                            <StackV gap={6} items={cardItems} />
                        </Card.Content>
                    </Card>
                </div>
            </Box>
        </Box>
    )
}
