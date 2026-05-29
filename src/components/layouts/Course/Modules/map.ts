import {
    BookOpenIcon,
    SwordIcon,
    VideoIcon,
} from "@phosphor-icons/react"
import type {
    ModuleSummaryItem,
} from "./types"

/**
 * Static catalog of summary chips shown on every module accordion item.
 *
 * Counts are placeholders until the real per-module totals are wired from the API.
 */
export const MODULE_SUMMARY_ITEMS: Array<ModuleSummaryItem> = [
    /** Number of reading contents in the module. */
    {
        id: "contents",
        icon: BookOpenIcon,
        tooltipKey: "module.chipContentsHint",
        quantity: 12,
    },
    /** Number of lesson videos in the module. */
    {
        id: "videos",
        icon: VideoIcon,
        tooltipKey: "module.chipVideosHint",
        quantity: 8,
    },
    /** Number of hands-on challenges in the module. */
    {
        id: "challenges",
        icon: SwordIcon,
        tooltipKey: "module.chipChallengesHint",
        quantity: 3,
    },
]
