"use client"

import React, {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    Breadcrumbs,
    Button,
    cn,
    Spinner,
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
    SubPageHeader,
    UserAvatar,
} from "@/components/reuseable"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link PublicProfile}. */
export type PublicProfileProps = WithClassNames<undefined>

/**
 * Public profile of another user — avatar, name, bio, follow counts, and a
 * follow / unfollow button.
 *
 * Reads the public profile via SWR (works for anonymous viewers). The follower
 * count + follow state are seeded from the server then adjusted locally on
 * toggle so the UI feels instant. The follow button is hidden for the viewer's
 * own profile and for signed-out visitors. Mounted by `/u/[userId]`; the target
 * user id is read from the route via `useParams`.
 *
 * @param props - {@link PublicProfileProps}
 */
export const PublicProfile = ({
    className,
}: PublicProfileProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    // target user id comes from the route segment `/u/[userId]`
    const userId = String(useParams().userId)
    const viewer = useAppSelector((state) => state.user.user)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const {
        data: user,
        isLoading,
        error,
    } = useQueryUserProfileSwr(userId)

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

    /** Navigate to the home page (breadcrumb root + back target). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale(locale).build()),
        [
            router,
            locale,
        ],
    )

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

    return (
        <div className={cn("mx-auto flex max-w-3xl flex-col gap-6 p-6", className)}>
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("publicProfile.title")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <SubPageHeader
                title={t("publicProfile.title")}
                onBack={onNavigateHome}
            />

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Spinner size="lg" />
                </div>
            ) : !user || error ? (
                <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                    {t("publicProfile.notFound")}
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            username={user.displayName ?? user.username}
                            avatar={user.avatar}
                            size="lg"
                            className="size-20 text-2xl"
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <div className="truncate text-2xl font-bold text-foreground">
                                {user.displayName?.trim() ? user.displayName : user.username}
                            </div>
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
                        {/* follow button: only for signed-in visitors viewing someone else */}
                        {authenticated && !isSelf ? (
                            <FollowButton
                                following={following}
                                isPending={isFollowPending}
                                onToggle={onToggleFollow}
                            />
                        ) : null}
                        {/* own profile → quick link to edit */}
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
                    {user.bio?.trim() ? (
                        <div className="whitespace-pre-wrap break-words text-sm text-foreground">{user.bio}</div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
