"use client"

import { SparkleIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "@sb-components/composites/buttons/FloatingActionButton/FloatingActionButton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentAiFab`: the floating "ask StarCi AI" trigger mounted once in
 * `learn/layout.tsx` (the layout tier, §11a/§4 of
 * `D:/Repositories/starci-academy-backend/.claude/fe/steps/11-overlays-layouts-brainstorm.md`),
 * bottom-right over every `/learn/**` route.
 *
 * ⭐ REUSE FIRST, checked before writing this file (Glob over
 * `components/starci/blocks/**` and `components/{atoms,frames,composites}/**`):
 * `FloatingActionButton` (composites/buttons) already owns the round accent
 * circle, fixed placement, shadow and icon-only press affordance. This block
 * adds nothing structural on top of it — only the ONE domain decision an
 * app-wide floating trigger is allowed to own: which icon it shows, what it is
 * called, and when it should not be there at all.
 *
 * WHAT THIS BLOCK OWNS (per the task brief): the icon (a sparkle — the app's
 * one "AI" glyph) and its fixed accessible name, per §14d.1 — this app ships a
 * single locale, so a caller-supplied aria-label prop would just repeat the
 * same string at its one call site. It does NOT own chat state, drag position,
 * or which mode the panel it opens lands on — all of that is
 * `ContentAiChatDrawer` + `useOverlayStore` wiring living in the layout that
 * mounts this block; this block only calls `onOpen()`.
 *
 * `isOpen` HIDES rather than disables. When the rail-mode AI chat panel this
 * FAB opens is already open, a second floating trigger sitting on top of it is
 * dead chrome — on narrow viewports it can even sit over the panel's own close
 * control. Returning `null` (not a disabled/dimmed button) matches the
 * "nothing true left to show" leaf already used by `MindMapContinueButton`.
 *
 * NEVER SKELETONISED, on purpose — same call as `ContentModeNav`. This is
 * static layout chrome with no data dependency: whether the trigger shows
 * never waits on a fetch, only on `isOpen`, which the layout already knows
 * synchronously from its own overlay-store subscription.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Extra classes on the button. */
    className?: string
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
    className,
}: ContentAiFabProps) => {
    // The panel this button opens is already up — a second trigger floating on
    // top of it would be redundant chrome (and could overlap the panel's own
    // controls), so this leaf has nothing true left to show.
    if (isOpen) {
        return null
    }

    return (
        <div>
            <div>
                <FloatingActionButton
                    onPress={onOpen}
                    ariaLabel={ARIA_LABEL}
                    icon={<SparkleIcon aria-hidden focusable="false" />}
                    className={className}
                />
            </div>
        </div>
    )
}

export { ContentAiFab }
