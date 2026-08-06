"use client"

import { ClockCountdownIcon as ClockCountdown } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
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
import { Button } from "@/components/atoms/buttons/Button"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

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
        <Box identity={{ tier: "page", component: "CheckoutExpired" }} principle="page-pad" className="flex min-h-[80vh] flex-col items-center justify-center p-4"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
            {/* Glass Card chrome stays on vendor Card until a house surface owns the frosted look. */}
            <Card className="w-full max-w-md bg-default/40 text-center backdrop-blur-md">
                <Box principle="card-padding" className="p-8"
                    explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                    <Card.Content>
                        <StackV gap={6} principle="group-boundary" align="center"
                            explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                            items={[
                                () => (
                                    <StackH gap={1} principle="identity" justify="center"
                                        explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                        items={[
                                            () => <IconTile icon={<ClockCountdown aria-hidden focusable="false" />} tone="warning" size="lg" />,
                                        ]} />
                                ),
                                () => (
                                    <StackV gap={2} principle="title-subtitle" align="center"
                                        explain="Title over supporting line — not label-field, because neither line is a form control label."
                                        items={[
                                            () => <h1 className="text-2xl font-bold">{t("payment.sepay.expired.title")}</h1>,
                                            () => <p className="text-muted">{t("payment.sepay.expired.description")}</p>,
                                        ]} />
                                ),
                                () => (
                                    <StackV gap={4} principle="content-row" classNames={["w-full"]}
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        items={[
                                            () => (
                                                <Button
                                                    variant="primary"
                                                    classNames={["w-full"]}
                                                    label={t("payment.sepay.expired.startOver")}
                                                    onPress={onStartOver}
                                                />
                                            ),
                                            () => (
                                                <Button
                                                    variant="secondary"
                                                    classNames={["w-full"]}
                                                    label={t("payment.sepay.expired.recheck")}
                                                    onPress={onRecheck}
                                                />
                                            ),
                                        ]} />
                                ),
                            ]} />
                    </Card.Content>
                </Box>
            </Card>
        </Box>
    )
}
