"use client"

import React from "react"
import {
    cn,
    Chip,
    Typography,
} from "@heroui/react"
import {
    ArrowSquareOutIcon,
    SealCheckIcon,
    GraduationCapIcon,
    CodeIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { QueryUserPinnedProjectItem } from "@/modules/api/graphql/queries/types/user-pinned-projects"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/** Tech-stack chips shown inline before collapsing the rest into a "+N" chip. */
const MAX_TECH_CHIPS = 3

/** Props for {@link PinnedProjectCard}. */
export interface PinnedProjectCardProps extends WithClassNames<undefined> {
    /** The pinned project to render (list-item data prop — store can't index it). */
    pin: QueryUserPinnedProjectItem
}

/**
 * Display-only card for one pinned project (public-profile showcase, GitHub-pinned
 * style).
 *
 * @param props - {@link PinnedProjectCardProps}
 */
export const PinnedProjectCard = ({ pin, className }: PinnedProjectCardProps) => {
    const t = useTranslations()

    const isCourse = pin.type === "course"
    const TypeIcon = isCourse ? GraduationCapIcon : CodeIcon
    const title = pin.title ?? t("pinnedProjects.untitled")

    const tech = pin.techStack ?? []
    const visibleTech = tech.slice(0, MAX_TECH_CHIPS)
    const overflow = tech.length - visibleTech.length

    const chipItems = [
        ...visibleTech.map((techName) => (
            () => (
                <Chip key={techName} variant="soft" size="sm">
                    <Chip.Label>{techName}</Chip.Label>
                </Chip>
            )
        )),
        ...(overflow > 0
            ? [() => (
                <Chip variant="soft" size="sm">
                    <Chip.Label>{`+${overflow}`}</Chip.Label>
                </Chip>
            )]
            : []),
    ]

    const body = (
        <>
            <Box principle="card-padding" className="p-4">
                <StackV gap={3} principle="sibling-stack" items={[
                    () => (
                        <StackH gap={3} principle="flex-action" justify="between" items={[
                            () => (
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0 text-xs",
                                        isCourse
                                            ? "bg-success-soft text-success-soft-foreground"
                                            : "border border-default text-muted",
                                    )}
                                >
                                    <StackH gap={2} principle="icon-text" inline items={[
                                        () => <TypeIcon className="size-4" aria-hidden="true" focusable="false" />,
                                        () => <span>{isCourse ? t("pinnedProjects.typeCapstone") : t("pinnedProjects.typeExternal")}</span>,
                                    ]} />
                                </span>
                            ),
                            () => (
                                <ArrowSquareOutIcon
                                    className="size-4 shrink-0 text-muted"
                                    aria-hidden="true"
                                    focusable="false"
                                />
                            ),
                        ]} />
                    ),
                    () => (
                        <Typography
                            type="body-sm"
                            weight="medium"
                            className="line-clamp-2 underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
                        >
                            {title}
                        </Typography>
                    ),
                    ...(pin.description
                        ? [() => (
                            <Typography type="body-xs" color="muted" className="line-clamp-1">
                                {pin.description}
                            </Typography>
                        )]
                        : []),
                    ...(visibleTech.length > 0
                        ? [() => <Cluster gap={3} principle="chip-row" items={chipItems} />]
                        : []),
                ]} />
            </Box>
            {pin.isVerified ? (
                <Box principle="pill-pad" className="border-t border-success/30 bg-success-soft px-4 py-2">
                    <StackH gap={3} items={[
                        () => (
                            <SealCheckIcon
                                className="size-4 shrink-0 text-success-soft-foreground"
                                aria-hidden="true"
                                focusable="false"
                            />
                        ),
                        () => (
                            <Typography type="body-xs" weight="medium" className="text-success-soft-foreground">
                                {t("pinnedProjects.verifiedByStarci")}
                            </Typography>
                        ),
                    ]} />
                </Box>
            ) : null}
        </>
    )

    const cardClassName = cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-surface",
        pin.isVerified ? "border-success/40" : "border-default",
        className,
    )

    if (pin.url) {
        return (
            <a
                href={pin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("pinnedProjects.openAria", { title })}
                className={cn(cardClassName, "cursor-pointer")}
            >
                {body}
            </a>
        )
    }

    return <div className={cardClassName}>{body}</div>
}
