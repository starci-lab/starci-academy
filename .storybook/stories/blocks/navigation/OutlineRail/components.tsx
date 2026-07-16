import { useState } from "react"
import { OutlineRail } from "@/components/blocks/navigation/OutlineRail"
import type { OutlineRailGroup, OutlineRailProps } from "@/components/blocks/navigation/OutlineRail"

export const mockGroups: Array<OutlineRailGroup> = [
    {
        id: "module-1",
        title: "Module 1: Getting started with React",
        progress: { done: 3, total: 5 },
        collapsedCountLabel: "3/5 lessons",
        items: [
            {
                id: "lesson-1",
                title: "Introduction to JSX",
                isActive: false,
                isRead: true,
                onPress: () => {},
            },
            {
                id: "lesson-2",
                title: "Components and Props",
                isActive: true,
                isRead: false,
                onPress: () => {},
            },
            {
                id: "lesson-3",
                title: "Advanced State and Hooks for large applications",
                isActive: false,
                isRead: false,
                isPremium: true,
                meta: "12 min",
                onPress: () => {},
            },
        ],
    },
    {
        id: "module-2",
        title: "Module 2: Data management",
        progress: { done: 0, total: 4 },
        collapsedCountLabel: "0/4 lessons",
        items: [
            {
                id: "lesson-4",
                title: "Fetching data with SWR",
                isActive: false,
                isRead: false,
                isLocked: true,
                onPress: () => {},
            },
        ],
    },
]

/** Internal wrapper that holds state for the search and the accordion's expanded-keys set, since OutlineRail is a controlled component. */
export const Controlled = (props: Omit<OutlineRailProps, "search" | "expandedKeys" | "onExpandedChange"> & { initialQuery?: string; initialExpanded?: Array<string> }) => {
    const { initialQuery, initialExpanded, ...rest } = props
    const [query, setQuery] = useState(initialQuery ?? "")
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(initialExpanded ?? ["module-1"]))
    return (
        <div className="h-[560px] w-[360px] rounded-xl border border-default-200">
            <OutlineRail
                {...rest}
                search={{
                    value: query,
                    onChange: setQuery,
                    placeholder: "Search lessons...",
                    ariaLabel: "Search content",
                }}
                expandedKeys={expandedKeys}
                onExpandedChange={setExpandedKeys}
            />
        </div>
    )
}
