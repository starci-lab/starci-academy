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

export const ModalBackdrop = HeroModal.Backdrop
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

export const ModalHeader = HeroModal.Header
export const ModalBody = HeroModal.Body
export const ModalFooter = HeroModal.Footer
export const ModalCloseTrigger = HeroModal.CloseTrigger

export const meta = { tier: "atom", name: "ModalRoot" } as const

/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */
export const Modal = {
    Root: ModalRoot,
    Backdrop: ModalBackdrop,
    Container: ModalContainer,
    Dialog: ModalDialog,
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
    CloseTrigger: ModalCloseTrigger,
} as const
