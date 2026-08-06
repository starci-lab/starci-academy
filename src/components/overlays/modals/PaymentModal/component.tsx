import { type SelectOption, SelectSingle } from "@/components/atoms/forms"
import React from "react"
import { ArrowRightIcon, GraduationCapIcon, LockIcon } from "@phosphor-icons/react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { Toolbar } from "@/components/composites/navigation/Toolbar"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { PriceTagProminent, PriceTagInline, type PriceCurrency } from "@/components/blocks/commerce/PriceTag"
import { IconTile } from "@/components/atoms/display/IconTile"
import { Typography, type TypographyIcon } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Spinner } from "@/components/atoms/display/Spinner"

import { StackV, StackH } from "@/components/frames/Stack"
import { PaymentType } from "@/modules/types/enums/payment-type"

/**
 * `_PaymentModal` — the SRC TWIN of the shared payment overlay: order summary
 * ("Summary" panel) then gateway pick ("Payment" panel), for every paid flow
 * (course enroll - multi-course checkout - membership - AI subscription).
 * Presentational: typed props, already resolved; no fetch/store/i18n (that's
 * the connected half, `./index.tsx`).
 *
 * Only the price region skeletons (`isSkeleton` flows into the order's
 * `PriceTagInline`/`PriceTagProminent` leaves only) — the tabs, installment
 * picker, voucher field and gateway list render immediately, mirroring
 * `PremiumGateModal`'s own "only the price region rests" contract.
 */

/** Which of the modal's two panels is showing — freely switchable, not a wizard. */
export type PaymentModalTab = "summary" | "payment"

/** One course row of the multi-course cart summary. */
export interface PaymentModalCheckoutLine {
    /** Stable row key (the course id). */
    key: string
    /** Course title. */
    title: string
    /** Course cover image, when known. */
    coverUrl?: string | null
    /** Real charged price in the active currency; `undefined` while its preview hasn't resolved. */
    discounted?: number | null
    /** List price in the active currency, struck through when it beats {@link PaymentModalCheckoutLine.discounted}. */
    original?: number | null
}

/** One loyalty-breakdown row — WHY the discount applies (course flow only). */
export interface PaymentModalLoyaltyRow {
    /** Stable row key. */
    key: string
    /** Leading icon, a COMPONENT reference — never already-built JSX. */
    icon: TypographyIcon
    /** Already-translated reason line. */
    label: string
}

/** One gateway inside {@link PaymentModalGatewayGroup}. */
export interface PaymentModalGatewayMethod {
    /** The gateway. */
    type: PaymentType
    /** Gateway display name (e.g. "PayOS"). */
    name: string
    /** Already-translated one-line description. */
    description: string
    /** Gateway logo. */
    iconUrl: string
    /** Amount charged through this gateway, already formatted; omitted while the price hasn't resolved. */
    amountLabel?: string
    /** `true` while a checkout through THIS gateway is in flight — swaps the row's trailing arrow for a spinner. */
    isPending: boolean
}

/** The gateway group for the active currency (domestic VND <-> international USD). */
export interface PaymentModalGatewayGroup {
    /** Group label (e.g. "Domestic"). */
    label: string
    /** Currency tag shown beside the label (e.g. "VND"). */
    currencyLabel: string
    /** Gateways in this group, in display order. */
    methods: ReadonlyArray<PaymentModalGatewayMethod>
}

/** All display text, already localized by the connected `PaymentModal`; a story passes i18n keys. */
export interface PaymentModalLabels {
    title: string
    tabsAria: string
    tabSummary: string
    tabPayment: string
    continueToPayment: string
    total: string
    priceError: string
    membershipPrice: string
    installmentTitle: string
    payFull: string
    payInstallment: string
    /** "3 months" — set only once a term is chosen. */
    installmentMonths?: string
    /** "…/month" — set only once a term is chosen. */
    installmentPerMonth?: string
    /** Total + markup summary line — set only once a term is chosen. */
    installmentSummary?: string
    voucherTitle: string
    voucherNone: string
    voucherVndOnlyHint: string
    currencyVnd: string
    currencyUsd: string
    secure: string
    noCardStored: string
}

