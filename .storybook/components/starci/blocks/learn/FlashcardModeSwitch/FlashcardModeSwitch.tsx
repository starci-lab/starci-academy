import React from "react"
import { CardsIcon, LightningIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FlashcardModeSwitch`: study the deck, or drill yourself. Two ways to
 * work the same cards, one row.
 *
 * ⚠️ NOT A DUPLICATE OF `ContentModeNav`, though the shape is identical: same
 * row, same `Tabs` atom, same deliberate absence of a skeleton. What differs is
 * the one thing a block at this tier OWNS — the VOCABULARY. `ContentModeNav`
 * knows reading modes, this one knows practice modes, and §14d.1 puts that
 * ownership here rather than at the caller. Folding them into one block taking a
 * mode list would hand the vocabulary of both screens back to their callers.
 *
 * The pair is worth reading together before either is changed: if a third screen
 * ever needs a mode row, THAT is the moment to ask whether a shared frame exists
 * underneath — not now, on a sample of two.
 *
 * NEVER SKELETONISED, same reasoning as `ContentModeNav`: the row is known before
 * any deck or session request lands, so it paints immediately and gives the
 * learner something to act on. There is no `isSkeleton` prop at all rather than
 * one that is quietly unused.
 *
 * ⭐ IT DISAPPEARS ONCE A SESSION STARTS — but that is the SCREEN's call, not
 * this block's. Mid-session, switching modes would throw the run away, so the
 * screen stops rendering the row entirely instead of disabling it. A disabled
 * control still says "you could do this"; an absent one says the question is
 * closed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The two ways to work a deck. */
export type FlashcardMode = "study" | "quiz"

/**
 * Label + icon per mode. The BLOCK owns this table — it is the vocabulary of the
 * flashcards pane, and a caller that could pass it would own the wording.
 */
const MODE_LABEL: Record<FlashcardMode, string> = {
    study: "Study cards",
    quiz: "Quick quiz",
}

const MODE_ICON: Record<FlashcardMode, TabItem["icon"]> = {
    study: CardsIcon,
    quiz: LightningIcon,
}

/** Props for {@link FlashcardModeSwitch}. */
export interface FlashcardModeSwitchProps {
    /** Which mode the learner is in now. */
    mode: FlashcardMode
    /** Fired with the mode the learner picked. */
    onModeChange: (mode: FlashcardMode) => void
    /**
     * Accessible name for the row, localized by the caller (blocks carry no
     * i18n). Without it a screen reader hears two loose tabs.
     */
    ariaLabel: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The flashcards mode row. See the file header for the full contract.
 *
 * @param props - {@link FlashcardModeSwitchProps}
 */
const FlashcardModeSwitch = ({
    mode,
    onModeChange,
    ariaLabel,
}: FlashcardModeSwitchProps) => {
    const items: Array<TabItem> = (Object.keys(MODE_LABEL) as Array<FlashcardMode>).map((key) => ({
        key,
        label: MODE_LABEL[key],
        icon: MODE_ICON[key],
    }))

    return (
        <div>
            <Tabs
                items={items}
                selectedKey={mode}
                onSelectionChange={(key) => onModeChange(key as FlashcardMode)}
                ariaLabel={ariaLabel}

            />
        </div>
    )
}

export { FlashcardModeSwitch }
