import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Button, Typography } from "@heroui/react"
import { PageBottomBar } from "@sb-components/composites/layout/Page/Page"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PageBottomBar` — the viewport-pinned action bar of a route. A bar is a
 * horizontal row, so its named slots are `body` (leading) + `actions`
 * (trailing) instead of the vertical `header`/`body`/`footer` trio.
 *
 * COMPOSITE-8: `body`/`actions` take a COMPONENT reference, not a built node
 * — the frame calls it itself so it can forward `isSkeleton`.
 */
const meta: Meta<typeof PageBottomBar> = {
    title: "Composites/Layout/Page/PageBottomBar",
    component: PageBottomBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PageBottomBar>

/**
 * The frame ships `fixed bottom-0` because in the app it pins to the VIEWPORT
 * edge. A `fixed` descendant re-anchors to the nearest ancestor that sets a
 * `transform` (CSS containing-block rule) instead of the viewport — so this
 * demo puts `transform: translateZ(0)` on the `Screen` shell below rather
 * than overriding the bar's own position scheme: `classNames` is a closed,
 * positioning-only union that deliberately excludes `fixed`/`absolute`
 * (positioning SCHEME is the parent composite's call, not a caller's), so
 * there is no door left to hand the bar an `absolute` override through its
 * public prop, nor should there be. The chrome the bar owns — top divider,
 * surface fill, safe padding — stays untouched either way.
 */
const FIXED_CONTAINING_BLOCK_STYLE = { transform: "translateZ(0)" } as const

// `body`/`actions` are arbitrary caller-supplied component references (§11a caller-slot rule,
// COMPOSITE-8) — the frame only lays out the row (justify-between, min-w-0/shrink-0 or raw when
// only one side is passed), it never claims their content as its own anatomy, so neither carries
// a badge.
const BOTH_PARTS: Array<AnatomyNode> = []
const BODY_ONLY_PARTS: Array<AnatomyNode> = []
const ACTIONS_ONLY_PARTS: Array<AnatomyNode> = []

/** Props for the local `PriceTag` helper — a faithful mini price display. */
interface PriceTagProps {
    /** Discounted price shown in bold. */
    discounted: number
    /** Original price shown struck through. */
    original: number
}

// TODO: swap for PriceTag local when ported — a faithful mini price display.
const PriceTag = ({ discounted, original }: PriceTagProps) => (
    <div data-tier="fixture" className="flex items-baseline gap-2">
        <Typography type="body" weight="bold">${discounted.toLocaleString("en-US")}</Typography>
        <Typography type="body-xs" color="muted" className="line-through">${original.toLocaleString("en-US")}</Typography>
    </div>
)

/** `body` fixture for the `PriceWithAction` leaf — a component reference (COMPOSITE-8). */
const EnrollPriceTag = () => <PriceTag discounted={59.99} original={89.99} />
/** `actions` fixture for the `PriceWithAction` leaf. */
const EnrollAction = () => <Button data-tier="fixture" variant="primary" onPress={() => {}}>Enroll now</Button>
/** `children` fixture for the `FullWidthAction` leaf — the whole bar is one full-width button. */
const StartLearningAction = () => (
    <Button data-tier="fixture" variant="primary" className="w-full" onPress={() => {}}>Start learning for free</Button>
)
/** `actions` fixture for the `WithDecline` leaf — two `flex-1` buttons sharing the bar. */
const DeclineOrAcceptActions = () => (
    <div data-tier="fixture" className="flex items-center gap-3">
        <Button variant="secondary" className="flex-1" onPress={() => {}}>Decline</Button>
        <Button variant="primary" className="flex-1" onPress={() => {}}>Accept all</Button>
    </div>
)

/** Props for the local `Screen` helper — a phone-screen shell wrapping the bar under test. */
interface ScreenProps {
    /** The `PageBottomBar` under test, pinned to the bottom of the frame. */
    bar: ReactNode
}

/** Phone-screen shell: fixed-height outer frame, inner pane scrolls, the bar sits `fixed` on the OUTER frame (see {@link FIXED_CONTAINING_BLOCK_STYLE}). */
const Screen = ({ bar }: ScreenProps) => (
    <div data-tier="fixture" className="relative h-[28rem] w-96 overflow-hidden bg-background" style={FIXED_CONTAINING_BLOCK_STYLE}>
        <div className="h-full overflow-y-auto px-4 pb-24 pt-4">
            <div className="flex flex-col gap-3">
                <Typography type="h3">Fullstack Mastery</Typography>
                <Typography type="body-sm" color="muted">
                    A path from fundamentals to shipping a real product. Scroll down to see the bottom bar stay pinned — the exact behavior on mobile when enrolling / accepting cookies.
                </Typography>
                {Array.from({ length: 8 }, (_, index) => (
                    <div data-tier="fixture" key={index} className="flex flex-col gap-1">
                        <Typography type="body-sm" weight="semibold">{`Module ${index + 1}`}</Typography>
                        <Typography type="body-sm" color="muted">
                            Sample content to give enough scroll height — the bar must stay within reach no matter where you are on the page.
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
        {bar}
    </div>
)

/** Both slots: the enroll bar of a paid course — `body` price left, `actions` CTA right; the frame lays the row out itself. */
export const PriceWithAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageBottomBar"
                tier="composite"
                leaf="PriceWithAction"
                parts={BOTH_PARTS}
                states={[
                    {
                        name: "body set, actions set (enroll bar of a paid course)",
                        why: "With both slots filled, the frame lays out a justify-between row itself, the price on the left and the CTA on the right. The caller no longer has to hand-write that flex row, which is the whole point of filling both slots instead of just one.",
                        code: `<PageBottomBar
  body={EnrollPriceTag}
  actions={EnrollAction}
/>`,
                        render: (
                            <Screen
                                bar={(
                                    <PageBottomBar

                                        body={EnrollPriceTag}
                                        actions={EnrollAction}
                                    />
                                )}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `children` shorthand only: a free course has no price to weigh, so one full-width button owns the whole bar. */
export const FullWidthAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageBottomBar"
                tier="composite"
                leaf="FullWidthAction"
                parts={BODY_ONLY_PARTS}
                states={[
                    {
                        name: "children set (body shorthand), actions not set",
                        why: "Content renders raw instead of wrapped in shrink-0, so the button's own w-full still takes effect across the whole bar. A free course has no price to weigh against a CTA, so one full-width button is left to own the entire row.",
                        code: "<PageBottomBar>{StartLearningAction}</PageBottomBar>",
                        render: (
                            <Screen
                                bar={(
                                    <PageBottomBar
                                        body={StartLearningAction}
                                    />
                                )}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `actions` only: a blocking DECISION (cookie consent) — two `flex-1` buttons share the bar, no leading content to weigh against. */
export const WithDecline: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageBottomBar"
                tier="composite"
                leaf="WithDecline"
                parts={ACTIONS_ONLY_PARTS}
                states={[
                    {
                        name: "body not set, actions set (two flex-1 buttons)",
                        why: "Actions fills the whole bar and keeps the two buttons' flex-1 intact instead of being squeezed by shrink-0. A blocking decision like cookie consent has no leading content to weigh against, so both choices share the bar equally.",
                        code: "<PageBottomBar actions={DeclineOrAcceptActions} />",
                        render: (
                            <Screen
                                bar={(
                                    <PageBottomBar

                                        actions={DeclineOrAcceptActions}
                                    />
                                )}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
