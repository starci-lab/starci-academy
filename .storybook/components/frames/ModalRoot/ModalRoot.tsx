import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * Identity root for a modal overlay: emits `data-tier="modal"` and the caller's
 * `data-component`, the modal-side twin of `DrawerRoot`. It arranges nothing and
 * carries no spacing -- pure identity, so it declares no `principles`.
 */
export interface ModalRootProps {
    /** The modal's `data-component` name -- supplied by the caller, e.g. `"PremiumGateModal"`. */
    "data-component": string
    /**
     * Caller-supplied part name for the Storybook anatomy overlay. Emitted as
     * `data-anat-part`. The frame never names itself.
     */
    anatPart?: string
    /** Single buildable region mounted inside the identity root. */
    body: ComponentTypeWithSkeleton
    /** When true, the body renders in its skeleton state. */
    isSkeleton?: boolean
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "ModalRoot" } as const

/**
 * Identity root for a modal overlay: emits `data-tier="modal"` and the caller's
 * `data-component`, the modal-side twin of `DrawerRoot`.
 */
export const ModalRoot = ({
    "data-component": dataComponent,
    anatPart,
    body: Body,
    isSkeleton,
}: ModalRootProps) => (
    <div data-tier="modal" data-component={dataComponent} data-anat-part={anatPart}>
        <Body isSkeleton={isSkeleton} />
    </div>
)
