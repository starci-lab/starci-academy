import type { IconComponent } from "@/types"
import { BookOpen as BookOpenIcon, Code as CodeIcon, Flame, Play as PlayIcon, CircleCheck as CircleCheckIcon, Flask as FlaskIcon } from "@gravity-ui/icons"
import {
    ContentTab,
} from "@/redux/slices"

/**
 * Icon component rendered on each {@link ContentTab} trigger.
 *
 * Keyed by the tabs surfaced in the {@link Content} bar; deprecated/unused tabs
 * fall back to the content icon so the lookup is total.
 */
export const CONTENT_TAB_ICON_MAP: Record<ContentTab, IconComponent> = {
    /** Article / markdown body tab. */
    [ContentTab.Content]: BookOpenIcon,
    /** Code explainings + implementations tab. */
    [ContentTab.CodeExplainings]: CodeIcon,
    /** Challenges tab. */
    [ContentTab.Challenges]: Flame,
    /** Live Sandpack sandbox tab. */
    [ContentTab.Sandbox]: PlayIcon,
    /** AI Lab playground tab. */
    [ContentTab.AILab]: FlaskIcon,
    /** E2E test-proof tab. */
    [ContentTab.E2e]: CircleCheckIcon,
    /** @deprecated Legacy lesson-videos tab, kept for a total lookup. */
    [ContentTab.LessonVideos]: BookOpenIcon,
    /** @deprecated Merged into code explainings; kept for a total lookup. */
    [ContentTab.CodeImplementation]: CodeIcon,
}
