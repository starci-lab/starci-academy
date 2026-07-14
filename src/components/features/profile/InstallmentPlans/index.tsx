"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    Button,
    Card,
    CardContent,
    Chip,
    Spinner,
    TextField,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    SettingsBreadcrumb,
} from "../Settings/SettingsBreadcrumb"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Callout } from "@/components/blocks/feedback/Callout"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryMyInstallmentPlansSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInstallmentPlansSwr"
import { useMutatePayNextInstallmentSwr } from "@/hooks/swr/api/graphql/mutations/useMutatePayNextInstallmentSwr"
import type { InstallmentPlanItem } from "@/modules/api/graphql/queries/types/my-installment-plans"
import { PaymentType } from "@/modules/types/enums/payment-type"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { submitCheckout } from "@/modules/payment/submit-checkout"
import { pathConfig } from "@/resources/path"

/** Format an integer VND amount as "1.275.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/** Chip color per plan lifecycle status — semantic only, never accent. */
const STATUS_COLOR: Record<string, "success" | "warning" | "danger" | "muted"> = {
    Active: "success",
    Overdue: "warning",
    Defaulted: "danger",
    Completed: "muted",
}

/**
 * "Kế hoạch trả góp của tôi" — lists the viewer's non-completed installment
 * (trả góp) plans and lets them pay the current cycle.
 *
 * Two render shapes share one list (mirrors `Sessions` — per-plan `Card` with a
 * row action, not a `SurfaceListCard` since each plan is its own bounded object):
 * `Fixed` (fixed monthly amount + `ProgressMeter` "đã trả N/M kỳ") and
 * `FlexiblePool` (outstanding balance + an editable amount, floor-clamped to
 * this cycle's minimum). Paying opens the gateway checkout via the shared
 * `payNextInstallment` mutation, then revalidates the list. Mounted by
 * `/profile/settings/installments`.
 */
