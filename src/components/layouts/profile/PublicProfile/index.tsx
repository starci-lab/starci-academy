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
    useParams,
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
    // target user id comes from the route segment `/profile/[userId]`
    const userId = String(useParams().userId)
    const viewer = useAppSelector((state) => state.user.user)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const {
        data: user,
        isLoading,
        error,
    } = useQueryUserProfileSwr(userId)

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
            // optimistic target = the opposite of the current state
            const next = !following
            setFollowPending(true)
            try {
                const result = await triggerSetFollow({
                    userId,
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
            userId,
            triggerSetFollow,
        ],
    )

    // viewing your own public profile → no follow button (link to edit instead)
    const isSelf = !!viewer && viewer.id === userId

    // first load → centered spinner so the column never jumps
    if (isLoading) {
        return (
            <div className={cn("mx-auto flex max-w-5xl justify-center p-12", className)}>
                <Spinner size="lg" />
            </div>
        )
    }

    // not found / soft-deleted / failed read → muted empty card
    if (!user || error) {
        return (
            <div className={cn("mx-auto max-w-5xl p-6", className)}>
                <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                    {t("publicProfile.notFound")}
                </div>
            </div>
        )
    }

    // prefer the chosen display name; fall back to the username as the title
    const hasDisplayName = Boolean(user.displayName?.trim())
    const title = hasDisplayName ? user.displayName : user.username

    return (
        <div className={cn("mx-auto flex max-w-5xl flex-col gap-6 p-6", className)}>
            {/* identity header + primary action — sits ABOVE the tab strip */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <UserAvatar
                    username={user.displayName ?? user.username}
                    avatar={user.avatar}
                    seed={user.username}
                    size="lg"
                    className="size-24 text-3xl"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="truncate text-2xl font-bold text-foreground">
                        {title}
                    </div>
                    {/* show the @handle only when it differs from the title */}
                    {hasDisplayName ? (
                        <div className="truncate text-base text-muted">
                            @{user.username}
                        </div>
                    ) : null}
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
                </div>
                {/* action: follow for signed-in visitors; edit on your own profile */}
                {authenticated && !isSelf ? (
                    <FollowButton
                        following={following}
                        isPending={isFollowPending}
                        onToggle={onToggleFollow}
                    />
                ) : null}
                {isSelf ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => router.push(pathConfig().locale(locale).profile().edit().build())}
                    >
                        {t("profileEdit.title")}
                    </Button>
                ) : null}
            </div>

            {/* tab strip (underline style) */}
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

            {/* panel — only the selected tab mounts (lazy fetch per tab) */}
            <div>
                {tab === "overview" ? (
                    user.bio?.trim() ? (
                        // bio rendered as markdown — the GitHub "About Me" README
                        <MarkdownContent markdown={user.bio} />
                    ) : (
                        <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                            {t("publicProfile.bioEmpty")}
                        </div>
                    )
                ) : null}
                {tab === "achievements" ? <ProfileAchievements /> : null}
                {tab === "activity" ? <ProfileActivity /> : null}
                {tab === "courses" ? <ProfileCourses /> : null}
            </div>
        </div>
    )
}
