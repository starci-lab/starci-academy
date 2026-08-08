"use client"

import React from "react"
import { Chip, Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import {
    ReceiptIcon,
    TicketIcon,
} from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import {
    SurfaceCardList,
    type SurfaceCardListItem,
} from "@/components/composites/cards/SurfaceCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { pathConfig } from "@/resources/path"
import type { QueryMyVoucherData } from "@/modules/api/graphql/queries/types/my-vouchers"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Chip color per voucher lifecycle status. */
const STATUS_COLOR: Record<string, "accent" | "warning" | "default" | "danger"> = {
    unused: "accent",
    reserved: "warning",
    used: "default",
    expired: "danger",
}

/** Format a voucher's discount as a short label, e.g. "-10%" / "-50,000 VND". */
const discountLabel = (voucher: QueryMyVoucherData): string => (
    voucher.discountType === "percent"
        ? `-${voucher.value}%`
        // Dong suffix via code point — keeps the source free of Vietnamese letters.
        : `-${voucher.value.toLocaleString("vi-VN")}${String.fromCharCode(0x0111)}`
)

/** Props for {@link MyVouchers}. */
export type MyVouchersProps = Record<string, never>
/**
 * The Coin shop's "My wallet" tab: the viewer's minted vouchers (code, scope,
 * status, expiry) plus the redemption history. Self-fetches both — the
 * `myRewardWallet` key is shared with the header/catalog, so a redeem
 * elsewhere refreshes this list without a manual prop.
 *
 * @param props - optional className for the root element.
 */
export const MyVouchers = () => {
    const t = useTranslations()
    const locale = useLocale()
    const vouchersSwr = useQueryMyVouchersSwr()
    const walletSwr = useQueryMyRewardWalletSwr()

    const vouchersLoading = !vouchersSwr.data
    const walletLoading = !walletSwr.data

    const voucherSkeletonItems: Array<SurfaceCardListItem> = Array.from({ length: 2 }, (_row, index) => ({
        key: `voucher-skeleton-${index}`,
        title: "…",
        subtitle: "…",
        leading: () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
    }))

    const voucherItems: Array<SurfaceCardListItem> = (vouchersSwr.data ?? []).map((voucher) => ({
        key: voucher.id,
        // `subtitle` is plain text now (never a built element), so the
        // course reference can no longer carry its own inline link — the
        // whole row becomes the link instead (`href` below), which is a
        // bigger, easier-to-hit target than the old inline text anyway.
        leading: () => (
            <IconTile
                size="sm"
                tone="accent"
                icon={<TicketIcon aria-hidden focusable="false" />}
            />
        ),
        title: voucher.code,
        subtitle: voucher.courseId
            ? t("rewards.myVouchers.scopeCourse", {
                course: voucher.courseTitle ?? "",
            }).replace(/<\/?link>/g, "")
            : t("rewards.myVouchers.scopeAny"),
        href: voucher.courseDisplayId
            ? pathConfig().locale(locale).course(voucher.courseDisplayId).build()
            : undefined,
        meta: () => (
            <span className="text-sm font-medium text-foreground">
                {discountLabel(voucher)}
            </span>
        ),
        trailing: () => (
            <Chip color={STATUS_COLOR[voucher.status] ?? "default"} variant="soft" size="sm">
                <Chip.Label>
                    {t(`rewards.myVouchers.status.${voucher.status}`)}
                </Chip.Label>
            </Chip>
        ),
    }))

    const redemptionSkeletonItems: Array<SurfaceCardListItem> = Array.from({ length: 3 }, (_row, index) => ({
        key: `redemption-skeleton-${index}`,
        title: "…",
        metaText: "…",
    }))

    const redemptionItems: Array<SurfaceCardListItem> = (walletSwr.data?.redemptions ?? []).map((redemption, index) => ({
        key: `${redemption.rewardKey}-${redemption.createdAt}-${index}`,
        title: redemption.title,
        subtitle: new Date(redemption.createdAt).toLocaleDateString(locale),
        meta: () => (
            <span className="text-xs text-muted">
                {t(`rewards.status.${redemption.status}`)}
            </span>
        ),
        trailing: () => (
            <span className="text-sm font-medium text-foreground">
                {t("rewards.cost", { count: redemption.cost })}
            </span>
        ),
    }))

    return (
        <Box identity={{ tier: "page", component: "MyVouchers" }}>
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    () => (
                        <SurfaceCardList
                            label={t("rewards.myVouchers.title")}
                            items={vouchersLoading ? voucherSkeletonItems : voucherItems}
                            isSkeleton={vouchersLoading}
                            emptyState={() => (
                                <AsyncContentEmpty
                                    icon={TicketIcon}
                                    title={t("rewards.myVouchers.empty")}
                                    description={t("rewards.myVouchers.emptyHint")}
                                />
                            )}
                            error={!vouchersSwr.data ? vouchersSwr.error : undefined}
                            errorState={() => (
                                <AsyncContentError
                                    title={t("rewards.myVouchers.error")}
                                    onRetry={() => void vouchersSwr.mutate()}
                                />
                            )}
                        />
                    ),

                    () => (
                        <SurfaceCardList
                            label={t("rewards.redeemedTitle")}
                            items={walletLoading ? redemptionSkeletonItems : redemptionItems}
                            isSkeleton={walletLoading}
                            emptyState={() => (
                                <AsyncContentEmpty
                                    icon={ReceiptIcon}
                                    title={t("rewards.noRedemptions")}
                                />
                            )}
                            error={!walletSwr.data ? walletSwr.error : undefined}
                            errorState={() => (
                                <AsyncContentError
                                    title={t("rewards.myVouchers.error")}
                                    onRetry={() => void walletSwr.mutate()}
                                />
                            )}
                        />
                    ),
                ]} />
        </Box>
    )
}
