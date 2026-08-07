"use client"

import React, {
    useCallback,
    useState,
} from "react"
import type { ReactNode } from "react"
import {
    Button,
    Card,
    Chip,
    Input,
    Label,
    Skeleton,
    TextField,
    Typography,
} from "@heroui/react"
import { toast } from "@/modules/toast/toast"
import { useTranslations } from "next-intl"
import {
    CheckCircleIcon,
    CopyIcon,
    GiftIcon,
    LightningIcon,
    SnowflakeIcon,
    TShirtIcon,
    TicketIcon,
} from "@phosphor-icons/react"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Callout } from "@/components/composites/feedback/Callout"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { useMutateRedeemRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRedeemRewardSwr"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { useQueryRewardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryRewardsSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import type { QueryRewardData } from "@/modules/api/graphql/queries/types/rewards"
import type { RedeemRewardAiCreditGrant } from "@/modules/api/graphql/mutations/types/redeem-reward"
import { Box } from "@/components/frames/Box"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

/** Icon per catalog item, keyed by its stable reward key (falls back to a generic gift). */
const REWARD_ICON: Record<string, ReactNode> = {
    streakFreeze: <SnowflakeIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />,
    aiCreditBoost: <LightningIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />,
    voucher10: <TicketIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />,
    tshirt: <TShirtIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />,
}

/**
 * Coin-shop catalog grouped into user-facing SECTIONS by reward `kind` (instructor's
 * call, 2026-07-17, "split into more categories"). `aiCredit` + `digital` read as one
 * "speed up learning" bucket; `voucher` and `physical` each stand alone. Order = display
 * order. A reward whose `kind` matches no section is not shown in the grouped view —
 * every current kind is covered here; adding a new kind means adding a section.
 */
const REWARD_SECTIONS: ReadonlyArray<{ key: string, icon: ReactNode, kinds: ReadonlyArray<string> }> = [
    { key: "learn", icon: <LightningIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />, kinds: ["aiCredit", "digital"] },
    { key: "voucher", icon: <TicketIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />, kinds: ["voucher"] },
    { key: "physical", icon: <GiftIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />, kinds: ["physical"] },
]

/** One redeem effect's takeaway shown right after redeeming (voucher code / AI-credit bump). */
type JustRedeemed =
    | { kind: "voucher", code: string }
    | { kind: "aiCredit", grant: RedeemRewardAiCreditGrant }

/** Shipping form fields (physical rewards only). */
interface ShippingForm {
    recipientName: string
    phone: string
    address: string
}

const EMPTY_SHIPPING: ShippingForm = {
    recipientName: "",
    phone: "",
    address: "",
}

/** Props for {@link RewardCatalog}. */
export type RewardCatalogProps = Record<string, never>
/**
 * The Coin shop's "Store" tab: the redeemable catalog grid. Self-fetches the
 * catalog + the viewer's balance (the wallet SWR key is shared with the header
 * and the "My Wallet" tab, so a redeem here refreshes both instantly). Physical
 * rewards expand an inline shipping form before redeeming; a `voucher`/`aiCredit`
 * redemption surfaces its takeaway (code to copy / bonus credit granted) in a
 * dismissible callout above the grid.
 *
 * @param props - optional className for the root element.
 */
export const RewardCatalog = () => {
    const t = useTranslations()
    const rewardsSwr = useQueryRewardsSwr()
    const walletSwr = useQueryMyRewardWalletSwr()
    const vouchersSwr = useQueryMyVouchersSwr()
    const { trigger: triggerRedeem } = useMutateRedeemRewardSwr()
    const runGraphQL = useGraphQLWithToast()

    /** The reward key currently being redeemed (single in-flight redeem). */
    const [redeeming, setRedeeming] = useState<string | null>(null)
    /** The physical reward whose shipping form is open (null = none). */
    const [shippingFor, setShippingFor] = useState<string | null>(null)
    const [ship, setShip] = useState<ShippingForm>(EMPTY_SHIPPING)
    /** The takeaway of the most recent voucher/aiCredit redemption, if any. */
    const [justRedeemed, setJustRedeemed] = useState<JustRedeemed | null>(null)
    /** A non-physical reward awaiting spend confirmation (Coin is real, redeem is irreversible). */
    const [confirming, setConfirming] = useState<QueryRewardData | null>(null)

    const balance = walletSwr.data?.balance ?? 0

    const onRedeem = useCallback(
        async (reward: QueryRewardData, shipping?: ShippingForm) => {
            setRedeeming(reward.key)
            try {
                let redeemed: { voucherCode?: string | null, aiCreditGranted?: RedeemRewardAiCreditGrant | null } | undefined
                const ok = await runGraphQL(async () => {
                    const result = await triggerRedeem({
                        rewardKey: reward.key,
                        ...shipping,
                    })
                    const wrapped = result.data!.redeemReward
                    redeemed = wrapped.data
                    return wrapped
                })
                if (ok) {
                    await walletSwr.mutate()
                    if (reward.kind === "voucher" && redeemed?.voucherCode) {
                        setJustRedeemed({ kind: "voucher", code: redeemed.voucherCode })
                        await vouchersSwr.mutate()
                    } else if (reward.kind === "aiCredit" && redeemed?.aiCreditGranted) {
                        setJustRedeemed({ kind: "aiCredit", grant: redeemed.aiCreditGranted })
                    }
                    // close + reset the shipping form on success
                    setShippingFor(null)
                    setShip(EMPTY_SHIPPING)
                }
            } finally {
                setRedeeming(null)
            }
        },
        [
            triggerRedeem,
            walletSwr,
            vouchersSwr,
            runGraphQL,
        ],
    )

    const onCopyCode = useCallback(
        async (code: string) => {
            try {
                await navigator.clipboard.writeText(code)
                toast.success(t("rewards.myVouchers.copied"))
            } catch {
                // clipboard blocked (permissions/http) → no-op, code is still selectable text
            }
        },
        [t],
    )

    return (
        <Box>
            <StackV gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => (justRedeemed ? (
                        <Callout
                            status="accent"
                            icon={CheckCircleIcon}
                            title={
                                justRedeemed.kind === "voucher"
                                    ? t("rewards.justRedeemed.voucherTitle")
                                    : t("rewards.justRedeemed.aiCreditTitle")
                            }
                            description={
                                justRedeemed.kind === "voucher"
                                    ? undefined
                                    : t("rewards.justRedeemed.aiCreditDescription", {
                                        amount5h: justRedeemed.grant.amount5h,
                                        amountWeek: justRedeemed.grant.amountWeek,
                                    })
                            }
                            body={justRedeemed.kind === "voucher" ? () => (
                                <StackH gap={3} principle="flex-action"
                                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                    align="center" items={[
                                        () => <span className="font-mono font-medium text-foreground">{justRedeemed.code}</span>,
                                        () => (
                                            <Button
                                                variant="tertiary"
                                                size="sm"
                                                onPress={() => void onCopyCode(justRedeemed.code)}
                                            >
                                                <CopyIcon aria-hidden focusable="false" className="size-4" />
                                                {t("rewards.myVouchers.copy")}
                                            </Button>
                                        ),
                                    ]} />
                            ) : undefined}
                            onClose={() => setJustRedeemed(null)}
                            closeAriaLabel={t("rewards.justRedeemed.dismiss")}
                        />
                    ) : null),

                    () => (
                        <AsyncContent
                            isLoading={!rewardsSwr.data}
                            skeleton={(
                                <Grid
                                    columns={{ base: 1, sm: 2 }}
                                    principle="content-row"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                    items={Array.from({ length: 4 }).map((_, index) => ({
                                        key: String(index),
                                        content: () => (
                                            <Box principle="card-padding" className="rounded-3xl bg-surface p-4 shadow-surface"
                                                explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                                                <StackV gap={4} principle="content-row"
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    items={[
                                                        () => (
                                                            <StackH gap={4} principle="content-row"
                                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                align="center" items={[
                                                                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                                                    () => <Skeleton className="h-4 w-1/2 rounded-lg" />,
                                                                ]} />
                                                        ),
                                                        () => <Skeleton className="h-4 w-full rounded-lg" />,
                                                        () => <Skeleton className="h-9 w-24 self-end rounded-lg" />,
                                                    ]} />
                                            </Box>
                                        ),
                                    }))}
                                />
                            )}
                            isEmpty={(rewardsSwr.data ?? []).length === 0}
                            emptyContent={{
                                icon: <GiftIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                                title: t("rewards.catalogEmptyTitle"),
                                description: t("rewards.catalogEmptyDescription"),
                            }}
                            error={rewardsSwr.error}
                            errorContent={{
                                title: t("rewards.catalogError"),
                                onRetry: () => void rewardsSwr.mutate(),
                            }}
                        >
                            <StackV gap={6} principle="block-boundary" explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups." items={REWARD_SECTIONS.map((section) => () => {
                                const sectionItems = (rewardsSwr.data ?? []).filter((reward) => section.kinds.includes(reward.kind))
                                if (sectionItems.length === 0) {
                                    return null
                                }
                                return (
                                    <LabeledCard
                                        key={section.key}
                                        // `label` is plain text now (never a built element) — `LabeledCard`
                                        // has no leading-icon slot the way `SectionCard` does, so the
                                        // per-section icon has nowhere left to attach (flagged for a
                                        // follow-up: a real icon slot on `LabeledCard`, or switch this
                                        // section header to `SectionCard`).
                                        label={t(`rewards.section.${section.key}`)}
                                    >
                                        <Grid
                                            columns={{ base: 1, sm: 2 }}
                                            principle="content-row"
                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                            items={sectionItems.map((reward) => ({
                                                key: reward.key,
                                                content: () => {
                                                    const affordable = balance >= reward.cost
                                                    const isPhysical = reward.kind === "physical"
                                                    const formOpen = shippingFor === reward.key
                                                    const shipReady = Boolean(
                                                        ship.recipientName.trim()
                                && ship.phone.trim()
                                && ship.address.trim(),
                                                    )
                                                    return (
                                                        <Card>
                                                            <StackV gap={4} principle="content-row"
                                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                items={[
                                                                    () => (
                                                                        <StackH gap={4} principle="content-row"
                                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                            align="start" items={[
                                                                                () => (
                                                                                    <IconTile
                                                                                        size="sm"
                                                                                        tone="accent"
                                                                                        icon={REWARD_ICON[reward.key] ?? (
                                                                                            <GiftIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />
                                                                                        )}
                                                                                    />
                                                                                ),
                                                                                () => (
                                                                                    <StackV gap={1} principle="name-handle"
                                                                                        explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                                                                        classNames={["min-w-0", "flex-1"]} items={[
                                                                                            () => (
                                                                                                <span className="truncate text-sm font-semibold text-foreground">
                                                                                                    {reward.title}
                                                                                                </span>
                                                                                            ),
                                                                                            () => (
                                                                                                <span className="text-xs text-muted">
                                                                                                    {reward.description}
                                                                                                </span>
                                                                                            ),
                                                                                        ]} />
                                                                                ),
                                                                            ]} />
                                                                    ),
                                                                    () => (
                                                                        <StackH gap={4} principle="content-row" justify="between" align="center"
                                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                            items={[
                                                                                () => (
                                                                                    <Chip color="accent" variant="soft" size="sm">
                                                                                        <Chip.Label>
                                                                                            {t("rewards.cost", { count: reward.cost })}
                                                                                        </Chip.Label>
                                                                                    </Chip>
                                                                                ),
                                                                                () => (!formOpen ? (
                                                                                    <Button
                                                                                        variant="primary"
                                                                                        size="sm"
                                                                                        isDisabled={!affordable || redeeming !== null}
                                                                                        isPending={redeeming === reward.key}
                                                                                        onPress={() => {
                                                                                            if (isPhysical) {
                                                                                                setShippingFor(reward.key)
                                                                                            } else {
                                                                                                // Coin is real + redeem is irreversible — confirm
                                                                                                // before spending (mirrors the shipping form's own
                                                                                                // "Confirm redeem" step for physical rewards).
                                                                                                setConfirming(reward)
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {affordable
                                                                                            ? t("rewards.redeem")
                                                                                            : t("rewards.cannotAfford")}
                                                                                    </Button>
                                                                                ) : null),
                                                                            ]} />
                                                                    ),
                                                                    () => (formOpen ? (
                                                                        <StackV gap={3} principle="sibling-stack"
                                                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                                            items={[
                                                                                () => (
                                                                                    <TextField variant="secondary">
                                                                                        <Label htmlFor={`reward-ship-name-${reward.key}`}>
                                                                                            {t("rewards.shipName")}
                                                                                        </Label>
                                                                                        <Input
                                                                                            id={`reward-ship-name-${reward.key}`}
                                                                                            value={ship.recipientName}
                                                                                            onChange={(event) => setShip((prev) => ({
                                                                                                ...prev,
                                                                                                recipientName: event.target.value,
                                                                                            }))}
                                                                                        />
                                                                                    </TextField>
                                                                                ),
                                                                                () => (
                                                                                    <TextField variant="secondary">
                                                                                        <Label htmlFor={`reward-ship-phone-${reward.key}`}>
                                                                                            {t("rewards.shipPhone")}
                                                                                        </Label>
                                                                                        <Input
                                                                                            id={`reward-ship-phone-${reward.key}`}
                                                                                            type="tel"
                                                                                            value={ship.phone}
                                                                                            onChange={(event) => setShip((prev) => ({
                                                                                                ...prev,
                                                                                                phone: event.target.value,
                                                                                            }))}
                                                                                        />
                                                                                    </TextField>
                                                                                ),
                                                                                () => (
                                                                                    <TextField variant="secondary">
                                                                                        <Label htmlFor={`reward-ship-address-${reward.key}`}>
                                                                                            {t("rewards.shipAddress")}
                                                                                        </Label>
                                                                                        <Input
                                                                                            id={`reward-ship-address-${reward.key}`}
                                                                                            value={ship.address}
                                                                                            onChange={(event) => setShip((prev) => ({
                                                                                                ...prev,
                                                                                                address: event.target.value,
                                                                                            }))}
                                                                                        />
                                                                                    </TextField>
                                                                                ),
                                                                                () => (
                                                                                    <StackH gap={3} principle="flex-action"
                                                                                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                                                                        align="center" items={[
                                                                                            () => (
                                                                                                <Button
                                                                                                    variant="primary"
                                                                                                    size="sm"
                                                                                                    isDisabled={!shipReady || redeeming !== null}
                                                                                                    isPending={redeeming === reward.key}
                                                                                                    onPress={() => void onRedeem(reward, ship)}
                                                                                                >
                                                                                                    {t("rewards.confirmRedeem")}
                                                                                                </Button>
                                                                                            ),
                                                                                            () => (
                                                                                                <Button
                                                                                                    variant="tertiary"
                                                                                                    size="sm"
                                                                                                    onPress={() => setShippingFor(null)}
                                                                                                >
                                                                                                    {t("rewards.cancel")}
                                                                                                </Button>
                                                                                            ),
                                                                                        ]} />
                                                                                ),
                                                                            ]} />
                                                                    ) : null),
                                                                ]} />
                                                        </Card>
                                                    )
                                                },
                                            }))}
                                        />
                                    </LabeledCard>
                                )
                            })} />
                        </AsyncContent>
                    ),

                    // spend confirmation for non-physical rewards — Coin is real + redeem is
                    // irreversible, so a single accidental tap must never fire it (mirrors the
                    // shipping form's own "Confirm redeem" step for physical rewards).
                    () => (
                        <ModalShell
                            isOpen={confirming !== null}
                            onOpenChange={(open) => {
                                if (!open) {
                                    setConfirming(null)
                                }
                            }}
                            title={t("rewards.confirmRedeem")}
                            size="sm"
                            body={() => (
                                <Typography type="body-sm" color="muted">
                                    {confirming
                                        ? t("rewards.confirmRedeemBody", { cost: confirming.cost, title: confirming.title })
                                        : null}
                                </Typography>
                            )}
                            footer={() => (
                                <>
                                    <Button variant="tertiary" onPress={() => setConfirming(null)}>
                                        {t("rewards.cancel")}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        isPending={redeeming !== null}
                                        onPress={() => {
                                            const reward = confirming
                                            setConfirming(null)
                                            if (reward) {
                                                void onRedeem(reward)
                                            }
                                        }}
                                    >
                                        {t("rewards.confirmRedeem")}
                                    </Button>
                                </>
                            )}
                        />
                    ),
                ]} />
        </Box>
    )
}
