"use client"

import React from "react"
import type { Key } from "react"
import { ChartLineUpIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { GroupPressableCard, type GroupPressableCardItem } from "@/components/blocks/cards/GroupPressableCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Container } from "@/components/frames/Container"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { UserJobReadinessBand } from "@/modules/api/graphql/queries/types/user-job-readiness"

/** Number of placeholder cards shown while the candidate list first loads. */
const SKELETON_COUNT = 6

/** Maps a readiness band to the `Chip` tone that reads correctly. */
const bandToneOf = (band: UserJobReadinessBand): "success" | "warning" | "default" =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "default"

/** One selectable track (course) in the filter strip. */
export interface TalentDirectoryTrack {
    /** Course id — also the SWR/tab selection key. */
    key: string
    /** Course title, already resolved for the current locale. */
    label: string
}

/** One recruiter-facing candidate card, already resolved (identity + the FILTERED-track badge). */
export interface TalentDirectoryCandidate {
    /** Stable React key — the candidate's user id. */
    key: string
    /** Profile link, already built for the current locale. */
    href: string
    /** Display name, already falling back to the username when blank. */
    displayName: string
    /** Role title, already falling back to `@username` when blank. */
    roleTitle: string
    avatar?: string | null
    /** Seed for the generated fallback avatar (falls back to the username). */
    seed?: string | null
    /** Qualitative badge — track-specific, never a blended cross-track score. */
    isQualified: boolean
    band: UserJobReadinessBand
    bio?: string | null
}

/** All display text, already localized by the connected `TalentDirectory`; a story passes i18n keys. */
export interface TalentDirectoryLabels {
    title: string
    description: string
    trackFilterAria: string
    candidatesAria: string
    emptyTitle: string
    emptyDescription: string
    errorTitle: string
    retry: string
    qualified: string
    /** Readiness-band chip label, keyed by {@link UserJobReadinessBand}. */
    band: Record<UserJobReadinessBand, string>
}

/** Props for {@link _TalentDirectory} — presentational; all data resolved, no fetch/store/i18n. */
export interface TalentDirectoryProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero candidates for the selected track → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** The tracks a recruiter can filter on. The strip stays hidden until at least one resolves AND a track is selected. */
    tracks: Array<TalentDirectoryTrack>
    /** Currently selected track id. `null` before the first course resolves. */
    selectedTrackKey: string | null
    /** Fired with the newly selected track's id — re-keys the ranked candidate query. */
    onSelectTrack: (key: string) => void
    /** Ranked candidates for the selected track, in display order. */
    candidates: Array<TalentDirectoryCandidate>
    labels: TalentDirectoryLabels
}

/**
 * Recruiter marketplace — pick ONE track (course) and browse the open-to-work
 * candidates for it, ranked by that track's depth (strongest first). The
 * presentational half of {@link TalentDirectory} (`design/storybook/architecture/
 * split.md`): four states in the fixed order error → skeleton → empty → content,
 * `error` falling to the shared `AsyncContentError` frame and `isEmpty` to
 * `AsyncContentEmpty`, otherwise the one real tree renders with `isSkeleton`
 * threaded to every leaf that supports it so the shimmer mirrors the loaded shape
 * (`loading-and-skeleton.md`). Each card shows the candidate's identity plus the
 * qualitative `band`/`isQualified` badge for the FILTERED track ONLY: never a
 * blended cross-track score, never a raw meaningless number (the fair-monetization
 * model — see `.workflows/00-INDEX.md`).
 *
 * @param props - {@link TalentDirectoryProps}
 */
