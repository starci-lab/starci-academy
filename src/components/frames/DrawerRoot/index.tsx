import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

/**
 * Identity root for a drawer overlay: emits `data-tier="drawer"` and the caller's
 * `data-component` so every drawer shares one root instead of a raw identity div.
 * It arranges nothing and carries no spacing -- pure identity, so it declares no
 * `principle`.
 */
export interface DrawerRootProps {
    /** The drawer's `data-component` name -- supplied by the caller, e.g. `"SubmissionAttemptsDrawer"`. */
    "data-component": string
    /** Single buildable region mounted inside the identity root. */
    body: ComponentTypeWithSkeleton
    /** When true, the body renders in its skeleton state. */
    isSkeleton?: boolean
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "DrawerRoot" } as const

/**
 * Identity root for a drawer overlay: emits `data-tier="drawer"` and the caller's
 * `data-component` so every drawer shares one root instead of a raw identity div.
 */
export const DrawerRoot = ({
    "data-component": dataComponent,
    body: Body,
    isSkeleton,
}: DrawerRootProps) => (
    <div data-tier="drawer" data-component={dataComponent}>
        <Body isSkeleton={isSkeleton} />
    </div>
)
