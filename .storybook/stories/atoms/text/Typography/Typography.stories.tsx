import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, TrashIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Typography`: the one text atom in the system (custom, not HeroUI's own
 * `Typography`, though it wraps it internally for headings/code/links).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — atom tier). Every prop with a visual effect gets its
 * own leaf, rendering the FULL set of that prop's values:
 * `size` · `color` · `weight` · `isItalic` · `isStruck` · `align` · `tabularNums` ·
 * `truncate` · `lineClamp` · `noWrap` · `preserveWhitespace` · `isInline` ·
 * `parseInlineCode` · `prefixIcon` · `suffixIcon` · `iconSlide` · `isLink` ·
 * `underlineOnHover` · `underlineOnGroupHover` · `isButton` · `hoverColor` ·
 * `isSkeleton`.
 *
 * NOT leafed (wiring/placement props with no enumerable visual state of their own):
 *   - `text` — freeform content, not a value set; every leaf below supplies its own.
 *   - `href` / `target` / `rel` — HeroUI `Link` passthrough, demonstrated inline
 *     inside the `Link` leaf's second state rather than enumerated on their own.
 *   - `onPress` — a callback, not a rendered value; wired into the `Link` and
 *     `IsButton` leaves as a no-op so the call shape stays accurate.
 *   - `classNames` — placement inside a parent, not an appearance choice (matches
 *     `Button`'s own `classNames`, which the gold-standard story also does not leaf).
 *   - `showAnatomy` — the dev-only overlay flag every leaf below already turns on
 *     for its representative state; not part of the visual system.
 *
 * ⚠️ Two props read as more general in the type/JSDoc than the component actually
 * wires them to be — the leaves below render what the SOURCE does, not what the
 * comment implies:
 *   - `underlineOnHover` is only consumed inside the `isLink` branch of
 *     `Typography.tsx` (`isLink ? (underlineOnHover ? SELF_HOVER_UNDERLINE_CLS : …)`).
 *     Outside `isLink` it is a no-op today, so the `UnderlineOnHover` leaf only shows
 *     `isLink` states.
 *   - `weight` and `tabularNums` are wired into the body-scale branch (and `weight`
 *     into the heading branch too) but never into the `size="code"` branch — the
 *     `Weight` and `TabularNums` leaves stay at body/heading sizes accordingly.
 *
 * ✍️ Text on the panel (`leaf`/`reason`/`name`/`why`/`code`), demo labels, and JSDoc
 * are all ENGLISH, so the Code tab reads the same words as the picture.
 */
const meta: Meta<typeof Typography> = {
    title: "Atoms/Text/Typography/Typography",
    component: Typography,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Typography>

/**
 * heroui TIER: `Typography` wraps HeroUI directly in three of its branches, so those
 * three nodes are tagged with the real HeroUI identifier, not an invented role name —
 * `Typography.Heading` (heading branch), `Typography` (the `size="code"` branch,
 * `HeroTypography type="code"`), `Link` (the `isLink` branch), and `Skeleton` (the
 * `isSkeleton` branch, HeroUI's own `Skeleton`). The atom's own internal slots
 * (`Text`, `PrefixIcon`, `SuffixIcon`, the plain `Button` node from `isButton`) are
 * NOT declared here — they are spans the atom draws itself, not components with a
 * story of their own to jump to, so an undeclared badge would be a badge to nowhere.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography.Heading": { tier: "heroui", role: "the HeroUI compound heading element this atom wraps for size = \"h1\"…\"h5\"" },
    "Typography": { tier: "heroui", role: "the HeroUI `Typography` element this atom wraps at size = \"code\"" },
    "Link": { tier: "heroui", role: "renders the text as HeroUI's own `Link`, for the accent color + hover underline + a11y" },
    "Skeleton": { tier: "heroui", role: "loading shimmer standing in for the text" },
}

/** Bare leaf — no prop turned on, the plain body-scale span every other leaf differs from by exactly one prop. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason={"The one text atom in the system. This leaf is the baseline: size falls back to \"base\" and color to \"default\", so every leaf below differs from it by exactly one prop."}
                states={[
                    {
                        name: "no prop turned on (size = base, color = default)",
                        why: "A plain inline span carrying just the text, at the default body size and the page's own foreground color. This is what a bare Typography call renders before any prop is turned on.",
                        code: "<Typography text=\"Grade assignments with the premium model\" />",
                        render: <Typography text="Grade assignments with the premium model" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `size` — the single scale axis for the whole text system, spanning
 * body copy (built with classes), headings (`HeroTypography.Heading`), and code
 * (`HeroTypography type="code"`). Full union, all 10 values.
 */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size is the one scale prop for the whole system: the same prop that steps a caption up to a paragraph also steps a paragraph up to a page title, and switches the underlying element between a span, a heading, and a code block."
                states={[
                    {
                        name: "size = \"xs\"",
                        why: "The smallest body step, for a timestamp or a metadata line that should sit quietly under something more important.",
                        code: "<Typography size=\"xs\" text=\"Last synced 2 minutes ago\" />",
                        render: <Typography size="xs" text="Last synced 2 minutes ago" />,
                    },
                    {
                        name: "size = \"sm\"",
                        why: "A small step up, for a secondary line beside a heading — a course code, a byline, a count.",
                        code: "<Typography size=\"sm\" text=\"12 students online now\" />",
                        render: <Typography size="sm" text="12 students online now" />,
                    },
                    {
                        name: "size = \"base\" (default)",
                        why: "The default body size, the scale every plain paragraph falls back to when size is left unset.",
                        code: "<Typography text=\"Grade assignments with the premium model\" />",
                        render: <Typography size="base" text="Grade assignments with the premium model" />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The largest body step, for a lead paragraph or a line that should read as slightly more important than the body around it, without becoming a heading.",
                        code: "<Typography size=\"lg\" text=\"Submit before the deadline\" />",
                        render: <Typography size="lg" text="Submit before the deadline" />,
                    },
                    {
                        name: "size = \"h1\"",
                        why: "Wraps a real HeroUI `Typography.Heading level={1}`, the top of the heading scale, for a page's own title.",
                        code: "<Typography size=\"h1\" text=\"Course dashboard\" />",
                        render: <Typography size="h1" text="Course dashboard" />,
                    },
                    {
                        name: "size = \"h2\"",
                        why: "A `level={2}` heading, for a major section inside a page that already has its own h1.",
                        code: "<Typography size=\"h2\" text=\"Module 3: React fundamentals\" />",
                        render: <Typography size="h2" text="Module 3: React fundamentals" />,
                    },
                    {
                        name: "size = \"h3\"",
                        why: "A `level={3}` heading, for a subsection — a card's own title, a grouped block of settings.",
                        code: "<Typography size=\"h3\" text=\"Assignment 2 — grading rubric\" />",
                        render: <Typography size="h3" text="Assignment 2 — grading rubric" />,
                    },
                    {
                        name: "size = \"h4\"",
                        why: "A `level={4}` heading, for a small group's label inside a subsection — a list's own heading, a form section.",
                        code: "<Typography size=\"h4\" text=\"Recent submissions\" />",
                        render: <Typography size="h4" text="Recent submissions" />,
                    },
                    {
                        name: "size = \"h5\"",
                        why: "The smallest heading step, `level={5}`, for the least important grouping label a page still wants to mark as a heading rather than body text.",
                        code: "<Typography size=\"h5\" text=\"Attachments\" />",
                        render: <Typography size="h5" text="Attachments" />,
                    },
                    {
                        name: "size = \"code\"",
                        why: "Wraps `HeroTypography type=\"code\"` instead of a heading or a body span, for a command, a file path, or any literal that should render in the monospace code style.",
                        code: "<Typography size=\"code\" text=\"npm run build\" />",
                        render: <Typography size="code" text="npm run build" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `color` — every semantic tone, including the two `-soft` variants
 * meant for a tinted surface (shown here on their matching soft background so the
 * contrast is legible, not just a color swatch in isolation).
 */
