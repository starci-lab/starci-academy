"use client"

import React from "react"
import { Chip, Skeleton, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    ReceiptIcon,
    TicketIcon,
} from "@phosphor-icons/react"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import {
    SurfaceListCard,
    SurfaceListCardRow,
} from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { EntityLink } from "@/components/blocks/feed/EntityLink"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { pathConfig } from "@/resources/path"
import type { QueryMyVoucherData } from "@/modules/api/graphql/queries/types/my-vouchers"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Chip color per voucher lifecycle status. */
const STATUS_COLOR: Record<string, "accent" | "warning" | "default" | "danger"> = {
    unused: "accent",
    reserved: "warning",
    used: "default",
    expired: "danger",
}

/** Format a voucher's discount as a short label, e.g. "-10%" / "-50.000đ". */
const discountLabel = (voucher: QueryMyVoucherData): string => (
    voucher.discountType === "percent"
        ? `-${voucher.value}%`
        : `-${voucher.value.toLocaleString("vi-VN")}đ`
)

/** Props for {@link MyVouchers}. */
export type MyVouchersProps = WithClassNames<undefined>

/**
 * The Coin shop's "Ví của tôi" tab: the viewer's minted vouchers (code, scope,
 * status, expiry) plus the redemption history. Self-fetches both — the
 * `myRewardWallet` key is shared with the header/catalog, so a redeem
 * elsewhere refreshes this list without a manual prop.
 *
 * @param props - optional className for the root element.
 */
export const MyVouchers = ({ className }: MyVouchersProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const vouchersSwr = useQueryMyVouchersSwr()
    const walletSwr = useQueryMyRewardWalletSwr()

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <LabeledCard
                label={t("rewards.myVouchers.title")}
                icon={<TicketIcon aria-hidden focusable="false" className="size-5" />}
                frameless
            >
                <AsyncContent
                    isLoading={!vouchersSwr.data}
                    skeleton={(
                        <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-3 px-4 py-4">
                                    <Skeleton className="size-12 shrink-0 rounded-xl" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <Skeleton className="h-4 w-1/3 rounded-lg" />
                                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    isEmpty={(vouchersSwr.data ?? []).length === 0}
                    emptyContent={{
                        icon: <TicketIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                        title: t("rewards.myVouchers.empty"),
                        description: t("rewards.myVouchers.emptyHint"),
                    }}
                    error={vouchersSwr.error}
                    errorContent={{
                        title: t("rewards.myVouchers.error"),
                        onRetry: () => void vouchersSwr.mutate(),
                    }}
                >
                    <SurfaceListCard>
                        {(vouchersSwr.data ?? []).map((voucher) => (
                            <SurfaceListCardRow
                                key={voucher.id}
                                leading={(
                                    <IconTile
                                        size="sm"
                                        tone="accent"
                                        icon={<TicketIcon aria-hidden focusable="false" />}
                                    />
                                )}
                                title={<span className="font-mono">{voucher.code}</span>}
                                subtitle={
                                    voucher.courseId
                                        ? t.rich("rewards.myVouchers.scopeCourse", {
                                            course: voucher.courseTitle ?? "",
                                            link: (chunks) => (
                                                <EntityLink
                                                    label={String(chunks)}
                                                    onPress={voucher.courseDisplayId ? () => router.push(
                                                        pathConfig().locale(locale).course(voucher.courseDisplayId ?? undefined).build(),
                                                    ) : undefined}
                                                />
                                            ),
                                        })
                                        : t("rewards.myVouchers.scopeAny")
                                }
                                meta={(
                                    <span className="text-sm font-medium text-foreground">
                                        {discountLabel(voucher)}
                                    </span>
                                )}
                                trailing={(
                                    <Chip color={STATUS_COLOR[voucher.status] ?? "default"} variant="soft" size="sm">
                                        <Chip.Label>
                                            {t(`rewards.myVouchers.status.${voucher.status}`)}
                                        </Chip.Label>
                                    </Chip>
                                )}
                            />
                        ))}
                    </SurfaceListCard>
                </AsyncContent>
            </LabeledCard>

            <LabeledCard
                label={t("rewards.redeemedTitle")}
                icon={<ReceiptIcon aria-hidden focusable="false" className="size-5" />}
                frameless
            >
                <AsyncContent
                    isLoading={!walletSwr.data}
                    skeleton={(
                        <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-center justify-between gap-3 px-4 py-4">
                                    <Skeleton className="h-4 w-1/3 rounded-lg" />
                                    <Skeleton className="h-4 w-16 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    )}
                    isEmpty={(walletSwr.data?.redemptions ?? []).length === 0}
                    emptyContent={{
                        icon: <ReceiptIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                        title: t("rewards.noRedemptions"),
                    }}
                    error={walletSwr.error}
                    errorContent={{
                        title: t("rewards.myVouchers.error"),
                        onRetry: () => void walletSwr.mutate(),
                    }}
                >
                    <SurfaceListCard>
                        {(walletSwr.data?.redemptions ?? []).map((redemption, index) => (
                            <SurfaceListCardRow
                                key={`${redemption.rewardKey}-${redemption.createdAt}-${index}`}
                                title={redemption.title}
                                subtitle={new Date(redemption.createdAt).toLocaleDateString(locale)}
                                meta={(
                                    <span className="text-xs text-muted">
                                        {t(`rewards.status.${redemption.status}`)}
                                    </span>
                                )}
                                trailing={(
                                    <span className="text-sm font-medium text-foreground">
                                        {t("rewards.cost", { count: redemption.cost })}
                                    </span>
                                )}
                            />
                        ))}
                    </SurfaceListCard>
                </AsyncContent>
            </LabeledCard>
        </div>
    )
}
