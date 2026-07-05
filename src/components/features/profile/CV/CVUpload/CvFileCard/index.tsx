"use client"

import { ClockIcon, DownloadSimpleIcon, FilePdfIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Card,
    CardContent,
    cn,
    Label,
    Link,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CvFileCard}. */
export interface CvFileCardProps extends WithClassNames<undefined> {
    /** URL the stored CV file resolves to (empty when none — e.g. generated CVs have no raw file). */
    currentCvLink: string
    /** Display label for the CV file link. */
    currentCvLinkLabel: string
    /** Human-readable submission time. */
    submittedAtLabel: string
}

/**
 * Current CV file card: file link, submitted time, and download link.
 *
 * Presentational: renders the provided file metadata, no logic.
 * @param props - {@link CvFileCardProps}
 */
export const CvFileCard = ({
    currentCvLink,
    currentCvLinkLabel,
    submittedAtLabel,
    className,
}: CvFileCardProps) => {
    const t = useTranslations()
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Label>{t("cv.submission.fileCardTitle")}</Label>
            <Card className="shadow-none">
                <CardContent className="flex items-center">
                    <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            <FilePdfIcon aria-hidden className="size-10 text-muted" />
                            <div className="flex min-w-0 flex-1 flex-col gap-2" title={currentCvLinkLabel}>
                                {
                                    currentCvLink ? (
                                        <Link
                                            href={currentCvLink}
                                            target="_blank"
                                            className="block w-full"
                                        >
                                            <Typography type="body-sm" truncate className="text-accent underline">
                                                {currentCvLinkLabel}
                                            </Typography>
                                        </Link>
                                    ) : (
                                        <Typography type="body-sm" color="muted" truncate>
                                            {currentCvLinkLabel}
                                        </Typography>
                                    )}
                                <div className="flex items-center gap-2">
                                    <ClockIcon aria-hidden className="size-5 text-muted" />
                                    <Typography type="body-xs" color="muted">
                                        {submittedAtLabel}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        {
                            currentCvLink && (
                                <Link
                                    href={currentCvLink}
                                    target="_blank"
                                >
                                    <DownloadSimpleIcon aria-hidden className="size-5 text-muted" />
                                </Link>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
