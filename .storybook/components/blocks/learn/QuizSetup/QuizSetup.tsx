import React from "react"
import { PlayIcon } from "@phosphor-icons/react"
import { Button, ButtonRadioGroup } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackCallout } from "@sb-components/composites/feedback/Feedback/Feedback"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QuizSetup`: choose the shape of a drill, then start it.
 *
 * WHY A BLOCK: every choice on this form is DOMAIN — how long a run is, what
 * seniority the questions aim at, what the run is called. The block owns those
 * words and the lengths behind them; the caller says which level is picked, never
 * what "Middle" reads as or how many cards `deep` means.
 *
 * ⭐ LENGTH IS A CHOICE OF SHAPE, NOT A NUMBER. The learner picks "nhanh" or
 * "sâu"; the block turns that into 5 or 10 cards and SAYS so on the button. A
 * caller passing a card count would move the judgement about what a short run is
 * out of the design system and into whoever wired the screen.
 *
 * ⭐ A RUN IN PROGRESS TAKES PRIORITY OVER STARTING A NEW ONE. When one exists,
 * the resume strip leads the card, above the form. Starting fresh is still there
 * — but a learner who left mid-run almost always means to come back, and making
 * them scroll past a start button to find their own session is how a run gets
 * abandoned twice.
 *
 * THE ERROR SITS WITH THE ACTION. A failed draw is reported next to the button
 * that failed, not at the top of the card: an error far from its cause reads as a
 * problem with the whole form.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How long a drill runs. */
export type QuizLength = "quick" | "deep"

/** Seniority the questions aim at. */
export type QuizLevel = "junior" | "middle" | "senior" | "staff"

/** Card count per length. The BLOCK owns this — it is the judgement, not a prop. */
const LENGTH_CARDS: Record<QuizLength, number> = { quick: 5, deep: 10 }

const LENGTH_LABEL: Record<QuizLength, string> = { quick: "Nhanh", deep: "Sâu" }

const LEVEL_LABEL: Record<QuizLevel, string> = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
    staff: "Staff",
}

/** A run the learner left unfinished. */
export interface QuizResumable {
    /** What the run was called when it was started. */
    name: string
    /** How many cards were answered already. */
    answered: number
    /** How many cards the run has in total. */
    total: number
    /** Fired when the learner picks the run back up. */
    onResume: () => void
}

/** Props for {@link QuizSetup}. */
export interface QuizSetupProps {
    /** Section label, localized by the caller — e.g. "Dựng phiên". */
    label: string
    /** Current run name. */
    name: string
    /** Fired as the learner types a name. */
    onNameChange: (value: string) => void
    /** Chosen length. */
    length: QuizLength
    /** Fired when the learner picks a length. */
    onLengthChange: (length: QuizLength) => void
    /** Chosen seniority. */
    level: QuizLevel
    /** Fired when the learner picks a seniority. */
    onLevelChange: (level: QuizLevel) => void
    /** Fired when the learner starts the run. */
    onStart: () => void
    /** A run left unfinished. Present → the resume strip leads the card. */
    resumable?: QuizResumable
    /** `true` → the draw is in flight; the start button owns the busy affordance. */
    isPending?: boolean
    /** Set → the draw failed. Reported beside the action that failed. */
    errorMessage?: string
    /** `true` → the card draws its own mirror while the setup data loads. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The drill setup form. See the file header for the full contract.
 *
 * @param props - {@link QuizSetupProps}
 */
const QuizSetup = ({
    label,
    name,
    onNameChange,
    length,
    onLengthChange,
    level,
    onLevelChange,
    onStart,
    resumable,
    isPending = false,
    errorMessage,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: QuizSetupProps) => (
    <div data-anat-part={anatPart}>
        <SurfaceCard label={label} isSkeleton={isSkeleton} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                {resumable != null ? (
                    // A learner who left mid-run almost always means to come back. Making
                    // them scroll past a start button to find their own session is how one
                    // run gets abandoned twice.
                    <FeedbackCallout
                        title={resumable.name}
                        description={`Đang dở ${resumable.answered}/${resumable.total} câu`}
                        actionLabel="Tiếp tục"
                        onAction={resumable.onResume}
                        anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                    />
                ) : null}

                <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                    <Typography size="sm" weight="medium" text="Tên phiên" anatPart={showAnatomy ? "Typography" : undefined} />
                    <InputText
                        value={name}
                        onValueChange={onNameChange}
                        placeholder="Ví dụ: ôn Docker trước phỏng vấn"
                        ariaLabel="Tên phiên"
                        showAnatomy={showAnatomy}
                    />
                </StackV>

                <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                    <Typography size="sm" weight="medium" text="Độ dài" anatPart={showAnatomy ? "Typography" : undefined} />
                    <ButtonRadioGroup
                        ariaLabel="Độ dài phiên"
                        value={length}
                        onChange={onLengthChange}
                        showAnatomy={showAnatomy}
                        items={(Object.keys(LENGTH_LABEL) as Array<QuizLength>).map((key) => ({
                            value: key,
                            content: `${LENGTH_LABEL[key]} · ${LENGTH_CARDS[key]} câu`,
                        }))}
                    />
                </StackV>

                <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                    <Typography size="sm" weight="medium" text="Cấp độ" anatPart={showAnatomy ? "Typography" : undefined} />
                    <ButtonRadioGroup
                        ariaLabel="Cấp độ câu hỏi"
                        value={level}
                        onChange={onLevelChange}
                        showAnatomy={showAnatomy}
                        items={(Object.keys(LEVEL_LABEL) as Array<QuizLevel>).map((key) => ({
                            value: key,
                            content: LEVEL_LABEL[key],
                        }))}
                    />
                </StackV>

                {/* The error sits WITH the action that failed. At the top of the card it
                    would read as a problem with the whole form. */}
                <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                    {errorMessage != null ? (
                        <FeedbackCallout
                            status="danger"
                            title={errorMessage}
                            anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                        />
                    ) : null}
                    <StackH gap="related" justify="end" anatPart={showAnatomy ? "StackH" : undefined}>
                        <Button
                            label={`Bắt đầu · ${LENGTH_CARDS[length]} câu`}
                            variant="primary"
                            prefixIcon={PlayIcon}
                            onPress={onStart}
                            isPending={isPending}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    </StackH>
                </StackV>
            </StackV>
        </SurfaceCard>
    </div>
)

export { QuizSetup }
