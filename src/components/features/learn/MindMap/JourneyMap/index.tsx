"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Skeleton,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { SerpentineTrack } from "./SerpentineTrack"
import {
    buildCapstoneJourney,
    buildLearningJourney,
} from "./journey"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyCourseOutlineSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCourseOutlineSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Which parallel journey is on screen. */
type JourneyTab = "learning" | "capstone"

/** Props for {@link JourneyMap}. */
export type JourneyMapProps = WithClassNames<undefined>

/**
 * The full-bleed course mind-map, reimagined as a HANDS-ON JOURNEY (serpentine path
 * to mastery) instead of a static module tree — two parallel journeys the learner
 * tabs between: 📚 the learning path (module → lesson · challenge) and 🏗️ the capstone
 * project (milestone → task). Both come from the SAME `myCourseOutline` query (0 BE),
 * rendered by the shared {@link SerpentineTrack} (auto-layout · scroll · progressive
 * detail → scales to any N). Self-fetches; empty (not enrolled / no content) funnels back.
 *
 * @param props - optional className for the root element.
 */
export const JourneyMap = ({
    className,
}: JourneyMapProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const courseId = useAppSelector((state) => state.course.id)
    const displayId = useAppSelector((state) => state.course.displayId)
    const { data: outline, isLoading } = useQueryMyCourseOutlineSwr(courseId ?? null)

    const [tab, setTab] = useState<JourneyTab>("learning")

    const learning = useMemo(
        () => (outline ? buildLearningJourney(outline, locale, displayId) : null),
        [outline, locale, displayId],
    )
    const capstone = useMemo(
        () => (outline && outline.milestones.length > 0
            ? buildCapstoneJourney(outline, locale, displayId)
            : null),
        [outline, locale, displayId],
    )

    // capstone tab only when the course actually has a capstone
    const activeTab: JourneyTab = tab === "capstone" && capstone ? "capstone" : "learning"
    const active = activeTab === "capstone" ? capstone : learning

    return (
        <AsyncContent
            isLoading={isLoading && !outline}
            skeleton={<Skeleton className="h-full w-full" />}
            isEmpty={!outline || outline.modules.length === 0}
            emptyContent={{
                title: t("mindMap.journey.emptyTitle"),
                description: t("mindMap.journey.emptyDescription"),
            }}
        >
            {active ? (
                <div className={cn("relative h-full w-full", className)}>
                    {/* parallel-journey switcher (floating segmented pill) */}
                    {capstone ? (
                        <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 gap-1 rounded-full bg-surface-secondary p-1 shadow-surface">
                            <TabButton active={activeTab === "learning"} onPress={() => setTab("learning")}>
                                📚 {t("mindMap.journey.learn")}
                            </TabButton>
                            <TabButton active={activeTab === "capstone"} onPress={() => setTab("capstone")}>
                                🏗️ {t("mindMap.journey.capstone")}
                            </TabButton>
                        </div>
                    ) : null}

                    <SerpentineTrack journey={active} />
                </div>
            ) : null}
        </AsyncContent>
    )
}

/** One segment of the floating journey switcher. */
const TabButton = ({
    active,
    onPress,
    children,
}: {
    active: boolean
    onPress: () => void
    children: React.ReactNode
}) => (
    <button
        type="button"
        onClick={onPress}
        className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors",
            active ? "bg-surface text-foreground shadow-surface" : "text-muted",
        )}
    >
        {children}
    </button>
)
