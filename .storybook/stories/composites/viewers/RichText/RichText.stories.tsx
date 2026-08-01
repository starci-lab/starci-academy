import type { Meta, StoryObj } from "@storybook/nextjs"
import { RichText } from "@sb-components/composites/viewers/RichText/RichText"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof RichText> = {
    title: "Composites/Viewers/RichText",
    component: RichText,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RichText>

/** Empty `text` → renders nothing (Typography with no children), takes no unexpected space. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="" />
        </div>
    ),
}

/** No marker matches → the text renders verbatim, no wrapping node. */
export const PlainText: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="Press the Submit button to send your answer, the system will grade it right away." />
        </div>
    ),
}

/** `` `code` `` — backtick span; NOT recursed, so its label prints literally. */
export const Code: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="Use `useEffect` to sync state with the DOM after rendering." />
        </div>
    ),
}

/** `**bold**` — emphasis for a warning or a key condition inside instructions. */
export const Bold: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="**Note:** this exercise counts as bonus points toward the weekly leaderboard." />
        </div>
    ),
}

/** `_italic_` — softer emphasis than bold, e.g. an optional note. */
export const Italic: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="_Optional_, but it's best to finish it before moving on to the next module." />
        </div>
    ),
}

/** `[label](url)` — always opens a new tab (`target=_blank`, `rel=noopener`). */
export const Link: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="See more in the [React Hooks documentation](https://react.dev/reference/react)." />
        </div>
    ),
}

/** Each `\n` becomes a `<br/>` — short step lists without a real `<ul>`. */
export const LineBreaks: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text={"Step 1: read the problem.\nStep 2: write the code.\nStep 3: run the tests."} />
        </div>
    ),
}

/** `renderInline` recurses on the remainder, so one sentence can mix code + bold + link. */
export const Combined: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="Run `npm install` then **rebuild** before submitting, check the [guide](https://starci.dev/docs) if you're stuck." />
        </div>
    ),
}

/** Nested markers (bold containing italic) — both `recurse: true`, so the inner label is re-parsed. */
export const Nested: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="**Warning: _time is almost up_, submit now** before the system closes automatically." />
        </div>
    ),
}

/** Malformed / unmatched marker → falls back to plain text, no throw, no broken layout. */
export const MalformedFallback: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <RichText text="An unmatched backtick ` shows up verbatim, without breaking the layout." />
        </div>
    ),
}

/** `size` mirrors the `Typography` type scale (body-xs → body-sm default → body → h4). */
export const SizeScale: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8 flex flex-col gap-3">
            <RichText size="body-xs" text="Size `body-xs` — a very small caption." />
            <RichText size="body-sm" text="Size `body-sm` — the default when no size is passed." />
            <RichText size="body" text="Size `body` — normal reading body text." />
            <RichText size="h4" text="Size `h4` — a small heading with markup" />
        </div>
    ),
}

/** `color` omitted → inherits Typography default; `muted` for secondary asides. */
export const ColorScale: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8 flex flex-col gap-3">
            <RichText color="default" text="Color `default` — the main content." />
            <RichText color="muted" text="Color `muted` — a secondary, less important note." />
        </div>
    ),
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "RichText": { tier: "composite", role: "the single HeroUI `Typography` that carries the rendered inline-markdown subset", storyId: "composites-viewers-richtext--plain-text" },
    "Skeleton": { tier: "heroui", role: "the single-line shimmer bar standing in for the not-yet-loaded inline copy while `isSkeleton`" },
}

/** LEAF — the caller flips `isSkeleton`; a single shimmer bar stands in for the short inline copy (§12g.0a), matching that `RichText` only ever holds one line/measure of text, unlike `MarkdownContent`'s multi-line document mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RichText"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The atom-level `HeroSkeleton` bar stands in for whatever inline copy hasn't loaded yet — a title, a caption, a short instruction — since `RichText` never knows its own length ahead of the real `text`.",
                        code: "<RichText isSkeleton />",
                        render: <RichText isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
