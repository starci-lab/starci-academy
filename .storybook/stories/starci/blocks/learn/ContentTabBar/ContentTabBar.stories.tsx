import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentTabBar } from "@sb-components/starci/blocks/learn/ContentTabBar/ContentTabBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentTabBar`: HOW to look at this lesson. Modes on the left, the
 * code language on the right.
 *
 * ⚠️ CORRECTED 2026-07-28, and worth reading before touching this file. The first
 * cut composed the `Tabs` ATOM directly and rebuilt a worse row on top of it. It
 * reached PAST an existing composite — `Toolbar` is the ported two-group tab row —
 * and silently dropped three behaviours the real screen depends on: the right
 * group entirely, `rightTabsNeutral`, and `collapseRightOnMobile`.
 *
 * None of that shows in a desktop screenshot of the happy path, which is exactly
 * why it survived a review and all nine gates: with one group at full width the
 * row LOOKED right. `Toolbar` even ships stories named `two-groups` and
 * `right-neutral-collapsed` — it had already documented the behaviours that went
 * missing.
 *
 * ⭐ ONE ACCENT SIGNAL. The mode group carries accent; the language group is
 * NEUTRAL. Switching language changes how the same lesson is PRESENTED rather
 * than what the reader is doing, so giving it accent too would put two things in
 * one row competing to be the thing you act on.
 *
 * ⚠️ NEVER SKELETONISED, on purpose: the row is static chrome, known before any
 * lesson data lands. There is no `isSkeleton` prop at all rather than one quietly
 * unused.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the right group appearing is a STRUCTURAL change
 * ⇒ its own leaf. Which mode is selected, and whether one is locked, are data ⇒
 * states.
 */
const meta: Meta<typeof ContentTabBar> = {
    title: "StarCi/Blocks/Learn/ContentTabBar/ContentTabBar",
    component: ContentTabBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentTabBar>

const MODES = [
    { mode: "content" as const },
    { mode: "sandbox" as const },
    { mode: "challenges" as const, count: 3 },
    { mode: "aiLab" as const },
]

const LANGUAGES = [
    { key: "typescript", label: "TypeScript" },
    { key: "java", label: "Java" },
    { key: "csharp", label: "C#" },
    { key: "go", label: "Go" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Toolbar": { tier: "composite", role: "the two-group tab row: it pins the mode group left and the language group right, owns the neutral-versus-accent chrome per group, and collapses the right group into a dropdown below @app-sm", storyId: "composites-navigation-toolbar-toolbar--two-groups" },
}

/** LEAF — a single-language lesson ⇒ the row carries only the mode group. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentTabBar"
                tier="block"
                leaf="Modes only"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "mode = content",
                        why: "The reader is on the lesson text, so the reading tab holds the indicator and the other three wait beside it. The challenge tab carries its count in the label, so the reader can see there is work waiting without switching to find out.",
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
                                modes={MODES}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "mode = challenges",
                        why: "The indicator has moved and nothing else about the row changes. Selection is the only thing this block tracks, so it is worth seeing that moving it disturbs no width around it.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="challenges"
    modes={modes}
    onModeChange={setMode}
/>`,
                        render: (
                            <ContentTabBar
                                ariaLabel="Cách xem bài học"
                                mode="challenges"
                                modes={MODES}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "aiLab.isLocked = true",
                        why: "The AI lab is premium and unbought, so it renders muted and refuses selection while staying in the row. Dropping it would make the paywall a surprise later; leaving it visible states the offer up front.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={[…, { mode: "aiLab", isLocked: true }]}
    onModeChange={setMode}
/>`,
                        render: (
                            <ContentTabBar
                                ariaLabel="Cách xem bài học"
                                mode="content"
                                modes={[...MODES.slice(0, 3), { mode: "aiLab" as const, isLocked: true }]}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a multi-language lesson ⇒ **gains** the right-hand language group. */
export const WithLanguages: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentTabBar"
                tier="block"
                leaf="With languages"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "languages.length = 4",
                        why: "The lesson exists in four languages, so a second group pins to the right of the row — NEUTRAL rather than accent, because switching language changes how the same lesson is presented, not what the reader is doing. Narrowing past @app-sm collapses this group into a dropdown instead of crowding the reading column with a second tab strip.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={modes}
    onModeChange={setMode}
    languages={[{ key: "typescript", label: "TypeScript" }, …]}
    language="typescript"
    languageAriaLabel="Ngôn ngữ code"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentTabBar
                                anatPart="ContentTabBar"
                                showAnatomy
                                ariaLabel="Cách xem bài học"
                                mode="content"
                                modes={MODES}
                                onModeChange={() => {}}
                                languages={LANGUAGES}
                                language="typescript"
                                languageAriaLabel="Ngôn ngữ code"
                                onLanguageChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "languages.length = 1",
                        why: "Only one language exists, so the right group is not drawn at all — a switcher with a single option is a control that cannot do anything. This is the case that proves the group is driven by the DATA rather than by a flag the caller has to remember to set.",
                        code: `<ContentTabBar
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={modes}
    onModeChange={setMode}
    languages={[{ key: "typescript", label: "TypeScript" }]}
    language="typescript"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentTabBar
                                ariaLabel="Cách xem bài học"
                                mode="content"
                                modes={MODES}
                                onModeChange={() => {}}
                                languages={[LANGUAGES[0]]}
                                language="typescript"
                                languageAriaLabel="Ngôn ngữ code"
                                onLanguageChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
