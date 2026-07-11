import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Loading placeholder for the mock-interview green room's "Bạn sắp được
 * phỏng vấn" card — the only piece of {@link import("../index").MockInterview}
 * visible before `courseId`/`courseDisplayId`/the enrollment check resolve.
 * Mirrors the real card 1:1: persona avatar + name/role, the title + "N câu ·
 * mức X · ~Y phút" meta line, and the primary CTA — so resolving never
 * collapses or jumps the surface.
 */
export const MockInterviewSetupSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-surface">
                {/* persona — avatar + name/role */}
                <div className="flex items-center gap-3">
                    <Skeleton.Avatar size="lg" />
                    <div className="flex min-w-0 flex-col gap-1">
                        <Skeleton.Typography type="body" width="1/3" />
                        <Skeleton.Typography type="body-xs" width="1/4" />
                    </div>
                </div>
                {/* title + "N câu · mức X · ~Y phút" meta */}
                <div className="flex flex-col gap-1">
                    <Skeleton.Typography type="h4" width="1/2" />
                    <Skeleton.Typography type="body-sm" width="2/3" />
                </div>
                {/* primary CTA — "Vào phòng phỏng vấn" */}
                <div className="flex flex-wrap items-center gap-3">
                    <Skeleton.Button width="w-48" />
                </div>
            </div>
        </div>
    )
}
