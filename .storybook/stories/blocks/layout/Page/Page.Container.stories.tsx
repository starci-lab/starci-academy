import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { Page } from "@sb-components/layouts/layout/Page/Page"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Page.Container` — the outermost khung of a route: full width, flush at the
 * left edge (no `mx-auto`, no `pl-*`), only a right gutter + `py-16`. Features
 * inside do not (and must not) set their own `p-*`.
 */
const meta: Meta<typeof Page.Container> = {
    title: "Layouts/Layout/Page/Page.Container",
    component: Page.Container,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Page.Container>

// Slot khung: Header / Body / Footer, gap-8 (page rhythm) between them. With
// neither header nor footer the body renders RAW — no wrapper, no part at all,
// so the BodyOnly leaf below carries NO BlockAnatomy axis (nothing to badge).
const HEADER_BODY_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "vùng đầu trang (thường là Page.Header)" },
    { name: "Body", tier: "primitive", role: "vùng nội dung chính" },
]

const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "vùng đầu trang (thường là Page.Header)" },
    { name: "Body", tier: "primitive", role: "vùng nội dung chính" },
    { name: "Footer", tier: "primitive", role: "vùng cuối trang TRONG DÒNG (không phải bar fixed)" },
]

// TODO: swap for SurfaceCard.Base local when the Page family is wired to it.
const ContentBlock = ({ title, text }: { title: string; text: string }) => (
    <div className="rounded-3xl bg-surface p-3 shadow-surface">
        <Typography type="body" weight="bold">{title}</Typography>
        <Typography type="body-sm" color="muted" className="mt-2">{text}</Typography>
    </div>
)

/**
 * `children` only — the shorthand path. With neither `header` nor `footer` the
 * body is returned RAW (no wrapper div), so this leaf composes NO parts and
 * therefore carries no anatomy axis: the khung contributes only the page
 * gutter + `py-16` rhythm around whatever it is handed.
 */
export const BodyOnly: Story = {
    render: () => (
        <div className="p-8">
            <Page.Container>
                <ContentBlock
                    title="My courses"
                    text="The list of courses you've enrolled in, along with your most recent learning progress."
                />
            </Page.Container>
        </div>
    ),
}

/** `header` + `body`: the everyday route shape — a `Page.Header` above the content, separated by the page rhythm (`gap-8`). */
export const HeaderAndBody: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.Container"
                tier="primitive"
                leaf="HeaderAndBody"
                parts={HEADER_BODY_PARTS}
                note="header khác null → khung dựng stack gap-8 (nhịp TRANG, rộng hơn gap-3 trong card)."
            >
                <Page.Container
                    showAnatomy
                    header={
                        <Page.Header
                            title="Fullstack Mastery"
                            description="A path from the fundamentals to shipping a real product, graded by AI."
                        />
                    }
                    body={
                        <div className="flex flex-col gap-3">
                            <ContentBlock title="Module 1 — Foundations" text="HTTP, REST semantics, and the request lifecycle." />
                            <ContentBlock title="Module 2 — Persistence" text="TypeORM entities, relations, and migrations." />
                        </div>
                    }
                />
            </BlockAnatomy>
        </div>
    ),
}

/** All three slots: an in-flow closing CTA under the content. This is NOT the pinned bar — that is `Page.BottomBar`. */
export const HeaderBodyFooter: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.Container"
                tier="primitive"
                leaf="HeaderBodyFooter"
                parts={FULL_PARTS}
                note="footer ở đây là vùng CUỐI TRANG trong dòng chảy — khác hẳn Page.BottomBar (fixed theo viewport)."
            >
                <Page.Container
                    showAnatomy
                    header={
                        <Page.Header
                            size="compact"
                            title="Checkout"
                            description="Review your order before paying."
                        />
                    }
                    body={<ContentBlock title="Fullstack Mastery" text="Lifetime access · AI grading · community support." />}
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button variant="tertiary" size="sm" onPress={() => {}}>Back</Button>
                            <Button variant="primary" size="sm" onPress={() => {}}>Continue to payment</Button>
                        </div>
                    }
                />
            </BlockAnatomy>
        </div>
    ),
}
