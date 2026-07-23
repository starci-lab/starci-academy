import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"

/**
 * PRIMITIVE — Typography is the text ATOM (§9). Every piece of text flows through
 * it via the `type` (scale), `color`, and `weight` props — NOT raw `text-*` /
 * `font-*` classNames. This specimen documents the real HeroUI scale:
 * `h1–h6 · body · body-sm · body-xs · code`, colours `default | muted`, and
 * weights `normal | medium | semibold | bold`.
 */
const meta: Meta<typeof Typography> = {
    title: "Primitives/Typography/Typography",
    component: Typography,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof Typography>

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-baseline gap-6 border-b border-divider/40 py-2">
        <span className="w-28 shrink-0 font-mono text-xs text-muted">{label}</span>
        <div className="min-w-0">{children}</div>
    </div>
)

const SAMPLE = "Nền tảng phỏng vấn Backend"

/** TYPE SCALE — heading levels h1–h6 then the body scale + inline code. */
export const TypeScale: Story = {
    render: () => (
        <div className="flex flex-col gap-1 p-8">
            <Row label="h1"><Typography type="h1">{SAMPLE}</Typography></Row>
            <Row label="h2"><Typography type="h2">{SAMPLE}</Typography></Row>
            <Row label="h3"><Typography type="h3">{SAMPLE}</Typography></Row>
            <Row label="h4"><Typography type="h4">{SAMPLE}</Typography></Row>
            <Row label="h5"><Typography type="h5">{SAMPLE}</Typography></Row>
            <Row label="h6"><Typography type="h6">{SAMPLE}</Typography></Row>
            <Row label="body (base)"><Typography type="body">{SAMPLE}</Typography></Row>
            <Row label="body-sm"><Typography type="body-sm">{SAMPLE}</Typography></Row>
            <Row label="body-xs"><Typography type="body-xs">{SAMPLE}</Typography></Row>
            <Row label="code"><Typography type="code">const answer = 42</Typography></Row>
        </div>
    ),
}

/** COLOUR — `default` (foreground, the DEFAULT — omit) vs `muted` (supporting). */
export const Colors: Story = {
    render: () => (
        <div className="flex flex-col gap-1 p-8">
            <Row label="default"><Typography type="body">Chữ chính — mặc định, không cần khai báo.</Typography></Row>
            <Row label="muted"><Typography type="body" color="muted">Chữ phụ — hint / mô tả / caption.</Typography></Row>
        </div>
    ),
}

/** WEIGHT — the emphasis dial; `medium` is the working emphasis for labels/values. */
export const Weights: Story = {
    render: () => (
        <div className="flex flex-col gap-1 p-8">
            <Row label="normal"><Typography type="body" weight="normal">{SAMPLE}</Typography></Row>
            <Row label="medium"><Typography type="body" weight="medium">{SAMPLE}</Typography></Row>
            <Row label="semibold"><Typography type="body" weight="semibold">{SAMPLE}</Typography></Row>
            <Row label="bold"><Typography type="body" weight="bold">{SAMPLE}</Typography></Row>
        </div>
    ),
}

/** CODE — the mono `code` type for inline snippets / commands. */
export const Code: Story = {
    render: () => (
        <div className="p-8">
            <Typography type="body">
                Chạy <Typography type="code">docker compose up -d</Typography> để khởi động, rồi{" "}
                <Typography type="code">npm run dev</Typography>.
            </Typography>
        </div>
    ),
}
