import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewSetup } from "@sb-components/starci/blocks/learn/MockInterviewSetup/MockInterviewSetup"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `MockInterviewSetup`: the green-room card. Who is interviewing, what
 * to call this run, how hard it should be, and the button(s) that start it.
 *
 * SIBLING OF `QuizSetup` (same resumable-banner-leads-the-form shape) — reused
 * on purpose rather than inventing a new green-room layout, per this run's
 * reuse-first mandate.
 *
 * ⭐ TWO START BUTTONS ARE TWO DIFFERENT INTERVIEWS. Q&A always exists; Design
 * only shows once the CALLER says the course offers it (`isDesignAvailable`) —
 * the block never infers a course kind on its own.
 *
 * ⭐ PERSONA ≠ `UserCell`. The identity row is built straight from
 * `Avatar`+`Typography` because the second line is a ROLE, not an `@handle`.
 *
 * 📐 ONE LEAF THIS PASS (task-scoped call, spelled out in the block's own file
 * header): resumable on/off and Design-mode on/off each add or remove a real
 * node, which by §14d.2 alone would read as separate leaves — but this pass's
 * brief pins scope to "one leaf: identity + tier + name + start", so every
 * combination below is a STATE of that one leaf. The "Tùy chỉnh" deep-config
 * body (languages / kinds / answer-mode / AI model) is a SECOND leaf, deferred
 * out of scope — not rendered anywhere in this story.
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
    name: "Chị Hà Vy",
    role: "Senior Backend @ ngân hàng số",
    avatarSrc: undefined,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "a vertical frame — the card's own section stack, or a label-and-control pair inside it", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal frame — the identity row, or the trailing start-button row", storyId: "frames-stack-stackh--default" },
    "SurfaceCard": { tier: "composite", role: "the card face, owning the section label and the padding every part below sits in", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "FeedbackCallout": { tier: "composite", role: "the resume banner when a run was left unfinished, or the failed-draw notice beside the start row", storyId: "composites-feedback-feedback-feedbackcallout--default" },
    "Avatar": { tier: "atom", role: "the interviewer's face — uploaded image, else the shared generated/initials fallback chain", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — interviewer name, role, a field label, or their skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "InputText": { tier: "atom", role: "the run-name field the candidate types into", storyId: "atoms-forms-input-inputtext--default" },
    "ButtonRadioGroup": { tier: "atom", role: "the Sơ/Trung/Cao tier picker — a stateful select row, not a stateless action cluster", storyId: "composites-buttons-buttonradiogroup--default" },
    "Button": { tier: "atom", role: "a start action — Q&A always, Design only once the course offers it", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the green-room card: identity + tier + name + start. See file header for why every combination below is a STATE of this one leaf. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
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
    label="Chuẩn bị phỏng vấn"
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
                                anatPart="MockInterviewSetup"
                                showAnatomy
                                label="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
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
    label="Chuẩn bị phỏng vấn"
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
                                label="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Thiết kế hệ thống rút gọn URL"
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
    label="Chuẩn bị phỏng vấn"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
    resumable={{ name: "Vòng 1 - Backend", progressLabel: "Đang dở câu 3", onResume: resume }}
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                resumable={{ name: "Vòng 1 - Backend", progressLabel: "Đang dở câu 3", onResume: () => {} }}
                            />
                        ),
                    },
                    {
                        name: "starting the Q&A round",
                        why: "The pressed button owns the busy affordance — its own spinner — while the other start button locks instead of staying pressable, so the candidate cannot fire two interviews at once.",
                        code: `<MockInterviewSetup
    label="Chuẩn bị phỏng vấn"
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
                                label="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Thiết kế hệ thống rút gọn URL"
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
    label="Chuẩn bị phỏng vấn"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
    errorMessage="Không rút được câu hỏi, thử lại nhé"
/>`,
                        render: (
                            <MockInterviewSetup
                                label="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                errorMessage="Không rút được câu hỏi, thử lại nhé"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while persona and setup data are still loading, keeping the exact box it will hand back — the flag reaches the real atoms instead of a parallel skeleton tree.",
                        code: `<MockInterviewSetup
    label="Chuẩn bị phỏng vấn"
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
                                label="Chuẩn bị phỏng vấn"
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
