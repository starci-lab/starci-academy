"use client"

import React from "react"
import {
    Modal,
    Skeleton,
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import dayjs from "dayjs"
import {
    useAiQuotaOverlayState,
    useQueryMyAiQuotaSwr,
} from "@/hooks/singleton"
import {
    AiMode,
} from "@/modules/api"
import {
    QuotaLane,
} from "./QuotaLane"

/**
 * AI quota modal — shows the signed-in user's usage for BOTH lanes (free Auto
 * "uses" + paid Premium credits), each split across the 5h and weekly windows,
 * plus the window reset times and the active tier.
 *
 * Container: owns the overlay state + quota SWR; renders presentational lane
 * blocks. Opened via {@link useAiQuotaOverlayState}.
 */
export const AiQuotaModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useAiQuotaOverlayState()
    const { data: quota, isLoading } = useQueryMyAiQuotaSwr()

    /** Format a window reset timestamp, or a dash when not started. */
    const formatReset = (value: string | null | undefined) =>
        value ? dayjs(value).format("HH:mm DD/MM") : "—"

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="pr-8">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-foreground">
                                        {t("aiQuota.title")}
                                    </span>
                                    {quota?.tier ? (
                                        <Chip
                                            size="sm"
                                            color="warning"
                                            variant="soft"
                                        >
                                            {quota.tier.toUpperCase()}
                                        </Chip>
                                    ) : null}
                                </div>
                                <div className="text-xs text-muted">{t("aiQuota.subtitle")}</div>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="gap-4 p-4">
                            {isLoading || !quota ? (
                                <>
                                    <Skeleton className="h-36 w-full rounded-large" />
                                    <Skeleton className="h-36 w-full rounded-large" />
                                </>
                            ) : (
                                <>
                                    <QuotaLane
                                        title={t("aiSettings.lanes.auto.title")}
                                        unit={t("aiQuota.usesUnit")}
                                        window5h={{
                                            used: quota.auto.used5h,
                                            limit: quota.auto.limit5h,
                                        }}
                                        windowWeek={{
                                            used: quota.auto.usedWeek,
                                            limit: quota.auto.limitWeek,
                                        }}
                                        fillClassName="bg-accent"
                                        isActive={quota.mode === AiMode.Auto}
                                    />
                                    <QuotaLane
                                        title={t("aiSettings.lanes.premium.title")}
                                        unit={t("aiQuota.creditsUnit")}
                                        window5h={{
                                            used: quota.premium.used5h,
                                            limit: quota.premium.limit5h,
                                        }}
                                        windowWeek={{
                                            used: quota.premium.usedWeek,
                                            limit: quota.premium.limitWeek,
                                        }}
                                        fillClassName="bg-warning"
                                        isActive={quota.mode === AiMode.Premium}
                                        note={quota.tier ? undefined : t("aiQuota.noPremium")}
                                    />
                                    <div className="flex flex-col gap-1 text-xs text-muted">
                                        <div className="flex items-center justify-between">
                                            <span>{t("aiQuota.resets5h")}</span>
                                            <span className="text-foreground">{formatReset(quota.window5hResetAt)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>{t("aiQuota.resetsWeek")}</span>
                                            <span className="text-foreground">{formatReset(quota.windowWeekResetAt)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
