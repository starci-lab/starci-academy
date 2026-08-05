"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    type ReactNode,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { toast } from "@/modules/toast/toast"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryPublicUserCvSwr } from "@/hooks/swr/api/graphql/queries/useQueryPublicUserCvSwr"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { useProfileFollow } from "@/hooks/profile/useProfileFollow"
import type { ProfileTab } from "@/components/starci/blocks/navigation/ProfileTabsBar"
import { toPublicProfileUser } from "./map"
import { _PublicProfileLayout } from "./component"

/** One tab's route path, keyed by locale + the viewed user's username — mirrors the real `ProfileTabsBar`'s own `tabHref`. */
const tabHref = (locale: string, username: string, tabId: ProfileTab): string => {
    const profile = pathConfig().locale(locale).profile(username)
    switch (tabId) {
    case "overview":
        return profile.overview().build()
    case "projects":
        return profile.projects().build()
    case "challenges":
        return profile.challenges().build()
    case "skills":
        return profile.skills().build()
    case "activity":
        return profile.activity().build()
    case "cv":
        return profile.cv().build()
    }
}

/** Every profile tab, in the order the strip checks a route-prefix match — ported from the real `PROFILE_TABS` minus "overview" (the fallback). */
const ROUTABLE_TABS: ReadonlyArray<ProfileTab> = ["projects", "challenges", "skills", "cv", "activity"]

/**
 * Public-profile shell — the CONNECTED half of `_PublicProfileLayout`. Mounted by
 * `app/[locale]/profile/[username]/layout.tsx` (the wiring-in is a later step —
 * out of THIS pilot's scope, see task scope limit). Reads the target user + their
 * public CV via SWR (deduped with the rest of the page), derives `isSelf` /
 * `isLoading` / the active tab from the route, owns the follow toggle, and
 * canonicalizes `/profile/<email-or-legacy-handle>` to `/profile/<username>` —
 * all ported 1:1 from the real `PublicProfile`/`ProfileTabsBar`/`ProfileHero`
 * feature files (see their file headers).
 *
 * Next hands a route layout its nested segment as already-rendered `children`
 * (a `ReactNode`, not a component reference) — this file is the one place that
 * boundary is unavoidable. It is immediately wrapped into a zero-prop component
 * so `_PublicProfileLayout` itself only ever takes the buildable `ComponentType`
 * slot RULE 12 requires (never a raw `ReactNode` prop).
 */
export const PublicProfileLayout = ({
    children,
}: {
    children: ReactNode
}) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const routeUsername = useParams().username
    const searchParams = useSearchParams()

    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const {
        data: user,
        isLoading,
        isValidating,
    } = useQueryUserProfileSwr(username)
    const { data: publicCv } = useQueryPublicUserCvSwr(user?.username)
    const {
        following,
        isPending: isFollowPending,
        onToggle: onToggleFollow,
    } = useProfileFollow()

    // canonicalize a legacy/email-addressed link to `/profile/<username>` once the
    // profile resolves — mirrors the real `PublicProfile`'s own effect.
    useEffect(() => {
        const segment = routeUsername ? String(routeUsername) : null
        if (!segment || !user?.username || segment === user.username) {
            return
        }
        const query = searchParams.toString()
        const target = pathConfig().locale(locale).profile(user.username).build()
        router.replace(query ? `${target}?${query}` : target)
    }, [routeUsername, user?.username, locale, searchParams, router])

    // "my own profile" = the route's username IS the signed-in viewer — match by
    // USERNAME first (id namespaces between the projected profile and the redux
    // viewer can differ and falsely read as a visitor), id as fallback.
    const isSelf = !!viewer && !!user
        && ((!!viewer.username && viewer.username === user.username) || viewer.id === user.id)

    // active tab = the routable tab whose path prefixes the current pathname;
    // "overview" is the bare `/profile/<username>` path — a prefix of everything —
    // so it's only the fallback when nothing deeper matches.
    const activeTab = useMemo<ProfileTab>(() => {
        if (!user?.username) {
            return "overview"
        }
        const match = ROUTABLE_TABS.find((tabId) => {
            const href = tabHref(locale, user.username, tabId)
            return pathname === href || pathname.startsWith(`${href}/`)
        })
        return match ?? "overview"
    }, [user?.username, pathname, locale])

    const onTabChange = useCallback(
        (tab: ProfileTab) => {
            if (!user?.username) {
                return
            }
            router.push(tabHref(locale, user.username, tab))
        },
        [router, locale, user?.username],
    )

    const onEditProfile = useCallback(() => {
        router.push(pathConfig().locale(locale).profile().edit().build())
    }, [router, locale])

    const onHire = useCallback(() => {
        if (user?.githubUsername) {
            window.open(`https://github.com/${user.githubUsername}`, "_blank", "noopener,noreferrer")
        }
    }, [user?.githubUsername])

    // share this profile — native share sheet when present, clipboard-copy fallback otherwise;
    // ported from the real `ShareProfileButton`.
    const onShare = useCallback(async () => {
        if (typeof window === "undefined") {
            return
        }
        const url = window.location.href
        const title = user?.displayName?.trim() || user?.username || ""
        if (navigator.share) {
            try {
                await navigator.share({ title, url })
                return
            } catch {
                // dismissed/failed the native sheet → fall through to copy
            }
        }
        try {
            await navigator.clipboard.writeText(url)
            toast.success(t("publicProfile.share.copied"))
        } catch {
            // clipboard blocked → no-op, nothing actionable to show
        }
    }, [user?.displayName, user?.username, t])

    const onGoHome = useCallback(() => {
        router.push(pathConfig().locale(locale).home().build())
    }, [router, locale])

    const onGoCourses = useCallback(() => {
        router.push(pathConfig().locale(locale).course().build())
    }, [router, locale])

    // Next hands the nested route segment as already-rendered `children` — wrap it
    // in a zero-prop component so `_PublicProfileLayout` keeps its buildable-slot contract.
    const BodyPanel = useCallback(() => <>{children}</>, [children])

    return (
        <_PublicProfileLayout
            isLoading={isLoading || (isValidating && !user) || (authenticated && !username)}
            user={user ? toPublicProfileUser(user) : null}
            isSelf={isSelf}
            hasPublicCv={Boolean(publicCv)}
            activeTab={activeTab}
            onTabChange={onTabChange}
            following={following}
            isFollowPending={isFollowPending}
            onToggleFollow={onToggleFollow}
            onEditProfile={onEditProfile}
            onHire={onHire}
            onShare={onShare}
            onGoHome={onGoHome}
            onGoCourses={onGoCourses}
            body={BodyPanel}
        />
    )
}
