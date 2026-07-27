import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentTabBar } from "@sb-components/starci/blocks/learn/ContentTabBar/ContentTabBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentTabBar`: HOW to look at this lesson. Reading, sandbox,
 * challenges, AI lab — four ways into the same lesson, one row.
 *
 * WHY A BLOCK AND NOT THE `Tabs` ATOM: the four modes are DOMAIN. The block owns
 * their order, their words and their icons, so the caller says `mode="sandbox"`
 * and never hands over labels. A caller that could pass labels would own the
 * vocabulary of the whole reading experience.
 *
 * ⚠️ NEVER SKELETONISED, on purpose. The row is static chrome: it is known
 * before any lesson data lands, so it paints immediately and gives the reader
 * something to act on while the body loads. A shimmer here would hide a control
 * that was already ready — which is why this block has no `isSkeleton` prop at
 * all rather than one that is merely unused.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Every leaf below renders the same row of tabs;
 * what changes is which one is selected, whether one is locked, and whether one
 * carries a count — all DATA, so they are states inside one leaf.
 */
const meta: Meta<typeof ContentTabBar> = {
    title: "StarCi/Blocks/Learn/ContentTabBar/ContentTabBar",
    component: ContentTabBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentTabBar>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tabs": { tier: "atom", role: "the tab row itself, owning the trigger shape, the selected indicator and the keyboard behaviour; the block only decides which modes exist and what they are called", storyId: "atoms-navigation-tabs-tabs--default" },
}

/** LEAF — the row of modes a lesson offers. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentTabBar"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "mode = content",
                        why: "The reader is on the lesson text, so the reading tab holds the indicator and the other three modes wait beside it. This is where every lesson opens, and the challenge tab carries its count so the reader can see there is work waiting without switching.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab" }]}
    onModeChange={setMode}
/>`,
                        render: (
                            <ContentTabBar
                                anatPart="ContentTabBar"
                                showAnatomy
                                ariaLabel="Cách xem bài học"
                                mode="content"
                                modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab" }]}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "mode = challenges",
                        why: "The indicator has moved to the challenges tab, and nothing else about the row changes. Selection is the one thing this block tracks, so it is worth seeing that moving it does not disturb the widths around it.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="challenges"
    modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab" }]}
    onModeChange={setMode}
/>`,
                        render: (
                            <ContentTabBar
                                ariaLabel="Cách xem bài học"
                                mode="challenges"
                                modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab" }]}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "aiLab.isLocked = true",
                        why: "The AI lab is premium and unbought, so it renders muted and refuses selection while staying in the row. Dropping it would make the paywall a surprise later, where leaving it visible states the offer up front.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab", isLocked: true }]}
    onModeChange={setMode}
/>`,
                        render: (
                            <ContentTabBar
                                ariaLabel="Cách xem bài học"
                                mode="content"
                                modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab", isLocked: true }]}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a text-only lesson ⇒ **loses** every tab but one. */
export const ReadingOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentTabBar"
                tier="block"
                leaf="Reading only"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "modes.length = 1",
                        why: "A lesson with no sandbox, no challenges and no lab offers one way in, so the row shrinks to a single tab. It is worth keeping the row rather than hiding it: the tab still names what the reader is looking at, and the layout below does not shift when a richer lesson follows.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={[{ mode: "content" }]}
    onModeChange={setMode}
/>`,
                        render: (
                            <ContentTabBar
                                anatPart="ContentTabBar"
                                showAnatomy
                                ariaLabel="Cách xem bài học"
                                mode="content"
                                modes={[{ mode: "content" }]}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
