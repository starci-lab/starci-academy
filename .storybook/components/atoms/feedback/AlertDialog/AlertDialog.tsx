/** @noSkeleton blocking dialog chrome — copy is handed in by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { AlertDialog as HeroAlertDialog } from "@heroui/react"

/** Props for {@link AlertDialogRoot}. */
export type AlertDialogRootProps = ComponentProps<typeof HeroAlertDialog> & {
    /** Dialog compound tree. */
    children?: ReactNode
}

/** House alert dialog root over HeroUI `AlertDialog`. */
export const AlertDialogRoot = (props: AlertDialogRootProps) => (
    <HeroAlertDialog data-tier="atom" data-component="AlertDialogRoot" {...props} />
)

export const AlertDialogBackdrop = HeroAlertDialog.Backdrop
export const AlertDialogContainer = HeroAlertDialog.Container
export const AlertDialogDialog = HeroAlertDialog.Dialog
export const AlertDialogHeader = HeroAlertDialog.Header
export const AlertDialogHeading = HeroAlertDialog.Heading
export const AlertDialogBody = HeroAlertDialog.Body
export const AlertDialogFooter = HeroAlertDialog.Footer

export const meta = { tier: "atom", name: "AlertDialogRoot" } as const
