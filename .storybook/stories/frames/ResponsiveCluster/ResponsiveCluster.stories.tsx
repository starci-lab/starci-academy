import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { ResponsiveCluster, type ResponsiveClusterItem } from "@sb-components/frames/ResponsiveCluster/ResponsiveCluster"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ResponsiveCluster` — a repeat-list FRAME: a full-width COLUMN below its switch
 * step, a packed ROW from it up, with ONE shared gap on both sides (unlike
 * `ResponsiveRow`, which goes flush once it becomes a row). Below the switch every
 * item is stretched `w-full`, released to `w-auto` at the switch step, so a caller's
 * `Button` never has to know which form it is in. Real caller: `ButtonGroup`.
 */
const meta: Meta<typeof ResponsiveCluster> = {
    title: "Frames/ResponsiveCluster/ResponsiveCluster",
    component: ResponsiveCluster,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ResponsiveCluster>

const buttonItems = (labels: ReadonlyArray<string>): Array<ResponsiveClusterItem> =>
    labels.map((label) => ({
        key: label,
        content: () => <Button label={label} variant={label === "Save" ? "primary" : "secondary"} onPress={() => {}} />,
    }))

const BUTTONS = ["Cancel", "Save"]

/** `@app-*` measures the NEAREST CONTAINER, not the viewport. */
interface FrameProps {
    width: string
    label: string
    children: ReactNode
}

const Frame = ({ width, label, children }: FrameProps) => (
    <div data-tier="fixture" className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** Default — the switch itself, at the two container widths that straddle `at="sm"` (`ButtonGroup`'s own default). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ResponsiveCluster"
                tier="frame"
                leaf="Default"
                reason="A repeating list ⇒ `items` DATA, `children` FORBIDDEN. Unlike `ResponsiveRow`, this frame keeps ONE real gap on BOTH sides of the switch — the fit for a homogeneous action row like `ButtonGroup`, where the buttons should never touch even stacked full-width."
                states={[
                    {
                        name: "container = 320px (below @app-sm) — stacked full-width column",
                        why: "Below the switch step each button stretches `w-full` and stacks in reading order, gap preserved between them — the shape a narrow dialog footer needs so neither action gets visually favoured by width.",
                        code: `<ResponsiveCluster
    at="sm"
    gap={3}
    items={[
        { key: "cancel", content: () => <Button label="Cancel" variant="secondary" /> },
        { key: "save", content: () => <Button label="Save" variant="primary" /> },
    ]}
/>`,
                        render: (
                            <Frame width="20rem" label="container 320px — below @app-sm → stacked column">
                                <ResponsiveCluster
                                    at="sm"
                                    gap={3}
                                    data-tier="frame"
                                    data-component="ResponsiveCluster"
                                    items={buttonItems(BUTTONS)}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "container = 640px (@app-sm) — packed row",
                        why: "Once the container crosses `@app-sm` the buttons release to `w-auto` and pack into a row, the same gap carried over from the stacked form — the `items`/`gap` props never changed, only the container's width did.",
                        code: `<ResponsiveCluster
    at="sm"
    gap={3}
    items={[…]}
/>`,
                        render: (
                            <Frame width="40rem" label="container 640px — @app-sm → packed row">
                                <ResponsiveCluster
                                    at="sm"
                                    gap={3}
                                    data-tier="frame"
                                    data-component="ResponsiveCluster"
                                    items={buttonItems(BUTTONS)}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Justify — main-axis distribution ONCE packed into a row; below the switch every item is `w-full` so justify has nothing to distribute yet. */
export const Justify: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ResponsiveCluster"
                tier="frame"
                leaf="Justify"
                reason="`justify` only reads once the track has switched to a packed row — below the switch step every item is stretched `w-full`, leaving no free space for a distribution to act on."
                states={[
                    {
                        name: "justify = \"end\" (container = 640px)",
                        why: "The packed row gathers both buttons against the trailing edge — the common dialog-footer shape, where the primary action sits at the reading end.",
                        code: `<ResponsiveCluster at="sm" gap={3} justify="end" items={[…]} />`,
                        render: (
                            <Frame width="40rem" label={`container 640px — justify="end"`}>
                                <ResponsiveCluster
                                    at="sm"
                                    gap={3}
                                    justify="end"
                                    data-tier="frame"
                                    data-component="ResponsiveCluster"
                                    items={buttonItems(BUTTONS)}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "justify = \"between\" (container = 640px)",
                        why: "The same two buttons instead pin to opposite edges — for a footer pairing a destructive/secondary action on one side with the primary action on the other.",
                        code: `<ResponsiveCluster at="sm" gap={3} justify="between" items={[…]} />`,
                        render: (
                            <Frame width="40rem" label={`container 640px — justify="between"`}>
                                <ResponsiveCluster
                                    at="sm"
                                    gap={3}
                                    justify="between"
                                    data-tier="frame"
                                    data-component="ResponsiveCluster"
                                    items={buttonItems(BUTTONS)}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
