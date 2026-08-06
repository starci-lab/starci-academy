/** @noSkeleton dialog chrome — content is handed in by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { cn, Modal as HeroModal } from "@heroui/react"

/** Props for {@link ModalRoot}. */
export type ModalRootProps = ComponentProps<typeof HeroModal> & {
    /** Dialog compound tree. */
    children?: ReactNode
}

/** House modal root over HeroUI `Modal`. */
export const ModalRoot = (props: ModalRootProps) => (
    <HeroModal data-tier="atom" data-component="ModalRoot" {...props} />
)

/** House backdrop over HeroUI `Modal.Backdrop`. */
export const ModalBackdrop = HeroModal.Backdrop
/** House container over HeroUI `Modal.Container`. */
export const ModalContainer = HeroModal.Container

/** Props for {@link ModalDialog}. */
export type ModalDialogProps = ComponentProps<typeof HeroModal.Dialog>

/**
 * Dialog pane — owns the header/body/footer seam (`gap-3`) so callers never paint
 * that rhythm through `className`.
 */
export const ModalDialog = ({ className, ...props }: ModalDialogProps) => (
    <HeroModal.Dialog
        data-tier="atom"
        data-component="ModalDialog"
        className={cn("gap-3", className)}
        {...props}
    />
)

/** House header over HeroUI `Modal.Header`. */
export const ModalHeader = HeroModal.Header
/** House body over HeroUI `Modal.Body`. */
export const ModalBody = HeroModal.Body
/** House footer over HeroUI `Modal.Footer`. */
export const ModalFooter = HeroModal.Footer
/** House close trigger over HeroUI `Modal.CloseTrigger`. */
export const ModalCloseTrigger = HeroModal.CloseTrigger

/** Tier metadata for `ModalRoot`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "ModalRoot" } as const
