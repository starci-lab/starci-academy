"use client"

import React from "react"
import { Link } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    PencilIcon,
} from "@phosphor-icons/react"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { PinnedProjectCard } from "./PinnedProjectCard"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { usePinnedProjectsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryUserPinnedProjectsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserPinnedProjectsSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

const ProfilePinnedAction = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Link
        onPress={onPress}
        className="inline-flex shrink-0 cursor-pointer items-center text-sm text-accent-soft-foreground no-underline transition-opacity hover:opacity-60"
    >
        <StackH gap={2} principle="icon-text" inline items={[
            () => <PencilIcon className="size-4" aria-hidden="true" focusable="false" />,
            () => <span>{label}</span>,
        ]} />
    </Link>
)

/** Props for {@link ProfilePinned}. */
export type ProfilePinnedProps = WithClassNames<undefined>

/**
 * Pinned projects card on the public profile — the user's hand-picked showcase
 * (verified course capstones + free-form external projects), GitHub-pinned-repos
 * style. Self-contained container: resolves the viewed user from the route, fetches
 * their pins via SWR, and renders one {@link PinnedProjectCard} per pin (verified
 * course pins get a "Verified by StarCi" chip; external pins link out).
 *
 * Owner-only: when the signed-in viewer owns this profile an "Add / manage"
 * action opens the manage modal (zustand overlay). Renders the empty state for
 * the owner (with an add CTA) but nothing at all for visitors with no pins, so a
 * stranger's profile stays clean.
 *
 * @param props - {@link ProfilePinnedProps}
 */
export const ProfilePinned = ({
    className,
}: ProfilePinnedProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
        error,
        mutate,
    } = useQueryUserPinnedProjectsSwr(userId)
    // manage modal (owner only) — open-state lives in the shared zustand overlay
    const { open: openManage } = usePinnedProjectsOverlayState()

    // viewing your own profile → show the add/manage affordance + owner empty state
    const isSelf = !!viewer && !!userId && viewer.id === userId
    const pins = data ?? []

    // visitor viewing a profile with no pins and nothing loading/erroring → hide the
    // whole section (clean profile). Owners always keep the card (header + add CTA).
    if (!isSelf && !isLoading && !error && pins.length === 0) {
        return null
    }

    // frameless ONLY once real pins render (each PinnedProjectCard self-frames);
    // while loading/empty(owner CTA)/erroring there is no bounded surface, so
    // LabeledCard's own Card must frame it — otherwise it renders bare on the page.
    const hasPins = !error && pins.length > 0

    return (
        <LabeledCard
            frameless={hasPins}
            label={t("pinnedProjects.heading")}
            action={isSelf && pins.length > 0
                ? () => <ProfilePinnedAction label={t("pinnedProjects.manage")} onPress={openManage} />
                : undefined}
            className={className}
        >
            <AsyncContent
                isLoading={isLoading && !data}
                skeleton={(
                    <Grid
                        principle="content-row"
                        columns={{ base: 1, sm: 2 }}
                        items={[0, 1, 2, 3].map((index) => ({
                            key: `pin-skel-${index}`,
                            content: () => (
                                <Box principle="card-padding" className="rounded-2xl border border-default bg-surface p-4">
                                    <StackV gap={3} principle="sibling-stack" items={[
                                        () => (
                                            <StackH gap={3} principle="flex-action" justify="between" items={[
                                                () => <Skeleton.Chip />,
                                                () => <Skeleton className="size-4 shrink-0 rounded" />,
                                            ]} />
                                        ),
                                        () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                        () => <Skeleton.Typography type="body-xs" width="1/2" />,
                                        () => (
                                            <Cluster gap={3} principle="chip-row" items={
                                                [0, 1, 2].map((chip) => (
                                                    () => <Skeleton.Chip key={chip} />
                                                ))
                                            } />
                                        ),
                                    ]} />
                                </Box>
                            ),
                        }))}
                    />
                )}
                isEmpty={pins.length === 0}
                // owner sees an add CTA; a visitor sees nothing (clean profile)
                emptyContent={isSelf ? {
                    title: t("pinnedProjects.emptyOwnerTitle"),
                    description: t("pinnedProjects.emptyOwnerDescription"),
                    onRetry: openManage,
                    retryLabel: t("pinnedProjects.add"),
                } : undefined}
                error={error}
                errorContent={{
                    title: t("pinnedProjects.errorTitle"),
                    description: t("pinnedProjects.errorDescription"),
                    onRetry: () => mutate(),
                    retryLabel: t("pinnedProjects.retry"),
                }}
            >
                <Grid
                    principle="content-row"
                    columns={{ base: 1, sm: 2 }}
                    items={pins.map((pin) => ({
                        key: pin.id,
                        content: () => <PinnedProjectCard pin={pin} />,
                    }))}
                />
            </AsyncContent>
        </LabeledCard>
    )
}
