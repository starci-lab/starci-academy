import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardReviewPage } from "@sb-components/starci/pages/FlashcardReviewPage/FlashcardReviewPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `FlashcardReviewPage`: browse decks and clear today's due queue, one
 * card at a time. See the component's own file header for the full phase model
 * and the two marked GAPs it leaves rather than fakes (the confirm dialog on
 * leave/end-early, and the dead `FlashcardStudyRail`).
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. Six blocks — two reused
 * (`FlashcardModeSwitch`, `WorkSessionHeader`), four new this run — arranged by
 * `phase`.
 *
 * 📐 THREE LEAVES, matching the one structural fork (`phase`) plus the one
 * prop-flip that only the overview phase exposes (`isSkeleton`) — the same
 * granularity `QuizPage`'s own story keeps its `SetupLoading` leaf at:
 *   `Overview` (2 states: resume-in-progress vs. plain due queue) ·
 *   `OverviewLoading` (prop flip) · `Session` (2 states: question vs. graded).
 */
const meta: Meta<typeof FlashcardReviewPage> = {
    title: "StarCi/Pages/FlashcardReviewPage/FlashcardReviewPage",
    component: FlashcardReviewPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FlashcardReviewPage>

const DECKS = [
    { id: "docker", title: "Docker cơ bản", description: "Image, layer và cache", difficulty: "beginner" as const, dueCount: 6, masteredCount: 18, totalCount: 30 },
    { id: "k8s", title: "Kubernetes networking", description: "Service, Ingress, DNS nội bộ", difficulty: "advanced" as const, masteredCount: 4, totalCount: 40 },
    { id: "cicd", title: "CI/CD pipeline", description: "Build, test, deploy tự động", difficulty: "intermediate" as const, dueCount: 2, masteredCount: 12, totalCount: 20 },
]

const RATING_OPTIONS = [
    { grade: 0, label: "Quên", hint: "Gặp lại hôm nay" },
    { grade: 1, label: "Khó", hint: "Gặp lại sau 1 ngày" },
    { grade: 2, label: "Được", hint: "Gặp lại sau 4 ngày" },
    { grade: 3, label: "Dễ", hint: "Gặp lại sau 10 ngày" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning the seam between the screen's own page-level wrapper and whichever phase cluster is on screen, or between the blocks inside that cluster", storyId: "frames-stack-stackv--default" },
    "FlashcardModeSwitch": { tier: "block", role: "study-vs-drill switch, shown only in the overview phase and gone the moment a session starts", storyId: "starci-blocks-learn-flashcardmodeswitch-flashcardmodeswitch--full" },
    "FlashcardDueHero": { tier: "block", role: "the due-today focal card — how many cards are owed across every enrolled course, and the one action that follows", storyId: "starci-blocks-learn-flashcardduehero-flashcardduehero--overview" },
    "FlashcardMasteryStrip": { tier: "block", role: "the mastery readout for the currently focused deck", storyId: "starci-blocks-learn-flashcardmasterystrip-flashcardmasterystrip--overview" },
    "FlashcardDeckList": { tier: "block", role: "search, switch shape and page through every deck, and jump into any one of them", storyId: "starci-blocks-learn-flashcarddecklist-flashcarddecklist--overview" },
    "WorkSessionHeader": { tier: "block", role: "the session band — a way out, a position, a rail — reused with its own data for the review session", storyId: "starci-blocks-navigation-worksessionheader-worksessionheader--full" },
    "FlashcardStudyCard": { tier: "block", role: "one card of the run — question, then reveal to grade", storyId: "starci-blocks-learn-flashcardstudycard-flashcardstudycard--overview" },
}

/** LEAF — overview: the mode switch plus the three overview blocks. */
export const Overview: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardReviewPage"
                tier="screen"
                leaf="Overview"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "dueResume = undefined (không có đợt ôn dở)",
                        why: "The learner has nothing paused, so the due hero shows the plain due-count shape with a Start CTA. This is the shape most visits to the overview open on — nothing left over from before, three blocks stacked answering three different questions.",
                        code: `<FlashcardReviewPage
    phase="overview"
    flashcardMode="study"
    onFlashcardModeChange={setMode}
    flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
    dueCount={8}
    dueReviewCount={5}
    dueNewCount={3}
    onDueStart={startDue}
    masteryMastered={18}
    masteryTotal={30}
    masteryLearning={9}
    masteryNewCount={3}
    masteryStreak={7}
    masteryRetention={82}
    masteryTotalReviewed={64}
    decks={decks}
    deckQuery=""
    onDeckQueryChange={setQuery}
    deckView="grid"
    onDeckViewChange={setView}
    deckPage={1}
    deckTotalPages={2}
    onDeckPageChange={setPage}
    onSelectDeck={openDeck}
    showDeckProgress
    …
/>`,
                        render: (
                            <FlashcardReviewPage
                                showAnatomy
                                phase="overview"
                                flashcardMode="study"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                dueCount={8}
                                dueReviewCount={5}
                                dueNewCount={3}
                                onDueStart={() => {}}
                                masteryMastered={18}
                                masteryTotal={30}
                                masteryLearning={9}
                                masteryNewCount={3}
                                masteryStreak={7}
                                masteryRetention={82}
                                masteryTotalReviewed={64}
                                decks={DECKS}
                                deckQuery=""
                                onDeckQueryChange={() => {}}
                                deckView="grid"
                                onDeckViewChange={() => {}}
                                deckPage={1}
                                deckTotalPages={2}
                                onDeckPageChange={() => {}}
                                onSelectDeck={() => {}}
                                showDeckProgress
                                sessionBackLabel="Thoát"
                                onSessionBack={() => {}}
                                sessionCounter=""
                                sessionTotal={0}
                                sessionCurrent={0}
                                cardQuestion=""
                                cardRevealed={false}
                                onCardReveal={() => {}}
                                cardRatingOptions={RATING_OPTIONS}
                                onCardRate={() => {}}
                                isCardFirst
                                isCardLast
                                onCardPrev={() => {}}
                                onCardNext={() => {}}
                            />
                        ),
                    },
                    {
                        name: "dueResume = { current: 4, total: 10 } (còn đợt ôn dở)",
                        why: "A batch was paused halfway; the due hero's whole shape swaps to a resume card, so the due-count breakdown steps aside — finishing what's in flight outranks a fresh total. The mastery strip and deck list underneath do not move.",
                        code: `<FlashcardReviewPage
    phase="overview"
    dueResume={{ current: 4, total: 10, onPress: resume }}
    …
/>`,
                        render: (
                            <FlashcardReviewPage
                                phase="overview"
                                flashcardMode="study"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                dueCount={10}
                                dueReviewCount={7}
                                dueNewCount={3}
                                dueResume={{ current: 4, total: 10, onPress: () => {} }}
                                onDueStart={() => {}}
                                masteryMastered={18}
                                masteryTotal={30}
                                masteryLearning={9}
                                masteryNewCount={3}
                                masteryStreak={7}
                                masteryRetention={82}
                                masteryTotalReviewed={64}
                                decks={DECKS}
                                deckQuery=""
                                onDeckQueryChange={() => {}}
                                deckView="grid"
                                onDeckViewChange={() => {}}
                                deckPage={1}
                                deckTotalPages={2}
                                onDeckPageChange={() => {}}
                                onSelectDeck={() => {}}
                                showDeckProgress
                                sessionBackLabel="Thoát"
                                onSessionBack={() => {}}
                                sessionCounter=""
                                sessionTotal={0}
                                sessionCurrent={0}
                                cardQuestion=""
                                cardRevealed={false}
                                onCardReveal={() => {}}
                                cardRatingOptions={RATING_OPTIONS}
                                onCardRate={() => {}}
                                isCardFirst
                                isCardLast
                                onCardPrev={() => {}}
                                onCardNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; only the three overview blocks that can mirror themselves do. */
export const OverviewLoading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardReviewPage"
                tier="screen"
                leaf="Overview — loading"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "FlashcardDueHero, FlashcardMasteryStrip and FlashcardDeckList each mirror their own eventual shape while overview data loads. FlashcardModeSwitch does not shimmer — it is known before any request lands, same reasoning ContentModeNav and FlashcardModeSwitch's own file header give for staying static — so the mode row paints immediately while the three data-backed blocks beneath it are still loading.",
                        code: `<FlashcardReviewPage
    phase="overview"
    isSkeleton
    dueCount={0}
    decks={[]}
    …
/>`,
                        render: (
                            <FlashcardReviewPage
                                showAnatomy
                                phase="overview"
                                flashcardMode="study"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                dueCount={0}
                                dueReviewCount={0}
                                dueNewCount={0}
                                onDueStart={() => {}}
                                masteryMastered={0}
                                masteryTotal={0}
                                masteryLearning={0}
                                masteryNewCount={0}
                                masteryTotalReviewed={0}
                                decks={[]}
                                deckQuery=""
                                onDeckQueryChange={() => {}}
                                deckView="grid"
                                onDeckViewChange={() => {}}
                                deckPage={1}
                                deckTotalPages={1}
                                onDeckPageChange={() => {}}
                                onSelectDeck={() => {}}
                                showDeckProgress
                                isSkeleton
                                sessionBackLabel="Thoát"
                                onSessionBack={() => {}}
                                sessionCounter=""
                                sessionTotal={0}
                                sessionCurrent={0}
                                cardQuestion=""
                                cardRevealed={false}
                                onCardReveal={() => {}}
                                cardRatingOptions={RATING_OPTIONS}
                                onCardRate={() => {}}
                                isCardFirst
                                isCardLast
                                onCardPrev={() => {}}
                                onCardNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — session: the session band plus one card, the mode switch gone. */
export const Session: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardReviewPage"
                tier="screen"
                leaf="Session"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "cardRevealed = false (chưa lật)",
                        why: "The learner is on card 3 of 10, question showing — FlashcardModeSwitch is entirely gone (switching mode mid-session would throw the run away), and the session band's rail shows two graded steps with the third standing taller. This is the shape most of a review session looks like.",
                        code: `<FlashcardReviewPage
    phase="session"
    sessionBackLabel="Thoát"
    onSessionBack={leave}
    sessionTitle="Ôn tập hôm nay"
    sessionCounter="Thẻ 3 / 10"
    sessionTotal={10}
    sessionCurrent={3}
    sessionDoneSteps={[1, 2]}
    sessionFinishLabel="Kết thúc"
    onSessionFinish={finish}
    cardQuestion={question}
    cardLevelLabel="Middle"
    cardRevealed={false}
    onCardReveal={reveal}
    cardRatingOptions={ratingOptions}
    onCardRate={rate}
    isCardFirst={false}
    isCardLast={false}
    onCardPrev={prev}
    onCardNext={next}
    …
/>`,
                        render: (
                            <FlashcardReviewPage
                                showAnatomy
                                phase="session"
                                flashcardMode="study"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                dueCount={0}
                                dueReviewCount={0}
                                dueNewCount={0}
                                onDueStart={() => {}}
                                masteryMastered={0}
                                masteryTotal={0}
                                masteryLearning={0}
                                masteryNewCount={0}
                                masteryTotalReviewed={0}
                                decks={[]}
                                deckQuery=""
                                onDeckQueryChange={() => {}}
                                deckView="grid"
                                onDeckViewChange={() => {}}
                                deckPage={1}
                                deckTotalPages={1}
                                onDeckPageChange={() => {}}
                                onSelectDeck={() => {}}
                                showDeckProgress
                                sessionBackLabel="Thoát"
                                onSessionBack={() => {}}
                                sessionTitle="Ôn tập hôm nay"
                                sessionCounter="Thẻ 3 / 10"
                                sessionTotal={10}
                                sessionCurrent={3}
                                sessionDoneSteps={[1, 2]}
                                onSessionStepPress={() => {}}
                                sessionFinishLabel="Kết thúc"
                                onSessionFinish={() => {}}
                                cardQuestion="Vì sao đặt `COPY . .` trước `npm ci` lại làm hỏng cache của Dockerfile?"
                                cardLevelLabel="Middle"
                                cardTags={["docker", "cache"]}
                                cardRevealed={false}
                                onCardReveal={() => {}}
                                cardRatingOptions={RATING_OPTIONS}
                                onCardRate={() => {}}
                                isCardFirst={false}
                                isCardLast={false}
                                onCardPrev={() => {}}
                                onCardNext={() => {}}
                            />
                        ),
                    },
                    {
                        name: "cardRevealed = true (đã lật, chờ chấm)",
                        why: "The same card, now revealed: the answer and explanation appear under the question, and RatingBar takes the question's place at the foot of the card — grading is the only thing left to do before moving on.",
                        code: `<FlashcardReviewPage
    phase="session"
    cardRevealed
    cardAnswer={answer}
    cardExplanation={explanation}
    …
/>`,
                        render: (
                            <FlashcardReviewPage
                                phase="session"
                                flashcardMode="study"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                dueCount={0}
                                dueReviewCount={0}
                                dueNewCount={0}
                                onDueStart={() => {}}
                                masteryMastered={0}
                                masteryTotal={0}
                                masteryLearning={0}
                                masteryNewCount={0}
                                masteryTotalReviewed={0}
                                decks={[]}
                                deckQuery=""
                                onDeckQueryChange={() => {}}
                                deckView="grid"
                                onDeckViewChange={() => {}}
                                deckPage={1}
                                deckTotalPages={1}
                                onDeckPageChange={() => {}}
                                onSelectDeck={() => {}}
                                showDeckProgress
                                sessionBackLabel="Thoát"
                                onSessionBack={() => {}}
                                sessionTitle="Ôn tập hôm nay"
                                sessionCounter="Thẻ 3 / 10"
                                sessionTotal={10}
                                sessionCurrent={3}
                                sessionDoneSteps={[1, 2]}
                                onSessionStepPress={() => {}}
                                sessionFinishLabel="Kết thúc"
                                onSessionFinish={() => {}}
                                cardQuestion="Vì sao đặt `COPY . .` trước `npm ci` lại làm hỏng cache của Dockerfile?"
                                cardLevelLabel="Middle"
                                cardTags={["docker", "cache"]}
                                cardRevealed
                                onCardReveal={() => {}}
                                cardAnswer="Mọi thay đổi code làm **vỡ cache** của bước cài phụ thuộc, nên lần build nào cũng cài lại từ đầu."
                                cardExplanation="COPY sớm khiến Docker coi bước cài phụ thuộc là đã đổi mỗi lần code đổi, nên nó luôn build lại từ bước đó."
                                cardRatingOptions={RATING_OPTIONS}
                                onCardRate={() => {}}
                                isCardFirst={false}
                                isCardLast={false}
                                onCardPrev={() => {}}
                                onCardNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
