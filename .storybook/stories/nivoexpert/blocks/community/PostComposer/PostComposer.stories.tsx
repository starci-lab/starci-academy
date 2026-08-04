import type { Meta, StoryObj } from "@storybook/nextjs"
import { PostComposer, type PostComposerLabels } from "@sb-components/nivoexpert/blocks/community/PostComposer/PostComposer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PostComposer` — the title + body + submit card a member meets above the
 * community feed. ONE composition: two fields and a submit action; there are
 * no separate pictures here, only the `isSubmitting` in-flight state. Grounded
 * in the real `PostForm.tsx` (`title`, `body`, the `createPost` mutation, and a
 * `busy` flag that locks the button while the request is in flight).
 */
const meta: Meta<typeof PostComposer> = {
    title: "NivoExpert/Blocks/Community/PostComposer/PostComposer",
    component: PostComposer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PostComposer>

const LABELS: PostComposerLabels = {
    titlePlaceholder: "Post title",
    bodyPlaceholder: "Share something with the community…",
    titleAriaLabel: "Post title",
    bodyAriaLabel: "Post body",
    submitLabel: "Post",
    submittingLabel: "Posting…",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the composer card face" },
    InputText: { tier: "atom", role: "the post title field" },
    InputTextarea: { tier: "atom", role: "the post body field" },
    Button: { tier: "atom", role: "the submit action — createPost" },
}

/** LEAF — one shape; empty/filled/isSubmitting are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PostComposer"
                tier="block"
                leaf="Composer"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the card owns the draft, so a route places the whole composer above its feed rather than restyling it. Submit stays disabled until both fields carry non-empty (trimmed) text, mirroring the real `PostForm`'s own guard before it calls `createPost`."
                states={[
                    {
                        name: "empty draft",
                        why: "The resting state before the member has typed anything: both fields are blank and submit is disabled — there is nothing to post yet.",
                        code: "<PostComposer title=\"\" body=\"\" onTitleChange={setTitle} onBodyChange={setBody} onSubmit={createPost} labels={labels} />",
                        render: <PostComposer title="" onTitleChange={NOOP} body="" onBodyChange={NOOP} onSubmit={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "draft filled",
                        why: "Both fields carry text: submit is enabled and reads ready to fire `createPost`.",
                        code: "<PostComposer title={title} body={body} onTitleChange={setTitle} onBodyChange={setBody} onSubmit={createPost} labels={labels} />",
                        render: (
                            <PostComposer
                                title="How I priced my first cohort"
                                onTitleChange={NOOP}
                                body="I anchored the cohort near my monthly 1:1 rate and opened an early-bird tier for the first run."
                                onBodyChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "The `createPost` mutation is in flight: the submit button shows a spinner and both fields lock, so a double-click cannot post twice.",
                        code: "<PostComposer {...props} isSubmitting />",
                        render: (
                            <PostComposer
                                title="How I priced my first cohort"
                                onTitleChange={NOOP}
                                body="I anchored the cohort near my monthly 1:1 rate and opened an early-bird tier for the first run."
                                onBodyChange={NOOP}
                                onSubmit={NOOP}
                                isSubmitting
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
