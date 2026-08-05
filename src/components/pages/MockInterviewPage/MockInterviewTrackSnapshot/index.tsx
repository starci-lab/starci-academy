"use client"

import React from "react"
import { Chip, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { StatPair } from "@/components/blocks/stats/StatPair"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryMyJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyJobReadinessSwr"
import type { UserJobReadinessBand } from "@/modules/api/graphql/queries/types/user-job-readiness"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MockInterviewTrackSnapshot}. */
export interface MockInterviewTrackSnapshotProps extends WithClassNames<undefined> {
    /** Course whose job-readiness track to show — filters the viewer's own `myJobReadiness.tracks`. */
    courseId: string
}

/** Maps a readiness band to the `Chip` color that reads correctly (mirrors {@link JobReadinessWidget}). */
const bandColorOf = (band: UserJobReadinessBand): "success" | "warning" | "default" =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "default"

/**
 * "Where you stand" snapshot for ONE course's job-readiness track — the interview
 * pillar's best score, plus the track's overall depth band. Shared between the
 * setup screen (before starting a new run) and the scorecard (right after grading)
 * so both read the exact same number (single source of render).
 *
 * Deliberately does NOT claim a rolling-5-average / delta-to-next-band number: the
 * `myJobReadiness` query only exposes `interviewScore` as a BEST-of score and `band`
 * as the track's blended composite (capstone + interview + cv), not an
 * interview-specific rolling window with a "one more run" delta. Showing a made-up
 * delta would misrepresent the real fairness mechanic (see `WF-09-interview-recent-window`)
 * — this renders only what the query actually returns.
 *
 * Self-hides when the viewer has never attempted this course's track at all (a
 * fresh learner with zero pillars shouldn't see a hollow snapshot before their
 * first attempt) — the setup screen and scorecard both gate rendering by null.
 *
 * @param props - {@link MockInterviewTrackSnapshotProps}
 */
export const MockInterviewTrackSnapshot = ({ courseId, className }: MockInterviewTrackSnapshotProps) => {
    const t = useTranslations()
    const readinessSwr = useQueryMyJobReadinessSwr()
    const data = readinessSwr.data
    const track = data?.tracks.find((candidate) => candidate.courseId === courseId)

    // 2026-07-12: this only mounts inside an already-rendered setup/scorecard
    // screen, so a bare `return null` while `readinessSwr` is still loading was
    // indistinguishable from "genuinely nothing to show" — it popped in above the
    // persona card / into the alert stack a beat after the screen had settled.
    if (readinessSwr.isLoading && !data) {
        return (
            <div className={cn("flex flex-wrap items-center gap-3 rounded-xl bg-default/40 p-4", className)}>
                <Skeleton.Typography type="h4" width="1/4" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        )
    }

    // no track yet (never enrolled-scored anything) — nothing meaningful to show
    if (!track) {
        return null
    }
    // interview pillar never attempted — the snapshot has nothing interview-specific to say
    if (track.interviewScore === null) {
        return null
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-3 rounded-xl bg-default/40 p-4", className)}>
            <StatPair value={track.interviewScore} label={t("mockInterview.trackSnapshotLabel")} />
            <Chip size="md" variant="soft" color={bandColorOf(track.band)}>
                <Chip.Label>{t(`jobReadiness.band.${track.band}`)}</Chip.Label>
            </Chip>
            <Typography type="body-xs" color="muted">
                {t("mockInterview.trackSnapshotHint")}
            </Typography>
        </div>
    )
}
