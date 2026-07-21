import { CaretRightIcon } from "@phosphor-icons/react"

import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

/** The resolved content branch — a real list read as ONE surface card. */
export const content = (
    <SurfaceListCard>
        <SurfaceListCardRow
            title="Build a REST API"
            subtitle="Submitted · 5/5 tests"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
        <SurfaceListCardRow
            title="Authentication & authorization"
            subtitle="In progress · 0/3 tests"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
    </SurfaceListCard>
)

/**
 * A layout-mirroring skeleton so the box never collapses / jumps on resolve —
 * `SurfaceListCardItem` carries the same `p-3` + full-bleed separator as the
 * real row, so the divider is already there while loading.
 */
export const skeleton = (
    <SurfaceListCard>
        {[0, 1].map((row) => (
            <SurfaceListCardItem key={row}>
                <div className="flex items-center gap-3">
                    {/* flex-1 so the % widths resolve against a real column */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0">
                        <Skeleton.Typography type="body-sm" width="1/2" />
                        <Skeleton.Typography type="body-xs" width="1/3" />
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                    </div>
                </div>
            </SurfaceListCardItem>
        ))}
    </SurfaceListCard>
)
