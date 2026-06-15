"use client"

import React from "react"
import {
    cn,
    Spinner,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryOpenToWorkUsersSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link TalentDirectory}. */
export type TalentDirectoryProps = WithClassNames<undefined>

/**
 * Talent directory — a grid of candidates who opted into "open to work", for
 * recruiters / headhunters to browse. Each card links to the candidate's public
 * profile. Self-contained container: reads the directory via SWR (public). MVP
 * shows the first page (newest first); pagination can be layered on later.
 *
 * @param props - optional className for the root element.
 */
export const TalentDirectory = ({
    className,
}: TalentDirectoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        data,
        isLoading,
    } = useQueryOpenToWorkUsersSwr(0)

    return (
        <div className={cn("mx-auto flex max-w-5xl flex-col gap-6 p-6", className)}>
            {/* page header */}
            <div className="flex flex-col gap-1.5">
                <div className="text-2xl font-bold text-foreground">
                    {t("talents.title")}
                </div>
                <div className="text-sm text-muted">
                    {t("talents.description")}
                </div>
            </div>

            {isLoading && !data ? (
                <div className="flex justify-center p-12">
                    <Spinner size="lg" />
                </div>
            ) : !data || data.length === 0 ? (
                <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                    {t("talents.empty")}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((candidate) => (
                        <button
                            key={candidate.id}
                            type="button"
                            onClick={() => router.push(
                                pathConfig().locale(locale).profile(candidate.username ?? "").build(),
                            )}
                            className="flex flex-col gap-3 rounded-large border border-default/40 p-4 text-left outline-none hover:border-default focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    username={candidate.displayName ?? candidate.username}
                                    avatar={candidate.avatar}
                                    seed={candidate.username}
                                    className="size-12"
                                />
                                <div className="flex min-w-0 flex-col gap-0">
                                    <div className="truncate text-sm font-semibold text-foreground">
                                        {candidate.displayName?.trim() ? candidate.displayName : candidate.username}
                                    </div>
                                    <div className="truncate text-xs text-muted">
                                        @{candidate.username}
                                    </div>
                                </div>
                            </div>
                            {candidate.bio?.trim() ? (
                                <div className="line-clamp-2 text-xs text-muted">
                                    {candidate.bio}
                                </div>
                            ) : null}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
