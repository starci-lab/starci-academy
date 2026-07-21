"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { ConsultantCardSkeleton } from "../../Headhuntings/ConsultantCardSkeleton"

/**
 * Skeleton placeholder shown while the headhunting company detail loads — mirrors
 * the real page tree: a breadcrumb row, the company profile block (logo + title +
 * description), then the responsive consultants grid.
 */
export const HeadhuntingCompanyLoadingState = () => (
    <div className="flex flex-col gap-6">
        {/* breadcrumb row */}
        <Skeleton.Breadcrumbs count={3} />

        {/* company profile block (logo · title · description) — mirrors @app-md:flex-row */}
        <div className="flex flex-col gap-3 @app-md:flex-row @app-md:items-start">
            <Skeleton className="h-16 w-40 shrink-0 rounded-2xl" />
            <div className="flex flex-1 flex-col gap-3">
                <Skeleton.Typography type="h3" width="1/2" />
                <Skeleton.Paragraph lines={2} />
            </div>
        </div>

        {/* consultants grid — one skeleton card per column */}
        <div className="grid gap-4 @app-md:grid-cols-2 @app-lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
                <ConsultantCardSkeleton key={index} />
            ))}
        </div>
    </div>
)
