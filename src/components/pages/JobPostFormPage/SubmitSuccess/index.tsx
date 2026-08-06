"use client"

import React from "react"
import { Button, Typography } from "@heroui/react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link SubmitSuccess}. */
export interface SubmitSuccessProps {
    /** Display id of the newly created posting, for the "view it" link. */
    jobDisplayId: string
}

/**
 * Persistent confirmation state shown after a successful `submitJobPosting` —
 * this is a full-page form (not a modal), so success is a screen the viewer can
 * read at their own pace, not a toast that disappears. Explains there is no
 * moderation queue (the posting is already live) and links onward to the new
 * listing or back to the board.
 *
 * @param props - {@link SubmitSuccessProps}
 */
export const SubmitSuccess = ({ jobDisplayId }: SubmitSuccessProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    return (
        <Box principle="center-measure" className="mx-auto max-w-lg p-6 py-16 text-center">
            <StackV gap={5} principle="group-boundary" align="center" items={[
                () => <CheckCircleIcon aria-hidden focusable="false" className="size-12 text-success-soft-foreground" />,
                () => (
                    <Typography type="h4" weight="bold">
                        {t("jobs.post.success.title")}
                    </Typography>
                ),
                () => (
                    <Typography type="body-sm" color="muted">
                        {t("jobs.post.success.description")}
                    </Typography>
                ),
                () => (
                    <Box principle="push-end" className="mt-2">
                        <StackH gap={4} principle="content-row" align="center" justify="center" at="sm" items={[
                            () => (
                                <Button
                                    variant="primary"
                                    onPress={() => router.push(pathConfig().locale(locale).jobs(jobDisplayId).build())}
                                >
                                    {t("jobs.post.success.viewPosting")}
                                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                                </Button>
                            ),
                            () => (
                                <Button
                                    variant="secondary"
                                    onPress={() => router.push(pathConfig().locale(locale).jobs().build())}
                                >
                                    {t("jobs.post.success.backToBoard")}
                                </Button>
                            ),
                        ]} />
                    </Box>
                ),
            ]} />
        </Box>
    )
}
