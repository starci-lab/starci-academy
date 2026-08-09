"use client"

import React, { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { CoinsIcon } from "@phosphor-icons/react"
import { HighlightChip } from "@/components/composites/chips/HighlightChip"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { pathConfig } from "@/resources/path"
import { MyVouchers } from "./MyVouchers"
import { RewardCatalog } from "./RewardCatalog"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/** The Coin shop's two tabs: buying new rewards vs owning/using them. */
enum RewardsTab {
    Shop = "shop",
    Wallet = "wallet",
}

/** Props for {@link RewardsPage}. */
export type RewardsPageProps = Record<string, never>
/**
 * The Coin shop: the viewer's spendable Coin balance in the header, a
 * "Store" tab (redeemable catalog) and a "My wallet" tab (minted vouchers +
 * redemption history). Tabs are local state — this page is not deep-linked
 * into from elsewhere, so URL state isn't needed. See `fe/features/rewards.md`
 * (canon) for the shell/CTA/state rationale.
 *
 * @param props - {@link RewardsPageProps}
 */
export const RewardsPage = () => {
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

    // Empty host wrapper removed — Box is the real page root and wears identity.
    return (
        <Container
            identity={{ tier: "page", component: "RewardsPage" }}
            principle="page-measure"
            explain="Uses the standard page reading measure: wider than a card, inset from the viewport, and centered for long-form content."
            body={() => (
                <StackV principle="layout-split"
                    explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                    items={[
                        () => (
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
                                        icon={CoinsIcon}
                                        value={balance}
                                        label={t("rewards.balanceLabel")}
                                    />
                                )}
                            />
                        ),
                        () => (
                            <StackV principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                items={[
                                    () => (
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
                                    ),
                                    () => (tab === RewardsTab.Shop ? <RewardCatalog /> : <MyVouchers />),
                                ]} />
                        ),
                    ]} />
            )}
        />
    )
}
