import React from "react"
import { FlowArrowIcon, PlayIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MockInterviewSetup`: the green-room card. Who is interviewing, what
 * to call this run, how hard it should be, and the button(s) that start it.
 *
 * WHY A BLOCK: every field here is a DOMAIN decision — which interviewer
 * persona greets the candidate, what a tier means, and which start actions a
 * course even offers. A caller passing pre-formatted strings or a raw button
 * list would move that judgement out of the design system (§14d.1). SIBLING OF
 * `QuizSetup` (same "green-room card" shape: resumable banner leads, form
 * body, action row trailing) — this file reuses its layout rhythm on purpose
 * instead of inventing a new one, per this run's reuse-first mandate.
 *
 * ⭐ TWO START BUTTONS ARE TWO DIFFERENT INTERVIEWS, NOT ONE MODE TOGGLE. Q&A
 * always exists; the Design round is a SEPARATE session type only System-Design
 * courses offer (`isDesignAvailable`). Folding them into one button plus a
 * mode switch would make the caller decide "which session starts" through a
 * hidden side-channel instead of a real prop — and would silently invent a
 * Design round on courses that never asked for one. The caller decides
 * availability; the block never guesses it from the course kind itself
 * (rule 7 — a block never hardcodes a business call it wasn't handed).
 *
 * ⭐ A RUN IN PROGRESS TAKES PRIORITY OVER STARTING A NEW ONE, same reasoning as
 * `QuizSetup`: the resumable banner leads the card, above the form, so a
 * candidate who left mid-interview is not asked to scroll past a fresh-start
 * button to find their own session.
 *
 * ⭐ PERSONA IS NOT `UserCell`. The sibling composite `UserCell` composes
 * avatar+name+`@handle` for an ACCOUNT identity; an interviewer persona's
 * second line is a ROLE ("Senior Backend @ a digital bank"), not a handle, and
 * this block's own compose list names `Avatar`+`Typography` directly rather
 * than `UserCell` — so the identity row is built from those two atoms instead
 * of reaching for a component shaped for a different kind of row.
 *
 * ⭐ ONE LEAF THIS PASS (task-scoped judgement call). Structurally, resumable
 * on/off and Design-mode on/off each add or remove a real node (the banner,
 * the second button) — by the letter of §14d.2 that reads as "new leaf per
 * structural change". This run's brief pins the scope explicitly ("one leaf
 * this pass: identity + tier + name + start"; the "Customize" deep-config body
 * is a SECOND leaf, deferred out of scope) — so every combination this pass
 * covers is filed as STATES of that one leaf rather than split further,
 * matching how `QuizRecapList`'s sibling story keeps its data combinations in
 * one leaf. `isSkeleton` is a state for the same reason `SurfaceCard` docs it
 * as one (§11f): it changes the STATE of an already-built tree, not its shape.
 *
 * NEVER RENDERS THE "Customize" DISCLOSURE. That deep-config body (languages /
 * question kinds / answer mode / AI model) is real scope but a DIFFERENT leaf
 * — this pass only builds identity + tier + name + start, so `Disclosure` is
 * not composed here at all rather than stubbed in half-built (§B3: a gap left
 * clearly absent beats a stub that renders nothing real).
 *
 * THE ERROR SITS WITH THE ACTION, same placement rule as `QuizSetup`: a failed
 * draw is reported next to the button row that failed, not floated above the
 * form where it would read as a problem with the whole card.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How hard the interviewer's questions run. The block owns the label (§14d.1). */
export type MockInterviewTier = "junior" | "mid" | "senior"

const TIER_LABEL: Record<MockInterviewTier, string> = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
}

/** Which start action is in flight, so the busy affordance lands on the right button. */
export type MockInterviewStartMode = "qna" | "design"

/** The interviewer greeting the candidate. */
export interface MockInterviewPersona {
    /** Interviewer's display name. */
    name: string
    /** Role line under the name, e.g. "Senior Backend @ a digital bank" — NOT a handle. */
    role: string
    /** Uploaded avatar URL. Absent → `Avatar`'s own generated/initials fallback. */
    avatarSrc?: string
}

/** A run the candidate left unfinished. */
export interface MockInterviewResumable {
    /** What the run was called when it was started. */
    name: string
    /** Where the run left off, already worded by the caller — e.g. "Left off at question 3". */
    progressLabel: string
    /** Fired when the candidate picks the run back up. */
    onResume: () => void
}

/** Props for {@link MockInterviewSetup}. */
export interface MockInterviewSetupProps {
    /** Section label, localized by the caller — e.g. "Prepare for the interview". */
    label: string
    /** The interviewer greeting the candidate. */
    persona: MockInterviewPersona
    /** Current run name. */
    sessionName: string
    /** Fired as the candidate types a name. */
    onSessionNameChange: (value: string) => void
    /** Chosen difficulty. */
    tier: MockInterviewTier
    /** Fired when the candidate picks a tier. */
    onTierChange: (tier: MockInterviewTier) => void
    /**
     * `true` → this is a System-Design course, so the Design-mode start button
     * renders beside the Q&A one. The CALLER decides this (course kind lives on
     * the screen); the block never infers it.
     */
    isDesignAvailable: boolean
    /** Fired when the candidate starts the Q&A round. Always available. */
    onStartQna: () => void
    /** Fired when the candidate starts the Design round. Required once `isDesignAvailable` is set. */
    onStartDesign?: () => void
    /** A run left unfinished. Present → the resume banner leads the card. */
    resumable?: MockInterviewResumable
    /** Which start action is currently in flight — drives which button shows its own spinner. */
    startingMode?: MockInterviewStartMode
    /** `true` → a start is in flight; both start buttons lock while one of them runs. */
    isPending?: boolean
    /** Set → the last start attempt failed. Reported beside the action row that failed. */
    errorMessage?: string
    /** `true` → the card draws its own mirror while the setup data loads. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The interview green-room card. See the file header for the full contract.
 *
 * @param props - {@link MockInterviewSetupProps}
 */
const MockInterviewSetup = ({
    label,
    persona,
    sessionName,
    onSessionNameChange,
    tier,
    onTierChange,
    isDesignAvailable,
    onStartQna,
    onStartDesign,
    resumable,
    startingMode,
    isPending = false,
    errorMessage,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: MockInterviewSetupProps) => {
    const showDesignStart = isDesignAvailable && onStartDesign != null

    // A candidate who left mid-interview almost always means to come back.
    // Making them scroll past a start button to find their own session is
    // how a run gets abandoned twice — same reasoning as `QuizSetup`.
    const resumeBanner = resumable != null ? (
        <Callout
            title={resumable.name}
            description={resumable.progressLabel}
            actionLabel="Continue"
            onAction={resumable.onResume}
            anatPart={showAnatomy ? "Callout" : undefined}
        />
    ) : null

    const personaDetails = (
        <>
            <Typography
                size="sm"
                weight="medium"
                isSkeleton={isSkeleton}
                text={persona.name}
                showAnatomy={showAnatomy}
            />
            <Typography
                size="xs"
                color="muted"
                isSkeleton={isSkeleton}
                text={persona.role}
                showAnatomy={showAnatomy}
            />
        </>
    )

    // Interviewer identity — built from Avatar + Typography directly (not
    // `UserCell`): the second line is a ROLE, not an `@handle`.
    const identityRow = (
        <StackH
            gap={3}
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <div data-anat-part={showAnatomy ? "Avatar" : undefined}>
                        <Avatar
                            name={persona.name}
                            src={persona.avatarSrc}
                            seed={persona.name}
                            size="md"
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                    </div>
                    <StackV gap={1} anatPart={showAnatomy ? "StackV" : undefined} body={personaDetails} />
                </>
            }
        />
    )

    const sessionNameField = (
        <StackV
            gap={3}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography size="sm" weight="medium" text="Session name" showAnatomy={showAnatomy} />
                    <InputText
                        value={sessionName}
                        onValueChange={onSessionNameChange}
                        placeholder="e.g. Round 1 - Backend"
                        ariaLabel="Session name"
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                </>
            }
        />
    )

    const tierField = (
        <StackV
            gap={3}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography size="sm" weight="medium" text="Level" showAnatomy={showAnatomy} />
                    <ButtonRadioGroup
                        ariaLabel="Interview level"
                        value={tier}
                        onChange={onTierChange}
                        showAnatomy={showAnatomy}
                        items={(Object.keys(TIER_LABEL) as Array<MockInterviewTier>).map((key) => ({
                            value: key,
                            content: TIER_LABEL[key],
                        }))}
                    />
                </>
            }
        />
    )

    const actionsRow = (
        <StackH
            gap={3}
            justify="end"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    {showDesignStart ? (
                        <Button
                            label="Start Design"
                            variant="secondary"
                            prefixIcon={FlowArrowIcon}
                            onPress={onStartDesign}
                            isPending={isPending && startingMode === "design"}
                            isDisabled={isPending && startingMode !== "design"}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                    <Button
                        label="Start Q&A"
                        variant="primary"
                        prefixIcon={PlayIcon}
                        onPress={onStartQna}
                        isPending={isPending && startingMode === "qna"}
                        isDisabled={isPending && startingMode !== "qna"}
                        showAnatomy={showAnatomy}
                    />
                </>
            }
        />
    )

    // The error sits WITH the action row that failed. At the top of the
    // card it would read as a problem with the whole form.
    const footer = (
        <StackV
            gap={3}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {errorMessage != null ? (
                        <Callout
                            status="danger"
                            title={errorMessage}
                            anatPart={showAnatomy ? "Callout" : undefined}
                        />
                    ) : null}
                    {actionsRow}
                </>
            }
        />
    )

    const setupBody = (
        <>
            {resumeBanner}
            {identityRow}
            {sessionNameField}
            {tierField}
            {footer}
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard
                label={label}
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "SurfaceCard" : undefined}
                body={() => <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={setupBody} />}
            />
        </div>
    )
}

export { MockInterviewSetup }
