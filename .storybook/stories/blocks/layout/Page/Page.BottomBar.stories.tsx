import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Button, Typography } from "@heroui/react"
import { Page } from "@sb-components/layouts/layout/Page/Page"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Page.BottomBar` — the viewport-pinned action bar of a route. A bar is a
 * horizontal row, so its named slots are `body` (leading) + `actions`
 * (trailing) instead of the vertical `header`/`body`/`footer` trio.
 */
const meta: Meta<typeof Page.BottomBar> = {
    title: "Layouts/Layout/Page/Page.BottomBar",
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

// Both slots → khung dựng hàng justify-between (Body min-w-0 · Actions shrink-0).
const BOTH_PARTS: Array<AnatomyNode> = [
    { name: "Body", tier: "primitive", role: "nội dung dẫn đầu (thường là giá), min-w-0" },
    { name: "Actions", tier: "primitive", role: "nút chính bên phải, shrink-0" },
]

// One side only → nội dung render RAW để giữ chiến lược width của caller.
const BODY_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Body", tier: "primitive", role: "toàn bộ hàng bar do caller tự dàn (không có Actions để chia đôi)" },
]
const ACTIONS_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Actions", tier: "primitive", role: "cụm nút chiếm cả bar, tự giữ w-full/flex-1 của caller" },
]

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
                tier="primitive"
                leaf="PriceWithAction"
                parts={BOTH_PARTS}
                reason="Có ĐỦ hai slot → khung tự dàn flex justify-between, caller không còn phải tự viết hàng flex đó nữa."
            >
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
            </BlockAnatomy>
        </div>
    ),
}

/** `children` shorthand only: a free course has no price to weigh, so one full-width button owns the whole bar. */
export const FullWidthAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.BottomBar"
                tier="primitive"
                leaf="FullWidthAction"
                parts={BODY_ONLY_PARTS}
                note="Chỉ một phía → nội dung render RAW, không bọc shrink-0, nên w-full của nút vẫn ăn."
            >
                <Screen
                    bar={(
                        <Page.BottomBar className={IN_BOX} showAnatomy>
                            <Button variant="primary" className="w-full" onPress={() => {}}>Start learning for free</Button>
                        </Page.BottomBar>
                    )}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `actions` only: a blocking DECISION (cookie consent) — two `flex-1` buttons share the bar, no leading content to weigh against. */
export const WithDecline: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.BottomBar"
                tier="primitive"
                leaf="WithDecline"
                parts={ACTIONS_ONLY_PARTS}
                note="body null → Actions chiếm cả bar và giữ nguyên flex-1 của hai nút (không bị shrink-0 bóp)."
            >
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
            </BlockAnatomy>
        </div>
    ),
}
