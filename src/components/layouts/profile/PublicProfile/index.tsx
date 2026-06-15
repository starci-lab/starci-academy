"use client"

import React, {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    Breadcrumbs,
    Button,
    Spinner,
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

/** Props for {@link PublicProfile}. */
export interface PublicProfileProps {
    /** Id of the user whose public profile to show. */
    userId: string
}

/**
 * Public profile of another user — avatar, name, bio, follow counts, and a
 * follow / unfollow button.
 *
 * Reads the public profile via SWR (works for anonymous viewers). The follower
 * count + follow state are seeded from the server then adjusted locally on
 * toggle so the UI feels instant. The follow button is hidden for the viewer's
 * own profile and for signed-out visitors. Mounted by `/u/[userId]`.
 *
 * @param props - {@link PublicProfileProps}
 */
export const PublicProfile = ({
    userId,
}: PublicProfileProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
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

    /** Apply a follow-state change: flip the flag + nudge the counter. */
    const onFollowChange = useCallback(
        (next: boolean) => {
            setFollowing(next)
            setFollowerCount((current) => current + (next ? 1 : -1))
        },
        [],
    )

    // viewing your own public profile → no follow button (link to edit instead)
    const isSelf = !!viewer && viewer.id === userId

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
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
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <UserAvatar
                            username={user.displayName ?? user.username}
                            avatar={user.avatar}
                            size="lg"
                            className="size-20 text-2xl"
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
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
                                userId={userId}
                                following={following}
                                onChange={onFollowChange}
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
