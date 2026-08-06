/** @noSkeleton panel chrome — content is handed in by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { cn, Drawer as HeroDrawer } from "@heroui/react"

/** Props for {@link DrawerRoot}. */
export type DrawerRootProps = ComponentProps<typeof HeroDrawer> & {
    /** Panel compound tree. */
    children?: ReactNode
}

/** House drawer root over HeroUI `Drawer`. */
export const DrawerRoot = (props: DrawerRootProps) => (
    <HeroDrawer data-tier="atom" data-component="DrawerRoot" {...props} />
)

export const DrawerBackdrop = HeroDrawer.Backdrop
export const DrawerContent = HeroDrawer.Content

/** Props for {@link DrawerDialog}. */
export type DrawerDialogProps = ComponentProps<typeof HeroDrawer.Dialog>

/**
 * Panel pane — owns the header/body/footer seam (`gap-3`) so callers never paint
 * that rhythm through `className`.
 */
export const DrawerDialog = ({ className, ...props }: DrawerDialogProps) => (
    <HeroDrawer.Dialog
        data-tier="atom"
        data-component="DrawerDialog"
        className={cn("gap-3", className)}
        {...props}
    />
)

export const DrawerHeader = HeroDrawer.Header
export const DrawerBody = HeroDrawer.Body
export const DrawerFooter = HeroDrawer.Footer
export const DrawerCloseTrigger = HeroDrawer.CloseTrigger

export const meta = { tier: "atom", name: "DrawerRoot" } as const

/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */
export const Drawer = {
    Root: DrawerRoot,
    Backdrop: DrawerBackdrop,
    Content: DrawerContent,
    Dialog: DrawerDialog,
    Header: DrawerHeader,
    Body: DrawerBody,
    Footer: DrawerFooter,
    CloseTrigger: DrawerCloseTrigger,
} as const
