"use client"

import React from "react"
import {
    Chip,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    BookOpenIcon,
    BracketsCurlyIcon,
} from "@phosphor-icons/react"
import _ from "lodash"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryModuleSwr,
} from "@/hooks"
import {
    AsyncContent,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    ContentCard,
} from "./ContentCard"
import {
    ModuleOverviewSkeleton,
} from "./ModuleOverviewSkeleton"

/** Props for {@link ModuleOverview}. */
export type ModuleOverviewProps = WithClassNames<undefined>

/**
 * Module overview surface — the per-module landing inside the Learn shell:
 * the module title/description, a content-count chip, the "path introduction"
 * preview bullets, and the grid of content cards.
 *
 * A thin orchestrator: it reads the active module + content list from Redux
 * (hydrated by the module SWR), wraps the first load in {@link AsyncContent},
 * and lets each {@link ContentCard} self-navigate from the route ids in store.
 *
 * @param props - {@link ModuleOverviewProps}
 */
export const ModuleOverview = ({
    className,
}: ModuleOverviewProps) => {
    const t = useTranslations()
    const module = useAppSelector((state) => state.module.entity)
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const isLoading = isModuleLoading || !module
    const contentsFromRedux = useAppSelector((state) => state.content.entities)
    const contentsCountFromRedux = useAppSelector((state) => state.content.count)
    const contents = (contentsFromRedux?.length ?? 0) > 0 ? contentsFromRedux : module?.contents
    /** Prefer server total (paginated list), then the rendered list, then module shell fallback. */
    const contentCount = contentsCountFromRedux ?? contents?.length ?? module?.numContents ?? 0

    return (
        <div className={className}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={<ModuleOverviewSkeleton />}
            >
                <div className="flex flex-col gap-6 p-3">
                    <div className="flex flex-col gap-2">
                        <Typography type="heading-md" weight="bold">
                            {module?.title}
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            {module?.description}
                        </Typography>
                        <div className="flex items-center gap-2">
                            <Chip variant="secondary" color="accent">
                                <BookOpenIcon className="size-5" />
                                <Chip.Label>
                                    {t("module.numContents", { count: contentCount })}
                                </Chip.Label>
                            </Chip>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Typography type="body-md" weight="semibold">
                            {t("module.pathIntroduction")}
                        </Typography>
                        <div className="flex flex-col gap-3">
                            {_.cloneDeep(module?.previewContents ?? [])
                                .sort((previous, current) => previous.sortIndex - current.sortIndex)
                                .map((content) => (
                                    <div key={content.id} className="flex items-center gap-2 text-muted">
                                        <BracketsCurlyIcon className="size-5 min-w-5 min-h-5" />
                                        <Typography
                                            type="body-sm"
                                            color="muted"
                                            asChild
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: content.text,
                                                }}
                                            />
                                        </Typography>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Typography type="body-md" weight="semibold">
                            {t("content.tabs.content")}
                        </Typography>
                        <AsyncContent
                            isLoading={false}
                            skeleton={null}
                            isEmpty={!(contents?.length && contents.length > 0)}
                            emptyContent={{
                                title: t("content.empty"),
                            }}
                        >
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {_.cloneDeep(contents ?? [])
                                    .sort((prev, next) => prev.sortIndex - next.sortIndex)
                                    .map((content) => (
                                        <ContentCard key={content.id} content={content} />
                                    ))}
                            </div>
                        </AsyncContent>
                    </div>
                </div>
            </AsyncContent>
        </div>
    )
}
