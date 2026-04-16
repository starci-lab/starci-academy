"use client"

import React from "react"
import { Button, Card, Spinner } from "@heroui/react"
import { useQueryCourseEnrollmentStatusSwrCore } from "@/hooks/singleton/swr/core/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources"
import { ArrowsClockwise, CheckCircle, Copy } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo } from "react"

export default function SepayCheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[80vh] items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <SepayCheckoutContent />
        </Suspense>
    )
}

function SepayCheckoutContent() {
    const searchParams = useSearchParams()
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const qrUrl = searchParams.get("qr") || ""
    const amount = searchParams.get("amount") || ""
    const referenceId = searchParams.get("ref") || ""
    const courseTitle = searchParams.get("courseTitle") || ""
    const courseId = searchParams.get("courseId") || ""

    const { data: statusData, mutate: refreshStatus } =
        useQueryCourseEnrollmentStatusSwrCore()
    const isEnrolled = statusData?.courseEnrollmentStatus?.data?.isEnrolled

    useEffect(() => {
        const interval = setInterval(() => {
            refreshStatus()
        }, 5000)
        return () => clearInterval(interval)
    }, [refreshStatus])

    useEffect(() => {
        if (isEnrolled) {
            const timer = setTimeout(() => {
                router.push(pathConfig().locale(locale).course(courseId).build())
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [isEnrolled, courseId, router])

    const bankDetails = useMemo(() => {
        if (!qrUrl) {
            return { bank: "MBBank", account: "" }
        }
        try {
            const url = new URL(qrUrl)
            return {
                bank: url.searchParams.get("bank") || "MBBank",
                account: url.searchParams.get("acc") || "",
            }
        } catch {
            return { bank: "MBBank", account: "" }
        }
    }, [qrUrl])

    if (isEnrolled) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md bg-default/40 p-8 text-center backdrop-blur-md">
                    <Card.Content>
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
                                <CheckCircle weight="fill" className="h-10 w-10 text-success" />
                            </div>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">{t("payment.sepay.success")}</h1>
                        <p className="mb-6 text-foreground-500">{t("payment.sepay.redirecting")}</p>
                        <Spinner color="success" size="lg" />
                    </Card.Content>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center px-4 py-12">
            <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="flex flex-col items-center overflow-hidden bg-default/40 p-8 backdrop-blur-md">
                    <Card.Content className="flex w-full flex-col items-center">
                        <h2 className="mb-6 text-center text-xl font-semibold">
                            {t("payment.sepay.instruction")}
                        </h2>

                        <div className="group relative rounded-2xl bg-white p-4 shadow-2xl transition-transform hover:scale-[1.02]">
                            {qrUrl ? (
                                <img
                                    alt="SePay QR"
                                    className="aspect-square w-full max-w-[300px] object-contain"
                                    src={qrUrl}
                                />
                            ) : (
                                <div className="flex h-[300px] w-[300px] items-center justify-center">
                                    <Spinner size="lg" />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex w-full flex-col items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Spinner size="sm" />
                                <span className="text-sm italic text-foreground-500">
                                    {t("payment.sepay.waiting")}
                                </span>
                            </div>
                            <Button
                                variant="secondary"
                                onPress={() => refreshStatus()}
                            >
                                <ArrowsClockwise className="h-4 w-4" />
                                {t("payment.sepay.checkStatus")}
                            </Button>
                        </div>
                    </Card.Content>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card className="bg-default/40 p-6 backdrop-blur-md">
                        <Card.Content>
                            <h3 className="mb-4 text-lg font-medium">{courseTitle}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-primary">
                                    {Number(amount).toLocaleString("vi-VN")}
                                </span>
                                <span className="text-sm text-foreground-500">VND</span>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card className="flex-grow bg-default/40 p-6 backdrop-blur-md">
                        <Card.Content>
                            <div className="space-y-6">
                                <DetailRow label={t("payment.sepay.bank")} value={bankDetails.bank} />
                                <DetailRow
                                    copyValue={bankDetails.account}
                                    label={t("payment.sepay.account")}
                                    showCopy
                                    value={bankDetails.account}
                                />
                                <DetailRow
                                    copyValue={amount}
                                    label={t("payment.sepay.amount")}
                                    showCopy
                                    value={`${Number(amount).toLocaleString("vi-VN")} VND`}
                                />
                                <DetailRow
                                    copyValue={referenceId}
                                    isHighlighted
                                    label={t("payment.sepay.content")}
                                    showCopy
                                    value={referenceId}
                                />
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function DetailRow({
    label,
    value,
    showCopy = false,
    copyValue,
    isHighlighted = false,
}: {
    label: string
    value: string
    showCopy?: boolean
    copyValue?: string
    isHighlighted?: boolean
}) {
    const textToCopy = copyValue ?? value
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-400">
                {label}
            </span>
            <div
                className={`flex items-center justify-between rounded-xl border-1 p-3 ${
                    isHighlighted ? "border-primary/30 bg-primary/10" : "border-default-200 bg-default/40"
                }`}
            >
                <span
                    className={`font-mono ${isHighlighted ? "text-lg font-bold text-primary" : "text-md"}`}
                >
                    {value}
                </span>
                {showCopy ? (
                    <Button
                        aria-label="Copy"
                        size="sm"
                        variant="ghost"
                        onPress={() => {
                            void navigator.clipboard.writeText(textToCopy)
                        }}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                ) : null}
            </div>
        </div>
    )
}
