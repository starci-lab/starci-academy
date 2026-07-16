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

    const isSelf = !!viewer && !!user?.id && viewer.id === user.id
    // locked profile viewed by a non-owner → hero + "private" notice, tabs withheld
    const isLocked = Boolean(user?.profileLocked) && !isSelf
    // the profile tab strip renders as the global Navbar's bottom layer, but only
    // when the main profile actually shows (not on loading / not-found / locked).
    const showTabs = !isLoading && !(authenticated && !username) && Boolean(user) && !error && !isLocked
    const tabsNode = useMemo(
        () => (user ? <ProfileTabsBar username={user.username} isSelf={isSelf} /> : null),
        [user, isSelf],
    )
    useRegisterNavbarBottomLayer(showTabs ? tabsNode : null)

    // first load → skeleton so the column never jumps. On the bare `/profile` the
    // username is null until the signed-in user hydrates — treat that as loading.
    if (isLoading || (authenticated && !username)) {
        return <ProfileLoadingState className={className} />
    }

    // not found / soft-deleted / failed read → a proper 404-style page
    if (!user || error) {
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
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-6 md:flex-row md:items-start">
                {/* left: identity column, bare (no card) — scrolls with the page (not sticky) */}
                <aside className="flex w-full flex-col gap-4 md:w-72 md:shrink-0">
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
