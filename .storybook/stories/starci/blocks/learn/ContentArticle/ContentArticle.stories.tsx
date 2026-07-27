import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentArticle } from "@sb-components/starci/blocks/learn/ContentArticle/ContentArticle"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentArticle`: the lesson itself, on the page it is read from.
 *
 * WHY A BLOCK OVER THE VIEWER: `MarkdownContent` repeats a document; this block
 * knows the document is a LESSON — that it can be locked, that a first-time
 * reader needs telling they can ask AI about a passage, and that the offer
 * belongs UNDER the text rather than in place of it.
 *
 * ⭐ LOCKED FADES, IT DOES NOT CUT. The body stays mounted and its tail fades
 * into the surface with the offer under it. Truncating would tell the reader
 * nothing about what they are being asked to buy; the fade shows the lesson
 * continues and stops them at the same time. Selection is switched off too — the
 * fade only hides the tail visually, and a reader could otherwise select through
 * it.
 *
 * ⭐ THE PAYWALL IS INSIDE THE SAME CARD, flat, under the faded tail: one surface
 * that runs out, not a second card interrupting the first. That is exactly why
 * `ContentPaywall` draws no frame of its own.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Locking adds the fade and the offer and removes
 * the hint ⇒ its own leaf; so does the caller flipping `isSkeleton`. Whether the
 * hint shows on an open lesson is data ⇒ a state.
 */
const meta: Meta<typeof ContentArticle> = {
    title: "StarCi/Blocks/Learn/ContentArticle/ContentArticle",
    component: ContentArticle,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentArticle>

const BODY = `## Vì sao image phình

Mỗi lệnh trong \`Dockerfile\` đẻ ra một **layer**, và layer thì cộng dồn — xoá file ở layer
sau không lấy lại chỗ đã chiếm ở layer trước.

- \`COPY . .\` trước \`npm ci\` làm cache vỡ mỗi lần sửa code
- toolchain nằm lại trong image chạy thật

\`\`\`dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
\`\`\`

> Đọc kỹ thứ tự lệnh trước khi tối ưu bất cứ thứ gì khác.

Phần dưới đi vào multi-stage build và cách ghim tag cho production.`

const OFFER = {
    title: "Phần còn lại dành cho học viên",
    description: "Mở khoá toàn bộ bài học, thử thách và sandbox của khoá này.",
    discountedPriceVnd: 1290000,
    originalPriceVnd: 1990000,
    currentPhase: PricingPhase.Pioneer,
    seatsRemaining: 12,
    nextPhasePriceVnd: 1590000,
    ctaLabel: "Mở khoá khoá học",
    onPurchase: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the reading card the lesson sits on, owning the paper surface and the padding around everything inside it", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical frame separating the hint, the body and the offer, owning the seams between them", storyId: "frames-stack-stackv--default" },
    "FeedbackCallout": { tier: "composite", role: "the one-time tip that a passage can be selected to ask AI, drawn as a flat strip so it leads the body without competing with it", storyId: "composites-feedback-feedback-feedbackcallout--default" },
    "MarkdownContent": { tier: "composite", role: "the viewer that repeats the authored lesson; the block hands it the document and never inspects what is in it", storyId: "composites-viewers-markdowncontent--reading" },
    "ContentPaywall": { tier: "block", role: "the offer under the faded tail, reused unchanged so pricing reads the same here as on the course page", storyId: "starci-blocks-learn-contentpaywall-contentpaywall--full" },
}

/** LEAF — an open lesson: the reader can read all of it. */
export const Open: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentArticle"
                tier="block"
                leaf="Open"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLocked = false, hintText set",
                        why: "The lesson renders in full with the one-time selection tip leading it. The tip is placed above the body rather than beside a paragraph, because the feature it teaches cannot be discovered until a passage is already selected.",
                        code: `<ContentArticle
    body={lesson.body}
    hintText="Bôi đen một đoạn để hỏi AI về đúng chỗ đó."
/>`,
                        render: (
                            <ContentArticle
                                anatPart="ContentArticle"
                                showAnatomy
                                body={BODY}
                                hintText="Bôi đen một đoạn để hỏi AI về đúng chỗ đó."
                            />
                        ),
                    },
                    {
                        name: "hintText = undefined",
                        why: "The reader has already seen the tip, so the body leads the card. This is the steady state of every lesson after the first, and it is worth seeing that removing the strip leaves no gap behind it.",
                        code: "<ContentArticle body={lesson.body} />",
                        render: <ContentArticle body={BODY} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a locked lesson ⇒ **gains** the fade and the offer, **loses** the hint. */
export const Locked: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentArticle"
                tier="block"
                leaf="Locked"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLocked = true",
                        why: "The body still renders and fades into the surface, with the offer flat underneath inside the same card. The reader can see the lesson continues, which is the whole argument for fading rather than truncating, and selection is switched off so the faded tail cannot be read around.",
                        code: `<ContentArticle
    body={lesson.body}
    isLocked
    offer={offer}
/>`,
                        render: (
                            <ContentArticle
                                anatPart="ContentArticle"
                                showAnatomy
                                body={BODY}
                                isLocked
                                offer={OFFER}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the card mirrors its own body. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentArticle"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The card draws its own mirror while the lesson is fetched, keeping the paper surface the document will land on. The card owns that mirror rather than the viewer, because the viewer cannot know how long a document it has not received will be.",
                        code: "<ContentArticle body=\"\" isSkeleton />",
                        render: (
                            <ContentArticle
                                anatPart="ContentArticle"
                                showAnatomy
                                body=""
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
