import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewSetup } from "@sb-components/starci/blocks/learn/MockInterviewSetup/MockInterviewSetup"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MockInterviewSetup` — the green-room card: who is interviewing, what to call
 * this run, how hard it should be, and the button(s) that start it. Sibling of
 * `QuizSetup` (same resumable-banner-leads-the-form shape). Two start buttons are
 * two different interviews — Q&A always exists; Design shows only when the caller
 * sets `isDesignAvailable`. The persona row is built from `Avatar` + `Typography`
 * (the second line is a role, not a handle). The "Customize" deep-config body is a
 * separate, deferred leaf.
 */
const meta: Meta<typeof MockInterviewSetup> = {
    title: "StarCi/Blocks/Learn/MockInterviewSetup/MockInterviewSetup",
    component: MockInterviewSetup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MockInterviewSetup>

const PERSONA = {
    name: "Vy Nguyen",
    role: "Senior Backend Engineer @ a digital bank",
    avatarSrc: undefined,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "a vertical frame — the card's own section stack, or a label-and-control pair inside it", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal frame — the identity row, or the trailing start-button row", storyId: "frames-stack-stackh--default" },
    "SurfaceCard": { tier: "composite", role: "the card face, owning the section label and the padding every part below sits in", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "Callout": { tier: "composite", role: "the resume banner when a run was left unfinished, or the failed-draw notice beside the start row", storyId: "composites-feedback-callout-callout--default" },
    "Avatar": { tier: "atom", role: "the interviewer's face — uploaded image, else the shared generated/initials fallback chain", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — interviewer name, role, a field label, or their skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "InputText": { tier: "atom", role: "the run-name field the candidate types into", storyId: "atoms-forms-input-inputtext--default" },
    "ButtonRadioGroup": { tier: "atom", role: "the Junior/Mid/Senior tier picker — a stateful select row, not a stateless action cluster", storyId: "composites-buttons-buttonradiogroup--default" },
    "Button": { tier: "atom", role: "a start action — Q&A always, Design only once the course offers it", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the green-room card: identity + tier + name + start. See file header for why every combination below is a STATE of this one leaf. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MockInterviewSetup"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "fresh setup, Q&A-only course",
                        why: "No run was left behind and the course has no Design round, so the card opens straight on the form with one start button. This is the plain first-visit shape most learners see.",
                        code: `<MockInterviewSetup
    label="Prepare for the interview"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
/>`,
                        render: (
                            <MockInterviewSetup

                               
                                label="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                            />
                        ),
                    },
                    {
                        name: "System-Design course — Design round offered",
                        why: "The caller marks the course as System Design, so a second start button appears beside Q&A. Neither button waits on the other: the candidate picks which interview to run.",
                        code: `<MockInterviewSetup
    label="Prepare for the interview"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="senior"
    onTierChange={setTier}
    isDesignAvailable
    onStartQna={startQna}
    onStartDesign={startDesign}
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Design a URL shortener system"
                                onSessionNameChange={() => {}}
                                tier="senior"
                                onTierChange={() => {}}
                                isDesignAvailable
                                onStartQna={() => {}}
                                onStartDesign={() => {}}
                            />
                        ),
                    },
                    {
                        name: "a run was left unfinished",
                        why: "The resume banner leads the card, above the form, because a candidate who left mid-interview almost always means to come back. The fresh-start form is still right there under it — leaving is not made harder, just no longer the first thing seen.",
                        code: `<MockInterviewSetup
    label="Prepare for the interview"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
    resumable={{ name: "Round 1 - Backend", progressLabel: "Midway through question 3", onResume: resume }}
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                resumable={{ name: "Round 1 - Backend", progressLabel: "Midway through question 3", onResume: () => {} }}
                            />
                        ),
                    },
                    {
                        name: "starting the Q&A round",
                        why: "The pressed button owns the busy affordance — its own spinner — while the other start button locks instead of staying pressable, so the candidate cannot fire two interviews at once.",
                        code: `<MockInterviewSetup
    label="Prepare for the interview"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="senior"
    onTierChange={setTier}
    isDesignAvailable
    onStartQna={startQna}
    onStartDesign={startDesign}
    startingMode="qna"
    isPending
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Design a URL shortener system"
                                onSessionNameChange={() => {}}
                                tier="senior"
                                onTierChange={() => {}}
                                isDesignAvailable
                                onStartQna={() => {}}
                                onStartDesign={() => {}}
                                startingMode="qna"
                                isPending
                            />
                        ),
                    },
                    {
                        name: "the last draw failed",
                        why: "The error sits with the action row that failed rather than floating above the form — the same placement rule `QuizSetup` uses — so it reads as this attempt's problem, not the whole card's.",
                        code: `<MockInterviewSetup
    label="Prepare for the interview"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
    errorMessage="Could not pull a question, try again"
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                errorMessage="Could not pull a question, try again"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while persona and setup data are still loading, keeping the exact box it will hand back — the flag reaches the real atoms instead of a parallel skeleton tree.",
                        code: `<MockInterviewSetup
    label="Prepare for the interview"
    persona={persona}
    sessionName=""
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
    isSkeleton
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Prepare for the interview"
                                persona={PERSONA}
                                sessionName=""
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
