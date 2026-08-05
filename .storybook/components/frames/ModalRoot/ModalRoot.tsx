import type { ReactNode } from "react"

/**
 * `ModalRoot` -- the identity root of a modal-tier component. It emits
 * `data-tier="modal"` and the caller's `data-component`, the modal-side twin of
 * `DrawerRoot`: a frame standing in for the modal's own root element so the raw
 * identity `<div>` is written ONCE here rather than in every modal.
 */
export interface ModalRootProps {
    /** The modal's `data-component` name -- supplied by the caller, e.g. `"PremiumGateModal"`. */
    "data-component": string
    /** Optional passthrough classes for the identity root. */
    className?: string
    children?: ReactNode
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "ModalRoot" } as const

/**
 * Identity root for a modal overlay: emits `data-tier="modal"` and the caller's
 * `data-component`, the modal-side twin of `DrawerRoot`.
 */
export const ModalRoot = ({ "data-component": dataComponent, className, children }: ModalRootProps) => (
    <div data-tier="modal" data-component={dataComponent} className={className}>
        {children}
    </div>
)
