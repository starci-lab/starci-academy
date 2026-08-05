import type { ComponentType } from "react"
import type { ContentTab } from "@/redux/slices/tabs"

/**
 * One entry in the {@link ContentPage} tab bar: which redux {@link ContentTab} it
 * maps to, the i18n label shown on the trigger, and the body rendered when the
 * tab is active.
 */
export interface ContentTabItem {
    /** Redux tab key this entry selects. */
    key: ContentTab
    /** Translated label rendered on the tab trigger. */
    label: string
    /**
     * The tab's own body — an UNCALLED component (never a built element), so a tab
     * that is not selected is never constructed just to be thrown away.
     */
    body: ComponentType
    /**
     * When true the tab is a locked premium feature: rendered muted and, on
     * click, opens the register modal instead of switching to its body.
     */
    locked?: boolean
}
