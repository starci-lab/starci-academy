import { useState } from "react"
import type { Key } from "react"
import { ListBox } from "@heroui/react"

export const TOPICS = [
    { id: "array", label: "Array" },
    { id: "string", label: "String" },
    { id: "hashmap", label: "Hash map" },
    { id: "two-pointer", label: "Two pointers" },
    { id: "sliding-window", label: "Sliding window" },
]

/** Wrapper that holds the selection state so the story is actually clickable (ListBox is controlled via selectedKeys). */
export const ControlledListBox = ({ initial, disabledKeys }: { initial: string; disabledKeys?: string[] }) => {
    const [selected, setSelected] = useState<string>(initial)
    return (
        <ListBox
            aria-label="Practice topics"
            selectionMode="single"
            selectedKeys={[selected]}
            disabledKeys={disabledKeys}
            onSelectionChange={(keys) => {
                const [first] = keys as Set<Key>
                if (first !== undefined) {
                    setSelected(String(first))
                }
            }}
            className="w-64 gap-1 p-0"
        >
            {TOPICS.map((topic) => (
                <ListBox.Item
                    key={topic.id}
                    id={topic.id}
                    textValue={topic.label}
                    className="cursor-pointer rounded-xl px-3 py-2 data-[hovered=true]:bg-default data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
                >
                    {topic.label}
                </ListBox.Item>
            ))}
        </ListBox>
    )
}
