import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentModeNav } from "@sb-components/starci/blocks/learn/ContentModeNav/ContentModeNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContentModeNav` — how to view this lesson: modes on the left, code language
 * on the right. Switching mode changes the route, so this is navigation, not a
 * tab/panel pair. A locked mode renders muted but still fires `onModeChange` —
 * the screen decides a locked tap opens the paywall. The mode group carries the
 * one accent; the language group is neutral. No `isSkeleton` — it is static
 * chrome. The right group appearing is its own leaf; selected mode and lock
 * state are data.
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
    { mode: "challenges" as const },
    { mode: "aiLab" as const },
]

const LANGUAGES = [
    { key: "typescript", label: "TypeScript" },
    { key: "java", label: "Java" },
    { key: "csharp", label: "C#" },
    { key: "go", label: "Go" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Toolbar": { tier: "composite", role: "the two-group tab row: it pins the mode group left and the language group right, owns the neutral-versus-accent chrome per group, and collapses the language group into an icon-only dropdown below @app-sm so it never crowds the reading column", storyId: "composites-navigation-toolbar-toolbar--right-neutral-collapsed" },
}

/** LEAF — a single-language lesson ⇒ the row carries only the mode group. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
                        why: "The reader is on the lesson text, so the reading mode holds the indicator and the other three wait beside it, each carrying its own icon rather than a count — the real tab row (`ContentTabBar`) has no per-tab number at all.",
                        code: `<ContentModeNav
    ariaLabel="How to view this lesson"
    mode="content"
    modes={[{ mode: "content" }, { mode: "sandbox" }, { mode: "challenges" }, { mode: "aiLab" }]}
    onModeChange={goMode}
/>`,
                        render: (
                            <ContentModeNav


                                ariaLabel="How to view this lesson"
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
    ariaLabel="How to view this lesson"
    mode="challenges"
    modes={modes}
    onModeChange={goMode}
/>`,
                        render: (
                            <ContentModeNav
                                ariaLabel="How to view this lesson"
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
    ariaLabel="How to view this lesson"
    mode="content"
    modes={[…, { mode: "aiLab", isLocked: true }]}
    onModeChange={goMode}
/>`,
                        render: (
                            <ContentModeNav
                                ariaLabel="How to view this lesson"
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentModeNav"
                tier="block"
                leaf="With languages"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "4 available (lesson ships every language)",
                        why: "The lesson exists in all four catalog languages, so a second group pins to the right of the row — NEUTRAL rather than accent, because switching language changes how the same lesson is presented, not what the reader is doing.",
                        code: `<ContentModeNav
    ariaLabel="How to view this lesson"
    mode="content"
    modes={modes}
    onModeChange={goMode}
    languages={[{ key: "typescript", label: "TypeScript" }, …]}
    language="typescript"
    languageAriaLabel="Code language"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentModeNav


                                ariaLabel="How to view this lesson"
                                mode="content"
                                modes={MODES}
                                onModeChange={() => {}}
                                languages={LANGUAGES}
                                language="typescript"
                                languageAriaLabel="Code language"
                                onLanguageChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "4 available, narrow column (below @app-sm) ⇒ language group collapses to a dropdown",
                        why: "Below @app-sm the language group is a set-once preference, not a second navigation choice, so it folds into a compact icon-only dropdown instead of crowding the reading column with 4 inline tabs — the mode group on the left stays inline at every width; only the language group on the right collapses.",
                        code: `<div className="@container" style={{ width: 375 }}>
    <ContentModeNav
        ariaLabel="How to view this lesson"
        mode="content"
        modes={modes}
        onModeChange={goMode}
        languages={[{ key: "typescript", label: "TypeScript" }, …]}
        language="typescript"
        languageAriaLabel="Code language"
        onLanguageChange={setLanguage}
    />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 375 }}>
                                <ContentModeNav
                                    ariaLabel="How to view this lesson"
                                    mode="content"
                                    modes={MODES}
                                    onModeChange={() => {}}
                                    languages={LANGUAGES}
                                    language="typescript"
                                    languageAriaLabel="Code language"
                                    onLanguageChange={() => {}}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "2 available, 2 disabled (the real common case)",
                        why: "The catalog is FIXED — real `src` always lists all four languages, it never shrinks to just what the lesson has. A lesson written in only TypeScript and Go still shows Java and C#, dimmed and unselectable, rather than removing them: the reader can see the full family exists, just not for this lesson.",
                        code: `<ContentModeNav
    ariaLabel="How to view this lesson"
    mode="content"
    modes={modes}
    onModeChange={goMode}
    languages={[
        { key: "typescript", label: "TypeScript" },
        { key: "java", label: "Java", isDisabled: true },
        { key: "csharp", label: "C#", isDisabled: true },
        { key: "go", label: "Go" },
    ]}
    language="typescript"
    languageAriaLabel="Code language"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentModeNav
                                ariaLabel="How to view this lesson"
                                mode="content"
                                modes={MODES}
                                onModeChange={() => {}}
                                languages={LANGUAGES.map((entry) => ({ ...entry, isDisabled: entry.key === "java" || entry.key === "csharp" }))}
                                language="typescript"
                                languageAriaLabel="Code language"
                                onLanguageChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "1 available, 3 disabled ⇒ group not drawn at all",
                        why: "Only one language is actually available, so the right group is not drawn at all — a switcher with a single live option is a control that cannot do anything. This is the case that proves the group is driven by the AVAILABLE count in the data, not by whether the caller remembered to pass all four.",
                        code: `<ContentModeNav
    ariaLabel="How to view this lesson"
    mode="content"
    modes={modes}
    onModeChange={goMode}
    languages={[
        { key: "typescript", label: "TypeScript" },
        { key: "java", label: "Java", isDisabled: true },
        { key: "csharp", label: "C#", isDisabled: true },
        { key: "go", label: "Go", isDisabled: true },
    ]}
    language="typescript"
    onLanguageChange={setLanguage}
/>`,
                        render: (
                            <ContentModeNav
                                ariaLabel="How to view this lesson"
                                mode="content"
                                modes={MODES}
                                onModeChange={() => {}}
                                languages={LANGUAGES.map((entry) => ({ ...entry, isDisabled: entry.key !== "typescript" }))}
                                language="typescript"
                                languageAriaLabel="Code language"
                                onLanguageChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
