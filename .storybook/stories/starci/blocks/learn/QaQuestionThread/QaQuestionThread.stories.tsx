import { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    QaQuestionThread,
    type QaQuestionThreadProps,
    type QaQuestionThreadQuestion,
    type QaQuestionThreadViewer,
    type QaThreadAnswer,
} from "@sb-components/starci/blocks/learn/QaQuestionThread/QaQuestionThread"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QaQuestionThread`: ONE course-Q&A conversation — a collapsed social
 * inbox row that presses open into the full conversation (header, question
 * bubble, every answer, a bottom composer). See the component file header for
 * the full contract, the local-state judgement call, and the assumed-contract
 * risk on the four sibling blocks that did not exist yet when this was written.
 */
const meta: Meta<typeof QaQuestionThread> = {
    title: "StarCi/Blocks/Learn/QaQuestionThread/QaQuestionThread",
    component: QaQuestionThread,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QaQuestionThread>

const ASKER = { id: "u-asker", displayName: "Amy Nguyen", avatarUrl: undefined }
const FOUNDER = { id: "u-founder", displayName: "Coach Quang", avatarUrl: undefined }
const PEER = { id: "u-peer", displayName: "Brandon Le", avatarUrl: undefined }

const CURRENT_USER: QaQuestionThreadViewer = { username: "Brandon Le", avatar: undefined }

const NESTED_REPLY: QaThreadAnswer = {
    id: "a-2-1",
    body: "That's right, try deleting `.next` and building again.",
    author: FOUNDER,
    createdTimeAgo: "5 minutes ago",
    reactionCount: 1,
    myReaction: null,
}

const ANSWERS: Array<QaThreadAnswer> = [
    {
        id: "a-1",
        body: "Check whether `output` is set to `standalone` in your `next.config.js`.",
        author: PEER,
        createdTimeAgo: "20 minutes ago",
        reactionCount: 2,
        myReaction: "like",
    },
    {
        id: "a-2",
        body: "I think it's just the Turbopack cache, not a bug in your code — try building with webpack instead.",
        author: FOUNDER,
        createdTimeAgo: "10 minutes ago",
        isAcceptedAnswer: true,
        reactionCount: 4,
        myReaction: null,
        replies: [NESTED_REPLY],
    },
]

/** A question with a lively conversation already going — the everyday case. */
const QUESTION_ANSWERED: QaQuestionThreadQuestion = {
    id: "q-1",
    author: ASKER,
    createdTimeAgo: "1 hour ago",
    isPinned: true,
    body: "Why does my production build keep hitting CSS cache errors? I've tried deleting `node_modules` but it still happens.",
    scope: { kind: "lesson", lessonTitle: "Deploying Next.js to Vercel" },
    replyCount: 3,
    answeredByFounder: true,
    reactionCount: 5,
    myReaction: null,
    answers: ANSWERS,
}

/** A fresh, course-general question — nobody has answered it yet. */
const QUESTION_UNANSWERED: QaQuestionThreadQuestion = {
    id: "q-2",
    author: PEER,
    createdTimeAgo: "3 minutes ago",
    body: "Does this course cover E2E testing anywhere?",
    scope: { kind: "general" },
    replyCount: 0,
    reactionCount: 0,
    myReaction: null,
    answers: [],
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the whole collapsed row as one press target (surface face, hover/press feedback, opens into the full conversation) — the SAME composite also bounds the opened conversation's header/bubbles/composer, just without `onPress`", storyId: "composites-cards-surfacecard-surfacecard--pressable" },
    "StackH": { tier: "frame", role: "a horizontal track — avatar beside identity/preview/chips, an identity line, or chips beside the reaction bar", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "a vertical track — the row's own text stack, or the conversation's own regions (header / bubbles / composer)", storyId: "frames-stack-stackv--default" },
    "Avatar": { tier: "atom", role: "the asker's avatar in the collapsed row", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — asker name, relative time, the empty-thread notice, or their skeleton mirrors", storyId: "atoms-text-typography-typography--plain" },
    "MarkdownContent": { tier: "composite", role: "the question body — a two-line clamp in the collapsed row, a compact render inside the question bubble", storyId: "composites-viewers-markdowncontent--compact" },
    "Chip": { tier: "atom", role: "the scope or status chip, real or its skeleton mirror", storyId: "atoms-chips-chip-chip--default" },
    "Cluster": { tier: "frame", role: "the scope + status (+ reply-count) chip row", storyId: "frames-cluster-cluster--default" },
    "CourseQaComposer": { tier: "block", role: "the bottom plain composer that posts a new top-level answer", storyId: "starci-blocks-learn-courseqacomposer-courseqacomposer--expanded-form" },
}

/**
 * The `Expanded` leaf has no controlled prop of its own (the toggle is
 * deliberately internal, mirroring `src`'s real `QuestionRow` — see the
 * component file header). This story-only wrapper opens it the same way a
 * reader would: it presses the collapsed row's own press target once mounted,
 * so the story lands directly on the conversation instead of asking the
 * reader to click through first.
 */
const ExpandedPreview = (props: QaQuestionThreadProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        containerRef.current?.querySelector("button")?.click()
    }, [])
    return (
        <div data-tier="fixture" ref={containerRef}>
            <QaQuestionThread {...props} />
        </div>
    )
}

/** LEAF — `Collapsed`: the private social inbox row, whole row pressable. */
export const Collapsed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QaQuestionThread"
                tier="block"
                leaf="Collapsed"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "replyCount = 3, answeredByFounder = true",
                        why: "The everyday row: a pinned question with three replies, the last one from the founder. The status chip reads the founder-answered wording and the status dot goes success-green, so a reader scanning the whole inbox can tell this one is settled without opening it.",
                        code: `<QaQuestionThread
    question={questionAnswered}
    currentUserId={currentUserId}
    currentUser={currentUser}
