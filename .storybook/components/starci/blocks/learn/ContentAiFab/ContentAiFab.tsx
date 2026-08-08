"use client"

import { SparkleIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "@sb-components/composites/buttons/FloatingActionButton/FloatingActionButton"

/**
 * `ContentAiFab` — the floating "ask StarCi AI" trigger mounted once by
 * `learn/layout.tsx`, bottom-right over every `/learn/**` route. Composes the
 * `FloatingActionButton` composite, fixing the icon + accessible name. `isOpen`
 * decides whether it renders at all, not its shape. No `isSkeleton` — it is
 * static chrome.
 */

/** Fixed accessible name — see the file header on why this is not a prop. */
const ARIA_LABEL = "Ask StarCi AI"

/** Props for {@link ContentAiFab}. */
export interface ContentAiFabProps {
    /**
     * Fired on press. The layout opens the AI chat rail/drawer in response —
     * this block never touches that state itself (§7: a block never decides
     * what an action means, only that it happened).
     */
    onOpen: () => void
    /**
     * `true` → the AI chat rail-mode panel this FAB opens is already open, so
     * the trigger hides instead of floating redundantly on top of it. Defaults
     * to `false` (visible).
     */
    isOpen?: boolean
}

/**
 * The floating "ask StarCi AI" trigger. See the file header for why `isOpen`
 * hides the button rather than disabling it.
 *
 * @param props - {@link ContentAiFabProps}
 */
const ContentAiFab = ({
    onOpen,
    isOpen = false,
}: ContentAiFabProps) => {
    // The panel this button opens is already up — a second trigger floating on
    // top of it would be redundant chrome (and could overlap the panel's own
    // controls), so this leaf has nothing true left to show.
    if (isOpen) {
        return null
    }

    return (
        // Identity hold: FloatingActionButton does not accept CallerIdentity.
        <FloatingActionButton
            onPress={onOpen}
            ariaLabel={ARIA_LABEL}
            icon={SparkleIcon}
        />
    )
}

export { ContentAiFab }
