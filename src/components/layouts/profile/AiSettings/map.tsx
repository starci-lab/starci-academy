import React from "react"
import {
    SparkleIcon,
    CrownIcon,
    KeyIcon,
} from "@phosphor-icons/react"
import {
    AiMode,
} from "@/modules/api"

/** Icon element rendered next to each AI lane in the selector. */
export const LANE_ICON_MAP: Record<AiMode, React.ReactNode> = {
    [AiMode.Auto]: (
        <SparkleIcon
            weight="duotone"
            className="size-6 text-success"
        />
    ),
    [AiMode.Premium]: (
        <CrownIcon
            weight="duotone"
            className="size-6 text-warning"
        />
    ),
    [AiMode.Byok]: (
        <KeyIcon
            weight="duotone"
            className="size-6 text-accent"
        />
    ),
}
