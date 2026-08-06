"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Card,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useSearchParams,
} from "next/navigation"
import type {
    BankDetails,
} from "../types"
import {
    parseBankDetails,
} from "../utils"
import {
    DetailRow,
} from "../DetailRow"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Right-hand panel: the price card plus the bank/account/amount/content rows.
 *
 * Self-contained section (single-use): reads its own checkout query params,
 * derives the destination bank from the QR url, and owns the clipboard copy
 * handler — so the checkout container only renders `<OrderSummary />` and the
 * logic lives next to where it is used. `"use client"` for the query-params /
 * i18n hooks and the interactive copy rows. The repeated rows are rendered via
 * the presentational {@link DetailRow} (list-style), which takes the local
 * `onCopy` handler as a prop.
 */
export const OrderSummary = () => {
    const t = useTranslations()
    const searchParams = useSearchParams()

    const amount = searchParams.get("amount") || ""
    const referenceId = searchParams.get("ref") || ""
    const courseTitle = searchParams.get("courseTitle") || ""
    const qrUrl = searchParams.get("qr") || ""

    /** Destination bank + account parsed once from the QR url. */
    const bankDetails = useMemo<BankDetails>(
        () => parseBankDetails(qrUrl),
        [
            qrUrl,
        ],
    )

    /** Copy the given text to the clipboard. */
    const onCopy = useCallback(
        (text: string) => {
            void navigator.clipboard.writeText(text)
        },
        [],
    )

    return (
        <StackV identity={{ tier: "page", component: "OrderSummary" }} gap={6} principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            items={[
                () => (
                    <Card className="bg-default/40 backdrop-blur-md">
                        <Box principle="card-padding" className="p-6"
                            explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                            <Card.Content>
                                <h3 className="mb-4 text-lg font-medium">{courseTitle}</h3>
                                <StackH gap={3} principle="value-row" align="baseline"
                                    explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
                                    items={[
                                        () => (
                                            <span className="text-3xl font-bold text-primary">
                                                {Number(amount).toLocaleString("vi-VN")}
                                            </span>
                                        ),
                                        () => <span className="text-sm text-muted">VND</span>,
                                    ]} />
                            </Card.Content>
                        </Box>
                    </Card>
                ),

                () => (
                    <Card className="flex-grow bg-default/40 backdrop-blur-md">
                        <Box principle="card-padding" className="p-6"
                            explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                            <Card.Content>
                                <StackV gap={4} principle="content-row"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                    items={[
                                        () => <DetailRow label={t("payment.sepay.bank")} value={bankDetails.bank} />,
                                        () => (
                                            <DetailRow
                                                copyValue={bankDetails.account}
                                                label={t("payment.sepay.account")}
                                                showCopy
                                                value={bankDetails.account}
                                                onCopy={onCopy}
                                            />
                                        ),
                                        () => (
                                            <DetailRow
                                                copyValue={amount}
                                                label={t("payment.sepay.amount")}
                                                showCopy
                                                value={`${Number(amount).toLocaleString("vi-VN")} VND`}
                                                onCopy={onCopy}
                                            />
                                        ),
                                        () => (
                                            <DetailRow
                                                copyValue={referenceId}
                                                isHighlighted
                                                label={t("payment.sepay.content")}
                                                showCopy
                                                value={referenceId}
                                                onCopy={onCopy}
                                            />
                                        ),
                                    ]} />
                            </Card.Content>
                        </Box>
                    </Card>
                ),
            ]} />
    )
}
