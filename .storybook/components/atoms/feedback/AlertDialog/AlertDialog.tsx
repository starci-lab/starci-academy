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

/** House alert dialog backdrop over HeroUI `AlertDialog.Backdrop`. */
export const AlertDialogBackdrop = HeroAlertDialog.Backdrop
/** House alert dialog container over HeroUI `AlertDialog.Container`. */
export const AlertDialogContainer = HeroAlertDialog.Container
/** House alert dialog dialog over HeroUI `AlertDialog.Dialog`. */
export const AlertDialogDialog = HeroAlertDialog.Dialog
/** House alert dialog header over HeroUI `AlertDialog.Header`. */
export const AlertDialogHeader = HeroAlertDialog.Header
/** House alert dialog heading over HeroUI `AlertDialog.Heading`. */
export const AlertDialogHeading = HeroAlertDialog.Heading
/** House alert dialog body over HeroUI `AlertDialog.Body`. */
export const AlertDialogBody = HeroAlertDialog.Body
/** House alert dialog footer over HeroUI `AlertDialog.Footer`. */
export const AlertDialogFooter = HeroAlertDialog.Footer

/** Tier metadata for `AlertDialogRoot`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "AlertDialogRoot" } as const
