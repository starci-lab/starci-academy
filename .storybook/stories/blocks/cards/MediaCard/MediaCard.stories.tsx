import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { MediaCard } from "./MediaCard"
import { MetaRow } from "../../lists/MetaRow/MetaRow"

const meta: Meta<typeof MediaCard> = {
    title: "Design/Cards/MediaCard",
    component: MediaCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MediaCard>

// Cụm meta = MetaRow (1 chip tín hiệu + đoạn muted nối `·`), KHÔNG fragment chip rời.
const courseMeta = (
    <MetaRow
        chip={
            <Chip size="sm" variant="soft">
                Intermediate
            </Chip>
        }
        items={["Fullstack", "12 hours"]}
    />
)

const DESCRIPTION = "Build a solid foundation from frontend to backend through hands-on projects, graded by AI."

/** Có cover — ảnh 16:9 full-bleed trên đầu, rồi title / meta / description / CTA trong body `p-3`. */
export const WithCover: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<img src="https://placehold.co/640x360" alt="Course cover" />}
                    title="Fullstack Mastery path"
                    meta={courseMeta}
                    description={DESCRIPTION}
                    footer={<Button size="sm">View course</Button>}
                />
            </div>
        </div>
    ),
}

/** Không cover — bỏ `cover`, placeholder 16:9 lấp slot để lưới đều thay vì hụt một ô. */
export const WithoutCover: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    title="Fullstack Mastery path"
                    meta={courseMeta}
                    description={DESCRIPTION}
                    footer={<Button size="sm">View course</Button>}
                />
            </div>
        </div>
    ),
}

/** `onPress` — cả card là MỘT target bấm được, truy cập bằng bàn phím; nhấn LÚN còn 97% (press-scale §7). */
export const Pressable: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<img src="https://placehold.co/640x360" alt="Course cover" />}
                    title="Fullstack Mastery path"
                    meta={courseMeta}
                    description={DESCRIPTION}
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** `href` — cả card là MỘT link truy cập được (điều hướng khi bấm); nhấn LÚN còn 97% (press-scale §7). */
export const AsLink: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<img src="https://placehold.co/640x360" alt="Course cover" />}
                    title="Fullstack Mastery path"
                    meta={courseMeta}
                    description={DESCRIPTION}
                    href="#"
                />
            </div>
        </div>
    ),
}

/** Minimal — chỉ có `title`, bỏ `meta`/`description`/`footer` (cover fallback lấp placeholder); kiểm chứng body không vỡ khi mọi slot phụ đều rỗng. */
export const Minimal: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard title="Fullstack Mastery path" />
            </div>
        </div>
    ),
}

/** Đang tải — bật `isSkeleton`, card TỰ vẽ skeleton mirror (giữ frame + cover slot + body), KHÔNG nhồi Skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard isSkeleton title="Fullstack Mastery path" />
            </div>
        </div>
    ),
}
