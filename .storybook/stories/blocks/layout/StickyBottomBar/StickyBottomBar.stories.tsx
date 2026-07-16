import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { StickyBottomBar } from "@/components/blocks/layout/StickyBottomBar"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { IN_BOX, Screen } from "./components"

const meta: Meta<typeof StickyBottomBar> = {
    title: "Core/Layout/StickyBottomBar",
    component: StickyBottomBar,
}
export default meta
type Story = StoryObj<typeof StickyBottomBar>

/** Use when an action must always stay within thumb's reach no matter how far the user scrolls on mobile — instead of letting the CTA drift with the content and scroll out of view. The block is just chrome: the background, the top border, and safe-area padding are its own; what to put inside is the caller's call. */
export const Default: Story = {
    parameters: { usage: "Use when an action must always stay within thumb's reach no matter how far the user scrolls on mobile — instead of letting the CTA drift with the content and scroll out of view. The block is just chrome: the background, top border, and safe-area padding are its own; what to put inside is the caller's call. Story: scroll the content above — the bar stays anchored to the bottom." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Price with a primary action</Label>
                <Typography type="body-sm" color="muted">
                    The layout of the enrollment bar for a paid course: price on the left, button on the right. Scroll the content above — the bar stays anchored to the bottom.
                </Typography>
            </div>
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <div className="flex items-center justify-between gap-3">
                            <PriceTag discounted={599000} original={899000} size="sm" />
                            <Button variant="primary" onPress={() => {}}>Enroll now</Button>
                        </div>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}

/** Use when there's nothing left to weigh before clicking — a free course, no price to read, so the button takes the full width instead of leaving half the bar empty. */
export const SingleAction: Story = {
    parameters: { usage: "Use when there's nothing left to weigh before clicking — a free course, no price to read, so the button takes the full width instead of leaving half the bar empty." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>One action, full width</Label>
                <Typography type="body-sm" color="muted">
                    The layout for a free course: the button spans the full width. Scroll the content — the bar stays anchored to the bottom.
                </Typography>
            </div>
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

/** Use when the bar is a BLOCKING decision — the user must answer right here before moving on (cookie consent), so the decline path has to sit next to the accept path rather than being hidden elsewhere. For an ordinary inviting bar, keep exactly one primary CTA as in the Default story. */
export const WithSecondaryAction: Story = {
    parameters: { usage: "Use when the bar is a BLOCKING decision — the user must answer right here before moving on (cookie consent), so the decline path has to sit next to the accept path rather than being hidden elsewhere. For an ordinary inviting bar, keep exactly one primary CTA as in the Default story." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Primary action with a decline path</Label>
                <Typography type="body-sm" color="muted">
                    The layout of a cookie-consent bar: two peer paths on the bar. Scroll the content — the bar stays anchored to the bottom.
                </Typography>
            </div>
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
