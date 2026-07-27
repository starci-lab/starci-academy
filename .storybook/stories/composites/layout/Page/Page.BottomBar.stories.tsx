import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Button, Typography } from "@heroui/react"
import { Page } from "@sb-components/composites/layout/Page/Page"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Page.BottomBar` — the viewport-pinned action bar of a route. A bar is a
 * horizontal row, so its named slots are `body` (leading) + `actions`
 * (trailing) instead of the vertical `header`/`body`/`footer` trio.
 */
const meta: Meta<typeof Page.BottomBar> = {
    title: "Composites/Layout/Page/Page.BottomBar",
    component: Page.BottomBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Page.BottomBar>

/**
 * The khung ships `fixed bottom-0` because in the app it pins to the VIEWPORT
 * edge. `fixed` ignores a `relative` ancestor, so inside a preview box it
 * escapes to the bottom of the canvas. Re-anchoring it to the box (`absolute`,
 * merged over `fixed` by tailwind-merge) is what makes the demo show the bar
 * where the story claims; the chrome it owns — top divider, surface fill, safe
 * padding — stays untouched.
 */
const IN_BOX = "absolute inset-x-0 bottom-0"

// `body`/`actions` are arbitrary caller-supplied slots (§11a caller-slot rule) — the khung only
// lays out the row (justify-between, min-w-0/shrink-0 or raw when only one side is passed), it
// never claims their content as its own anatomy, so neither carries a badge.
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
    <div className="flex items-baseline gap-2">
        <Typography type="body" weight="bold">{discounted.toLocaleString("vi-VN")}đ</Typography>
        <Typography type="body-xs" color="muted" className="line-through">{original.toLocaleString("vi-VN")}đ</Typography>
    </div>
)

/** Props for the local `Screen` helper — a phone-screen shell wrapping the bar under test. */
interface ScreenProps {
    /** The `Page.BottomBar` under test, pinned to the bottom of the frame. */
    bar: ReactNode
}

/** Phone-screen shell: fixed-height outer frame, inner pane scrolls, the bar sits `absolute` on the OUTER frame. */
const Screen = ({ bar }: ScreenProps) => (
    <div className="relative h-[28rem] w-96 overflow-hidden bg-background">
        <div className="h-full overflow-y-auto px-4 pb-24 pt-4">
            <div className="flex flex-col gap-3">
                <Typography type="h3">Fullstack Mastery</Typography>
                <Typography type="body-sm" color="muted">
                    A path from fundamentals to shipping a real product. Scroll down to see the bottom bar stay pinned — the exact behavior on mobile when enrolling / accepting cookies.
                </Typography>
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-1">
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

/** Both slots: the enroll bar of a paid course — `body` price left, `actions` CTA right; the khung lays the row out itself. */
export const PriceWithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.BottomBar"
                tier="composite"
                leaf="PriceWithAction"
                parts={BOTH_PARTS}
                states={[
                    {
                        name: "body set, actions set (enroll bar of a paid course)",
                        why: "With both slots filled, the khung lays out a justify-between row itself, the price on the left and the CTA on the right. The caller no longer has to hand-write that flex row, which is the whole point of filling both slots instead of just one.",
                        code: `<Page.BottomBar
  body={<PriceTag discounted={599000} original={899000} />}
  actions={<Button variant="primary">Enroll now</Button>}
/>`,
                        render: (
                            <Screen
                                bar={(
                                    <Page.BottomBar
                                        className={IN_BOX}
                                        showAnatomy
                                        body={<PriceTag discounted={599000} original={899000} />}
                                        actions={<Button variant="primary" onPress={() => {}}>Enroll now</Button>}
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
        <div className="p-8">
            <BlockAnatomy
                name="Page.BottomBar"
                tier="composite"
                leaf="FullWidthAction"
                parts={BODY_ONLY_PARTS}
                states={[
                    {
                        name: "children set (body shorthand), actions not set",
                        why: "Content renders raw instead of wrapped in shrink-0, so the button's own w-full still takes effect across the whole bar. A free course has no price to weigh against a CTA, so one full-width button is left to own the entire row.",
                        code: "<Page.BottomBar><Button variant=\"primary\" className=\"w-full\">Start learning for free</Button></Page.BottomBar>",
                        render: (
                            <Screen
                                bar={(
                                    <Page.BottomBar className={IN_BOX} showAnatomy>
                                        <Button variant="primary" className="w-full" onPress={() => {}}>Start learning for free</Button>
                                    </Page.BottomBar>
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
        <div className="p-8">
            <BlockAnatomy
                name="Page.BottomBar"
                tier="composite"
                leaf="WithDecline"
                parts={ACTIONS_ONLY_PARTS}
                states={[
                    {
                        name: "body not set, actions set (two flex-1 buttons)",
                        why: "Actions fills the whole bar and keeps the two buttons' flex-1 intact instead of being squeezed by shrink-0. A blocking decision like cookie consent has no leading content to weigh against, so both choices share the bar equally.",
                        code: `<Page.BottomBar
  actions={(
    <>
      <Button variant="secondary" className="flex-1">Decline</Button>
      <Button variant="primary" className="flex-1">Accept all</Button>
    </>
  )}
/>`,
                        render: (
                            <Screen
                                bar={(
                                    <Page.BottomBar
                                        className={IN_BOX}
                                        showAnatomy
                                        actions={(
                                            <div className="flex items-center gap-3">
                                                <Button variant="secondary" className="flex-1" onPress={() => {}}>Decline</Button>
                                                <Button variant="primary" className="flex-1" onPress={() => {}}>Accept all</Button>
                                            </div>
                                        )}
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
