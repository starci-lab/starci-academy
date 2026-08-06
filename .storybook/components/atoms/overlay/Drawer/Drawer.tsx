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

/** House backdrop over HeroUI `Drawer.Backdrop`. */
export const DrawerBackdrop = HeroDrawer.Backdrop
/** House content over HeroUI `Drawer.Content`. */
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

/** House header over HeroUI `Drawer.Header`. */
export const DrawerHeader = HeroDrawer.Header
/** House body over HeroUI `Drawer.Body`. */
export const DrawerBody = HeroDrawer.Body
/** House footer over HeroUI `Drawer.Footer`. */
export const DrawerFooter = HeroDrawer.Footer
/** House close trigger over HeroUI `Drawer.CloseTrigger`. */
export const DrawerCloseTrigger = HeroDrawer.CloseTrigger

/** Tier metadata for `DrawerRoot`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "DrawerRoot" } as const
