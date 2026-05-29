"use client"

import React from "react"
import { Skeleton } from "@heroui/react"

/**
 * Skeleton placeholder shown while the headhunting companies list loads.
 */
export const HeadhuntingCompanyLoadingState = () => (
    <div className="p-3">
        <Skeleton className="mb-4 h-8 w-2/3 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-xl" />
    </div>
)