/** Props for {@link _PaymentModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface PaymentModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open/close callback. */
    onOpenChange: (open: boolean) => void

    /** Which panel is showing. */
    selectedTab: PaymentModalTab
    /** Fired when the learner switches panels (via the tab strip, or the "Continue" CTA). */
    onSelectedTabChange: (tab: PaymentModalTab) => void

    /** Product name (course title / cart count / AI tier / membership). */
    orderName: string
    /** Course cover for the single-item summary icon tile; omitted for every other flow. */
    orderCoverUrl?: string | null
    /** Multi-course cart lines; omitted for every single-product flow. */
    checkoutLines?: ReadonlyArray<PaymentModalCheckoutLine>

    /** The charged price (single-item summary, or the cart's charged total) in the active currency. */
    discounted?: number | null
    /** The list price, struck through when it beats {@link PaymentModalProps.discounted}. */
    original?: number | null
    /** Active-phase price before loyalty — feeds the breakdown popover's middle step (course flow only). */
    phase?: number | null
    /** Loyalty discount percent (0 = no loyalty row). */
    discountPercent: number
    /** `true` -> no numeric price exists yet; shows the flat membership heading instead of a `PriceTag`. */
    isMembershipFlow: boolean
    /** Loyalty breakdown rows (course flow only); empty elsewhere. */
    loyaltyRows: ReadonlyArray<PaymentModalLoyaltyRow>

    /** Currency the summary price + gateway list are shown in. */
    currency: PriceCurrency
    /**
     * `true` -> the price region rests: only the `PriceTagInline`/`PriceTagProminent`
     * leaves shimmer, the rest of the panel (tabs, installment, voucher, gateways)
     * renders immediately.
     */
    isSkeleton?: boolean
    /** `true` -> the price region failed to load; replaces it with an error message. */
    priceError?: boolean

    /** `true` -> the "pay in full / pay in installments" picker shows (course flows with terms offered). */
    installmentAvailable: boolean
    /** `true` -> an installment term is the active plan (clamps the order to VND). */
    installmentActive: boolean
    /** Fired when the learner toggles between "pay in full" and "pay in installments". */
    onInstallmentActiveChange: (active: boolean) => void

    /** `true` -> the apply-voucher field shows (course flow, with applicable vouchers). */
    showVoucher: boolean
    /** Options for the apply-voucher field — a leading "no voucher" row plus one per applicable voucher. */
    voucherOptions: Array<SelectOption>
    /** Applied voucher code, `null` = none. */
    voucherCode: string | null
    /** Fired when the learner picks a voucher (or clears it). */
    onVoucherCodeChange: (code: string | null) => void
    /** `true` -> the applied voucher is VND-only (clamps the order to the domestic side). */
    flatVoucherActive: boolean

    /** `true` -> international (USD) gateways are usable for this order — the currency toggle shows. */
    hasUsd: boolean
    /** Fired when the learner switches the domestic/international currency. */
    onCurrencyChange: (currency: PriceCurrency) => void

    /** Gateways for the active currency; omitted only while no flow context is open. */
    activeGroup?: PaymentModalGatewayGroup
    /** Fired when the learner picks a gateway row. */
    onSelectMethod: (type: PaymentType) => void
    /** `true` while any checkout mutation is in flight — disables every gateway row. */
    isMutating: boolean

    labels: PaymentModalLabels
}

/**
 * One course row of the multi-course cart summary — icon tile, truncated title, and
 * (once resolved) its real charged price.
 */
const checkoutLineRow = (
    line: PaymentModalCheckoutLine,
    currency: PriceCurrency,
    isSkeleton: boolean,
) => (
    <StackH
        gap={4}
        principle="content-row"
        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
        align="center"
        items={[
            () => (
                <IconTile
                    size="sm"
                    tone="accent"
                    icon={GraduationCapIcon}
                    src={line.coverUrl}
                    alt={line.title}
                />
            ),
            () => (
                <Typography
                    size="sm"
                    truncate
                    classNames={["min-w-0", "flex-1"]}
                    text={line.title}
                />
            ),
            ...(isSkeleton || line.discounted != null
                ? [() => (
                    <PriceTagInline
                        discounted={line.discounted ?? 0}
                        original={line.original}
                        currency={currency}
                        isSkeleton={isSkeleton}
                        showSavingLine={false}
                        classNames={["shrink-0"]}
                    />
                )]
                : []),
        ]}
    />
)

