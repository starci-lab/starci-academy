"use client"

import React, {
    useEffect,
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useLocale,
} from "next-intl"
import {
    useParams,
    useRouter,
    useSearchParams,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useProfileUsername,
} from "./hooks/useProfileUsername"
import {
    ProfileHero,
} from "./ProfileHero"
import {
    ProfileTabsBar,
} from "./ProfileTabsBar"
import {
    ProfileLoadingState,
} from "./ProfileLoadingState"
import {
    ProfileNotFoundState,
} from "./ProfileNotFoundState"
import {
    ProfileLockedState,
} from "./ProfileLockedState"
import { useAppSelector } from "@/redux/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryPublicUserCvSwr } from "@/hooks/swr/api/graphql/queries/useQueryPublicUserCvSwr"
import { useRegisterNavbarBottomLayer } from "@/hooks/zustand/navbarBottomLayer/store"

/** Props for {@link PublicProfile}. */
export interface PublicProfileProps extends WithClassNames<undefined> {
    /** The active tab's panel — rendered by that tab's own route `page.tsx`. */
    children: React.ReactNode
}

/**
 * Shared shell of the public profile — viewable by anyone, signed in or not.
 * Editorial layout: a full-width tab strip pinned under the app navbar, then the
 * identity hero and a single centered content column. This is the ONLY place that
 * owns the loading / not-found / locked / main branch decision, the hero, and the
 * tabs-bar registration; each tab is a real nested route
 * (`/profile/<username>/<tab>`, bare = overview) whose own `page.tsx` renders
 * `children` — so a tab only queries when its route is actually open.
 *
 * Mounted by the `/profile/[username]` route layout (`app/[locale]/profile/
 * [username]/layout.tsx`); the target username is read from the route. The bare
 * `/profile` route (viewer's own profile) does NOT mount this shell — it only
 * ever redirects to `/profile/<username>` once the viewer hydrates, so it renders
 * a plain {@link ProfileLoadingState} meanwhile instead.
 *
 * @param props - {@link PublicProfileProps}
 */
export const PublicProfile = ({
    className,
    children,
}: PublicProfileProps) => {
    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const {
        data: user,
        isLoading,
        isValidating,
        error,
    } = useQueryUserProfileSwr(username)

    // canonicalize the URL to `/profile/<username>` — a legacy/email-addressed
    // link (e.g. `/profile/<email>`) still resolves on the backend, but once the
    // user loads we replace the URL with their real username (GitHub-style), so
    // the address bar never lingers on an email or any non-canonical handle.
    const router = useRouter()
    const locale = useLocale()
    const routeUsername = useParams().username
    const searchParams = useSearchParams()
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
    // USERNAME (the route is username-keyed; viewer.id vs the projected profile id
    // can live in different namespaces and falsely read as a visitor). id kept as a
    // fallback. (thầy 2026-07-18: "username = current me thì coi như trang mình".)
    const isSelf = !!viewer && !!user
        && ((!!viewer.username && viewer.username === user.username) || viewer.id === user.id)
    // the CV tab shows for visitors only when the user has a PUBLIC CV (the owner
    // always sees it) — drives the tab gate + its href in ProfileTabsBar.
    const { data: publicCv } = useQueryPublicUserCvSwr(user?.username)
    // locked profile viewed by a non-owner → hero + "private" notice, tabs withheld
    const isLocked = Boolean(user?.profileLocked) && !isSelf
    // the profile tab strip renders as the global Navbar's bottom layer, but only
    // when the main profile actually shows (not on loading / not-found / locked).
    const showTabs = !isLoading && !(authenticated && !username) && Boolean(user) && !error && !isLocked
    const tabsNode = useMemo(
        () => (user ? (
            <ProfileTabsBar
                username={user.username}
                isSelf={isSelf}
                hasPublicCv={Boolean(publicCv)}
                sectionVisibility={user.sectionVisibility}
            />
        ) : null),
        [user, isSelf, publicCv],
    )
    useRegisterNavbarBottomLayer(showTabs ? tabsNode : null)

    // first load → skeleton so the column never jumps. On the bare `/profile` the
    // username is null until the signed-in user hydrates — treat that as loading.
    // Also hold the skeleton while the read is STILL in flight with no user yet —
    // incl. SWR's retry after a transient error (e.g. a 401 before the token is
    // attached on a cold load). Otherwise the not-found flashes for the retry
    // window before the profile actually resolves.
    if (isLoading || (isValidating && !user) || (authenticated && !username)) {
        return <ProfileLoadingState className={className} />
    }

    // SETTLED with no user (query done, not validating) → a proper 404-style page.
    // `error` no longer forces this on its own: a transient error is still
    // validating above; only a definitively-empty read (or an error that has
    // stopped retrying) lands here.
    if (!user) {
        return <ProfileNotFoundState className={className} />
    }

    if (isLocked) {
        return <ProfileLockedState className={className} />
    }

    return (
        <div className={cn("flex w-full flex-col", className)}>
            {/* the profile tab strip is registered as the Navbar's bottom layer
                above (useRegisterNavbarBottomLayer), so it is NOT rendered here. */}

            {/* starci-concept: flex 2-col — left identity BARE, right content cards */}
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-6 @app-md:flex-row @app-md:items-start">
                {/* left: identity column, bare (no card) — scrolls with the page (not sticky) */}
                <aside className="flex w-full flex-col gap-4 @app-md:w-72 @app-md:shrink-0">
                    <ProfileHero />
                </aside>

                {/* right: the active tab's panel, rendered by its own route */}
                <main className="flex min-w-0 flex-1 flex-col gap-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
