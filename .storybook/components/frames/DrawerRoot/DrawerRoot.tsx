import type { ReactNode } from "react"

/** Bare identity root — emits `data-tier="drawer"` + the caller's `data-component`. */
export interface DrawerRootProps {
    /** The drawer's `data-component` name — supplied by the caller, e.g. `"SubmissionAttemptsDrawer"`. */
    "data-component": string
    /** Optional passthrough classes for the identity root. */
    className?: string
    children?: ReactNode
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "DrawerRoot" } as const

export const DrawerRoot = ({ "data-component": dataComponent, className, children }: DrawerRootProps) => (
    <div data-tier="drawer" data-component={dataComponent} className={className}>
        {children}
    </div>
)