export const InstallmentPlans = () => {
    const t = useTranslations()
    const router = useRouter()
    const {
        data: plans,
        isLoading,
        error,
        mutate,
    } = useQueryMyInstallmentPlansSwr()
    const { trigger: triggerPayNextInstallment } = useMutatePayNextInstallmentSwr()
    const runGraphQL = useGraphQLWithToast()

    // the plan id currently being paid (drives the per-row spinner)
    const [payingId, setPayingId] = useState<string | null>(null)
    // FlexiblePool custom amounts, keyed by plan id — seeded lazily from minPaymentVnd
    const [customAmountByPlan, setCustomAmountByPlan] = useState<Record<string, number>>({})

    const planList = plans ?? []

    /** The amount to charge for a plan — the edited FlexiblePool value, else the minimum. */
    const amountFor = useCallback(
        (plan: InstallmentPlanItem) => customAmountByPlan[plan.id] ?? plan.minPaymentVnd,
        [customAmountByPlan],
    )

    /** Clamp a FlexiblePool amount edit to never go below this cycle's minimum. */
    const onAmountChange = useCallback(
        (plan: InstallmentPlanItem, raw: string) => {
            const digits = Number(raw.replace(/\D/g, ""))
            const clamped = Math.max(digits || 0, plan.minPaymentVnd)
            setCustomAmountByPlan((prev) => ({ ...prev, [plan.id]: clamped }))
        },
        [],
    )

    /** Pay a plan's current cycle (PayOS — the only gateway offered here), then refresh the list. */
    const onPay = useCallback(
        async (plan: InstallmentPlanItem) => {
            setPayingId(plan.id)
            try {
                let checkoutUrl = ""
                let checkoutFields: string | null | undefined
                const success = await runGraphQL(
                    async () => {
                        const amountVnd = plan.planType === "FlexiblePool" ? amountFor(plan) : undefined
                        const response = await triggerPayNextInstallment({
                            planId: plan.id,
                            paymentType: PaymentType.PayOS,
                            returnUrl: window.location.href,
                            cancelUrl: window.location.href,
                            amountVnd,
                        })
                        if (!response.data?.payNextInstallment) {
                            throw new Error(response.error?.message)
                        }
                        const data = response.data.payNextInstallment.data
                        checkoutUrl = data?.checkoutUrl ?? ""
                        checkoutFields = data?.checkoutFields
                        return response.data.payNextInstallment
                    },
                    {
                        showSuccessToast: false,
                        showErrorToast: true,
                    },
                )
                if (success && checkoutUrl) {
                    submitCheckout({ checkoutUrl, checkoutFields })
                }
            } finally {
                setPayingId(null)
            }
        },
        [runGraphQL, triggerPayNextInstallment, amountFor],
    )

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("installmentPlans.title")} />}
                title={t("installmentPlans.title")}
                description={t("installmentPlans.subtitle")}
            />

            <AsyncContent
                isLoading={isLoading && !plans}
                skeleton={(
                    <div className="flex flex-col gap-3">
                        {[0, 1].map((row) => (
                            <Skeleton key={row} className="h-40 w-full rounded-2xl" />
                        ))}
                    </div>
                )}
                isEmpty={planList.length === 0}
                emptyContent={{
                    title: t("installmentPlans.empty"),
                    description: t("installmentPlans.emptyDesc"),
                    onRetry: () => router.push(pathConfig().locale().course().build()),
                    retryLabel: t("installmentPlans.emptyCta"),
                }}
                error={error}
                errorContent={{
                    title: t("installmentPlans.empty"),
                    onRetry: () => { void mutate() },
                }}
            >
                <div className="flex flex-col gap-3">
                    {planList.map((plan) => {
                        const isFixed = plan.planType === "Fixed"
                        const isLocked = plan.status === "Defaulted"
                        const statusColor = STATUS_COLOR[plan.status] ?? "muted"
                        const isPaying = payingId === plan.id
                        return (
                            <Card key={plan.id}>
                                <CardContent className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={statusColor === "muted" ? "default" : statusColor}
                                        >
                                            <Chip.Label>{t(`installmentPlans.status.${plan.status}`)}</Chip.Label>
                                        </Chip>
                                        <Typography type="body-xs" color="muted">
                                            {isFixed
                                                ? t("installmentPlans.termMonths", { months: plan.months ?? 0 })
                                                : t("installmentPlans.flexiblePool")}
                                        </Typography>
                                    </div>

                                    {plan.courses.length > 0 ? (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {plan.courses.map((course) => (
                                                <Chip key={course.id} size="sm" variant="soft" color="default">
                                                    <Chip.Label>{course.title}</Chip.Label>
                                                </Chip>
                                            ))}
                                        </div>
                                    ) : null}

                                    {isFixed ? (
                                        <>
                                            <div className="flex items-center justify-between gap-3">
                                                <Typography type="body-sm" weight="semibold">
                                                    {formatVnd(plan.monthlyAmountVnd ?? 0)}
                                                    <Typography type="body-xs" color="muted" className="ml-1 inline">
                                                        {t("installmentPlans.perCycle")}
                                                    </Typography>
                                                </Typography>
                                            </div>
                                            <ProgressMeter
                                                value={plan.installmentsPaid ?? 0}
                                                max={plan.months ?? 1}
                                                label={t("installmentPlans.progress", {
                                                    paid: plan.installmentsPaid ?? 0,
                                                    months: plan.months ?? 0,
                                                })}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between gap-3">
                                                <Typography type="body-sm" color="muted">
                                                    {t("installmentPlans.remaining")}
                                                </Typography>
                                                <Typography type="body-sm" weight="semibold">
                                                    {formatVnd(plan.remainingVnd ?? 0)}
                                                </Typography>
                                            </div>
                                            <Typography type="body-xs" color="muted">
                                                {t("installmentPlans.minPaymentFormula", {
                                                    percent: plan.minPaymentPercent ?? 0,
                                                    floor: formatVnd(plan.minPaymentFloorVnd ?? 0),
                                                })}
                                            </Typography>
                                            <div className="flex items-center gap-2">
                                                <TextField
                                                    className="max-w-[160px]"
                                                    value={amountFor(plan).toLocaleString("vi-VN")}
                                                    onChange={(value) => onAmountChange(plan, value)}
                                                    isDisabled={isPaying}
                                                    aria-label={t("installmentPlans.amountLabel")}
                                                />
                                                <Typography type="body-xs" color="muted">
                                                    {t("installmentPlans.minLabel", { amount: formatVnd(plan.minPaymentVnd) })}
                                                </Typography>
                                            </div>
                                        </>
                                    )}

                                    {isLocked ? (
                                        <Callout
                                            status="danger"
                                            title={t("installmentPlans.lockedTitle")}
                                            description={t("installmentPlans.lockedDesc")}
                                        />
                                    ) : null}

                                    <div className="flex items-center justify-between gap-3 border-t border-default pt-3">
                                        <Typography type="body-xs" color="muted">
                                            {plan.nextDueAt
                                                ? t("installmentPlans.nextDue", { date: new Date(plan.nextDueAt).toLocaleDateString("vi-VN") })
                                                : ""}
                                        </Typography>
                                        <Button
                                            variant={isLocked ? "danger" : "primary"}
                                            size="sm"
                                            isDisabled={isPaying}
                                            onPress={() => { void onPay(plan) }}
                                        >
                                            {isPaying ? (
                                                <Spinner size="sm" color="current" />
                                            ) : isLocked ? (
                                                t("installmentPlans.unlock")
                                            ) : isFixed ? (
                                                t("installmentPlans.payThisCycle")
                                            ) : (
                                                t("installmentPlans.pay")
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </AsyncContent>
        </div>
    )
}
