import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuizRecapList } from "@sb-components/starci/blocks/learn/QuizRecapList/QuizRecapList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QuizRecapList`: the run is over, go back over what you answered and
 * say how well you actually knew each one.
 *
 * ⭐ THE GRADE HERE IS NOT THE VERDICT FROM THE RUN. During the drill the SYSTEM
 * judged right or wrong; here the LEARNER judges how well they remembered. They
 * are different questions — a card can be marked correct and still be one the
 * learner wants back tomorrow, which is exactly the case the spaced-repetition
 * schedule needs and an automatic verdict cannot see. The `CorrectButShaky`
 * state below is that case.
 *
 * ⭐ ALREADY-GRADED CARDS KEEP THEIR RATING BAR. Nothing collapses or locks after
 * a tap: someone going back over a run changes their mind, and removing the
 * control would make the first tap final without ever saying so.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): how many cards, and which are rated, is data ⇒
 * states inside one leaf. Finishing the recap changes the counter line only.
 */
const meta: Meta<typeof QuizRecapList> = {
    title: "StarCi/Blocks/Learn/QuizRecapList/QuizRecapList",
    component: QuizRecapList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizRecapList>

const RATING_OPTIONS = [
    { grade: 0, label: "Quên", hint: "Gặp lại hôm nay" },
    { grade: 1, label: "Khó", hint: "Gặp lại sau 1 ngày" },
    { grade: 2, label: "Được", hint: "Gặp lại sau 4 ngày" },
    { grade: 3, label: "Dễ", hint: "Gặp lại sau 10 ngày" },
]

const CARDS = [
    {
        key: "layer",
        question: "Vì sao xoá file ở layer sau không làm image nhẹ đi?",
        expectedAnswer: "Layer **cộng dồn**: layer sau chỉ ghi đè, chỗ đã chiếm ở layer trước vẫn nằm trong image.",
        givenAnswer: "Vì layer trước vẫn còn file đó, xoá ở sau chỉ là ghi đè thôi.",
        wasCorrect: true,
    },
    {
        key: "cache",
        question: "Đặt `COPY . .` trước `npm ci` thì hỏng chuyện gì?",
        expectedAnswer: "Mọi thay đổi code làm **vỡ cache** của bước cài phụ thuộc, nên lần build nào cũng cài lại từ đầu.",
        givenAnswer: "Em nghĩ là image nặng hơn.",
        wasCorrect: false,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "a vertical frame — the run of cards, or the label-and-body pairs inside one card", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding a card's verdict chip on its own row", storyId: "frames-stack-stackh--default" },
    "SurfaceCard": { tier: "composite", role: "one answered card's surface, owning its padding and the box every part inside it sits in", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "Chip": { tier: "atom", role: "how the RUN judged this answer — the system's verdict, not the learner's own rating", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "the counter line, a section label, or the answer the learner typed during the run", storyId: "atoms-text-typography-typography--plain" },
    "MarkdownContent": { tier: "composite", role: "the viewer repeating the authored question and expected answer at the compact measure, because here a card is a passenger rather than the page", storyId: "composites-viewers-markdowncontent--compact" },
    "RatingBar": { tier: "block", role: "the learner's OWN recall grade for this card, reused unchanged from flashcard review so both places feed the schedule the same way", storyId: "starci-blocks-learn-ratingbar-ratingbar--full" },
    "Skeleton": { tier: "heroui", role: "the counter-line bar plus, per shimmering card, a chip bar and two text bars, standing in for the recap before real `cards` have arrived" },
}

/** LEAF — the recap of a finished run. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizRecapList"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "cards.length = 2, none rated",
                        why: "Both answered cards are laid out with the run's own verdict, what the learner typed, the expected answer, and a rating bar under each. The counter line above says how much of the recap is left, which is the only progress signal here because the recap is work to finish rather than an achievement to celebrate.",
                        code: `<QuizRecapList
    cards={cards}
    ratingOptions={ratingOptions}
    ratingAriaLabel="Bạn nhớ tới đâu"
    onRate={rate}
/>`,
                        render: (
                            <QuizRecapList
                                anatPart="QuizRecapList"
                                showAnatomy
                                cards={CARDS}
                                ratingOptions={RATING_OPTIONS}
                                ratingAriaLabel="Bạn nhớ tới đâu"
                                onRate={() => {}}
                            />
                        ),
                    },
                    {
                        name: "correct answer rated `Khó`",
                        why: "The run marked this card correct and the learner still rated it hard, so it comes back tomorrow. This is the whole reason the recap exists as a separate step: the system can only see whether an answer matched, while the learner knows whether they actually remembered it or guessed.",
                        code: `<QuizRecapList
    cards={[{ ...cards[0], rating: 1 }]}
    ratingOptions={ratingOptions}
    ratingAriaLabel="Bạn nhớ tới đâu"
    onRate={rate}
/>`,
                        render: (
                            <QuizRecapList
                                cards={[{ ...CARDS[0], rating: 1 }]}
                                ratingOptions={RATING_OPTIONS}
                                ratingAriaLabel="Bạn nhớ tới đâu"
                                onRate={() => {}}
                            />
                        ),
                    },
                    {
                        name: "every card rated",
                        why: "The counter line switches from what is left to what is done, and every rating bar stays exactly where it was. Nothing locks, because someone reading back over a finished recap is allowed to change their mind about a card.",
                        code: `<QuizRecapList
    cards={cards.map((card, index) => ({ ...card, rating: index }))}
    ratingOptions={ratingOptions}
    ratingAriaLabel="Bạn nhớ tới đâu"
    onRate={rate}
/>`,
                        render: (
                            <QuizRecapList
                                cards={CARDS.map((card, index) => ({ ...card, rating: index }))}
                                ratingOptions={RATING_OPTIONS}
                                ratingAriaLabel="Bạn nhớ tới đâu"
                                onRate={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the counter line and `skeletonCount` cards shimmer because there is no real recap to show yet. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizRecapList"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true, default skeletonCount",
                        why: "The counter line and three `SurfaceCard` rows shimmer in place of the real recap, each card mirroring its eventual shape as a verdict-chip bar over two text bars — so the layout does not jump once real `cards` land.",
                        code: `<QuizRecapList
    ratingOptions={ratingOptions}
    ratingAriaLabel="Bạn nhớ tới đâu"
    onRate={rate}
    isSkeleton
/>`,
                        render: (
                            <QuizRecapList
                                anatPart="QuizRecapList"
                                showAnatomy
                                ratingOptions={RATING_OPTIONS}
                                ratingAriaLabel="Bạn nhớ tới đâu"
                                onRate={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