/>`,
                        render: (
                            <QaQuestionThread
                                anatPart="QaQuestionThread"
                                showAnatomy
                                question={QUESTION_ANSWERED}
                                currentUserId="u-peer"
                                currentUser={CURRENT_USER}
                            />
                        ),
                    },
                    {
                        name: "replyCount = 0",
                        why: "A fresh, course-general question with nobody having answered yet: the scope chip reads \"General\" (no lesson tag), the status chip reads the neutral \"Unanswered\" wording, and the status dot goes warning instead of success — the row's own honest signal that this one still needs an answer.",
                        code: "<QaQuestionThread question={questionUnanswered} currentUserId={currentUserId} currentUser={currentUser} />",
                        render: (
                            <QaQuestionThread
                                question={QUESTION_UNANSWERED}
                                currentUserId="u-peer"
                                currentUser={CURRENT_USER}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the row composes swaps to its own shimmer — avatar, identity line, the two-line preview, both chips — and the row stops accepting presses (there is no conversation to open yet). The flag reaches the real atoms rather than a parallel skeleton tree, so the row keeps the exact box the real one will land into.",
                        code: "<QaQuestionThread question={questionAnswered} currentUserId={null} currentUser={null} isSkeleton />",
                        render: (
                            <QaQuestionThread
                                question={QUESTION_ANSWERED}
                                currentUserId={null}
                                currentUser={null}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `Expanded`: the full conversation, opened. */
export const Expanded: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QaQuestionThread"
                tier="block"
                leaf="Expanded"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "answers.length = 2 (one carrying a flattened reply)",
                        why: "The header opens with the collapse control and the asker's identity; the question itself becomes the first chat bubble, left-aligned because the signed-in viewer (Brandon Le) is not its author; the two answers follow as their own bubbles, the founder's own one carrying the accepted-answer badge plus a flattened reply riding beside it with a reply-to tag instead of an indent; the bottom composer stays ready to add one more.",
                        code: `<QaQuestionThread
    question={questionAnswered}
    currentUserId={currentUserId}
    currentUser={currentUser}
    onAnswered={bumpAggregates}
/>
// pressing the collapsed row is what opens this shape`,
                        render: (
                            <ExpandedPreview
                                anatPart="QaQuestionThread"
                                showAnatomy
                                question={QUESTION_ANSWERED}
                                currentUserId="u-peer"
                                currentUser={CURRENT_USER}
                            />
                        ),
                    },
                    {
                        name: "answers.length = 0",
                        why: "Nobody has answered this one yet, so the header carries the quiet \"be the first to answer\" wording (see `QaConversationHeader`'s own contract) and the answer region drops the bubble list for a single honest line inviting the viewer to write the first one — never a hollow list rendering nothing.",
                        code: `<QaQuestionThread
    question={questionUnanswered}
    currentUserId={currentUserId}
    currentUser={currentUser}
/>`,
                        render: (
                            <ExpandedPreview
                                question={QUESTION_UNANSWERED}
                                currentUserId="u-peer"
                                currentUser={CURRENT_USER}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
