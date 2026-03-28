import {
    Listbox,
    ListboxSection,
    ListboxItem,
    ListboxProps,
    cn
} from "@heroui/react"
import React from "react"

export const StarCiListbox = (props: ListboxProps) => {
    return <Listbox 
        color="primary" 
        variant="flat" 
        {...props} 
        classNames={{
            list: "gap-2 p-0"
        }}
        hideSelectedIcon={true}
        selectionMode="single"
        itemClasses={{
            base: cn(
                "gap-4 px-0 py-1 data-[selected]:text-primary",
                "data-[selectable=true]:focus:bg-inherit",
                "data-[selectable=true]:hover:bg-inherit",
                props.itemClasses?.base
            )
        }}
    />
}
export const StarCiListboxSection = ListboxSection
export const StarCiListboxItem = ListboxItem

// since we cannot pass extra 