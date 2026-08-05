import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseQaComposer } from "@sb-components/starci/blocks/learn/CourseQaComposer/CourseQaComposer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseQaComposer`: the ONE writing shape reused three ways on a
 * course Q&A board — the root "ask the whole course" collapsible pill, an
 * answer's inline edit form, and an inline reply form. See the component file
 * header for the full mode/`initialValue`/fold-back contract and why this is
 * genuinely new rather than a duplicate of `_legacy/blocks/feed/Composer`.
 */
const meta: Meta<typeof CourseQaComposer> = {
    title: "StarCi/Blocks/Learn/CourseQaComposer/CourseQaComposer",
    component: CourseQaComposer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaComposer>

const CURRENT_USER = { name: "Minh Anh", avatarSrc: undefined }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": { tier: "atom", role: "the viewer's own face, or its skeleton mirror while identity is still resolving", storyId: "atoms-display-avatar-avatar--default" },
    "StackH": { tier: "frame", role: "the horizontal track lining the avatar up against the pill or the form", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the vertical track stacking the textarea over its own action row", storyId: "frames-stack-stackv--default" },
    "InputButtonLike": { tier: "composite", role: "the collapsed pill — a field-look press target rather than a hand-rolled button, reused instead of rebuilt", storyId: "composites-buttons-inputbuttonlike--default" },
    "TextArea": { tier: "atom", role: "the open draft field, strictly controlled by the caller's `value`/`onValueChange`", storyId: "atoms-forms-input-inputtextarea--default" },
    "Button": { tier: "atom", role: "Submit or Cancel — Submit locks and shows the busy spinner while `isPending`", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — `CollapsedPrompt`: the root composer before it is opened — avatar + pill, nothing else composed. */
export const CollapsedPrompt: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaComposer"
                tier="block"
                leaf="CollapsedPrompt"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "collapsed, viewer known",
                        why: "The root \"ask the whole course\" composer boots as a slim avatar + placeholder pill rather than an open textarea, so an empty grey box never dominates the Q&A board before anyone has clicked in. A press anywhere on the pill opens the full form.",
                        code: `<CourseQaComposer
    mode="collapsible"
    currentUser={{ name: "Minh Anh" }}
    value=""
    onValueChange={setDraft}
    placeholder="Ask a question about this course…"
    onSubmit={submitQuestion}
/>`,
                        render: (
                            <CourseQaComposer


                                mode="collapsible"
                                currentUser={CURRENT_USER}
                                value=""
                                onValueChange={() => {}}
                                placeholder="Ask a question about this course…"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "collapsed, viewer unknown",
                        why: "While the signed-in viewer has not resolved yet, `currentUser` is omitted rather than guessed — the leading avatar is simply not drawn, and the pill still opens the same way.",
                        code: `<CourseQaComposer
    mode="collapsible"
    value=""
    onValueChange={setDraft}
    placeholder="Ask a question about this course…"
    onSubmit={submitQuestion}
/>`,
                        render: (
                            <CourseQaComposer
                                mode="collapsible"
                                value=""
                                onValueChange={() => {}}
                                placeholder="Ask a question about this course…"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The avatar and the pill each mirror themselves while the viewer's identity is still loading — the flag flows into the real `Avatar`/`InputButtonLike` atoms rather than a parallel skeleton tree, so the row keeps the exact box the real pill will land into.",
                        code: "<CourseQaComposer mode=\"collapsible\" value=\"\" onValueChange={setDraft} onSubmit={submitQuestion} isSkeleton />",
                        render: (
                            <CourseQaComposer
                                mode="collapsible"
                                value=""
                                onValueChange={() => {}}
                                onSubmit={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `ExpandedForm`: the open shape — avatar + textarea + action row. Root (opened), inline edit, and inline reply all land here. */
export const ExpandedForm: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaComposer"
                tier="block"
                leaf="ExpandedForm"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "root composer, opened",
                        why: "After the collapsed pill is pressed, the same block swaps to its open shape: avatar, a 3-row textarea, and an action row with a way back out (Cancel) plus Submit. Submitting a `\"collapsible\"` composer folds it back to the pill — the caller is still the one who clears `value`.",
                        code: `<CourseQaComposer
    mode="collapsible"
    initialValue=""
    currentUser={{ name: "Minh Anh" }}
    value={draft}
    onValueChange={setDraft}
    placeholder="Ask a question about this course…"
    onSubmit={submitQuestion}
/>`,
                        render: (
                            <CourseQaComposer


                                mode="collapsible"
                                initialValue="Why does"
                                currentUser={CURRENT_USER}
                                value="Why does exercise 3 require using generics instead of any?"
                                onValueChange={() => {}}
                                placeholder="Ask a question about this course…"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "inline edit, plain",
                        why: "An answer's inline edit form is `mode=\"plain\"` — always open, no pill to fold back to. `onCancel` is supplied here (bailing out of editing), so Cancel shows even though the mode itself never collapses.",
                        code: `<CourseQaComposer
    mode="plain"
    initialValue={answer.body}
    value={draft}
    onValueChange={setDraft}
    submitLabel="Save"
    onSubmit={saveAnswer}
    onCancel={stopEditing}
/>`,
                        render: (
                            <CourseQaComposer
                                mode="plain"
                                initialValue="Generics keep the concrete type across the call; any throws it away."
                                value="Generics keep the concrete type across the call, any throws it away — so the compiler still catches type errors."
                                onValueChange={() => {}}
                                submitLabel="Save"
                                onSubmit={() => {}}
                                onCancel={() => {}}
                            />
                        ),
                    },
                    {
                        name: "inline reply, plain",
                        why: "A reply form is also `mode=\"plain\"`, fresh (no `initialValue`), with the replying viewer's own avatar leading it and a shorter placeholder tuned to a reply rather than a new question.",
                        code: `<CourseQaComposer
    mode="plain"
    currentUser={{ name: "Minh Anh" }}
    value={draft}
    onValueChange={setDraft}
    placeholder="Write a reply…"
    submitLabel="Reply"
    onSubmit={submitReply}
    onCancel={closeReply}
/>`,
                        render: (
                            <CourseQaComposer
                                mode="plain"
                                currentUser={CURRENT_USER}
                                value=""
                                onValueChange={() => {}}
                                placeholder="Write a reply…"
                                submitLabel="Reply"
                                onSubmit={() => {}}
                                onCancel={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "Submitting locks both buttons — Submit shows its own busy spinner, Cancel is disabled too so the viewer cannot back out mid-submit — while the textarea itself stays interactive-looking (only the buttons own the busy affordance).",
                        code: "<CourseQaComposer mode=\"plain\" value={draft} onValueChange={setDraft} onSubmit={submitReply} onCancel={closeReply} isPending />",
                        render: (
                            <CourseQaComposer
                                mode="plain"
                                value="Sending this reply…"
                                onValueChange={() => {}}
                                onSubmit={() => {}}
                                onCancel={() => {}}
                                isPending
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every composed atom mirrors itself — avatar, textarea, and both buttons — while the surrounding content (which answer, which reply target) is still loading, keeping the exact box the real form will land into.",
                        code: "<CourseQaComposer mode=\"plain\" value=\"\" onValueChange={setDraft} onSubmit={submitReply} onCancel={closeReply} isSkeleton />",
                        render: (
                            <CourseQaComposer
                                mode="plain"
                                value=""
                                onValueChange={() => {}}
                                onSubmit={() => {}}
                                onCancel={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
