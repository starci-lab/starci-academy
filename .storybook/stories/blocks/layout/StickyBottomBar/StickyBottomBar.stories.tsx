import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Button, Typography } from "@heroui/react"
import { StickyBottomBar } from "./StickyBottomBar"

const meta: Meta<typeof StickyBottomBar> = {
    title: "Primitives/Layout/StickyBottomBar",
    component: StickyBottomBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StickyBottomBar>

/**
 * The block ships `fixed inset-x-0 bottom-0` because in the app it pins to the
 * VIEWPORT edge. `fixed` ignores a `relative` ancestor, so inside a preview box
 * it escapes to the bottom of the canvas. Re-anchoring it to the box
 * (`absolute`, merged over `fixed` by tailwind-merge) is what makes the demo
 * show the bar where the story claims; the chrome it owns — top divider,
 * surface fill, safe padding — stays untouched.
 */
const IN_BOX = "absolute inset-x-0 bottom-0"

// TODO: swap for PriceTag local when ported — a faithful mini price display.
const PriceTag = ({ discounted, original }: { discounted: number; original: number }) => (
    <div className="flex items-baseline gap-2">
        <Typography type="body" weight="bold">{discounted.toLocaleString("vi-VN")}đ</Typography>
        <Typography type="body-xs" color="muted" className="line-through">{original.toLocaleString("vi-VN")}đ</Typography>
    </div>
)

/** Phone-screen shell: fixed-height outer frame, inner pane scrolls, the bar sits `absolute` on the OUTER frame. */
const Screen = ({ bar }: { bar: ReactNode }) => (
    <div className="relative h-[28rem] w-96 overflow-hidden bg-background">
        <div className="h-full overflow-y-auto px-4 pb-24 pt-4">
            <div className="flex flex-col gap-4">
                <Typography type="h3">Fullstack Mastery</Typography>
                <Typography type="body-sm" color="muted">
                    A path from fundamentals to shipping a real product. Scroll down to see the bottom bar stay pinned — the exact behavior on mobile when enrolling / accepting cookies.
                </Typography>
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <Typography type="body-sm" weight="semibold">{`Module ${index + 1}`}</Typography>
                        <Typography type="body-sm" color="muted">
                            Sample content to give enough scroll height — the StickyBottomBar must stay within reach no matter where you are on the page.
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
        {bar}
    </div>
)

/** Price + primary action: the enroll bar of a paid course — price left, CTA right; scroll and it stays pinned. */
export const PriceWithAction: Story = {
    render: () => (
        <div className="p-8">
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <div className="flex items-center justify-between gap-3">
                            <PriceTag discounted={599000} original={899000} />
                            <Button variant="primary" onPress={() => {}}>Enroll now</Button>
                        </div>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}

/** One full-width action: a free course has no price to weigh, so the button owns the whole bar. */
export const FullWidthAction: Story = {
    render: () => (
        <div className="p-8">
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <Button variant="primary" className="w-full" onPress={() => {}}>Start learning for free</Button>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}

/** Primary action beside a decline path — a blocking DECISION (cookie consent), both choices side by side. */
export const WithDecline: Story = {
    render: () => (
        <div className="p-8">
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" className="flex-1" onPress={() => {}}>Decline</Button>
                            <Button variant="primary" className="flex-1" onPress={() => {}}>Accept all</Button>
                        </div>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}
