import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentModeNav } from "@sb-components/starci/blocks/learn/ContentModeNav/ContentModeNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentModeNav`: HOW to look at this lesson. Modes on the left, the
 * code language on the right.
 *
 * ⚠️ NAMED FOR WHAT IT DOES (renamed from `ContentTabBar` 2026-07-28). Switching
 * mode changes the ROUTE, so this is navigation, not a tab/panel pair — the body
 * it switches to is a separate block, being the content of a different route.
 *
 * ⭐ A LOCKED MODE IS CLICKABLE, and clicking it is the whole point. The first cut
 * disabled locked modes, so tapping did nothing — killing the offer this row
 * exists to surface. A locked mode renders MUTED but still fires `onModeChange`;
 * the SCREEN decides that a locked tap opens the paywall. "What locked does" is a
 * business decision, not a behaviour this block hardcodes.
 *
 * ⭐ ONE ACCENT SIGNAL. The mode group carries accent; the language group is
 * NEUTRAL — switching language changes how the same lesson is presented, not what
 * the reader is doing.
 *
 * ⚠️ NEVER SKELETONISED, on purpose: the row is static chrome. No `isSkeleton`
 * prop at all rather than one quietly unused.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the right group appearing is STRUCTURAL ⇒ its own
 * leaf. Which mode is selected, and whether one is locked, are data ⇒ states.
 */
const meta: Meta<typeof ContentModeNav> = {
    title: "StarCi/Blocks/Learn/ContentModeNav/ContentModeNav",
    component: ContentModeNav,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentModeNav>

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
                name="ContentModeNav"
                tier="block"
                leaf="Modes only"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "mode = content",
                        why: "The reader is on the lesson text, so the reading mode holds the indicator and the other three wait beside it. The challenge mode carries its count in the label, so the reader can see there is work waiting without switching to find out.",
                        code: `<ContentModeNav
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges", count: 3 }, { mode: "aiLab" }]}
    onModeChange={goMode}
/>`,
                        render: (
                            <ContentModeNav
                                anatPart="ContentModeNav"
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
                        code: `<ContentModeNav
    ariaLabel="Cách xem bài học"
    mode="challenges"
    modes={modes}
    onModeChange={goMode}
/>`,
                        render: (
                            <ContentModeNav
                                ariaLabel="Cách xem bài học"
                                mode="challenges"
                                modes={MODES}
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "aiLab.isLocked = true",
                        why: "The AI lab is premium and unbought, so it renders muted — but it stays clickable, and its click still fires onModeChange. The screen turns that into a paywall; disabling the mode instead would take away the very tap the offer depends on.",
                        code: `<ContentModeNav
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={[…, { mode: "aiLab", isLocked: true }]}
    onModeChange={goMode}
/>`,
                        render: (
                            <ContentModeNav
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
                name="ContentModeNav"
                tier="block"
                leaf="With languages"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "languages.length = 4",
                        why: "The lesson exists in four languages, so a second group pins to the right of the row — NEUTRAL rather than accent, because switching language changes how the same lesson is presented, not what the reader is doing. Narrowing past @app-sm collapses this group into a dropdown instead of crowding the reading column with a second tab strip.",
                        code: `<ContentModeNav
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={modes}
    onModeChange={goMode}
    languages={[{ key: "typescript", label: "TypeScript" }, …]}
    language="typescript"
    languageAriaLabel="Ngôn ngữ code"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentModeNav
                                anatPart="ContentModeNav"
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
                        code: `<ContentModeNav
    ariaLabel="Cách xem bài học"
    mode="content"
    modes={modes}
    onModeChange={goMode}
    languages={[{ key: "typescript", label: "TypeScript" }]}
    language="typescript"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentModeNav
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
