import type {
    Icon,
} from "@phosphor-icons/react"
import type {
    SidebarTab,
} from "@/redux/slices"

/**
 * One row in the course-learn sidebar navigation.
 */
export interface SidebarNavItem {
    /** Visible label. */
    label: string
    /** Stable list key. */
    value: string
    /** Sidebar tab enum value this row activates. */
    tab: SidebarTab
    /** Phosphor icon component rendered before the label. */
    icon: Icon
    /** Navigation target the row routes to when pressed. */
    url?: string
}
