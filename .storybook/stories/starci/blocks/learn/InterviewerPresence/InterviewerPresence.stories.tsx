import type { Meta, StoryObj } from "@storybook/nextjs"
import { InterviewerPresence } from "@sb-components/starci/blocks/learn/InterviewerPresence/InterviewerPresence"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `InterviewerPresence` — "someone is interviewing you": persona, live-speaking
 * cue, TTS toggle, and the question underneath. Whether the question region
 * exists is presence/absence data on the same shape — an idle and a mid-question
 * interviewer are one block with different data. `speaking` (audio) and `isAsking`
 * (text still streaming) are independent props; the identity row composes `Avatar`
 * + `Typography` directly (role, not a handle, plus a pulse ring).
 */
const meta: Meta<typeof InterviewerPresence> = {
    title: "StarCi/Blocks/Learn/InterviewerPresence/InterviewerPresence",
    component: InterviewerPresence,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InterviewerPresence>

const PERSONA = {
    name: "Ms. Mai",
    role: "Backend Engineer · Solution Architect",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking the header row over the question region, and the name over the role inside the identity cluster", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the identity cluster against the TTS toggle, and the role against the live-speaking status line", storyId: "frames-stack-stackh--default" },
    "Avatar": { tier: "atom", role: "the interviewer's face, wrapped by the block in a decorative pulse ring that appears only while `speaking` is true", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the interviewer's name, role, or the live-speaking status label", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the icon-only TTS mute/unmute toggle, drawn only once the caller supplies both `ttsEnabled` and `onToggleTts`", storyId: "atoms-buttons-button-button--is-icon-only" },
    "MarkdownContent": { tier: "composite", role: "the current question, rendered as authored/streamed markdown", storyId: "composites-viewers-markdowncontent--reading" },
}

/** LEAF — the interviewer header: identity → optional speaking cue → optional TTS toggle → optional question. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InterviewerPresence"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "idle — no question yet",
                        why: "Between questions the interviewer sits still: no pulse, no TTS status, and no question region at all. This is the shape the learner sees the instant a session opens, before the interviewer has said a word.",
                        code: `<InterviewerPresence
    persona={{ name: "Ms. Mai", role: "Backend Engineer · Solution Architect" }}
    speaking={false}
    speakingLabel="Reading the question aloud"
    ttsSupported
    ttsEnabled
    onToggleTts={() => {}}
    muteLabel="Mute question audio"
    unmuteLabel="Unmute question audio"
/>`,
                        render: (
                            <InterviewerPresence

                               
                                persona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question aloud"
                                ttsSupported
                                ttsEnabled
                                onToggleTts={() => {}}
                                muteLabel="Mute question audio"
                                unmuteLabel="Unmute question audio"
                            />
                        ),
                    },
                    {
                        name: "reading the question aloud (TTS + text still streaming)",
                        why: "TTS is voicing the question right now, so the pulse ring and the speaking status line light up; the question text is only half arrived, so typing dots sit under it. `speaking` and `isAsking` are both true here but they answer two different questions — audio versus text — and either can be true without the other.",
                        code: `<InterviewerPresence
    persona={{ name: "Ms. Mai", role: "Backend Engineer · Solution Architect" }}
    speaking
    speakingLabel="Reading the question aloud"
    ttsSupported
    ttsEnabled
    onToggleTts={() => {}}
    muteLabel="Mute question audio"
    unmuteLabel="Unmute question audio"
    questionMarkdown="Suppose you're designing a payment-processing service, how do you make sure a retried request doesn't get charged"
    isAsking
/>`,
                        render: (
                            <InterviewerPresence
                                persona={PERSONA}
                                speaking
                                speakingLabel="Reading the question aloud"
                                ttsSupported
                                ttsEnabled
                                onToggleTts={() => {}}
                                muteLabel="Mute question audio"
                                unmuteLabel="Unmute question audio"
                                questionMarkdown="Suppose you're designing a payment-processing service, how do you make sure a retried request doesn't get charged"
                                isAsking
                            />
                        ),
                    },
                    {
                        name: "question fully shown, waiting for an answer",
                        why: "The question has fully arrived and the audio has finished, so the pulse, the status line, and the typing dots all drop out together, leaving a plain finished question. This is the resting shape the learner spends most of their time reading.",
                        code: `<InterviewerPresence
    persona={{ name: "Ms. Mai", role: "Backend Engineer · Solution Architect" }}
    speaking={false}
    speakingLabel="Reading the question aloud"
    ttsSupported
    ttsEnabled
    onToggleTts={() => {}}
    muteLabel="Mute question audio"
    unmuteLabel="Unmute question audio"
    questionMarkdown="Suppose you're designing a payment-processing service, how do you make sure a retried request doesn't get charged twice?"
/>`,
                        render: (
                            <InterviewerPresence
                                persona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question aloud"
                                ttsSupported
                                ttsEnabled
                                onToggleTts={() => {}}
                                muteLabel="Mute question audio"
                                unmuteLabel="Unmute question audio"
                                questionMarkdown="Suppose you're designing a payment-processing service, how do you make sure a retried request doesn't get charged twice?"
                            />
                        ),
                    },
                    {
                        name: "TTS unavailable",
                        why: "This device or plan cannot speak the question aloud, so the toggle is not drawn at all rather than shown disabled — a control that cannot do anything is not a control. The question still reads normally; only the audio affordance is gone.",
                        code: `<InterviewerPresence
    persona={{ name: "Ms. Mai", role: "Backend Engineer · Solution Architect" }}
    speaking={false}
    speakingLabel="Reading the question aloud"
    muteLabel="Mute question audio"
    unmuteLabel="Unmute question audio"
    questionMarkdown="How would you debug a cron job that runs twice in a distributed system?"
/>`,
                        render: (
                            <InterviewerPresence
                                persona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question aloud"
                                muteLabel="Mute question audio"
                                unmuteLabel="Unmute question audio"
                                questionMarkdown="How would you debug a cron job that runs twice in a distributed system?"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
