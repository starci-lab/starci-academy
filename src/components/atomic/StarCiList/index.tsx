import {
    ListBox,
    ListBoxSection,
    ListBoxItem,
    cn
} from "@heroui/react"
import type { ListBoxRootProps } from "@heroui/react"
import React from "react"

export const StarCiListbox = <T extends object = object>(props: ListBoxRootProps<T>) => {
    return <ListBox 
        {...props} 
        selectionMode="single"
    />
}
export const StarCiListboxSection = ListBoxSection
export const StarCiListboxItem = ListBoxItem
