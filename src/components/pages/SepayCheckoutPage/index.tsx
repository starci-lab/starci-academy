"use client"

import React, {
    Suspense,
    useCallback,
    useEffect,
    useState,
} from "react"
import { Spinner } from "@/components/atoms/display/Spinner"
import {
    useLocale,
} from "next-intl"
import {
    useSearchParams,
} from "next/navigation"
import {
    useQueryCourseEnrollmentStatusSwr,
} from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import {
    useRouter,
} from "@/i18n/navigation"
import {
    EnrolledSuccess,
} from "./EnrolledSuccess"
import {
    CheckoutExpired,
} from "./CheckoutExpired"
import {
    QrPanel,
} from "./QrPanel"
import {
    OrderSummary,
} from "./OrderSummary"
import { pathConfig } from "@/resources/path"
import { Box } from "@/components/frames/Box"
import { Grid } from "@/components/frames/Grid"

/** How often (ms) to re-poll the enrollment status while waiting for payment. */
const POLL_INTERVAL_MS = 5000
/** Delay (ms) before redirecting to the course once enrollment is confirmed. */
const REDIRECT_DELAY_MS = 2000
/**
 * How long (ms) to keep polling before treating the checkout as timed out.
 * There is no transaction-status query in the FE GraphQL layer (the only signal
 * is enrollment, which can never flip `true → false`), so once this window
 * elapses without enrollment we surface a terminal "expired" state rather than
 * spinning forever — matching the BE's `Pending → Unpaid` transition
 * (`transactions/business.md`). 15 minutes covers a slow bank transfer.
 */
const CHECKOUT_EXPIRY_MS = 15 * 60 * 1000

/**
 * SePay checkout container.
 *
 * Owns only the page-level concern: poll the course enrollment status via SWR
 * and redirect to the course once enrollment lands (showing the success screen
 * for a beat first). Each panel is self-contained — `QrPanel` and `OrderSummary`
 * read their own query params and own their own handlers — so this container
 * just composes them. `"use client"` because it runs effects + reads params.
 */
const SepayCheckoutPageContent = () => {
    const searchParams = useSearchParams()
    const locale = useLocale()
    const router = useRouter()

    const courseId = searchParams.get("courseId") || ""

    const {
        data: statusData,
        mutate: refreshStatus,
    } = useQueryCourseEnrollmentStatusSwr()
    const isEnrolled = statusData?.courseEnrollmentStatus?.data?.isEnrolled

    // once the checkout window elapses without enrollment, flip to the terminal
    // "expired" state (there is no tx-status query to observe `Unpaid` directly)
    const [isExpired, setIsExpired] = useState(false)

    // poll the enrollment status on a fixed interval while waiting for payment —
    // stops once we're enrolled (redirecting) or the checkout has expired, so we
    // don't keep hitting the API on a settled/dead checkout
    useEffect(
        () => {
            if (isEnrolled || isExpired) {
                return
            }
            const interval = setInterval(
                () => {
                    refreshStatus()
                },
                POLL_INTERVAL_MS,
            )
            return () => clearInterval(interval)
        },
        [
            refreshStatus,
            isEnrolled,
            isExpired,
        ],
    )

    // arm the expiry timeout while waiting; re-arms whenever the user re-checks
    // (which resets `isExpired` to false), and never fires once enrolled
    useEffect(
        () => {
            if (isEnrolled || isExpired) {
                return
            }
            const timer = setTimeout(
                () => {
                    setIsExpired(true)
                },
                CHECKOUT_EXPIRY_MS,
            )
            return () => clearTimeout(timer)
        },
        [
            isEnrolled,
            isExpired,
        ],
    )

    // re-open the poll window and re-check once more (e.g. a slow transfer just
    // settled after the timeout) — resets the terminal back to the waiting view
    const onRecheck = useCallback(
        () => {
            setIsExpired(false)
            refreshStatus()
        },
        [
            refreshStatus,
        ],
    )

    // once enrolled, give the success screen a beat then redirect to the course
    useEffect(
        () => {
            if (isEnrolled) {
                const timer = setTimeout(
                    () => {
                        router.push(pathConfig().locale(locale).course(courseId).build())
                    },
                    REDIRECT_DELAY_MS,
                )
                return () => clearTimeout(timer)
            }
        },
        [
            isEnrolled,
            courseId,
            locale,
            router,
        ],
    )

    if (isEnrolled) {
        return <EnrolledSuccess />
    }

    if (isExpired) {
        return <CheckoutExpired onRecheck={onRecheck} />
    }

    return (
        <Box principle="page-pad" className="flex min-h-screen flex-col items-center px-4 py-12"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
            <Box principle="center-measure" className="w-full max-w-4xl"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
            >
                <Grid
                    columns={{ base: 1, md: 2 }}
                    principle="layout-split"
                    explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                    items={[
                        { key: "qr", content: QrPanel },
                        { key: "summary", content: OrderSummary },
                    ]}
                />
            </Box>
        </Box>
    )
}

/**
 * Public SePay checkout entry point.
 *
 * Wraps {@link SepayCheckoutPageContent} in a Suspense boundary (required because
 * the content + panels read `useSearchParams`) with a centered spinner fallback.
 * Mounted by the `/[locale]/checkout/sepay` route.
 */
export const SepayCheckoutPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[80vh] items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <SepayCheckoutPageContent />
        </Suspense>
    )
}
