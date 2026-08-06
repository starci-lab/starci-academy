"use client"

import { ClockCountdownIcon as ClockCountdown } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    Button,
    Card,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useSearchParams,
} from "next/navigation"
import {
    useRouter,
} from "@/i18n/navigation"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { pathConfig } from "@/resources/path"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link CheckoutExpired}. */
export interface CheckoutExpiredProps {
    /** Re-arm the poll window and re-check the payment status once more. */
    onRecheck: () => void
}

/**
 * Terminal state shown when the SePay checkout window elapses without the
 * payment landing (the transaction has moved — or will move — to `Unpaid` on
 * the BE, `transactions/business.md` "Pending → Unpaid"). Replaces the
 * otherwise-indefinite QR + waiting spinner with an explicit dead-end + two
 * ways forward: re-check once more (in case the bank transfer just settled) or
 * start a fresh checkout from the course page.
 *
 * Self-contained (mirrors the sibling panels): reads its own `courseId` param
 * and owns the "start over" navigation; the re-check + timer reset is handed in
 * from the container as `onRecheck`. `"use client"` for the params / i18n / nav
 * hooks and the buttons.
 *
 * @param props - the container's re-check handler.
 */
export const CheckoutExpired = ({ onRecheck }: CheckoutExpiredProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const searchParams = useSearchParams()
    const courseId = searchParams.get("courseId") || ""

    /** Go back to the course page to start a fresh checkout. */
    const onStartOver = useCallback(
        () => {
            router.push(pathConfig().locale(locale).course(courseId).build())
        },
        [
            router,
            locale,
            courseId,
        ],
    )

    return (
        <Box principle="page-pad" className="flex min-h-[80vh] flex-col items-center justify-center p-4"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
            <Card className="w-full max-w-md bg-default/40 text-center backdrop-blur-md">
                <Box principle="card-padding" className="p-8"
                    explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                    <Card.Content className="flex flex-col items-center">
                        <div className="mb-6 flex justify-center">
                            <IconTile icon={<ClockCountdown aria-hidden focusable="false" />} tone="warning" size="lg" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">{t("payment.sepay.expired.title")}</h1>
                        <p className="mb-6 text-muted">{t("payment.sepay.expired.description")}</p>
                        <StackV gap={4} principle="content-row" classNames={["w-full"]}
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            items={[
                                () => (
                                    <Button variant="primary" onPress={onStartOver}>
                                        {t("payment.sepay.expired.startOver")}
                                    </Button>
                                ),
                                () => (
                                    <Button variant="secondary" onPress={onRecheck}>
                                        {t("payment.sepay.expired.recheck")}
                                    </Button>
                                ),
                            ]} />
                    </Card.Content>
                </Box>
            </Card>
        </Box>
    )
}