/** The order summary panel — a multi-course cart list + total, or a single-item price + loyalty breakdown. */
const summaryContent = (props: PaymentModalProps) => {
    const {
        orderName,
        orderCoverUrl,
        checkoutLines,
        discounted,
        original,
        phase,
        discountPercent,
        isMembershipFlow,
        loyaltyRows,
        currency,
        isSkeleton = false,
        priceError = false,
        labels,
        onSelectedTabChange,
    } = props

    if (priceError) {
        return <AsyncContentError title={labels.priceError} />
    }

    if (checkoutLines != null) {
        const checkoutLineItems = checkoutLines.map((line) => () => checkoutLineRow(line, currency, isSkeleton))
        const totalRow = [
            () => <Typography size="sm" weight="semibold" text={labels.total} />,
            ...(isSkeleton || discounted != null
                ? [() => (
                    <PriceTagProminent
                        discounted={discounted ?? 0}
                        original={original}
                        currency={currency}
                        isSkeleton={isSkeleton}
                        showSavingLine={false}
                        classNames={["shrink-0"]}
                    />
                )]
                : []),
        ]
        const checkoutSummaryItems = [
            () => <StackV gap={4} items={checkoutLineItems} />,
            () => (
                <StackH
                    gap={4}
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    justify="between"
                    items={totalRow}
                />
            ),
        ]
        return (
            <StackV
                gap={5}
                principle="group-boundary"
                explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                divider
                items={checkoutSummaryItems}
            />
        )
    }

    const priceRegion = isSkeleton || discounted != null
        ? (
            <PriceTagProminent
                discounted={discounted ?? 0}
                original={original}
                currency={currency}
                isSkeleton={isSkeleton}
                breakdown={phase != null ? { phase, loyaltyPercent: discountPercent } : undefined}
            />
        )
        : isMembershipFlow
            ? <Typography size="h4" weight="bold" text={labels.membershipPrice} />
            : null

    const orderIdentityItems = [
        () => (
            <IconTile
                size="sm"
                tone="accent"
                icon={GraduationCapIcon}
                src={orderCoverUrl}
                alt={orderName}
            />
        ),
        () => (
            <StackV
                gap={3}
                classNames={["min-w-0", "flex-1"]}
                items={[
                    () => <Typography size="xs" color="muted" truncate text={orderName} />,
                    () => priceRegion,
                ]}
            />
        ),
    ]

    const singleSummaryItems = [
        () => (
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                items={orderIdentityItems}
            />
        ),
        ...(loyaltyRows.length > 0
            ? [() => (
                <StackV
                    gap={3}
                    items={loyaltyRows.map((row) => () => (
                        <InlineIconLabel icon={row.icon} label={row.label} tone="success" size="xs" />
                    ))}
                />
            )]
            : []),
        () => (
            <Button
                variant="primary"
                size="lg"
                suffixIcon={ArrowRightIcon}
                iconSlide
                classNames={["w-full"]}
                label={labels.continueToPayment}
                onPress={() => onSelectedTabChange("payment")}
            />
        ),
    ]

    return <StackV gap={4} items={singleSummaryItems} />
}

/** Trailing control for a gateway row - spinner while pending, else a chevron. */
interface GatewayTrailingProps {
    isPending: boolean
}

const GatewayTrailing = ({ isPending }: GatewayTrailingProps) => {
    if (isPending) {
        return <Spinner size="sm" />
    }
    return <ArrowRightIcon aria-hidden focusable="false" className="size-5 text-muted" />
}

/** One gateway row — leading logo, name + description, amount, and a trailing arrow/spinner. */
const gatewayRow = (
    method: PaymentModalGatewayMethod,
    onSelectMethod: (type: PaymentType) => void,
    isMutating: boolean,
): SurfaceCardListItem => ({
    key: method.type,
    leading: () => (
        <img
            alt={method.name}
            className="h-8 w-12 shrink-0 object-contain object-left"
            src={method.iconUrl}
        />
    ),
    title: method.name,
    subtitle: method.description,
    metaText: method.amountLabel,
    trailing: () => <GatewayTrailing isPending={method.isPending} />,
    onPress: () => onSelectMethod(method.type),
    isDisabled: isMutating,
})

