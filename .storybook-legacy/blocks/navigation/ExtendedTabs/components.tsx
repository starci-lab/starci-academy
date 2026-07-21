import { useState } from "react"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import type { ExtendedTabsProps } from "@/components/blocks/navigation/ExtendedTabs"

/** Wrapper that owns the selected-tab state since `ExtendedTabs` is fully controlled. */
export const Controlled = (props: Omit<ExtendedTabsProps, "selectedKey" | "onSelectionChange"> & {
    defaultKey: string
}) => {
    const { defaultKey, ...rest } = props
    const [selectedKey, setSelectedKey] = useState(defaultKey)
    return (
        <ExtendedTabs {...rest} selectedKey={selectedKey} onSelectionChange={setSelectedKey}>
            {rest.children}
        </ExtendedTabs>
    )
}
