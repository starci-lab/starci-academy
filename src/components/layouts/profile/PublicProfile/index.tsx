"use client"

import React, {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    Button,
    cn,
    Spinner,
    Tabs,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useAppSelector,
} from "@/redux"
import {
    useMutateSetFollowSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    useProfileUsername,
} from "./useProfileUsername"
import {
    pathConfig,
} from "@/resources"
import {
    FollowButton,
    MarkdownContent,
    UserAvatar,
} from "@/components/reuseable"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    ProfileAchievements,
} from "./ProfileAchievements"
import {
    ProfileActivity,
} from "./ProfileActivity"
import {
    ProfileCourses,
} from "./ProfileCourses"
import {
    ProfileContributions,
} from "./ProfileContributions"

/** Props for {@link PublicProfile}. */
export type PublicProfileProps = WithClassNames<undefined>

/** The four profile tabs (drives the panel switch). */
type ProfileTab = "overview" | "achievements" | "activity" | "courses"

/** Tabs rendered in order, left to right (id + i18n label key suffix). */
const PROFILE_TABS: ReadonlyArray<ProfileTab> = [
    "overview",
    "achievements",
    "activity",
    "courses",
]

/**
 * GitHub-style public profile of any user — viewable by anyone, signed in or not.
 * An identity header (avatar + name + follow counts) with the primary action
 * (follow / unfollow, or "edit" on your own profile) sits **above** a tab strip;
 * the tabs are Overview (bio rendered as markdown, like a GitHub README),
 * Achievements, Activity, and Courses. Each tab is its own self-fetching
 * container, so a tab only queries when first opened.
 *
 * The follower count + follow state are seeded from the server then nudged
 * locally on toggle so the action feels instant. Mounted by `/profile/[userId]`;
 * the target user id is read from the route via `useParams`.
 *
 * @param props - {@link PublicProfileProps}
 */