/** The payment panel — installment picker, apply-voucher, currency toggle, gateway list, trust line. */
const paymentContent = (props: PaymentModalProps) => {
    const {
        installmentAvailable,
        installmentActive,
        onInstallmentActiveChange,
        showVoucher,
        voucherOptions,
        voucherCode,
        onVoucherCodeChange,
        flatVoucherActive,
        hasUsd,
        currency,
        onCurrencyChange,
        activeGroup,
        onSelectMethod,
        isMutating,
        labels,
    } = props

    const installmentMonthsRow = [
        () => <Typography size="sm" weight="semibold" text={labels.installmentMonths ?? ""} />,
        () => <Typography size="sm" color="muted" text={labels.installmentPerMonth ?? ""} />,
    ]

    const installmentSectionItems = [
        () => <Typography size="xs" weight="medium" color="muted" text={labels.installmentTitle} />,
        () => (
            <Toolbar
                variant="primary"
                size="sm"
                leftTabs={{
                    selectedKey: installmentActive ? "installment" : "full",
                    ariaLabel: labels.installmentTitle,
                    onSelectionChange: (key) => onInstallmentActiveChange(String(key) === "installment"),
                    items: [
                        { key: "full", label: labels.payFull },
                        { key: "installment", label: labels.payInstallment },
                    ],
                }}
            />
        ),
        ...(installmentActive && labels.installmentMonths != null
            ? [() => (
                <SurfaceCard
                    variant="nested"
                    padding={4}
                    body={() => (
                        <StackH
                            gap={4}
                            principle="content-row"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            justify="between"
                            items={installmentMonthsRow}
                        />
                    )}
                />
            )]
            : []),
        ...(labels.installmentSummary != null
            ? [() => <Typography size="xs" color="muted" text={labels.installmentSummary ?? ""} />]
            : []),
    ]

    const voucherSectionItems = [
        () => (
            <SelectSingle
                label={labels.voucherTitle}
                ariaLabel={labels.voucherTitle}
                placeholder={labels.voucherNone}
                options={voucherOptions}
                value={voucherCode ?? ""}
                onValueChange={(value) => onVoucherCodeChange(value || null)}
                isDisabled={isMutating}
            />
        ),
        ...(flatVoucherActive
            ? [() => <Typography size="xs" color="muted" text={labels.voucherVndOnlyHint} />]
            : []),
    ]

    const trustLineItems = [
        () => <InlineIconLabel icon={LockIcon} label={labels.secure} size="xs" />,
        () => <Typography size="xs" color="muted" text={labels.noCardStored} />,
    ]

    const paymentPanelItems = [
        ...(installmentAvailable
            ? [() => <StackV gap={4} items={installmentSectionItems} />]
            : []),
        ...(showVoucher
            ? [() => <StackV gap={4} items={voucherSectionItems} />]
            : []),
        ...(hasUsd
            ? [() => (
                <Toolbar
                    variant="primary"
                    leftTabs={{
                        selectedKey: currency,
                        ariaLabel: labels.title,
                        onSelectionChange: (key) => onCurrencyChange(String(key) as PriceCurrency),
                        items: [
                            { key: "VND", label: labels.currencyVnd },
                            { key: "USD", label: labels.currencyUsd },
                        ],
                    }}
                />
            )]
            : []),
        ...(activeGroup
            ? [() => (
                <SurfaceCardList
                    label={activeGroup.label}
                    labelEnd={activeGroup.currencyLabel}
                    items={activeGroup.methods.map((method) => gatewayRow(method, onSelectMethod, isMutating))}
                />
            )]
            : []),
        () => (
            <StackV
                gap={3}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                align="center"
                items={trustLineItems}
            />
        ),
    ]

    return <StackV gap={4} items={paymentPanelItems} />
}

/**
 * Shared payment modal for every paid flow. See the file header for the panel
 * layout and the `isSkeleton` contract.
 *
 * @param props - {@link PaymentModalProps}
 */
const _PaymentModal = (props: PaymentModalProps) => {
    const { isOpen, onOpenChange, selectedTab, onSelectedTabChange, labels } = props

    const body = () => (
        <StackV
            gap={6}
            items={[
                () => (
                    <Toolbar
                        leftTabs={{
                            selectedKey: selectedTab,
                            ariaLabel: labels.tabsAria,
                            onSelectionChange: (key) => onSelectedTabChange(String(key) as PaymentModalTab),
                            items: [
                                { key: "summary", label: labels.tabSummary },
                                { key: "payment", label: labels.tabPayment },
                            ],
                        }}
                    />
                ),
                () => (selectedTab === "summary" ? summaryContent(props) : paymentContent(props)),
            ]}
        />
    )

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.title}
            size="sm"
            body={body}
            identity={{ tier: "overlay", component: "PaymentModal" }}
        />
    )
}

export { _PaymentModal }
