"use client"

import React from "react"
import {
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    PlayIcon,
} from "@phosphor-icons/react"
import {
    useSidebarCollapsed,
} from "@/components/blocks/navigation/CollapsibleSidebar/context"
import {
    useCourseResume,
} from "../../shared/useCourseResume"

/**
 * The persistent "Tiếp tục học" (resume) pill pinned at the TOP of the course-learn
 * sidebar — visible on EVERY learn surface (not just the content home), so the
 * learner always has a one-click way back to the course spine (next unread lesson /
 * uncompleted challenge). Reads the shared {@link useCourseResume} pointer.
 *
 * Chrome: self-hides while the outline is loading or when there's nothing to resume
 * (all content done). Expanded → an accent-tinted pill (play + "Tiếp tục · n/m" +
 * target title). Collapsed rail → an icon-only play button (aria-label kept). Uses
 * the sanctioned tonal-active skin (`bg-accent/10 text-accent`) to match the active
 * nav row. `"use client"` for the hooks.
 */
export const ResumeRail = () => {
    const t = useTranslations()
    const router = useRouter()
    const collapsed = useSidebarCollapsed()
    const { outline, resumeHref, resumeTitle } = useCourseResume()

    // sidebar chrome — only appears once there's a resolvable resume target
    if (!outline || !resumeHref || !resumeTitle) {
        return null
    }

    const onResume = () => router.push(resumeHref)
    const eyebrow = `${t("nav.resumeContinue")} · ${outline.progress.lessonsRead}/${outline.progress.lessonsTotal}`

    if (collapsed) {
        return (
            <Link
                aria-label={`${t("nav.resumeContinue")} · ${resumeTitle}`}
                onPress={onResume}
                className={cn(
                    "mx-auto mb-3 flex size-9 cursor-pointer items-center justify-center rounded-large",
                    "bg-accent/10 text-accent no-underline transition-colors hover:bg-accent/15",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                )}
            >
                <PlayIcon aria-hidden focusable="false" className="size-5" />
            </Link>
        )
    }

    return (
        <Link
            aria-label={`${t("nav.resumeContinue")} · ${resumeTitle}`}
            onPress={onResume}
            className={cn(
                "mb-3 flex w-full min-w-0 max-w-full cursor-pointer items-center gap-2 overflow-hidden rounded-large bg-accent/10 px-3 py-2",
                "no-underline transition-colors hover:bg-accent/15",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
        >
            <PlayIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent" />
            <span className="flex min-w-0 flex-1 flex-col gap-0 overflow-hidden">
                <Typography type="body-xs" className="min-w-0 text-accent" truncate>
                    {eyebrow}
                </Typography>
                <Typography type="body-sm" className="min-w-0 text-foreground" truncate title={resumeTitle}>
                    {resumeTitle}
                </Typography>
            </span>
        </Link>
    )
}
