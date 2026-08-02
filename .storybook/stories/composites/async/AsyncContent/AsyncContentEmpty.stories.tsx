import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): `AsyncContentEmpty` is the EMPTY
 * MESSAGE FRAME — its own asset is the message SLOTS (icon · title · description ·
 * action). So every state here originates from TOGGLING its own slots. The
 * question of "when does the empty branch get picked" is a state of
 * `AsyncContent`, and is NOT repeated here.
 *
 * ANATOMY IS PER-LEAF: each story is its own leaf, carrying its own parts tree.
 */
const meta: Meta<typeof AsyncContentEmpty> = {
    title: "Composites/Async/AsyncContent/AsyncContentEmpty",
    component: AsyncContentEmpty,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof AsyncContentEmpty>
/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>
// This frame is a THIN layer over the `EmptyState` composite. Icon/title/description
// are VALUES passed into EmptyState's props, so they don't split into separate
// nodes — only `action` is a node that gets COMPOSED in, so it only shows up in the
// tree of the leaf that has a button.
const MESSAGE_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "composite",
        role: "icon + title + description + action frame, centered",
        storyId: "composites-feedback-emptystate-emptystate--title-only",
    },
]
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "composite",
        role: "icon + title + description + action frame, centered",
        storyId: "composites-feedback-emptystate-emptystate--title-only",
        children: [
            { name: "Button", tier: "atom", role: "shorthand onRetry + retryLabel → button placed in the action slot", state: "secondary", storyId: "atoms-buttons-button-button--default" },
        ],
    },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "composite",
        role: "icon + title + description + action frame, centered",
        storyId: "composites-feedback-emptystate-emptystate--title-only",
        children: [
            { name: "Action", tier: "composite", role: "general-purpose action slot, taking any node the caller passes in" },
        ],
    },
]
/** BASIC — title only: the most compact shape (default icon + title). */
export const Basic: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContentEmpty"
                tier="composite"
                leaf="Basic"
                parts={MESSAGE_PARTS}
                reason="The empty state of an async data area needs the exact anatomy of EmptyState (icon + title + description + centered action). AsyncContentEmpty only adds a default TrayIcon and wraps onRetry/retryLabel into a button for the action slot, a thin layer over EmptyState that redraws nothing of its own."
                states={[
                    {
                        name: "title set, no other slot set",
                        why: "The default TrayIcon sits above the title, with no description line and no action row below it. This is the most compact shape the frame can take, for a data area that simply has nothing to show yet.",
                        code: `<AsyncContentEmpty
  title="No data yet"
/>`,
                        render: <AsyncContentEmpty title="No data yet" />,
                    },
                ]}
            />,
        ),
}
/** WITH DESCRIPTION — turns on the `description` slot: adds a muted line under the title. */
export const WithDescription: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContentEmpty"
                tier="composite"
                leaf="WithDescription"
                parts={MESSAGE_PARTS}
                states={[
                    {
                        name: "title set, description set",
                        why: "A muted description line grows under the title, a node the Basic leaf does not carry. The extra sentence exists for a message that needs more context than the title alone can give.",
                        code: `<AsyncContentEmpty
  title="List is empty"
  description="You haven't saved any items to this list yet."
/>`,
                        render: (
                            <AsyncContentEmpty
                                title="List is empty"
                                description="You haven't saved any items to this list yet."
                               
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/** WITH RETRY — shorthand `onRetry` + `retryLabel` auto-wraps into a Button in the action slot. */
export const WithRetry: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContentEmpty"
                tier="composite"
                leaf="WithRetry"
                parts={RETRY_PARTS}
                states={[
                    {
                        name: "onRetry set, retryLabel set",
                        why: "A secondary size-sm Button grows in the action slot, built by the frame itself rather than passed in as a node. Missing either onRetry or retryLabel leaves the action slot empty, so both must be set together for the button to appear.",
                        code: `<AsyncContentEmpty
  title="No results found"
  description="Try changing your filters or reloading to see more."
  onRetry={() => {}}
  retryLabel="Reload"
/>`,
                        render: (
                            <AsyncContentEmpty
                                title="No results found"
                                description="Try changing your filters or reloading to see more."
                                onRetry={() => {}}
                                retryLabel="Reload"
                               
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/** WITH ACTION — the general-purpose `action` slot: any node, WINS over the retry shorthand. */
export const WithAction: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContentEmpty"
                tier="composite"
                leaf="WithAction"
                parts={ACTION_PARTS}
                states={[
                    {
                        name: "action set (node, wins over onRetry/retryLabel)",
                        why: "The exact node passed through action lands in the action slot instead of the frame's own retry button. This is for when the thing to do is not \"retry\" but something else, such as creating a new item, so the caller passes the node straight through.",
                        code: `<AsyncContentEmpty
  title="No decks yet"
  description="Create your first deck to start reviewing."
  action={<Button size="sm" suffixIcon={PlusIcon} label="Create deck" />}
/>`,
                        render: (
                            <AsyncContentEmpty
                                title="No decks yet"
                                description="Create your first deck to start reviewing."
                                action={<Button size="sm" suffixIcon={PlusIcon} label="Create deck" />}
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/** CUSTOM ICON — overrides the `icon` slot; the rest of the shape matches leaf WithDescription. */
export const CustomIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContentEmpty"
                tier="composite"
                leaf="CustomIcon"
                parts={MESSAGE_PARTS}
                states={[
                    {
                        name: "icon set (overrides default TrayIcon)",
                        why: "The glyph above the title swaps from the default TrayIcon to whatever icon is passed in, here MagnifyingGlassIcon. Icon is a value handed into EmptyState rather than a composed node, so the parts tree stays the same as the leaves without it.",
                        code: `<AsyncContentEmpty
  icon={<MagnifyingGlassIcon weight="duotone" />}
  title="No matching results"
  description="No items match the keyword you entered."
/>`,
                        render: (
                            <AsyncContentEmpty
                                icon={MagnifyingGlassIcon}
                                title="No matching results"
                                description="No items match the keyword you entered."
                               
                            />
                        ),
                    },
                ]}
            />,
        ),
}