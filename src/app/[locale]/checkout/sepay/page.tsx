"use client"
import React from 'react'
import {
    StarCiButton,
    StarCiCard,
    StarCiImage,
    StarCiSnippet,
    StarCiSpinner
} from "@/components/atomic"
import { useQueryCourseEnrollmentStatusSwrCore } from "@/hooks/singleton/swr/core/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { useRouter } from "@/i18n/navigation"
import { ArrowsClockwise, CheckCircle } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo } from "react"

export default function SepayCheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <StarCiSpinner size="lg" />
            </div>
        }>
            <SepayCheckoutContent />
        </Suspense>
    )
}

function SepayCheckoutContent() {
    const searchParams = useSearchParams()
    const t = useTranslations()
    const router = useRouter()
    
    const qrUrl = searchParams.get("qr") || ""
    const amount = searchParams.get("amount") || ""
    const referenceId = searchParams.get("ref") || ""
    const courseTitle = searchParams.get("courseTitle") || ""
    const courseId = searchParams.get("courseId") || ""

    // Polling for enrollment status
    const { data: statusData, mutate: refreshStatus } = useQueryCourseEnrollmentStatusSwrCore(courseId)
    const isEnrolled = statusData?.courseEnrollmentStatus?.data?.isEnrolled

    useEffect(() => {
        // Poll every 5 seconds
        const interval = setInterval(() => {
            refreshStatus()
        }, 5000)
        return () => clearInterval(interval)
    }, [refreshStatus])

    useEffect(() => {
        if (isEnrolled) {
            // Redirect to course page after short delay to show success
            const timer = setTimeout(() => {
                router.push(`/courses/${courseId}`)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [isEnrolled, courseId, router])

    const bankDetails = useMemo(() => {
        if (!qrUrl) return { bank: "MBBank", account: "" }
        try {
            const url = new URL(qrUrl)
            return {
                bank: url.searchParams.get("bank") || "MBBank",
                account: url.searchParams.get("acc") || "",
            }
        } catch (e) {
            return { bank: "MBBank", account: "" }
        }
    }, [qrUrl])

    if (isEnrolled) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <StarCiCard className="max-w-md w-full p-8 text-center bg-default/40 backdrop-blur-md">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                            <CheckCircle weight="fill" className="w-10 h-10 text-success" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{t("payment.sepay.success")}</h1>
                    <p className="text-foreground-500 mb-6">{t("payment.sepay.redirecting")}</p>
                    <StarCiSpinner color="success" size="lg" />
                </StarCiCard>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: QR Code Section */}
                <StarCiCard className="bg-default/40 backdrop-blur-md overflow-hidden flex flex-col items-center p-8">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        {t("payment.sepay.instruction")}
                    </h2>
                    
                    <div className="relative group bg-white p-4 rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]">
                        {qrUrl ? (
                            <StarCiImage
                                src={qrUrl}
                                alt="SePay QR"
                                className="w-full max-w-[300px] aspect-square object-contain"
                            />
                        ) : (
                            <div className="w-[300px] h-[300px] flex items-center justify-center">
                                <StarCiSpinner size="lg" />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 flex flex-col items-center gap-4 w-full">
                        <div className="flex items-center gap-2">
                            <StarCiSpinner size="sm" />
                            <span className="text-sm text-foreground-500 italic">
                                {t("payment.sepay.waiting")}
                            </span>
                        </div>
                        <StarCiButton 
                            variant="flat" 
                            startContent={<ArrowsClockwise className="w-4 h-4" />}
                            onPress={() => refreshStatus()}
                        >
                            {t("payment.sepay.checkStatus")}
                        </StarCiButton>
                    </div>
                </StarCiCard>

                {/* Right: Payment Details Section */}
                <div className="flex flex-col gap-6">
                    <StarCiCard className="bg-default/40 backdrop-blur-md p-6">
                        <h3 className="text-lg font-medium mb-4">{courseTitle}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-primary">
                                {Number(amount).toLocaleString("vi-VN")}
                            </span>
                            <span className="text-sm text-foreground-500">VND</span>
                        </div>
                    </StarCiCard>

                    <StarCiCard className="bg-default/40 backdrop-blur-md p-6 flex-grow">
                        <div className="space-y-6">
                            <DetailRow 
                                label={t("payment.sepay.bank")} 
                                value={bankDetails.bank} 
                            />
                            <DetailRow 
                                label={t("payment.sepay.account")} 
                                value={bankDetails.account} 
                                showCopy
                            />
                            <DetailRow 
                                label={t("payment.sepay.amount")} 
                                value={`${Number(amount).toLocaleString("vi-VN")} VND`} 
                                showCopy
                                copyValue={amount}
                            />
                            <DetailRow 
                                label={t("payment.sepay.content")} 
                                value={referenceId} 
                                showCopy
                                isHighlighted
                            />
                        </div>
                    </StarCiCard>
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
    isHighlighted = false 
}: { 
    label: string, 
    value: string, 
    showCopy?: boolean, 
    copyValue?: string,
    isHighlighted?: boolean
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-foreground-400 font-semibold">{label}</span>
            <div className={`flex items-center justify-between p-3 rounded-xl border-1 ${isHighlighted ? "bg-primary/10 border-primary/30" : "bg-default/40 border-default-200"}`}>
                <span className={`font-mono ${isHighlighted ? "text-primary font-bold text-lg" : "text-md"}`}>
                    {value}
                </span>
                {showCopy && (
                    <StarCiSnippet 
                        size="sm" 
                        variant="flat" 
                        symbol="" 
                        classNames={{ base: "p-0 min-w-0" }}
                    >
                        {copyValue || value}
                    </StarCiSnippet>
                )}
            </div>
        </div>
    )
}
