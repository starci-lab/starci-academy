import type { ReactNode } from "react"

/**
 * `ModalRoot` — the identity root of a modal-tier component. It emits
 * `data-tier="modal"` and the caller's `data-component`, the drawer-side twin of
 * {@link DrawerRoot}: a frame standing in for the modal's own root element so the
 * raw identity `<div>` is written ONCE here rather than in every modal.
 *
 * FRAME, not atom: it takes its name FROM THE CALLER (an atom hard-codes its own),
 * and `Box` cannot stand in because it hard-codes `data-tier="frame"`. It arranges
 * nothing — pure identity, no `principles`.
 */
export interface ModalRootProps {
    /** The modal's `data-component` name — supplied by the caller, e.g. `"PremiumGateModal"`. */
    "data-component": string
    /** Optional passthrough classes for the identity root. */
    className?: string
    children?: ReactNode
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "ModalRoot" } as const

export const ModalRoot = ({ "data-component": dataComponent, className, children }: ModalRootProps) => (
    <div data-tier="modal" data-component={dataComponent} className={className}>
        {children}
    </div>
)
