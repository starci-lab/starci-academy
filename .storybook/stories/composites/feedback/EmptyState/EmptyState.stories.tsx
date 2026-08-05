import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowCounterClockwiseIcon, HouseIcon, MagnifyingGlassIcon, PackageIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `EmptyState` — a centered vertical stack that fills an empty spot (empty list, no results)
 * or a broken spot (`tone="danger"` + a retry button). Slots: `code`, `icon`, `description`,
 * `body`, `action`; axes `tone` and `size` (`compact`/`page`). This shell IS the empty/error
 * state, so it has no loading leaf of its own.
 */
const meta: Meta<typeof EmptyState> = {
    title: "Composites/Feedback/EmptyState",
    component: EmptyState,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EmptyState>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>

/**
 * ONE shared whitelist for every leaf in this file (§11a.1): the tree is a whitelist by
 * NAME, so a leaf whose DOM never renders `Typography` (e.g. `size="default"`) simply
 * never shows that entry — no need for a separate table per leaf.
 *
 * `icon`/`body`/`action` are deliberately ABSENT (see file banner) — the component no
 * longer badges them at all, so there is nothing here to declare for those slots.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        tier: "atom",
        role: "the title (Base medium) and, when `description` is set, the muted description line under it — same real component for every size except the two page-size heading slots below",
        storyId: "atoms-text-typography-typography--colors",
    },
    "HeroTypography": {
        tier: "heroui",
        role: "size=\"page\" only: the `code` numeral (`h1` bold) and the page title (`h4` semibold) — HeroUI's own component, NOT the atom (§9 gap noted at the end of this file)",
    },
}

/** The most minimal edge case: `title` only — no icon, no description, no CTA. */
export const TitleOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyState"
                tier="composite"
                leaf="TitleOnly"
                annotate={ANNOTATE}
                reason="This is the frame that fills an empty spot: every 'nothing here' in the app reads the same, centered, in the same slot order, whether it's plain-empty or broken (tone), compact, default, or page-sized."
                states={[
                    {
                        name: "icon unset, description unset, action unset",
                        why: "Only the title text renders, since none of the optional slots have content to show. This leaf has the fewest slots of the whole family, the shape to reach for when the title alone already says enough.",
                        code: `<EmptyState
  title="No data yet"
/>`,
                        render: <EmptyState title="No data yet" />,
                    },
                ]}
            />,
        ),
}

/** Adds an illustrative icon (a phosphor component — the shell forces `size-8` + the tone colour itself). */
export const IconAndTitle: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyState"
                tier="composite"
                leaf="IconAndTitle"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "icon set, description unset, action unset",
                        why: "An icon node appears above the title, sized and colored by the frame itself rather than by classes the caller sets. `icon` takes a component reference, not JSX, which is why the frame owns the size and color instead of the caller (§4/§5).",
                        code: `<EmptyState
  icon={PackageIcon}
  title="No courses yet"
/>`,
                        render: <EmptyState icon={PackageIcon} title="No courses yet" />,
                    },
                ]}
            />,
        ),
}

