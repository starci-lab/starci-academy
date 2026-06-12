"use client"

import React from "react"
import {
    Accordion,
    Skeleton,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link ModulesSkeleton}. */
export interface ModulesSkeletonProps {
    /** Number of placeholder accordion items to render. */
    count: number
}

/**
 * Loading placeholder for the modules accordion.
 *
 * Presentational: renders `count` shimmering accordion items while the course
 * query is in flight. `"use client"` because HeroUI `Accordion` is interactive.
 * @param props - the number of placeholder rows to render
 */
export const ModulesSkeleton = ({
    count,
}: ModulesSkeletonProps) => {
    const t = useTranslations()
    return (
        <Accordion variant="surface">
            {Array.from({ length: count }).map((_, index) => (
                <Accordion.Item
                    key={index}
                    aria-label={t("module.aria", { index: index + 1 })}
                >
                    <Accordion.Heading>
                        <Accordion.Trigger className="w-full">
                            <div className="flex w-full items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                    <Skeleton className="h-4 w-[30%] my-[4px]" />
                                    <div>
                                        <Skeleton className="h-[14px] w-[60%] my-[3px]" />
                                        <Skeleton className="h-[14px] w-[40%] my-[3px]" />
                                    </div>
                                </div>
                                <Accordion.Indicator />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                        <Accordion.Body />
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}
