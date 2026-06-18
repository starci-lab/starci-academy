"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    Typography,
} from "@heroui/react"
import {
    Skeleton,
    PressableCard,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ModuleOverviewSkeleton}. */
export type ModuleOverviewSkeletonProps = WithClassNames<undefined>

/**
 * Loading skeleton for {@link import("../").ModuleOverview} — mirrors the real
 * layout tree (title + description + count chip, the preview-bullet list, and the
 * content-card grid) so the surface never jumps when the module resolves.
 *
 * @param props - {@link ModuleOverviewSkeletonProps}
 */
export const ModuleOverviewSkeleton = ({
    className,
}: ModuleOverviewSkeletonProps) => {
    const t = useTranslations()
    return (
        <div className={className}>
            <div className="flex flex-col gap-6 p-3">
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="h3" width="3/4" />
                    <Skeleton.Typography type="body-sm" width="3/4" />
                    <Skeleton.Chip />
                </div>

                <div className="flex flex-col gap-3">
                    <Typography type="body-sm" weight="semibold">
                        {t("module.pathIntroduction")}
                    </Typography>
                    <div className="flex flex-col gap-3">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton.Typography type="body-sm" width="2/3" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Typography type="body-sm" weight="semibold">
                        {t("content.tabs.content")}
                    </Typography>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {[0, 1, 2].map((index) => (
                            <PressableCard key={index}>
                                <div className="flex flex-col gap-2">
                                    <Skeleton.Typography type="body" width="2/3" />
                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                </div>
                            </PressableCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
