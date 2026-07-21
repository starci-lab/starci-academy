import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { LightningIcon, ShieldCheckIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { PitchCard } from "./PitchCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof PitchCard> = {
    title: "Block/Marketing/PitchCard",
    component: PitchCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PitchCard>

const ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung surface (h-full để đều hàng)" },
        { name: "IconTile", role: "ô icon tô nền theo tone" },
    ],
    reason:
        "Một 'beat' landing lặp lại: một icon có nhãn màu, một claim đậm, một đoạn giải thích, đôi khi một CTA. Gói SectionCard + IconTile + typography vào một block để mọi beat (wedge/outcome/methodology) dùng chung một khung nhất quán, đều chiều cao khi xếp lưới — feature chỉ đổi icon/tone/chữ.",
}

export const Default: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PitchCard
                    icon={<LightningIcon weight="duotone" />}
                    title="Học nhanh gấp đôi"
                    body="Lộ trình cô đọng, mỗi tuần một chủ đề với bài tập tự chấm — không lan man."
                />
            </div>,
            ANATOMY,
        ),
}

export const WithFooter: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PitchCard
                    icon={<ShieldCheckIcon weight="duotone" />}
                    tone="success"
                    title="Cam kết đầu ra"
                    body="Hoàn thành dự án cuối là có sản phẩm bỏ thẳng vào CV."
                    footer={<Button variant="secondary" size="sm">Xem lộ trình</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const ToneVariants: Story = {
    render: () =>
        blockShell(
            <div className="grid max-w-3xl grid-cols-1 gap-3 @app-md:grid-cols-3">
                <PitchCard icon={<LightningIcon weight="duotone" />} tone="accent" title="Nhanh" body="Cô đọng, đúng trọng tâm." />
                <PitchCard icon={<ShieldCheckIcon weight="duotone" />} tone="success" title="Chắc" body="Cam kết đầu ra rõ ràng." />
                <PitchCard icon={<RocketLaunchIcon weight="duotone" />} tone="warning" title="Xa" body="Nền tảng để đi đường dài." />
            </div>,
            ANATOMY,
        ),
}
