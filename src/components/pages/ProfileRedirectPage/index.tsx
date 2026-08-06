"use client"

import React from "react"
import {
    Card,
    CardContent,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { ProfileHero } from "@/components/blocks/profile/ProfileHero"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Box } from "@/components/frames/Box"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link ProfileRedirectPage}. */
export type ProfileRedirectPageProps = WithClassNames<undefined>

/**
 * First-load skeleton for the public profile, shaped to MIRROR the real shell so
 * the layout never jumps on resolve.
 *
 * @param props - {@link ProfileRedirectPageProps}
 */
export const ProfileRedirectPage = ({
    className,
}: ProfileRedirectPageProps) => {
    return (
        <div
            aria-busy="true"
            aria-label="Loading profile"
            className={cn("flex w-full flex-col", className)}
        >
            {/* Tab strip — retuned to row-pad (px-4 py-3) from held px-6 py-3. */}
            <Box principle="row-pad" className="w-full px-4 py-3">
                <StackH gap={6} principle="flex-action" items={
                    [0, 1, 2, 3, 4].map((tab) => (
                        () => <Skeleton key={tab} className="h-6 w-24 rounded-xl" />
                    ))
                } />
            </Box>

            <Box principle="center-measure" className="mx-auto w-full max-w-6xl">
                <Box principle="page-pad" className="p-6">
                    <div data-principle="layout-split" className="flex flex-col gap-8 @app-md:flex-row @app-md:items-start">
                        <aside className="w-full @app-md:w-72 @app-md:shrink-0">
                            <ProfileHero
                                isSkeleton
                                user={{ id: "", fullName: "", handle: "", joinedAt: "" }}
                            />
                        </aside>

                        <StackV gap={6} principle="block-boundary" classNames={["min-w-0", "flex-1"]} items={[
                            () => (
                                <StackV gap={4} items={[
                                    () => <Skeleton className="h-5 w-40 rounded-xl" />,
                                    () => (
                                        <StackV gap={4} items={[
                                            () => <Skeleton.Metric />,
                                            () => (
                                                <SurfaceListCard>
                                                    <SurfaceListCardItem>
                                                        <StackV gap={4} items={[
                                                            () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                            () => <Skeleton.ProgressBar />,
                                                            () => <Skeleton.ProgressBar />,
                                                        ]} />
                                                    </SurfaceListCardItem>
                                                </SurfaceListCard>
                                            ),
                                        ]} />
                                    ),
                                ]} />
                            ),
                            () => (
                                <StackV gap={4} items={[
                                    () => <Skeleton className="h-5 w-40 rounded-xl" />,
                                    () => (
                                        <SurfaceListCard>
                                            {[0, 1].map((row) => (
                                                <SurfaceListCardItem key={row}>
                                                    <StackH gap={4} principle="content-row" items={[
                                                        () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                                        () => (
                                                            <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]} items={[
                                                                () => (
                                                                    <StackH gap={3} principle="flex-action" justify="between" items={[
                                                                        () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                                        () => <Skeleton className="h-3 w-8 rounded" />,
                                                                    ]} />
                                                                ),
                                                                () => <Skeleton.ProgressBar />,
                                                            ]} />
                                                        ),
                                                    ]} />
                                                </SurfaceListCardItem>
                                            ))}
                                        </SurfaceListCard>
                                    ),
                                ]} />
                            ),
                            () => (
                                <StackV gap={4} items={[
                                    () => <Skeleton className="h-5 w-40 rounded-xl" />,
                                    () => (
                                        <StackV gap={4} items={[
                                            () => <Skeleton className="h-40 w-full rounded-xl" />,
                                            () => (
                                                <StackH gap={3} items={[
                                                    () => <Skeleton className="size-4 shrink-0 rounded-full" />,
                                                    () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                ]} />
                                            ),
                                        ]} />
                                    ),
                                ]} />
                            ),
                            () => (
                                <Grid
                                    principle="block-boundary"
                                    columns={{ base: 1, md: 2 }}
                                    items={[0, 1].map((cardIndex) => ({
                                        key: `skill-${cardIndex}`,
                                        content: () => (
                                            <StackV gap={4} items={[
                                                () => <Skeleton className="h-5 w-40 rounded-xl" />,
                                                () => (
                                                    <Card>
                                                        <CardContent>
                                                            <Skeleton.Metric />
                                                        </CardContent>
                                                    </Card>
                                                ),
                                            ]} />
                                        ),
                                    }))}
                                />
                            ),
                        ]} />
                    </div>
                </Box>
            </Box>
        </div>
    )
}
