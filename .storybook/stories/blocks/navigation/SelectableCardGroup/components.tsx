import { useState } from "react"

import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import type { SelectableCardItem } from "@/components/blocks/navigation/SelectableCardGroup"

export type PlanValue = "monthly" | "quarterly" | "yearly"

export const PLAN_ITEMS: Array<SelectableCardItem<PlanValue>> = [
    {
        value: "monthly",
        label: "Monthly",
        description: "299.000đ / month",
    },
    {
        value: "quarterly",
        label: "Quarterly",
        description: "799.000đ / quarter",
        badge: (
            <span className="rounded-full bg-accent-soft px-2 py-0 text-xs font-medium text-accent-soft-foreground">
                Save 11%
            </span>
        ),
    },
    {
        value: "yearly",
        label: "Yearly",
        description: "2.499.000đ / year",
        badge: (
            <span className="rounded-full bg-accent-soft px-2 py-0 text-xs font-medium text-accent-soft-foreground">
                Save 30%
            </span>
        ),
    },
]

export const StarIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M8 1.5l1.9 4.2 4.6.5-3.4 3.2.9 4.6L8 11.8l-4 2.2.9-4.6-3.4-3.2 4.6-.5L8 1.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
        />
    </svg>
)

export const LANGUAGE_ITEMS: Array<SelectableCardItem<"ts" | "java" | "csharp" | "go">> = [
    {
        value: "ts",
        label: "TypeScript",
        description: "Node.js / NestJS",
        icon: <StarIcon />,
    },
    {
        value: "java",
        label: "Java",
        description: "Spring Boot",
    },
    {
        value: "csharp",
        label: "C#",
        description: ".NET",
    },
    {
        value: "go",
        label: "Go",
        description: "Coming soon",
        isDisabled: true,
    },
]

/**
 * Wraps the story render in local `useState` so the group is genuinely
 * interactive in the Storybook canvas (the block itself is fully controlled —
 * no internal store/hook — so this is plain prop-mocking, not a provider).
 */
export const ControlledGroup = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    columns,
    width = "420px",
}: {
    items: Array<SelectableCardItem<T>>
    initialValue: T
    ariaLabel: string
    columns?: 1 | 2 | 3
    width?: string
}) => {
    const [value, setValue] = useState<T>(initialValue)
    return (
        <div style={{ width }}>
            <SelectableCardGroup
                items={items}
                value={value}
                onChange={setValue}
                ariaLabel={ariaLabel}
                columns={columns}
            />
        </div>
    )
}
