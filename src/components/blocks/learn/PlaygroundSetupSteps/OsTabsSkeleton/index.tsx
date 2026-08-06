import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"
import { type PlaygroundSetupOs } from "../types"

const OS_ORDER: ReadonlyArray<PlaygroundSetupOs> = ["mac", "win", "linux"]

// Depends on the loop variable, so it cannot be hoisted to a const above the
// return — a small named helper instead, in the style this file already uses.
const renderOsTabSkeleton = (key: PlaygroundSetupOs) => (
    <StackV
        key={key}
        gap={2}
        align="center"
        principle="title-subtitle"
        explain="Title over supporting line — not label-field, because neither line is a form control label."
        items={[
            () => <Typography size="sm" isSkeleton classNames={["w-1/3"]} />,
            () => <Typography size="xs" isSkeleton classNames={["w-1/3"]} />,
        ]}
    />
)

/** Placeholder mirror of the OS tab row — label+underline bar per OS, matching `Tabs`'s own `secondary` skeleton shape. */
export const OsTabsSkeleton = () => (
    <StackH gap={3} items={OS_ORDER.map((key) => () => renderOsTabSkeleton(key))} />
)
