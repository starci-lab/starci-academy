"use client"

import { ArrowDownToLine as DownloadSimpleIcon, Clock as ClockIcon, FileText as FilePdfIcon } from "@gravity-ui/icons"
import React from "react"
import {
    Button,
    Card,
    CardContent,
    Link,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link CvFileCard}. */
export interface CvFileCardProps {
    /** URL the stored/selected CV file resolves to (empty when none). */
    currentCvLink: string
    /** Display label for the CV file link. */
    currentCvLinkLabel: string
    /** Human-readable submission time. */
    submittedAtLabel: string
    /** Fired when the user wants to open the CV update upload modal. */
    onOpenUpdate: () => void
}

/**
 * Stored CV file card: file link, submitted time, download link, and update action.
 *
 * Presentational: renders the provided file metadata, no logic.
 * @param props - {@link CvFileCardProps}
 */
export const CvFileCard = ({
    currentCvLink,
    currentCvLinkLabel,
    submittedAtLabel,
    onOpenUpdate,
}: CvFileCardProps) => {
    const t = useTranslations()
    return (
        <div>
            <div className="mb-3 text-base font-semibold">{t("cv.submission.fileCardTitle")}</div>
            <Card className="w-full shadow-none">
                <CardContent className="flex items-center">
                    <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-1.5">
                            <FilePdfIcon className="size-10 text-muted" />
                            <div className="min-w-0 flex-1" title={currentCvLinkLabel}>
                                {
                                    currentCvLink ? (
                                        <Link
                                            href={currentCvLink}
                                            target="_blank"
                                            className="block w-full truncate text-sm text-accent underline"
                                        >
                                            {currentCvLinkLabel}
                                        </Link>
                                    ) : (
                                        <span className="block w-full truncate text-sm text-muted">
                                            {currentCvLinkLabel}
                                        </span>
                                    )}
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                                    <ClockIcon className="size-4" />
                                    {submittedAtLabel}
                                </div>
                            </div>
                        </div>
                        {
                            currentCvLink && (
                                <Link
                                    href={currentCvLink}
                                    target="_blank"
                                >
                                    <DownloadSimpleIcon className="size-5 text-muted" />
                                </Link>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
            <div className="h-3" />
            <Button variant="secondary" onPress={onOpenUpdate}>
                {t("cv.submission.updateAction")}
            </Button>
        </div>
    )
}
