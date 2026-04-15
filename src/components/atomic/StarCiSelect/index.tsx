import { Select, ListBoxItem } from "@heroui/react"
import type { SelectRootProps } from "@heroui/react"
import React from "react"

export const StarCiSelect = <T extends object = object>(props: SelectRootProps<T>) => {
    return <Select {...props} />
}
export const StarCiSelectItem = ListBoxItem
