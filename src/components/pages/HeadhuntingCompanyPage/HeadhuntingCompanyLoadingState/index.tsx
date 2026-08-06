"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { ConsultantCard } from "@/components/blocks/consultant/ConsultantCard"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

/** Resting tiles hand this as `onOpen` — `ConsultantCard.isSkeleton` refuses presses, so it never fires. */
const NOOP = () => {}

/**
 * Skeleton placeholder shown while the headhunting company detail loads — mirrors
 * the real page tree: a breadcrumb row, the company profile block (logo + title +
 * description), then the responsive consultants grid.
 */
export const HeadhuntingCompanyLoadingState = () => (
    <StackV gap={6} principle="block-boundary" items={[
        // breadcrumb row
        () => <Skeleton.Breadcrumbs count={3} />,

        // company profile block (logo · title · description) — mirrors @app-md:flex-row
        () => (
            <StackH gap={4} principle="content-row" at="md" align="start" items={[
                () => <Skeleton className="h-16 w-40 shrink-0 rounded-2xl" />,
                () => (
                    <StackV gap={4} principle="content-row" classNames={["flex-1"]} items={[
                        () => <Skeleton.Typography type="h3" width="1/2" />,
                        () => <Skeleton.Paragraph lines={2} />,
                    ]} />
                ),
            ]} />
        ),

        // consultants grid — the REAL tile at rest, so it cannot drift from the loaded one
        () => (
            <Grid
                columns={{ base: 1, md: 2, lg: 3 }}
                principle="group-boundary"
                items={[0, 1, 2].map((index) => ({
                    key: String(index),
                    content: () => (
                        <ConsultantCard
                            consultant={{ id: `pending-${index}`, fullName: "" }}
                            onOpen={NOOP}
                            isSkeleton
                        />
                    ),
                }))}
            />
        ),
    ]} />
)
