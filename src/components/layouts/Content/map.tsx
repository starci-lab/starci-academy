import type {
    Icon,
} from "@phosphor-icons/react"
import {
    BookOpenIcon,
    CodeIcon,
    SwordIcon,
} from "@phosphor-icons/react"
import {
    ContentTab,
} from "@/redux/slices"

/**
 * Phosphor icon component rendered on each {@link ContentTab} trigger.
 *
 * Keyed by the tabs surfaced in the {@link Content} bar; deprecated/unused tabs
 * fall back to the content icon so the lookup is total.
 */
export const CONTENT_TAB_ICON_MAP: Record<ContentTab, Icon> = {
    /** Article / markdown body tab. */
    [ContentTab.Content]: BookOpenIcon,
    /** Code explainings + implementations tab. */
    [ContentTab.CodeExplainings]: CodeIcon,
    /** Challenges tab. */
    [ContentTab.Challenges]: SwordIcon,
    /** @deprecated Legacy lesson-videos tab, kept for a total lookup. */
    [ContentTab.LessonVideos]: BookOpenIcon,
    /** @deprecated Merged into code explainings; kept for a total lookup. */
    [ContentTab.CodeImplementation]: CodeIcon,
}
