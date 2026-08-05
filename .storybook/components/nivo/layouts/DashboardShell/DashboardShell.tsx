import type { ComponentTypeWithSkeleton, SkeletonProps } from "@sb-components/frames/_slot"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"
import { NivoTopBar, type NivoTopBarProps } from "@sb-components/nivo/blocks/navigation/NivoTopBar/NivoTopBar"
import { NivoSidebar, type NivoSidebarProps } from "@sb-components/nivo/blocks/navigation/NivoSidebar/NivoSidebar"

/**
 * `DashboardShell` — the layout every nivo dashboard route sits in. One
 * composition: `NivoTopBar` on top, then a `RailShell` with `NivoSidebar` as the
 * rail on the LEFT (`side="start"`) and the route content in the CENTER. `content`
 * is the one slot a route's shape enters; the shell itself never changes across
 * routes, so `isSkeleton` (loaded vs loading) is the only structural state.
 *
 * The rail renders correctly here — `NivoSidebar` a real 288px column instead of
 * the full-width stacked list the shell shipped with — because `RailShell` opens
 * its OWN `@container` context rather than trusting this shell's bare `<div>`
 * wrapper below to have opened one; see `RailShell`'s file header for the fix.
 * This layout does not need to open a container context itself.
 */

/** Props for {@link DashboardShell}. */
export interface DashboardShellProps {
    /** Top-bar block data (theme · notifications · account), forwarded to `NivoTopBar`. */
    topBar: NivoTopBarProps
    /** Right-rail block data (brand · items), forwarded to `NivoSidebar`. */
    sidebar: NivoSidebarProps
    /** The routed page's own content, mounted in the CENTER column. */
    content: ComponentTypeWithSkeleton
    /** Render the rail + content in their skeleton (loading) state. */
    isSkeleton?: boolean
}

/**
 * The dashboard route shell. See the file header for why the rail sits at the
 * trailing edge and why the slots are buildable components rather than nodes.
 *
 * @param props - {@link DashboardShellProps}
 */
const DashboardShell = ({ topBar, sidebar, content, isSkeleton }: DashboardShellProps) => {
    // The rail is `NivoSidebar` fed the block data + the shell's skeleton flag; it is a
    // CALLER SLOT of `RailShell`, so it stays an uncalled component the frame renders itself.
    const railSlot = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <NivoSidebar {...sidebar} isSkeleton={skeleton} />
    )

    return (
        <div data-tier="layout" data-component="DashboardShell" className="min-h-dvh">
            <NivoTopBar {...topBar} />
            <div className="mx-auto w-full max-w-7xl px-6 py-8">
                <RailShell
                    side="start"
                    isRailSticky
                    rail={railSlot}
                    body={content}
                    isSkeleton={isSkeleton}
                />
            </div>
        </div>
    )
}

export { DashboardShell }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "layout", name: "DashboardShell" } as const
