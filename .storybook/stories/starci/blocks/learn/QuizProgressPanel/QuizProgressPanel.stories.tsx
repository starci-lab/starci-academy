import type { Meta, StoryObj } from "@storybook/nextjs"
import { CardsIcon, FlameIcon, TargetIcon, TrophyIcon } from "@phosphor-icons/react"
import { QuizProgressPanel } from "@sb-components/starci/blocks/learn/QuizProgressPanel/QuizProgressPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `QuizProgressPanel` — how has this learner been drilling: lifetime numbers and the
 * sessions behind them. Sits beside `QuizSetup` in the setup pane. `Empty` is its
 * own shape — with zero sessions both views would be empty, so the whole panel
 * collapses to one invitation rather than letting the learner flip between two empty
 * views. The `stats` ⇄ `history` view switch is a state inside `Content` (swapping
 * `StatGridCard` vs `SurfaceCardList`) since both read the same already-loaded data.
 */
const meta: Meta<typeof QuizProgressPanel> = {
    title: "StarCi/Blocks/Learn/QuizProgressPanel/QuizProgressPanel",
    component: QuizProgressPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizProgressPanel>

const STATS = [
    { key: "accuracy", icon: TargetIcon, label: "Accuracy", value: "82%" },
    { key: "streak", icon: FlameIcon, label: "Day streak", value: "7 days" },
    { key: "total", icon: CardsIcon, label: "Total answered", value: "126" },
    { key: "avgScore", icon: TrophyIcon, label: "Average score", value: "7.4/10" },
]

const SESSIONS = [
    { key: "run3", name: "Review Docker before the interview", dateLabel: "Yesterday", scoreLabel: "8/10 correct", onPress: () => {} },
    { key: "run2", name: "Quick CI/CD drill", dateLabel: "3 days ago", scoreLabel: "6/10 correct", onPress: () => {} },
    { key: "run1", name: "Review Kubernetes", dateLabel: "Last week", scoreLabel: "9/10 correct", onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the one card face both views share — the label and the box stay put across the stats/history switch", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical frame separating the tab row from whichever view is showing beneath it, or a stat cell's own label-over-value pair", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding a stat cell's icon beside its label", storyId: "frames-stack-stackh--default" },
    "Tabs": { tier: "atom", role: "the stats/history switch — the same tab-strip atom every other mode row in this catalog uses, never a hand-rolled row", storyId: "atoms-navigation-tabs-tabs--default" },
    "StatGridCard": { tier: "composite", role: "the lifetime-numbers grid; this block only feeds it icon+label+value cells, the grid/border/span structure is the composite's own", storyId: "composites-stats-statgridcard--even" },
    "SurfaceCardList": { tier: "composite", role: "the run history, one row per past session; the block maps a session straight onto the row's title/subtitle/metaText/onPress fields", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "Typography": { tier: "atom", role: "a stat cell's own label or value line, real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "EmptyState": { tier: "composite", role: "the single invitation the whole panel becomes when no session has ever run — it replaces the tab switch and both views at once", storyId: "composites-feedback-emptystate--icon-and-title" },
}

/** LEAF — progress data has landed: the tab switch plus whichever view is selected. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizProgressPanel"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "view = \"stats\"",
                        why: "The lifetime numbers lead: accuracy, streak, total answered, average score, each fed to StatGridCard as one cell. This is the view a learner opens the panel to first — the running scoreboard before they decide whether to start another run.",
                        code: `<QuizProgressPanel
    label="How you have been practicing"
    view="stats"
    onViewChange={setView}
    viewAriaLabel="Choose to view stats or history"
    stats={stats}
    sessions={sessions}
/>`,
                        render: (
                            <QuizProgressPanel

                               
                                label="How you have been practicing"
                                view="stats"
                                onViewChange={() => {}}
                                viewAriaLabel="Choose to view stats or history"
                                stats={STATS}
                                sessions={SESSIONS}
                            />
                        ),
                    },
                    {
                        name: "view = \"history\"",
                        why: "The same card, the same data, but now the past runs themselves — each a row with when it happened and how it went, tappable to reopen. Nothing about the panel's identity changes; only which half of the same progress it shows.",
                        code: `<QuizProgressPanel
    label="How you have been practicing"
    view="history"
    onViewChange={setView}
    viewAriaLabel="Choose to view stats or history"
    stats={stats}
    sessions={sessions}
/>`,
                        render: (
                            <QuizProgressPanel
                                label="How you have been practicing"
                                view="history"
                                onViewChange={() => {}}
                                viewAriaLabel="Choose to view stats or history"
                                stats={STATS}
                                sessions={SESSIONS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so the card mirrors its own eventual shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizProgressPanel"
                tier="block"
                leaf="Loading"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "isSkeleton = true, view = \"stats\"",
                        why: "The tab strip and the four stat cells all shimmer in the exact grid they will hold once numbers land — a fixed 4-cell shape known ahead of any real data, same reasoning as a comment thread's own skeleton rows.",
                        code: "<QuizProgressPanel label=\"How you have been practicing\" view=\"stats\" stats={[]} sessions={[]} isSkeleton />",
                        render: (
                            <QuizProgressPanel

                               
                                label="How you have been practicing"
                                view="stats"
                                onViewChange={() => {}}
                                viewAriaLabel="Choose to view stats or history"
                                stats={[]}
                                sessions={[]}
                                isSkeleton
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, view = \"history\"",
                        why: "Switching tabs while still loading swaps which mirror is under the tab strip — three shimmering rows instead of the stat grid — because the row list owns its own skeleton shape independently of the grid's.",
                        code: "<QuizProgressPanel label=\"How you have been practicing\" view=\"history\" stats={[]} sessions={[]} isSkeleton />",
                        render: (
                            <QuizProgressPanel
                                label="How you have been practicing"
                                view="history"
                                onViewChange={() => {}}
                                viewAriaLabel="Choose to view stats or history"
                                stats={[]}
                                sessions={[]}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — no run has ever happened, so the tab switch and both views disappear together. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizProgressPanel"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "sessions = []",
                        why: "Nothing has ever been run, so there is nothing for either view to show — a scoreboard reading all zeros next to an empty history list would be two blank screens behind a switch. One invitation instead, pointing at the setup form beside this panel where the first run actually starts.",
                        code: `<QuizProgressPanel
    label="How you have been practicing"
    view="stats"
    onViewChange={setView}
    viewAriaLabel="Choose to view stats or history"
    stats={[]}
    sessions={[]}
/>`,
                        render: (
                            <QuizProgressPanel

                               
                                label="How you have been practicing"
                                view="stats"
                                onViewChange={() => {}}
                                viewAriaLabel="Choose to view stats or history"
                                stats={[]}
                                sessions={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
