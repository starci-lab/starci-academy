"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Avatar,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    SearchInput,
} from "@/components/reuseable"
import {
    resolveUserAvatarUrl,
} from "@/utils"
import type {
    QueryMyDashboardRefItemData,
} from "@/modules/api"
import {
    EntityToken,
} from "../EntityToken"

/** Props for {@link HistoryRail}. */
export interface HistoryRailProps {
    /** Courses the viewer has joined. */
    enrolledCourses: Array<QueryMyDashboardRefItemData>
    /** Lessons the viewer recently read. */
    recentContents: Array<QueryMyDashboardRefItemData>
    /** Challenges the viewer has started but not yet passed. */
    inProgressChallenges: Array<QueryMyDashboardRefItemData>
}

/** One titled, searchable section of left-rail items. */
interface RailSection {
    /** i18n key suffix under `dashboard.*` for the section heading + empty text. */
    key: string
    /** Items to render in this section. */
    items: Array<QueryMyDashboardRefItemData>
}

/**
 * GitHub-style left rail: the viewer's identity on top, then searchable sections
 * — joined courses, recent lessons, and in-progress challenges. Every row is a
 * route-index token (resolves its route on click). `"use client"` for redux +
 * the search filter.
 * @param props - the three left-rail lists
 */
export const HistoryRail = ({
    enrolledCourses,
    recentContents,
    inProgressChallenges,
}: HistoryRailProps) => {
    const t = useTranslations()
    const user = useAppSelector((state) => state.user.user)

    /** Immediate filter input (filters every section by label). */
    const [query, setQuery] = useState("")

    /**
     * Display name shown next to the avatar. Prefers the user's chosen display
     * name; otherwise derives a readable handle from the email/username by taking
     * the part before "@" (so we never surface a raw email by default).
     */
    const displayName = useMemo(
        () => {
            const explicit = user?.displayName?.trim()
            if (explicit) {
                return explicit
            }
            const base = user?.email ?? user?.username ?? ""
            return base.split("@")[0]
        },
        [
            user,
        ],
    )

    /** Sections filtered by the label query (case-insensitive). */
    const sections = useMemo<Array<RailSection>>(
        () => {
            const needle = query.trim().toLowerCase()
            const apply = (items: Array<QueryMyDashboardRefItemData>) => (
                needle
                    ? items.filter((item) => item.label.toLowerCase().includes(needle))
                    : items
            )
            return [
                {
                    key: "enrolledCourses",
                    items: apply(enrolledCourses),
                },
                {
                    key: "recentContent",
                    items: apply(recentContents),
                },
                {
                    key: "inProgressChallenges",
                    items: apply(inProgressChallenges),
                },
            ]
        },
        [
            query,
            enrolledCourses,
            recentContents,
            inProgressChallenges,
        ],
    )

    return (
        <div className="flex flex-col gap-6">
            {/* identity block (avatar + display name) */}
            <div className="flex items-center gap-3">
                <Avatar className="size-10">
                    <Avatar.Image
                        src={resolveUserAvatarUrl(
                            user?.avatar,
                            user?.email ?? user?.username ?? displayName,
                        )}
                        alt={displayName}
                    />
                    <Avatar.Fallback>
                        {(displayName[0] ?? "?").toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>
                <div className="font-semibold text-foreground">
                    {displayName}
                </div>
            </div>

            <SearchInput
                value={query}
                onValueChange={setQuery}
                placeholder={t("dashboard.historySearch")}
            />

            {/* one block per section: heading + token rows (or empty hint) */}
            {sections.map((section) => (
                <div
                    key={section.key}
                    className="flex flex-col gap-3"
                >
                    <div className="text-sm font-semibold text-foreground">
                        {t(`dashboard.${section.key}`)}
                    </div>
                    {section.items.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                            {section.items.map((item) => (
                                <EntityToken
                                    key={item.globalId}
                                    globalId={item.globalId}
                                    label={item.label}
                                    block
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted">
                            {t(`dashboard.${section.key}Empty`)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