export const _TalentDirectory = ({
    className,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    tracks,
    selectedTrackKey,
    onSelectTrack,
    candidates,
    labels,
}: TalentDirectoryProps) => {
    // error beats a stale loading flag; empty only once settled (BLOCK-8). Kept
    // inside the same `max-w-5xl`/`p-6` measure (`Container size="lg"`) the
    // content renders in below, so the page chrome doesn't jump between states.
    if (error) {
        return (
            <div data-tier="block" data-component="TalentDirectory" className={className}>
                <Container size="lg" padding={6} body={() => (
                    <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
                )} />
            </div>
        )
    }
    if (!isSkeleton && isEmpty) {
        return (
            <div data-tier="block" data-component="TalentDirectory" className={className}>
                <Container size="lg" padding={6} body={() => (
                    <AsyncContentEmpty
                        icon={ChartLineUpIcon}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                    />
                )} />
            </div>
        )
    }

    // ROW shape — while shimmering, placeholder cards keep the SAME `GroupPressableCard`
    // shape (row component + count) as the loaded grid. `UserAvatar` has no `isSkeleton`
    // of its own (block, not atom/composite), so it is mirrored in place with `Skeleton.Avatar`
    // right where it sits — still co-located, not a parallel tree.
    const candidateItems: Array<GroupPressableCardItem> = isSkeleton
        ? Array.from({ length: SKELETON_COUNT }, (_unused, index) => ({
            key: `pending-${index}`,
            isDisabled: true,
            content: (
                <StackV gap={3} items={[
                    () => (
                        <StackH gap={3} items={[
                            () => <Skeleton.Avatar size="lg" />,
                            () => (
                                <StackV gap={1} classNames={["min-w-0"]} items={[
                                    () => <Typography size="sm" weight="semibold" isSkeleton />,
                                    () => <Typography size="xs" color="muted" isSkeleton />,
                                ]} />
                            ),
                        ]} />
                    ),
                    () => <StackH gap={2} items={[() => <Chip isSkeleton />]} />,
                ]} />
            ),
        }))
        : candidates.map((candidate) => ({
            key: candidate.key,
            href: candidate.href,
            content: (
                <StackV gap={3} items={[
                    () => (
                        <StackH gap={3} items={[
                            () => (
                                <UserAvatar
                                    username={candidate.displayName}
                                    avatar={candidate.avatar}
                                    seed={candidate.seed}
                                    className="size-12"
                                />
                            ),
                            () => (
                                <StackV gap={1} classNames={["min-w-0"]} items={[
                                    () => <Typography size="sm" weight="semibold" truncate text={candidate.displayName} />,
                                    () => <Typography size="xs" color="muted" truncate text={candidate.roleTitle} />,
                                ]} />
                            ),
                        ]} />
                    ),
                    // qualitative track badges ONLY — no blended score, no raw number
                    () => (
                        <StackH gap={2} items={[
                            ...(candidate.isQualified ? [() => (
                                <Chip tone="success" icon={RocketLaunchIcon} text={labels.qualified} />
                            )] : []),
                            () => <Chip tone={bandToneOf(candidate.band)} text={labels.band[candidate.band]} />,
                        ]} />
                    ),
                    ...(candidate.bio?.trim() ? [() => (
                        <Typography size="xs" color="muted" lineClamp={2} text={candidate.bio ?? ""} />
                    )] : []),
                ]} />
            ),
        }))

    const handleTrackSelectionChange = (key: Key) => onSelectTrack(String(key))

    return (
        <div data-tier="block" data-component="TalentDirectory" className={className}>
            <Container size="lg" padding={6} isSkeleton={isSkeleton} body={() => (
                <StackV gap={6} items={[
                    () => <PageHeader title={labels.title} description={labels.description} />,

                    // track filter (single-select nav → underline tabs). Changing the track
                    // re-keys the candidate query below → server-side re-rank. Hidden until
                    // tracks resolve + a selection exists — same condition as before, and it
                    // never coincides with the skeleton grid below (both wait on the same
                    // course fetch), so no separate skeleton mirror is needed here.
                    ...(tracks.length > 0 && selectedTrackKey ? [() => (
                        <TabsCard
                            leftTabs={{
                                items: tracks.map((track) => ({ key: track.key, label: track.label })),
                                selectedKey: selectedTrackKey,
                                ariaLabel: labels.trackFilterAria,
                                onSelectionChange: handleTrackSelectionChange,
                            }}
                        />
                    )] : []),

                    () => (
                        <GroupPressableCard
                            ariaLabel={labels.candidatesAria}
                            // container steps, not viewport. A candidate card carries a 48px
                            // avatar + name + chips, so it needs real width: two-up from 576px
                            // (≈284px each), three-up only from 896px (≈293px each).
                            columns={{ base: 1, xl: 2, xl4: 3 }}
                            items={candidateItems}
                        />
                    ),
                ]} />
            )} />
        </div>
    )
}
