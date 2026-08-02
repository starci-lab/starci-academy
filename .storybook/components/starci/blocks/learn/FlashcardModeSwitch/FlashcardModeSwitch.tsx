import React from "react"
import { CardsIcon, LightningIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"

/**
 * `FlashcardModeSwitch` — a one-row toggle between studying the deck and drilling
 * yourself, built on the `Tabs` atom. Owns the practice-mode vocabulary. Never
 * skeletonised (the row is known before any deck/session loads). The screen removes
 * the row entirely once a session starts rather than disabling it.
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
