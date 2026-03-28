import {
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerBody, 
    DrawerFooter, 
    DrawerProps,
    DrawerHeaderProps,
    DrawerBodyProps,
    cn
} from "@heroui/react"
import React from "react"

export const StarCiDrawer = (props: DrawerProps) => {
    return <Drawer {...props} />
}

export const StarCiDrawerContent = DrawerContent
export const StarCiDrawerHeader = (props: DrawerHeaderProps) => {
    return <DrawerHeader className="text-lg font-bold" {...props} />
}
export const StarCiDrawerBody = (props: DrawerBodyProps) => {
    return <DrawerBody {...props} className={cn(props.className)} />
}
export const StarCiDrawerFooter = DrawerFooter