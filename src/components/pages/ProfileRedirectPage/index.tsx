"use client"

import React from "react"
import { Card, CardContent } from "@heroui/react"
import { ProfileHero } from "@/components/blocks/profile/ProfileHero"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Box } from "@/components/frames/Box"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link ProfileRedirectPage}. */
export type ProfileRedirectPageProps = Record<string, never>
/**
 * First-load skeleton for the public profile, shaped to MIRROR the real shell so
 * the layout never jumps on resolve.
 *
 * @param props - {@link ProfileRedirectPageProps}
 */
export const ProfileRedirectPage = () => {
    return (
        <div
            aria-busy="true"
            aria-label="Loading profile"
            className={"flex w-full flex-col"}
        >
            {/* Tab strip — retuned to row-pad (px-4 py-3) from held px-6 py-3. */}
            <Box principle="row-pad" className="w-full px-4 py-3"
                explain="Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.">
                <StackH gap={6} principle="flex-action"
                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                    items={
                        [0, 1, 2, 3, 4].map((tab) => (
                            () => <Skeleton key={tab} className="h-6 w-24 rounded-xl" />
                        ))
                    } />
            </Box>

            <Box principle="center-measure" className="mx-auto w-full max-w-6xl"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                <Box principle="page-pad" className="p-6"
                    explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                    <div data-principle="layout-split" className="flex flex-col gap-8 @app-md:flex-row @app-md:items-start">
                        <aside className="w-full @app-md:w-72 @app-md:shrink-0">
                            <ProfileHero
                                isSkeleton
                                user={{ id: "", fullName: "", handle: "", joinedAt: "" }}
                            />
                        </aside>

                        <StackV gap={6} principle="block-boundary" classNames={["min-w-0", "flex-1"]}
                            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                            items={[
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
                                                        <StackH gap={4} principle="content-row"
                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                            items={[
                                                                () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                                                () => (
                                                                    <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]}
                                                                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                                        items={[
                                                                            () => (
                                                                                <StackH gap={3} principle="flex-action" justify="between"
                                                                                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                                                                    items={[
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
                                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
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
