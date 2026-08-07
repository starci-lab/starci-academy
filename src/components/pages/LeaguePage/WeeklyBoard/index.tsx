"use client"

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    _WeeklyBoard,
    type WeeklyBoardHero,
    type WeeklyBoardPodiumEntry,
    type WeeklyBoardRowEntry,
} from "./component"
import { useQueryMyLeagueSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyLeagueSwr"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Props for {@link WeeklyBoard}. */
export type WeeklyBoardProps = Record<string, never>
/**
 * The full weekly-league board — one shell shared with the global board:
 * a {@link import("./component").WeeklyBoardHero} of the viewer's own standing (rank-driven
 * badge · goal-gradient meter · climb CTA), the top-3 podium (the viewer's own column ringed
 * when they're a finisher), the promote/demote legend, then rank 4+ (zone edge-markers + the
 * rank-movement caret). Self-fetches its leaf query; empty (not placed in a cohort) funnels to
 * courses.
 *
 * The CONNECTED half: it owns the fetch, computes `isSkeleton` from the first-load formula and
 * `isEmpty` from the resolved data, derives every domain value (countdown, the viewer's own
 * standing, the promotion goal-gradient, the one-shot podium-finish celebration), resolves every
 * translated string, and hands it all to the presentational `_WeeklyBoard`
 * (`tiers/split.md`).
 *
 * @param props - optional className for the root element.
 */
export const WeeklyBoard = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // `error` is intentionally not read: the original `AsyncContent` usage never wired an
    // error/errorContent pair, so a settled fetch error falls through into the empty branch
    // exactly as it did before this split (`!data` makes `isEmpty` true) — see `apiChanged`
    // in the retirement report for this deliberate call.
    const { data, isLoading } = useQueryMyLeagueSwr()
    const me = useAppSelector((state) => state.user.user)

    /** Hours/days left until the weekly reset (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            if (!data) {
                return null
            }
            const remaining = Math.max(0, new Date(data.weekEndAt).getTime() - Date.now())
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
            }
        },
        [data],
    )

    const total = data?.entries.length ?? 0

    /** Whether an entry belongs to the viewer (best-effort username match). */
    const isMine = (username: string | null) => Boolean(me?.username) && username === me?.username

    // the viewer's own standing + goal-gradient toward the promotion cutoff (all
    // computed FE from data already fetched — no BE change).
    const myEntry = data && me?.username
        ? data.entries.find((entry) => entry.username === me.username)
        : undefined
    const myPercent = myEntry ? Math.max(1, Math.ceil((myEntry.rank / total) * 100)) : null
    const promoteCutoff = data ? data.entries[data.promoteCount - 1] : undefined
    const inPromote = myEntry ? myEntry.rank <= (data?.promoteCount ?? 0) : false
    const pointsToPromote = myEntry && promoteCutoff && !inPromote
        ? Math.max(0, promoteCutoff.weekPoints - myEntry.weekPoints + 1)
        : 0

    /** Funnel to courses — climb the league by learning (the north-star CTA). */
    const onClimb = () => router.push(pathConfig().locale(locale).course().build())

    // celebrate a top-3 finish with a confetti burst when the viewer lands here
    // (the board remounts on tab switch → fires once per visit to a podium tab).
    const isTop = Boolean(myEntry) && (myEntry?.rank ?? 99) <= 3
    const [celebrateKey, setCelebrateKey] = useState(0)
    const celebratedRef = useRef(false)
    useEffect(
        () => {
            if (isTop && !celebratedRef.current) {
                celebratedRef.current = true
                setCelebrateKey((key) => key + 1)
            }
        },
        [isTop],
    )

    const youLabel = t("dashboard.league.you")

    const hero: WeeklyBoardHero | undefined = myEntry && myPercent !== null ? {
        rank: myEntry.rank,
        rankLabel: t("dashboard.myProfile.rankLine", {
            rank: myEntry.rank,
            percent: myPercent,
        }),
        meta: `${t("dashboard.league.points", { count: myEntry.weekPoints })}${countdown
            ? ` · ${t("dashboard.league.resetIn", { days: countdown.days, hours: countdown.hours })}`
            : ""}`,
        progress: !inPromote && promoteCutoff ? {
            ratio: myEntry.weekPoints / Math.max(1, promoteCutoff.weekPoints),
            label: t("dashboard.league.pointsToPromote", { points: pointsToPromote }),
        } : undefined,
    } : undefined

    // top-3 finishers — pointsLabel is i18n, so it's resolved here (not in the presentational half).
    const podiumEntries: Array<WeeklyBoardPodiumEntry> = (data?.entries ?? []).slice(0, 3).map((entry) => ({
        rank: entry.rank,
        username: entry.username,
        avatar: entry.avatar,
        pointsLabel: t("dashboard.league.points", { count: entry.weekPoints }),
        isMe: isMine(entry.username),
        rankDelta: entry.rankDelta,
    }))

    // rank 4+ — the runners the podium can't hold.
    const rows: Array<WeeklyBoardRowEntry> = (data?.entries ?? []).slice(3).map((entry) => {
        const mine = isMine(entry.username)
        return {
            userGlobalId: entry.userGlobalId,
            rank: entry.rank,
            mine,
            profileHref: pathConfig().locale(locale).profile(entry.username ?? undefined).build(),
            displayUsername: mine ? `${entry.username} · ${youLabel}` : (entry.username ?? ""),
            avatar: entry.avatar,
            pointsLabel: t("dashboard.league.points", { count: entry.weekPoints }),
            rankDelta: entry.rankDelta,
        }
    })

    return (
        <_WeeklyBoard
            // first load, nothing in hand → shimmer (unchanged formula, loading-and-skeleton.md)
            isSkeleton={isLoading && !data}
            // nothing to show until the viewer is placed in a cohort → funnel to courses
            isEmpty={!data || data.entries.length === 0}
            hero={hero}
            podiumEntries={podiumEntries}
            rows={rows}
            celebrateKey={celebrateKey}
            onClimb={onClimb}
            labels={{
                emptyTitle: t("dashboard.league.emptyTitle"),
                emptyDescription: t("dashboard.league.emptyDescription"),
                climbCta: t("dashboard.league.climbCta"),
                you: youLabel,
                legendPromote: t("dashboard.league.promote", { count: data?.promoteCount ?? 0 }),
                legendDemote: t("dashboard.league.demote", { count: data?.demoteCount ?? 0 }),
            }}
        />
    )
}
