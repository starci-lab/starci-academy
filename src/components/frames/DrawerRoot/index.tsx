import type { ReactNode } from "react"

/**
 * `DrawerRoot` — the identity root of a drawer-tier component. It emits
 * `data-tier="drawer"` and the caller's `data-component`, the same way
 * `ResponsiveCluster` emits a caller-supplied identity: a frame standing in for a
 * higher tier's own root element, so the raw identity `<div>` is written ONCE here
 * instead of copy-pasted into every drawer.
 *
 * FRAME, not atom: it takes its name FROM THE CALLER (the frame rule — an atom
 * hard-codes its own). `Box` cannot stand in, because `Box` hard-codes
 * `data-tier="frame"`; a drawer's identity root must emit `data-tier="drawer"`.
 * It arranges nothing and carries no spacing — pure identity, so it declares no
 * `principles`.
 */
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
