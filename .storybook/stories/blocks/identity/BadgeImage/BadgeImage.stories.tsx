import type { Meta, StoryObj } from "@storybook/nextjs"
import { DiamondIcon, LockIcon, MedalIcon, TrophyIcon } from "@phosphor-icons/react"
import { BadgeImage } from "./BadgeImage"

const meta: Meta<typeof BadgeImage> = {
    title: "Primitives/Identity/BadgeImage",
    component: BadgeImage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof BadgeImage>

// NOTE: in Storybook there is no live MinIO, so every objectKey 404s and the
// `fallback` node renders — which is exactly the block's designed behaviour while
// art is still being uploaded.

export const HasArtOnMinio: Story = {
    render: () => (
        <div className="p-8">
            <BadgeImage
                objectKey="badges/league/gold.png"
                alt="Huy hiệu Vàng"
                size={40}
                fallback={<TrophyIcon size={40} weight="fill" className="text-warning" aria-label="Huy hiệu Vàng" />}
            />
        </div>
    ),
}

export const NotUploadedFallback: Story = {
    render: () => (
        <div className="p-8">
            <BadgeImage
                objectKey="badges/league/not-uploaded-yet.png"
                alt="Huy hiệu Kim Cương"
                size={40}
                fallback={<DiamondIcon size={40} weight="fill" className="text-accent" aria-label="Huy hiệu Kim Cương" />}
            />
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex items-center gap-4">
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Cỡ nhỏ, hàng danh sách"
                    size={16}
                    fallback={<MedalIcon size={16} weight="fill" aria-label="Cỡ nhỏ" />}
                />
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Cỡ mặc định"
                    size={24}
                    fallback={<MedalIcon size={24} weight="fill" aria-label="Cỡ mặc định" />}
                />
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Cỡ lớn, khối hero"
                    size={48}
                    fallback={<MedalIcon size={48} weight="fill" aria-label="Cỡ lớn" />}
                />
            </div>
        </div>
    ),
}

export const CustomFallback: Story = {
    render: () => (
        <div className="p-8">
            <BadgeImage
                objectKey="mascots/fox/not-uploaded-yet.png"
                alt="Linh vật Cáo, chưa mở khoá"
                size={40}
                className="opacity-40 grayscale"
                fallback={<LockIcon size={40} weight="fill" className="text-muted" aria-label="Linh vật Cáo, chưa mở khoá" />}
            />
        </div>
    ),
}