/** Adds a muted description line under the title. */
export const Description: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyState"
                tier="composite"
                leaf="Description"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "icon set, description set, action unset",
                        why: "A muted supporting line appears under the title, smaller than the title itself. The action slot still holds nothing, so this shape says more about the empty state without yet offering a way out of it.",
                        code: `<EmptyState
  icon={MagnifyingGlassIcon}
  title="No results found"
  description="…"
/>`,
                        render: (
                            <EmptyState

                                icon={MagnifyingGlassIcon}
                                title="No results found"
                                description="Try different filters or a shorter search term."
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * The full shape of the default size: adds a CTA below the body.
 *
 * Also covers `tone="danger"` (a BROKEN spot, retry button) — tone only
 * changes the icon's colour, the DOM tree is identical ⇒ state within this
 * leaf, not a separate leaf (§14d.2). Merged from the deleted `ErrorState` shell.
 */
export const Action: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyState"
                tier="composite"
                leaf="Action"
                annotate={ANNOTATE}
                reason="`action` is the way out of an empty state, so nothing should ever leave the reader stuck at a dead end with no next step."
                states={[
                    {
                        name: "tone unset (default), action set",
                        why: "A button node fills the action slot below the description, giving the reader a next step for a plain empty state. The icon keeps the frame's default color, since nothing here is broken.",
                        code: `<EmptyState
  icon={PackageIcon}
  title="This list is empty"
  description="…"
  action={<Button label="Add an item" />}
/>`,
                        render: (
                            <EmptyState

                                icon={PackageIcon}
                                title="This list is empty"
                                description="You haven't saved any items to this list yet."
                                action={() => <Button label="Add an item" />}
                            />
                        ),
                    },
                    {
                        name: "tone = \"danger\", action set",
                        why: "The same shape as the default tone carries over untouched, only the icon recolors to the danger tone because something actually went wrong here. tone changes color alone, never the node tree, which is why this stays a state of the Action leaf instead of a leaf of its own.",
                        code: `<EmptyState
  tone="danger"
  icon={WarningCircleIcon}
  title="Couldn't load the data"
  description="…"
  action={<Button label="Retry" variant="danger" prefixIcon={ArrowCounterClockwiseIcon} />}
/>`,
                        render: (
                            <EmptyState

                                tone="danger"
                                icon={WarningCircleIcon}
                                title="Couldn't load the data"
                                description="Something went wrong. Please try again."
                                action={() => <Button label="Retry" variant="danger" prefixIcon={ArrowCounterClockwiseIcon} />}
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** `body` — a free slot between the description and the CTA, for content that isn't a single line of text. */
export const WithBody: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyState"
                tier="composite"
                leaf="WithBody"
                annotate={ANNOTATE}
                reason="The frame wraps (§13b): `body` is the free-form body slot, sitting between the description and the action so a caller can drop in anything richer than one more line of text."
                states={[
                    {
                        name: "body set to a hint list",
                        why: "A bullet list of hints slots in between the description and the action button, content richer than a single line of text. This is the shape a caller reaches for when a plain description isn't enough to guide the reader back to results.",
                        code: `<EmptyState
  icon={MagnifyingGlassIcon}
  title="No results found"
  description="…"
  body={<ul>…</ul>}
  action={…}
/>`,
                        render: (
                            <EmptyState

                                icon={MagnifyingGlassIcon}
                                title="No results found"
                                description="A few things that usually help:"
                                body={() => (
                                    <ul data-tier="fixture" className="list-disc space-y-1 pl-4 text-left">
                                        <li><Typography size="xs" text="Clear some active filters" color="muted" /></li>
                                        <li><Typography size="xs" text="Use a shorter search term" color="muted" /></li>
                                    </ul>
                                )}
                                action={() => <Button label="Clear filters" variant="secondary" size="sm" />}
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * `size="page"` — the whole route is broken: adds a `code` slot (a large
 * status number) above the title. Merged from the deleted `ErrorPageState` shell.
 *
 * Renders both 404 (one button) and 500 (two buttons) within the SAME leaf:
 * the button count inside the `action` slot is the CALLER's content, the
 * shell's own part tree doesn't change by a single piece (§14d.2).
 */
export const FullPage: Story = {
    render: () => (
        <BlockAnatomy
            name="EmptyState"
            tier="composite"
            leaf="FullPage"
            annotate={ANNOTATE}
            reason={"`size=\"page\"` gives the frame a 70vh height, a larger title, and room for a `code` numeral, the shape for a route that failed to load at all rather than a section within a working page."}
            states={[
                {
                    name: "size = \"page\", code = \"404\", action = 1 button",
                    why: "One button sits in the centered action row below the code numeral and title, enough for a route that simply doesn't exist. size=\"page\" centers and wraps the action row automatically, so the frame never has to know in advance how many buttons will land there.",
                    code: `<EmptyState
  size="page"
  code="404"
  title="Page not found"
  action={<Button label="Go home" prefixIcon={HouseIcon} />}
/>`,
                    render: (
                        <EmptyState

                            size="page"
                            code="404"
                            title="Page not found"
                            description="The page you're looking for doesn't exist or has moved."
                            action={() => <Button label="Go home" prefixIcon={HouseIcon} />}
                        />
                    ),
                },
                {
                    name: "size = \"page\", code = \"500\", action = 2 buttons",
                    why: "Two buttons sit in the same action row this time, retry first and go home second, since the caller's node tree simply carries more content. The count of buttons is content the caller decides, so it never opens a leaf of its own.",
                    code: `<EmptyState
  size="page"
  code="500"
  title="Something went wrong"
  action={(
    <>
      <Button label="Retry" prefixIcon={ArrowCounterClockwiseIcon} />
      <Button label="Go home" variant="secondary" prefixIcon={HouseIcon} />
    </>
  )}
/>`,
                    render: (
                        <EmptyState
                            size="page"
                            code="500"
                            title="Something went wrong"
                            description="The server ran into a problem handling your request. Try again in a moment."
                            action={() => (
                                <>
                                    <Button label="Retry" prefixIcon={ArrowCounterClockwiseIcon} />
                                    <Button label="Go home" variant="secondary" prefixIcon={HouseIcon} />
                                </>
                            )}
                        />
                    ),
                },
            ]}
        />
    ),
}

/** `size="compact"` — shrinks the whole shell to ONE muted line of text, for tight spaces (tab/panel body). */
export const Compact: Story = {
    render: () =>
        shell(
            <div data-tier="fixture" className="w-64">
                <BlockAnatomy
                    name="EmptyState"
                    tier="composite"
                    leaf="Compact"
                    annotate={ANNOTATE}
                    reason={"`size=\"compact\"` was merged from the deleted `SimpleEmptyState` frame, and it drops every icon, description, body, and CTA down to one muted line, a different shape from the default reserved for a tight spot like a tab or panel body."}
                    states={[
                        {
                            name: "size = \"compact\"",
                            why: "Only the title text renders as a single muted line, even though icon and description are passed in, because compact drops every secondary slot on purpose. The frame chooses this shrink over letting a full-size empty state crowd a narrow container.",
                            code: `<EmptyState
  size="compact"
  title="No submissions yet for this assignment."
/>`,
                            render: (
                                <EmptyState

                                    size="compact"
                                    title="No submissions yet for this assignment."
                                    icon={WarningIcon}
                                    description="This line does NOT render — compact drops every secondary slot."
                                />
                            ),
                        },
                    ]}
                />
            </div>,
        ),
}