export const Colors: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `color`"
                reason="color carries meaning, not decoration: default is the page's own foreground, the five status tones borrow the shared status colors, and the two `-soft` tones exist only so text keeps reading clearly when it sits on top of a soft-tinted chip or badge instead of the page background."
                states={[
                    {
                        name: "color = \"default\"",
                        why: "The page's own foreground color — what every leaf renders when color is left unset.",
                        code: "<Typography text=\"Primary text\" />",
                        render: <Typography text="Primary text" />,
                    },
                    {
                        name: "color = \"muted\"",
                        why: "A quieter tone for secondary text that should not compete with the primary line beside it.",
                        code: "<Typography text=\"Secondary text\" color=\"muted\" />",
                        render: <Typography text="Secondary text" color="muted" />,
                    },
                    {
                        name: "color = \"accent\"",
                        why: "The brand tone, for text that should draw the eye — a highlight, a link, the reader's own item in a list.",
                        code: "<Typography text=\"Highlight / mine\" color=\"accent\" />",
                        render: <Typography text="Highlight / mine" color="accent" />,
                    },
                    {
                        name: "color = \"success\"",
                        why: "For text reporting something that finished correctly — a passed check, a completed step.",
                        code: "<Typography text=\"Passed / done\" color=\"success\" />",
                        render: <Typography text="Passed / done" color="success" />,
                    },
                    {
                        name: "color = \"warning\"",
                        why: "For text flagging something that needs attention soon but has not failed yet — a running-low count, a near deadline.",
                        code: "<Typography text=\"Caution / running low\" color=\"warning\" />",
                        render: <Typography text="Caution / running low" color="warning" />,
                    },
                    {
                        name: "color = \"danger\"",
                        why: "For text reporting a failure or an error the reader must act on.",
                        code: "<Typography text=\"Error / failed\" color=\"danger\" />",
                        render: <Typography text="Error / failed" color="danger" />,
                    },
                    {
                        name: "color = \"info\"",
                        why: "For a neutral informational note — mirrors the same `--info` token `Alert`'s own info status reads.",
                        code: "<Typography text=\"Heads up: grading may take a few minutes\" color=\"info\" />",
                        render: <Typography text="Heads up: grading may take a few minutes" color="info" />,
                    },
                    {
                        name: "color = \"accent-soft\"",
                        why: "The foreground token paired with a soft accent surface — used here on its matching `bg-accent-soft` chip so the tone reads correctly instead of looking like plain accent on white.",
                        code: "<div className=\"rounded-full bg-accent-soft px-3 py-1\">\n  <Typography text=\"New\" color=\"accent-soft\" weight=\"medium\" />\n</div>",
                        render: (
                            <div data-tier="fixture" className="rounded-full bg-accent-soft px-3 py-1 w-fit">
                                <Typography text="New" color="accent-soft" weight="medium" />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"success-soft\"",
                        why: "The same soft-surface pairing for the success tone — text sitting on a `bg-success-soft` badge, such as a \"Graded\" pill.",
                        code: "<div className=\"rounded-full bg-success-soft px-3 py-1\">\n  <Typography text=\"Graded\" color=\"success-soft\" weight=\"medium\" />\n</div>",
                        render: (
                            <div data-tier="fixture" className="rounded-full bg-success-soft px-3 py-1 w-fit">
                                <Typography text="Graded" color="success-soft" weight="medium" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `weight` — `medium`/`bold` apply at body scale, `semibold` folds to
 * `medium` there and only becomes a real third step at heading scale. `weight` is
 * never wired into the `size="code"` branch, so this leaf stays at body + heading.
 */
export const Weight: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `weight`"
                reason="medium reads as working emphasis, bold reads as heading weight. semibold is a real third step only at heading size — at body scale the atom folds it back to medium, since body copy has no use for a third weight step."
                states={[
                    {
                        name: "weight = \"medium\", size = \"base\"",
                        why: "Working emphasis inside a paragraph, one step up from plain body text without going as heavy as bold.",
                        code: "<Typography text=\"Reviewed by the grading team\" weight=\"medium\" />",
                        render: <Typography text="Reviewed by the grading team" weight="medium" />,
                    },
                    {
                        name: "weight = \"semibold\", size = \"base\" (folds to medium)",
                        why: "At body scale semibold renders identically to medium — the atom folds the third step away rather than shipping a weight body text has no use for.",
                        code: "<Typography text=\"Reviewed by the grading team\" weight=\"semibold\" />",
                        render: <Typography text="Reviewed by the grading team" weight="semibold" />,
                    },
                    {
                        name: "weight = \"bold\", size = \"base\"",
                        why: "Heading-level weight on a body-scale line, for a number or a label that must carry more visual weight than its neighbours without growing in size.",
                        code: "<Typography text=\"Final grade: 92/100\" weight=\"bold\" />",
                        render: <Typography text="Final grade: 92/100" weight="bold" />,
                    },
                    {
                        name: "weight = \"semibold\", size = \"h4\"",
                        why: "At heading scale semibold is a real, distinct step between medium and bold — passed straight through to HeroUI's own `Typography.Heading`.",
                        code: "<Typography size=\"h4\" text=\"Course completion certificate\" weight=\"semibold\" />",
                        render: <Typography size="h4" text="Course completion certificate" weight="semibold" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isItalic` — a slanted style, for a quote or a flagged note. */
export const Italic: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isItalic`"
                reason="A plain italic switch, independent of weight and color, for the handful of places prose wants a slanted style — a quote, a system note about the text rather than the text itself."
                states={[
                    {
                        name: "isItalic = true, color = default",
                        why: "A flagged note rendered in italics so it visually reads as commentary about the row, not the row's own content.",
                        code: "<Typography text=\"This assignment was auto-flagged for review\" isItalic />",
                        render: <Typography text="This assignment was auto-flagged for review" isItalic />,
                    },
                    {
                        name: "isItalic = true, color = muted, size = sm",
                        why: "A quoted line of feedback, italic and muted together so it reads as someone else's words rather than the interface's own copy.",
                        code: "<Typography size=\"sm\" color=\"muted\" text=\"“Great effort on the introduction.”\" isItalic />",
                        render: <Typography size="sm" color="muted" text="“Great effort on the introduction.”" isItalic />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isStruck` — strikes the text, for a superseded value beside its replacement. */
export const Struck: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isStruck`"
                reason="isStruck strikes the text through, for a value the reader should still see but no longer treat as current — an original price beside a discounted one, a previous score beside a re-grade."
                states={[
                    {
                        name: "isStruck = true",
                        why: "The struck line on its own, for a value being called out as superseded even without a replacement shown beside it.",
                        code: "<Typography text=\"$49.00\" isStruck color=\"muted\" />",
                        render: <Typography text="$49.00" isStruck color="muted" />,
                    },
                    {
                        name: "isStruck = true, paired with the replacement value",
                        why: "The common shape: a struck original price sits beside the real, current one, so the discount reads at a glance without a separate label explaining it.",
                        code: "<div className=\"flex items-center gap-2\">\n  <Typography text=\"$49.00\" isStruck color=\"muted\" />\n  <Typography text=\"$29.00\" weight=\"bold\" color=\"success\" />\n</div>",
                        render: (
                            <div data-tier="fixture" className="flex items-center gap-2">
                                <Typography text="$49.00" isStruck color="muted" />
                                <Typography text="$29.00" weight="bold" color="success" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `align` — text alignment, using logical `start`/`center`/`end` (auto-flips under RTL). */
export const Align: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `align`"
                reason="Logical alignment (start/end), not physical (left/right), matching what HeroUI itself uses so alignment auto-flips under RTL instead of staying pinned to one physical side. Shown at heading size, which is block-level by default, so the alignment is actually visible inside a bounded box."
                states={[
                    {
                        name: "align = \"start\"",
                        why: "The default reading-direction edge — where a heading sits when align is left unset.",
                        code: "<Typography size=\"h3\" text=\"Grading rubric\" align=\"start\" />",
                        render: (
                            <div data-tier="fixture" className="w-72 rounded-2xl border border-default p-3">
                                <Typography size="h3" text="Grading rubric" align="start" />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"center\"",
                        why: "Centers the heading inside its box, for a dialog title or an empty-state heading with no strong reading edge to anchor to.",
                        code: "<Typography size=\"h3\" text=\"Grading rubric\" align=\"center\" />",
                        render: (
                            <div data-tier="fixture" className="w-72 rounded-2xl border border-default p-3">
                                <Typography size="h3" text="Grading rubric" align="center" />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"end\"",
                        why: "Pushes the heading to the trailing edge, for a value that should line up against a number or an action sitting on the opposite side.",
                        code: "<Typography size=\"h3\" text=\"Grading rubric\" align=\"end\" />",
                        render: (
                            <div data-tier="fixture" className="w-72 rounded-2xl border border-default p-3">
                                <Typography size="h3" text="Grading rubric" align="end" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tabularNums` — locks digit widths so numbers line up in a column. Body scale only. */
export const TabularNums: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `tabularNums`"
                reason="Ordinary text digits have proportional widths, so a stack of numbers drifts out of column. tabularNums switches every digit to the same width, which matters for prices, counts, or any two numbers meant to be compared at a glance. Only wired into the body-scale branch, not headings or code."
                states={[
                    {
                        name: "tabularNums = false (default) — digits drift",
                        why: "Without it, proportional digits like \"1\" and \"8\" take different widths, so two stacked numbers do not line up in a column.",
                        code: "<div className=\"flex flex-col\">\n  <Typography text=\"$1,284.00\" weight=\"bold\" />\n  <Typography text=\"$128,400.00\" weight=\"bold\" />\n</div>",
                        render: (
                            <div data-tier="fixture" className="flex flex-col">
                                <Typography text="$1,284.00" weight="bold" />
                                <Typography text="$128,400.00" weight="bold" />
                            </div>
                        ),
                    },
                    {
                        name: "tabularNums = true — digits align",
                        why: "The same two numbers, now with tabularNums on: every digit takes the same width, so the columns line up even though the values differ.",
                        code: "<div className=\"flex flex-col\">\n  <Typography text=\"$1,284.00\" weight=\"bold\" tabularNums />\n  <Typography text=\"$128,400.00\" weight=\"bold\" tabularNums />\n</div>",
                        render: (
                            <div data-tier="fixture" className="flex flex-col">
                                <Typography text="$1,284.00" weight="bold" tabularNums />
                                <Typography text="$128,400.00" weight="bold" tabularNums />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `truncate` — clips to one line with an ellipsis; needs a bounded-width parent. */
export const Truncate: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `truncate`"
                reason="truncate forces overflow-hidden + a one-line ellipsis, for a label that must never grow the row it sits in — a table cell, a card title. The parent needs a bounded width or there is nothing to clip against."
                states={[
                    {
                        name: "truncate = true",
                        why: "A string too long for its box clips to one line and ends in an ellipsis instead of wrapping or overflowing the card.",
                        code: "<Typography text=\"An assignment title long enough to overflow its card\" truncate />",
                        render: (
                            <div data-tier="fixture" className="max-w-[220px] rounded-2xl border border-default p-3">
                                <Typography text="An assignment title long enough to overflow its card" truncate />
                            </div>
                        ),
                    },
                    {
                        name: "truncate = true, with prefixIcon",
                        why: "Truncation composes with an icon: the glyph stays fixed at the leading edge while only the text clips, since the icon span is not part of the clipped block.",
                        code: "<Typography text=\"An assignment title long enough to overflow its card\" prefixIcon={CheckCircleIcon} truncate />",
                        render: (
                            <div data-tier="fixture" className="max-w-[220px] rounded-2xl border border-default p-3">
                                <Typography text="An assignment title long enough to overflow its card" prefixIcon={CheckCircleIcon} truncate />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `lineClamp` — clamps to N lines (1–3); wins over `truncate` when both are set. */
export const LineClamp: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `lineClamp`"
                reason="Where truncate always clips to one line, lineClamp holds a few lines before cutting off — for a description or a comment preview that should show a paragraph's worth of context, not just its first word."
                states={[
                    {
                        name: "lineClamp = 1",
                        why: "Clamps to exactly one line, the same visual result as truncate but reached through the clamp prop for a caller already working in \"how many lines\" terms.",
                        code: "<Typography text=\"A long assignment description that keeps going well past a single line of available width\" lineClamp={1} />",
                        render: (
                            <div data-tier="fixture" className="max-w-[260px] rounded-2xl border border-default p-3">
                                <Typography text="A long assignment description that keeps going well past a single line of available width" lineClamp={1} />
                            </div>
                        ),
                    },
                    {
                        name: "lineClamp = 2",
                        why: "Holds two lines of a description before clipping — the common shape for a card preview that wants a hint of the full text.",
                        code: "<Typography text=\"A long assignment description that keeps going well past a single line of available width\" lineClamp={2} />",
                        render: (
                            <div data-tier="fixture" className="max-w-[260px] rounded-2xl border border-default p-3">
                                <Typography text="A long assignment description that keeps going well past a single line of available width" lineClamp={2} />
                            </div>
                        ),
                    },
                    {
                        name: "lineClamp = 3",
                        why: "Holds three lines, for a preview that can afford to show more before clipping, such as a wider card.",
                        code: "<Typography text=\"A long assignment description that keeps going well past a single line of available width\" lineClamp={3} />",
                        render: (
                            <div data-tier="fixture" className="max-w-[260px] rounded-2xl border border-default p-3">
                                <Typography text="A long assignment description that keeps going well past a single line of available width" lineClamp={3} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `noWrap` — forces one line via `white-space: nowrap`, no ellipsis (distinct from `truncate`). */
export const NoWrap: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `noWrap`"
                reason="noWrap keeps text on one line without clipping into an ellipsis, unlike truncate. It is for a label that must never wrap inside a container already sized to fit it — an ellipsis there would falsely imply hidden text."
                states={[
                    {
                        name: "noWrap = false (default) — wraps",
                        why: "Without noWrap, a long label wraps onto a second line once it runs out of horizontal room.",
                        code: "<Typography text=\"Submission received and queued for grading\" />",
                        render: (
                            <div data-tier="fixture" className="max-w-[180px] rounded-2xl border border-default p-3">
                                <Typography text="Submission received and queued for grading" />
                            </div>
                        ),
                    },
                    {
                        name: "noWrap = true — stays on one line",
                        why: "With noWrap, the same label refuses to wrap and instead overflows its box on a single line, since this container was not meant to hold it — the caller who reaches for noWrap already sized the container to fit.",
                        code: "<Typography text=\"Submission received and queued for grading\" noWrap />",
                        render: (
                            <div data-tier="fixture" className="max-w-[180px] overflow-x-auto rounded-2xl border border-default p-3">
                                <Typography text="Submission received and queued for grading" noWrap />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `preserveWhitespace` — keeps the text's own newlines/spaces instead of collapsing them. */
export const PreserveWhitespace: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `preserveWhitespace`"
                reason="Plain HTML text collapses runs of newlines and spaces into one. preserveWhitespace switches to `white-space: pre-wrap`, keeping content's own line breaks — for a pasted error message or a plain-text description that already carries its own formatting."
                states={[
                    {
                        name: "preserveWhitespace = false (default) — collapses",
                        why: "The text's own newlines collapse into a single line, the normal HTML behaviour for any run of whitespace.",
                        code: "<Typography text={\"Line one\\nLine two\\nLine three\"} />",
                        render: <Typography text={"Line one\nLine two\nLine three"} />,
                    },
                    {
                        name: "preserveWhitespace = true — line breaks kept",
                        why: "The same three-line string now keeps its own line breaks, while still wrapping normally at the container edge if a line runs long.",
                        code: "<Typography text={\"Line one\\nLine two\\nLine three\"} preserveWhitespace />",
                        render: <Typography text={"Line one\nLine two\nLine three"} preserveWhitespace />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isInline` — forces `display: inline`; only changes anything for headings/code (block by default). */
export const IsInline: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isInline`"
                reason="A body span is already inline by default, so isInline only changes anything at heading or code size, which wrap a real block-level element. This is for a heading- or code-styled run of text that must sit inside a sentence's own flow instead of starting a new line."
                states={[
                    {
                        name: "isInline = true, size = \"h3\", inside a sentence",
                        why: "Without isInline, an h3 renders a real block-level heading and would start its own line, breaking the sentence around it. With it on, the same styled text sits inline mid-sentence.",
                        code: "<p>\n  Your next milestone is <Typography size=\"h3\" text=\"Module 3\" isInline /> — start whenever you are ready.\n</p>",
                        render: (
                            <p data-tier="fixture" className="max-w-md">
                                Your next milestone is <Typography size="h3" text="Module 3" isInline /> — start whenever you are ready.
                            </p>
                        ),
                    },
                    {
                        name: "isInline = true, size = \"code\", inside a sentence",
                        why: "The code branch is block-level by default too; isInline lets a short code literal sit inline inside a sentence instead of breaking onto its own line.",
                        code: "<p>\n  Run <Typography size=\"code\" text=\"npm run build\" isInline /> before you deploy.\n</p>",
                        render: (
                            <p data-tier="fixture" className="max-w-md">
                                Run <Typography size="code" text="npm run build" isInline /> before you deploy.
                            </p>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `parseInlineCode` — backtick-only inline code, for text that must stay a `<span>` (no full markdown). */
export const ParseInlineCode: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `parseInlineCode`"
                reason="For text that must stay inline (an accordion trigger title, a label inside a button) rather than the block-level tree a full markdown renderer would produce, parseInlineCode understands only backtick segments — enough to style a code literal without pulling in a whole markdown parser."
                states={[
                    {
                        name: "parseInlineCode = false (default) — backticks render literally",
                        why: "Without it, backtick characters in the string are just characters — they render as-is, with no styling applied to the segment between them.",
                        code: "<Typography text=\"Run `npm install` before you start\" />",
                        render: <Typography text="Run `npm install` before you start" />,
                    },
                    {
                        name: "parseInlineCode = true — backtick segment styled",
                        why: "The same string, now with the backtick-delimited segment rendered as styled inline code, while the rest of the sentence stays plain text.",
                        code: "<Typography text=\"Run `npm install` before you start\" parseInlineCode />",
                        render: <Typography text="Run `npm install` before you start" parseInlineCode />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `prefixIcon` — the LEADING glyph, only wired into the plain
 * body-scale branch (not `isLink`/`isButton`/heading/code). Takes a COMPONENT, not JSX.
 */
export const PrefixIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `prefixIcon` (leading)"
                reason="A leading glyph as a COMPONENT, not JSX — the atom controls its own size and forces bold weight, since every text glyph renders under 20px and a thin stroke reads weak there. Adding an icon also pushes the text to font-medium automatically."
                states={[
                    {
                        name: "prefixIcon = CheckCircleIcon",
                        why: "A leading check mark grows before the label to confirm a completed state, at the same font-driven scale the text renders at.",
                        code: "<Typography text=\"Passed\" prefixIcon={CheckCircleIcon} />",
                        render: <Typography text="Passed" prefixIcon={CheckCircleIcon} />,
                    },
                    {
                        name: "prefixIcon set, color = \"danger\"",
                        why: "The leading glyph composes freely with color, so a destructive row carries its own warning icon the same way a passed row carries a check.",
                        code: "<Typography text=\"Submission removed\" prefixIcon={TrashIcon} color=\"danger\" />",
                        render: <Typography text="Submission removed" prefixIcon={TrashIcon} color="danger" />,
                    },
                    {
                        name: "prefixIcon set, size = \"lg\"",
                        why: "The glyph scales up together with the larger body size, confirming the icon tracks the text's own size axis instead of a fixed pixel value.",
                        code: "<Typography size=\"lg\" text=\"Passed\" prefixIcon={CheckCircleIcon} />",
                        render: <Typography size="lg" text="Passed" prefixIcon={CheckCircleIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `suffixIcon` — the TRAILING glyph, same rules as `prefixIcon`, opposite side. */
export const SuffixIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `suffixIcon` (trailing)"
                reason="Where the glyph sits carries meaning: a leading icon says what the text is about, a trailing one says where it leads onward. Both slots can be filled at once for text that both states something and continues somewhere."
                states={[
                    {
                        name: "suffixIcon = ArrowRightIcon",
                        why: "A trailing arrow after the label, for a text link into more detail — \"View results →\".",
                        code: "<Typography text=\"View results\" suffixIcon={ArrowRightIcon} color=\"accent\" />",
                        render: <Typography text="View results" suffixIcon={ArrowRightIcon} color="accent" />,
                    },
                    {
                        name: "prefixIcon and suffixIcon both set",
                        why: "The atom lays out both glyphs at once: icon, text, icon — for a status line that both confirms something and continues onward, such as a passed check that also links deeper.",
                        code: "<Typography text=\"All tests passed\" prefixIcon={CheckCircleIcon} suffixIcon={ArrowRightIcon} color=\"success\" />",
                        render: <Typography text="All tests passed" prefixIcon={CheckCircleIcon} suffixIcon={ArrowRightIcon} color="success" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `iconSlide` — the glyph slides on hover (prefix ← / suffix →). Arrows only, never a caret. */
export const IconSlide: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `iconSlide`"
                reason="The arrow slides the direction it already points: a trailing arrow nudges right (onward), a leading one nudges left (back). The text itself is the hover target — the atom puts `group` on its own wrapping span, so no ancestor wiring is required. Arrows only; a static glyph or a caret just fidgets."
                states={[
                    {
                        name: "iconSlide = true, suffixIcon (trailing arrow) — hover the text",
                        why: "On hover, the trailing arrow slides right, nudging the reader onward — the same `translate`-based transition `Button` uses, so a leading and a trailing arrow never fight each other's motion rule.",
                        code: "<Typography text=\"See more\" suffixIcon={ArrowRightIcon} iconSlide color=\"accent\" />",
                        render: <Typography text="See more" suffixIcon={ArrowRightIcon} iconSlide color="accent" />,
                    },
                    {
                        name: "iconSlide = true, prefixIcon (leading arrow) — hover the text",
                        why: "On hover, the leading arrow slides left, signalling a step backward — the mirror direction of the trailing case above.",
                        code: "<Typography text=\"Back to overview\" prefixIcon={ArrowLeftIcon} iconSlide color=\"muted\" />",
                        render: <Typography text="Back to overview" prefixIcon={ArrowLeftIcon} iconSlide color="muted" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isLink` — renders as HeroUI `Link`. `href`/`target`/`rel`/`onPress`
 * are demonstrated here rather than as their own leaves, since none of them has an
 * enumerable value set of their own.
 */
export const Link: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isLink`"
                reason="isLink renders through HeroUI's own Link — accent color and a hover underline by default, plus real link a11y. color overrides the accent default; href/target/rel forward straight to the underlying anchor."
                states={[
                    {
                        name: "isLink = true (default accent, no href)",
                        why: "The plain link look: accent color with a hover underline, for an in-app action reached through onPress rather than a real navigation target.",
                        code: "<Typography text=\"View details\" isLink onPress={() => {}} />",
                        render: <Typography text="View details" isLink onPress={() => {}} />,
                    },
                    {
                        name: "isLink = true, color = \"muted\", href + target + rel set",
                        why: "An external evidence link that inherits its row's quiet tone instead of calling attention to itself, opening in a new tab with the safe rel pair — the shape a citation or a source reference takes.",
                        code: "<Typography text=\"src/components/Foo.tsx:42\" isLink color=\"muted\" href=\"#\" target=\"_blank\" rel=\"noopener noreferrer\" />",
                        render: <Typography text="src/components/Foo.tsx:42" isLink color="muted" href="#" target="_blank" rel="noopener noreferrer" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `underlineOnHover` — swaps `isLink`'s own plainer underline for a
 * quieter recipe. Only wired into the `isLink` branch in the current source, so both
 * states here keep `isLink` on.
 */
export const UnderlineOnHover: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `underlineOnHover`"
                reason="isLink's own default underline is underline-offset-2 with the link's own color as the decoration. underlineOnHover swaps that for a quieter offset-4 + muted-decoration recipe, triggered by the text's own hover — for a link that should inherit its row's quiet tone rather than shout accent."
                states={[
                    {
                        name: "isLink = true, underlineOnHover = false (default) — plain underline",
                        why: "The default isLink underline: offset-2, colored with the link's own accent tone.",
                        code: "<Typography text=\"View details\" isLink onPress={() => {}} />",
                        render: <Typography text="View details" isLink onPress={() => {}} />,
                    },
                    {
                        name: "isLink = true, underlineOnHover = true — quiet underline",
                        why: "The same link now underlines with the quieter offset-4 + muted-decoration recipe on hover, matching the tone `underlineOnGroupHover` uses elsewhere in the system.",
                        code: "<Typography text=\"src/components/Foo.tsx:42\" isLink underlineOnHover color=\"muted\" href=\"#\" />",
                        render: <Typography text="src/components/Foo.tsx:42" isLink underlineOnHover color="muted" href="#" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `underlineOnGroupHover` — underlines when an ANCESTOR `.group` is
 * hovered, not the text's own hover. The caller owns putting `.group` on the real
 * hoverable ancestor; the atom only owns the `group-hover:` class.
 */
export const UnderlineOnGroupHover: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `underlineOnGroupHover`"
                reason={"For the \"whole row is the link, only the title underlines\" shape — a list row where onPress/href lives on the row itself, not on this text. Foreground color, no accent: unlike isLink, this is only the underline behaviour."}
                states={[
                    {
                        name: "underlineOnGroupHover = true — hover the dashed row",
                        why: "Hovering the ancestor row (the dashed box standing in for a real hoverable row) underlines the title inside it, because the class is group-hover:underline and any ancestor's .group triggers it.",
                        code: "<div className=\"group\">\n  <Typography text=\"Multi-stage build: drop the toolchain from the runtime image\" underlineOnGroupHover />\n</div>",
                        render: (
                            <div data-tier="fixture" className="group w-fit cursor-pointer rounded-lg border border-dashed border-accent p-3">
                                <Typography text="Multi-stage build: drop the toolchain from the runtime image" underlineOnGroupHover />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isButton` — a plain pressable `<button>`, for text that DOES
 * something but is not navigation. No underline (unlike `isLink`).
 */
export const IsButton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isButton`"
                reason={"isButton renders a plain <button> — text that fires onPress but is not a navigation link, such as \"Reply\"/\"Edit\"/\"Delete\" action text real prose never underlines. No underline at all, only an optional hoverColor transition."}
                states={[
                    {
                        name: "isButton = true, no hoverColor",
                        why: "A plain pressable label, cursor-pointer with no other visual change — the bare shape before hoverColor adds a transition.",
                        code: "<Typography text=\"Reply\" isButton onPress={() => {}} />",
                        render: <Typography text="Reply" isButton onPress={() => {}} />,
                    },
                    {
                        name: "isButton = true, color = \"muted\", hoverColor = \"default\"",
                        why: "The common shape: a quiet action link that starts muted and steps up to the page's own foreground on hover, so it reads as interactive without shouting like a real link.",
                        code: "<Typography text=\"Reply\" isButton color=\"muted\" hoverColor=\"default\" onPress={() => {}} />",
                        render: <Typography text="Reply" isButton color="muted" hoverColor="default" onPress={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `hoverColor` — only takes effect with `isButton`. Same
 * {@link TypographyColor} token set the `Colors` leaf already enumerates in full, so
 * this leaf shows a representative subset rather than repeating all nine values —
 * what is new here is the hover TRANSITION, not the color palette itself.
 */
export const HoverColor: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `hoverColor`"
                reason="hoverColor is only wired into the isButton branch — it names the color the text transitions to on hover, from whatever color it starts at. It reuses the same TypographyColor tokens the Colors leaf already covers in full, so this leaf shows three representative transitions rather than all nine again."
                states={[
                    {
                        name: "color = \"muted\", hoverColor = \"default\" — hover to see the shift",
                        why: "A quiet action that steps up to full foreground on hover, the shape used for a low-emphasis \"Reply\"/\"Edit\".",
                        code: "<Typography text=\"Edit\" isButton color=\"muted\" hoverColor=\"default\" onPress={() => {}} />",
                        render: <Typography text="Edit" isButton color="muted" hoverColor="default" onPress={() => {}} />,
                    },
                    {
                        name: "color = \"muted\", hoverColor = \"danger\" — hover to see the shift",
                        why: "A destructive action link that stays quiet at rest and only warns on hover, the same mechanism as above with the danger tone instead — the shape for \"Delete\".",
                        code: "<Typography text=\"Delete\" isButton color=\"muted\" hoverColor=\"danger\" onPress={() => {}} />",
                        render: <Typography text="Delete" isButton color="muted" hoverColor="danger" onPress={() => {}} />,
                    },
                    {
                        name: "color = \"muted\", hoverColor = \"success\" — hover to see the shift",
                        why: "A confirming action link — muted at rest, success-toned on hover, for something like \"Mark as complete\".",
                        code: "<Typography text=\"Mark as complete\" isButton color=\"muted\" hoverColor=\"success\" onPress={() => {}} />",
                        render: <Typography text="Mark as complete" isButton color="muted" hoverColor="success" onPress={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isSkeleton` — a co-located shimmer bar, height matched to the glyph
 * height of the size it stands in for (body, heading, and code all have their own row
 * in the atom's own height table).
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Typography"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its loading state, so the atom draws its own shimmer bar rather than relying on a shared skeleton component. The bar's height is matched per size — body, heading, and code all have their own row in the atom's own height table — so nothing jumps once the real text lands."
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\"",
                        why: "A shimmer bar at the height of small body text, the placeholder for a caption or metadata line before its data arrives.",
                        code: "<Typography size=\"sm\" isSkeleton />",
                        render: <Typography size="sm" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"base\" (default)",
                        why: "A shimmer bar at the default body height, the most common loading placeholder in the app since base is what most plain text falls back to.",
                        code: "<Typography isSkeleton />",
                        render: <Typography size="base" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"h3\"",
                        why: "A taller shimmer bar matching the h3 heading's own glyph height, so a loading card title does not jump in size once the real heading replaces it.",
                        code: "<Typography size=\"h3\" isSkeleton />",
                        render: <Typography size="h3" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"code\"",
                        why: "The code branch gets its own row in the height table too, so a loading command or file path placeholder matches the monospace line height it will resolve to.",
                        code: "<Typography size=\"code\" isSkeleton />",
                        render: <Typography size="code" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
