"use client"

import React from "react"
import {
    useParams,
} from "next/navigation"
import {
    useQueryActiveAdvertisementSwr,
} from "@/hooks"
import {
    AdvertisementPlacement,
} from "@/modules/api"
import {
    AdBanner,
} from "@/components/layouts/shell/Dashboard/AdBanner"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Course-detail ad slot (below the enroll card). Self-contained: reads the route
 * `courseId` and fetches its own banner. The result is null server-side for
 * members and viewers enrolled in this course, so it renders nothing for them.
 */
export const CourseDetailAd = ({ className }: WithClassNames<undefined>) => {
    const params = useParams()
    const courseId = params.courseId as string | undefined
    const { data: ad } = useQueryActiveAdvertisementSwr({
        placement: AdvertisementPlacement.CourseDetail,
        courseId,
    })

    if (!ad) {
        return null
    }

    return (
        <AdBanner
            ad={ad}
            className={className}
        />
    )
}
