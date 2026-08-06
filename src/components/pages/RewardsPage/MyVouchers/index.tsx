"use client"

import React from "react"
import { Chip, Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
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
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { pathConfig } from "@/resources/path"
import type { QueryMyVoucherData } from "@/modules/api/graphql/queries/types/my-vouchers"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

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
        : `-${voucher.value.toLocaleString("vi-VN")}đ` // vn-ok: VND currency suffix
)

/** Props for {@link MyVouchers}. */
export type MyVouchersProps = WithClassNames<undefined>

/**
 * The Coin shop's "My wallet" tab: the viewer's minted vouchers (code, scope,
 * status, expiry) plus the redemption history. Self-fetches both — the
 * `myRewardWallet` key is shared with the header/catalog, so a redeem
 * elsewhere refreshes this list without a manual prop.
 *
 * @param props - optional className for the root element.
 */
export const MyVouchers = ({ className }: MyVouchersProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const vouchersSwr = useQueryMyVouchersSwr()
    const walletSwr = useQueryMyRewardWalletSwr()

    return (
        <Box identity={{ tier: "page", component: "MyVouchers" }} className={className}>
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    () => (
                        <LabeledCard
                            label={t("rewards.myVouchers.title")}
                            frameless
                        >
                            <AsyncContent
                                isLoading={!vouchersSwr.data}
                                skeleton={(
                                    <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                                        {Array.from({ length: 2 }).map((_, index) => (
                                            <Box key={index} principle="row-pad" className="px-4 py-4"
                                                explain="Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.">
                                                <StackH gap={4} principle="content-row"
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    align="center" items={[
                                                        () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                                        () => (
                                                            <StackV gap={3} principle="sibling-stack"
                                                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                                classNames={["min-w-0", "flex-1"]} items={[
                                                                    () => <Skeleton className="h-4 w-1/3 rounded-lg" />,
                                                                    () => <Skeleton className="h-4 w-1/2 rounded-lg" />,
                                                                ]} />
                                                        ),
                                                    ]} />
                                            </Box>
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
                                            // `subtitle` is plain text now (never a built element), so the
                                            // course reference can no longer carry its own inline link — the
                                            // whole row becomes the link instead (`href` below), which is a
                                            // bigger, easier-to-hit target than the old inline text anyway.
                                            leading={() => (
                                                <IconTile
                                                    size="sm"
                                                    tone="accent"
                                                    icon={<TicketIcon aria-hidden focusable="false" />}
                                                />
                                            )}
                                            title={voucher.code}
                                            subtitle={
                                                voucher.courseId
                                                    ? t("rewards.myVouchers.scopeCourse", {
                                                        course: voucher.courseTitle ?? "",
                                                    }).replace(/<\/?link>/g, "")
                                                    : t("rewards.myVouchers.scopeAny")
                                            }
                                            href={voucher.courseDisplayId
                                                ? pathConfig().locale(locale).course(voucher.courseDisplayId).build()
                                                : undefined}
                                            meta={() => (
                                                <span className="text-sm font-medium text-foreground">
                                                    {discountLabel(voucher)}
                                                </span>
                                            )}
                                            trailing={() => (
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
                    ),

                    () => (
                        <LabeledCard
                            label={t("rewards.redeemedTitle")}
                            frameless
                        >
                            <AsyncContent
                                isLoading={!walletSwr.data}
                                skeleton={(
                                    <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <Box key={index} principle="row-pad" className="px-4 py-4"
                                                explain="Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.">
                                                <StackH gap={4} principle="content-row"
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    justify="between" align="center" items={[
                                                        () => <Skeleton className="h-4 w-1/3 rounded-lg" />,
                                                        () => <Skeleton className="h-4 w-16 rounded-lg" />,
                                                    ]} />
                                            </Box>
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
                                            meta={() => (
                                                <span className="text-xs text-muted">
                                                    {t(`rewards.status.${redemption.status}`)}
                                                </span>
                                            )}
                                            trailing={() => (
                                                <span className="text-sm font-medium text-foreground">
                                                    {t("rewards.cost", { count: redemption.cost })}
                                                </span>
                                            )}
                                        />
                                    ))}
                                </SurfaceListCard>
                            </AsyncContent>
                        </LabeledCard>
                    ),
                ]} />
        </Box>
    )
}
