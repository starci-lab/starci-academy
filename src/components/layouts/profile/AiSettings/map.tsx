import { CrownDiamond as CrownIcon, Key as KeyIcon, Sparkles as SparkleIcon } from "@gravity-ui/icons"
import React from "react"
import {
    AiMode,
} from "@/modules/api"

/** Icon element rendered next to each AI lane in the selector. */
export const LANE_ICON_MAP: Record<AiMode, React.ReactNode> = {
    [AiMode.Auto]: (
        <SparkleIcon
            className="size-6 text-success"
        />
    ),
    [AiMode.Premium]: (
        <CrownIcon
            className="size-6 text-warning"
        />
    ),
    [AiMode.Byok]: (
        <KeyIcon
            className="size-6 text-accent"
        />
    ),
}
