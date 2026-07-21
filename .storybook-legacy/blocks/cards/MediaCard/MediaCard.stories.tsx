import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { MediaCard } from "@/components/blocks/cards/MediaCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof MediaCard> = {
    title: "Legacy/Blocks/Cards/MediaCard",
    component: MediaCard,
}
export default meta
type Story = StoryObj<typeof MediaCard>

/**
 * Toàn bộ trạng thái của MediaCard: một single-shape content card dùng chung cho
 * mọi entity grid (course, lesson, challenge, blog) — 16:9 full-bleed cover trên
 * đầu (flush mép card, Card p-0) rồi title, meta, summary, CTA trong body p-3.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có ảnh cover"
                hint="Entity có ảnh cover: ảnh 16:9 full-bleed trên đầu, để trống bất kỳ slot text nào không có dữ liệu. Card KHÔNG tự pressable — muốn cả card bấm được phải truyền `href`/`onPress`, nếu không footer phải tự có nút riêng. Mô tả bị clamp 2 dòng (line-clamp) nên chiều cao card không đổi theo dữ liệu."
            >
                <div style={{ width: 320 }}>
                    <MediaCard
                        cover={
                            <img
                                src="https://placehold.co/640x360"
                                alt="Course cover"
                                className="size-full object-cover"
                            />
                        }
                        title="Fullstack Mastery path"
                        meta={
                            <>
                                <Chip size="sm">Fullstack</Chip>
                                <Chip size="sm" variant="soft">Intermediate</Chip>
                            </>
                        }
                        description="Build a solid foundation from frontend to backend through hands-on projects, graded by AI."
                        footer={<Button size="sm">View course</Button>}
                    />
                </div>
            </Variant>
            <Variant
                label="Không có cover — fallback 16:9"
                hint="Entity chưa có ảnh cover: không truyền `cover`, MediaCard tự render placeholder 16:9 full-bleed flush mép card để grid vẫn đều hàng thay vì để trống slot media."
            >
                <div style={{ width: 320 }}>
                    <MediaCard
                        title="Fullstack Mastery path"
                        meta={
                            <>
                                <Chip size="sm">Fullstack</Chip>
                                <Chip size="sm" variant="soft">Intermediate</Chip>
                            </>
                        }
                        description="Build a solid foundation from frontend to backend through hands-on projects, graded by AI."
                        footer={<Button size="sm">View course</Button>}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Một single-shape content card dùng chung cho mọi entity grid (course, lesson, challenge, blog): " +
            "16:9 full-bleed cover trên đầu (flush mép card, Card p-0) rồi title, meta, summary, CTA trong body p-3. " +
            "Không truyền cover → fallback placeholder 16:9. Để trống bất kỳ slot text nào không có dữ liệu. " +
            "Card KHÔNG tự pressable — muốn cả card bấm được phải truyền href/onPress, nếu không footer phải tự có nút riêng. " +
            "Mô tả bị clamp 2 dòng (line-clamp) nên chiều cao card không đổi theo dữ liệu.",
    },
}
