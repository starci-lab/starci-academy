import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { MediaCard } from "@sb-components/_legacy/designs/cards/MediaCard/MediaCard"
import { ListMeta } from "@sb-components/composites/lists/List/List"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof MediaCard> = {
    title: "Legacy/Design/Cards/MediaCard",
    component: MediaCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MediaCard>

// Cụm meta = ListMeta (1 chip tín hiệu + đoạn muted nối `·`), KHÔNG fragment chip rời.
const courseMeta = (
    <ListMeta
        chip={
            <Chip size="sm" variant="soft">
                Intermediate
            </Chip>
        }
        items={["Fullstack", "12 hours"]}
    />
)

const DESCRIPTION = "Build a solid foundation from frontend to backend through hands-on projects, graded by AI."

// LOADED leaf shape — cover slot · title · optional meta · optional description · optional footer,
// all inside the HeroUI Card/CardContent frame (frame itself isn't a named part — it's the primitive's own root).
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Cover", tier: "block", role: "media full-bleed 16:9 (ảnh thật hoặc placeholder khi omit `cover`)" },
    { name: "Typography.Title", tier: "composite", role: "tiêu đề (weight medium)" },
    { name: "Meta", tier: "block", role: "slot meta — nhận node ListMeta do caller truyền vào" },
    { name: "Typography.Description", tier: "composite", role: "mô tả ngắn, line-clamp-2" },
    { name: "Footer", tier: "block", role: "slot footer — CTA/giá/tiến độ do caller truyền vào" },
]
const MINIMAL_PARTS: Array<AnatomyNode> = [
    { name: "Cover", tier: "block", role: "placeholder 16:9 (không truyền `cover`) — lấp slot để lưới đều" },
    { name: "Typography.Title", tier: "composite", role: "tiêu đề (weight medium)" },
]
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton.Cover", tier: "composite", role: "mirror cover 16:9", state: "skeleton" },
    { name: "Skeleton", tier: "composite", role: "mirror tiêu đề + 2 dòng mô tả (×3)", state: "skeleton" },
    { name: "Skeleton", tier: "composite", role: "mirror chip tín hiệu trong meta", state: "skeleton" },
    { name: "Skeleton", tier: "composite", role: "mirror CTA footer", state: "skeleton" },
]

/** Có cover — ảnh 16:9 full-bleed trên đầu, rồi title / meta / description / CTA trong body `p-3`. */
export const WithCover: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="MediaCard" tier="block" leaf="WithCover" parts={FULL_PARTS}>
                <div style={{ width: 320 }}>
                    <MediaCard
                        showAnatomy
                        cover={<img src="https://placehold.co/640x360" alt="Course cover" />}
                        title="Fullstack Mastery path"
                        meta={courseMeta}
                        description={DESCRIPTION}
                        footer={<Button size="sm">View course</Button>}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Không cover — bỏ `cover`, placeholder 16:9 lấp slot để lưới đều thay vì hụt một ô. */
export const WithoutCover: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MediaCard"
                tier="block"
                leaf="WithoutCover"
                parts={FULL_PARTS}
                note="Không truyền `cover` — placeholder 16:9 lấp ĐÚNG slot Cover, phần còn lại giống hệt WithCover."
            >
                <div style={{ width: 320 }}>
                    <MediaCard
                        showAnatomy
                        title="Fullstack Mastery path"
                        meta={courseMeta}
                        description={DESCRIPTION}
                        footer={<Button size="sm">View course</Button>}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** `onPress` — cả card là MỘT target bấm được, truy cập bằng bàn phím; nhấn LÚN còn 97% (press-scale §7). */
export const Pressable: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="MediaCard" tier="block" leaf="Pressable" parts={FULL_PARTS.filter((p) => p.name !== "Footer")}>
                <div style={{ width: 320 }}>
                    <MediaCard
                        showAnatomy
                        cover={<img src="https://placehold.co/640x360" alt="Course cover" />}
                        title="Fullstack Mastery path"
                        meta={courseMeta}
                        description={DESCRIPTION}
                        onPress={() => {}}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** `href` — cả card là MỘT link truy cập được (điều hướng khi bấm); nhấn LÚN còn 97% (press-scale §7). */
export const AsLink: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="MediaCard" tier="block" leaf="AsLink" parts={FULL_PARTS.filter((p) => p.name !== "Footer")}>
                <div style={{ width: 320 }}>
                    <MediaCard
                        showAnatomy
                        cover={<img src="https://placehold.co/640x360" alt="Course cover" />}
                        title="Fullstack Mastery path"
                        meta={courseMeta}
                        description={DESCRIPTION}
                        href="#"
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Minimal — chỉ có `title`, bỏ `meta`/`description`/`footer` (cover fallback lấp placeholder); kiểm chứng body không vỡ khi mọi slot phụ đều rỗng. */
export const Minimal: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MediaCard"
                tier="block"
                leaf="Minimal"
                parts={MINIMAL_PARTS}
                note="Mọi slot phụ (meta/description/footer) đều rỗng — chỉ còn Cover placeholder + Title."
            >
                <div style={{ width: 320 }}>
                    <MediaCard showAnatomy title="Fullstack Mastery path" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Đang tải — bật `isSkeleton`, card TỰ vẽ skeleton mirror (giữ frame + cover slot + body), KHÔNG nhồi Skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MediaCard"
                tier="block"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="Skeleton mirror TỰ vẽ bởi primitive (isSkeleton) — composition khác hẳn leaf loaded (không part thật)."
            >
                <div style={{ width: 320 }}>
                    <MediaCard showAnatomy isSkeleton title="Fullstack Mastery path" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