export const PublicProfile = ({
    className,
}: PublicProfileProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    // target username: the `/profile/[username]` segment, or — on the bare
    // `/profile` — the signed-in user's own username (one layout for self + others)
    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const {
        data: user,
        isLoading,
        error,
    } = useQueryUserProfileSwr(username)
    // entity id resolved from the username — what follow + isSelf key off
    const targetUserId = user?.id ?? null

    // which tab is open (Overview by default); panels mount lazily on select
    const [tab, setTab] = useState<ProfileTab>("overview")

    // local mirror of the follow state + count so toggles feel instant
    const [following, setFollowing] = useState(false)
    const [followerCount, setFollowerCount] = useState(0)
    // owns the follow mutation; FollowButton is presentational
    const { trigger: triggerSetFollow } = useMutateSetFollowSwr()
    const [isFollowPending, setFollowPending] = useState(false)

    // seed the local mirror whenever the fetched profile changes
    useEffect(() => {
        if (user) {
            setFollowing(Boolean(user.isFollowedByMe))
            setFollowerCount(user.followerCount ?? 0)
        }
    }, [
        user,
    ])

    /** Run the follow toggle, then flip the flag + nudge the counter on success. */
    const onToggleFollow = useCallback(
        async () => {
            // follow edges key off the entity id; bail until the profile resolved
            if (!targetUserId) {
                return
            }
            // optimistic target = the opposite of the current state
            const next = !following
            setFollowPending(true)
            try {
                const result = await triggerSetFollow({
                    userId: targetUserId,
                    follow: next,
                })
                // only commit when the server confirms
                if (result?.data?.setFollow?.success) {
                    setFollowing(next)
                    setFollowerCount((current) => current + (next ? 1 : -1))
                }
            } finally {
                setFollowPending(false)
            }
        },
        [
            following,
            targetUserId,
            triggerSetFollow,
        ],
    )

    // viewing your own public profile → no follow button (link to edit instead)
    const isSelf = !!viewer && !!targetUserId && viewer.id === targetUserId

    // first load → centered spinner so the column never jumps. On the bare
    // `/profile` the username is null until the signed-in user hydrates — treat
    // that as loading too (avoids a not-found flash before redux settles)
    if (isLoading || (authenticated && !username)) {
        return (
            <div className={cn("mx-auto flex max-w-6xl justify-center p-12", className)}>
                <Spinner size="lg" />
            </div>
        )
    }

    // not found / soft-deleted / failed read → a proper 404-style page
    if (!user || error) {
        return (
            <div className={cn("mx-auto flex max-w-5xl flex-col items-center gap-6 p-6 py-24 text-center", className)}>
                <div className="text-7xl font-bold leading-none text-default-300">
                    404
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="text-xl font-semibold text-foreground">
                        {t("publicProfile.notFound")}
                    </div>
                    <div className="text-sm text-muted">
                        {t("publicProfile.notFoundDescription")}
                    </div>
                </div>
                <Button
                    variant="primary"
                    onPress={() => router.push(pathConfig().locale(locale).build())}
                >
                    {t("nav.home")}
                </Button>
            </div>
        )
    }

    // prefer the chosen display name; fall back to the username as the title
    const hasDisplayName = Boolean(user.displayName?.trim())
    const title = hasDisplayName ? user.displayName : user.username

    return (
        <div className={cn("mx-auto flex max-w-6xl flex-col gap-6 p-6", className)}>
            {/* full-width tab strip at the top (GitHub-style) */}
            <Tabs
                selectedKey={tab}
                variant="secondary"
                onSelectionChange={(key) => setTab(String(key) as ProfileTab)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("publicProfile.title")}>
                        {PROFILE_TABS.map((tabId) => (
                            <Tabs.Tab
                                key={tabId}
                                id={tabId}
                                className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                            >
                                {t(`publicProfile.tabs.${tabId}`)}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            {/* below the tabs: identity sidebar (left) + tab content (right) */}
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
                {/* sidebar — persistent identity + primary action (sticky on desktop) */}
                <aside className="flex w-full flex-col gap-3 md:sticky md:top-6 md:w-64 md:shrink-0">
                    <UserAvatar
                        username={user.displayName ?? user.username}
                        avatar={user.avatar}
                        seed={user.username}
                        size="lg"
                        className="size-32 text-5xl"
                    />
                    <div className="flex flex-col gap-0">
                        <div className="truncate text-2xl font-bold text-foreground">
                            {title}
                        </div>
                        {/* show the @handle only when it differs from the title */}
                        {hasDisplayName ? (
                            <div className="truncate text-base text-muted">
                                @{user.username}
                            </div>
                        ) : null}
                    </div>
                    {/* action (full-width under the identity): follow others, edit self */}
                    {authenticated && !isSelf ? (
                        <FollowButton
                            following={following}
                            isPending={isFollowPending}
                            onToggle={onToggleFollow}
                            className="w-full"
                        />
                    ) : null}
                    {isSelf ? (
                        <Button
                            variant="secondary"
                            className="w-full"
                            onPress={() => router.push(pathConfig().locale(locale).profile().edit().build())}
                        >
                            {t("profileEdit.title")}
                        </Button>
                    ) : null}
                    {/* follower / following counts */}
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-foreground">
                            <span className="font-semibold">{followerCount}</span>
                            <span className="ml-1 text-muted">{t("profile.followers")}</span>
                        </span>
                        <span className="text-foreground">
                            <span className="font-semibold">{user.followingCount ?? 0}</span>
                            <span className="ml-1 text-muted">{t("profile.following")}</span>
                        </span>
                    </div>
                </aside>

                {/* main — selected tab content (only the open tab mounts → lazy fetch) */}
                <main className="flex min-w-0 flex-1 flex-col gap-6">
                    {tab === "overview" ? (
                        <>
                            {/* README-style bio card (markdown) */}
                            <div className="rounded-large border border-default/40 p-5">
                                <div className="mb-3 text-xs text-muted">
                                    {t("publicProfile.bioHeading")}
                                </div>
                                {user.bio?.trim() ? (
                                    <MarkdownContent markdown={user.bio} />
                                ) : (
                                    <div className="text-sm text-muted">
                                        {t("publicProfile.bioEmpty")}
                                    </div>
                                )}
                            </div>
                            {/* contribution heatmap card (public, per user) */}
                            <div className="rounded-large border border-default/40">
                                <ProfileContributions />
                            </div>
                        </>
                    ) : null}
                    {tab === "achievements" ? <ProfileAchievements /> : null}
                    {tab === "activity" ? <ProfileActivity /> : null}
                    {tab === "courses" ? <ProfileCourses /> : null}
                </main>
            </div>
        </div>
    )
}
