import {
    Drawer, 
    DrawerContent, 
    DrawerDialog,
    DrawerBackdrop,
    DrawerHeader, 
    DrawerBody, 
    DrawerFooter,
    DrawerCloseTrigger,
    cn
} from "@heroui/react"
import type { DrawerRootProps, DrawerHeaderProps, DrawerBodyProps } from "@heroui/react"
import React from "react"

export const StarCiDrawer = (props: DrawerRootProps) => {
    return <Drawer {...props} />
}

export const StarCiDrawerContent = DrawerContent
export const StarCiDrawerDialog = DrawerDialog
export const StarCiDrawerBackdrop = DrawerBackdrop
export const StarCiDrawerHeader = (props: DrawerHeaderProps) => {
    return <DrawerHeader className="text-lg font-bold" {...props} />
}
export const StarCiDrawerBody = (props: DrawerBodyProps) => {
    return <DrawerBody {...props} className={cn(props.className)} />
}
export const StarCiDrawerFooter = DrawerFooter
export const StarCiDrawerCloseTrigger = DrawerCloseTrigger
