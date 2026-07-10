"use client"

import React, { useState } from "react"
import { cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { CoinsIcon } from "@phosphor-icons/react"
import { HighlightChip } from "@/components/blocks/chips/HighlightChip"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { MyVouchers } from "./MyVouchers"
import { RewardCatalog } from "./RewardCatalog"

/** The Coin shop's two tabs: buying new rewards vs owning/using them. */
enum RewardsTab {
    Shop = "shop",
    Wallet = "wallet",
}

/** Props for {@link RewardsPage}. */
export type RewardsPageProps = WithClassNames<undefined>

/**
 * The Coin shop: the viewer's spendable Coin balance in the header, a
 * "Cửa hàng" tab (redeemable catalog) and a "Ví của tôi" tab (minted vouchers +
 * redemption history). Tabs are local state — this page is not deep-linked
 * into from elsewhere, so URL state isn't needed. See `fe/features/rewards.md`
 * (canon) for the shell/CTA/state rationale.
 *
 * @param props - optional className for the root element.
 */
export const RewardsPage = ({ className }: RewardsPageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const walletSwr = useQueryMyRewardWalletSwr()
    const vouchersSwr = useQueryMyVouchersSwr()
    const [tab, setTab] = useState<RewardsTab>(RewardsTab.Shop)

    const balance = walletSwr.data?.balance ?? 0
    const unusedVoucherCount = (vouchersSwr.data ?? []).filter(
        (voucher) => voucher.status === "unused",
    ).length

    return (
        <div className={cn(className)}>
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-6">
                <PageHeader
                    breadcrumb={(
                        <ResponsiveBreadcrumb
                            items={[
                                {
                                    key: "home",
                                    label: t("nav.home"),
                                    onPress: () => router.push(pathConfig().locale(locale).build()),
                                },
                                {
                                    key: "rewards",
                                    label: t("rewards.title"),
                                },
                            ]}
                        />
                    )}
                    title={t("rewards.title")}
                    description={t("rewards.description")}
                    meta={(
                        <HighlightChip
                            tone="accent"
                            icon={<CoinsIcon aria-hidden focusable="false" className="size-4" />}
                            value={balance}
                            label={t("rewards.balanceLabel")}
                        />
                    )}
                />

                <div className="flex flex-col gap-6">
                    <TabsCard
                        leftTabs={{
                            items: [
                                {
                                    key: RewardsTab.Shop,
                                    label: t("rewards.tabs.shop"),
                                },
                                {
                                    key: RewardsTab.Wallet,
                                    label: unusedVoucherCount > 0
                                        ? t("rewards.tabs.walletWithCount", { count: unusedVoucherCount })
                                        : t("rewards.tabs.wallet"),
                                },
                            ],
                            selectedKey: tab,
                            ariaLabel: t("rewards.tabsAria"),
                            onSelectionChange: (key) => setTab(key as RewardsTab),
                        }}
                    />

                    {tab === RewardsTab.Shop ? <RewardCatalog /> : <MyVouchers />}
                </div>
            </div>
        </div>
    )
}
