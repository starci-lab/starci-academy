import type { Meta, StoryObj } from "@storybook/nextjs"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Image.Base> = {
    title: "Atoms/Media/Image/Image",
    component: Image.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Image.Base>

// PNG base64 1×1 (object-cover phủ khung) — load CHẮC CHẮN (onLoad bắn), không kén
// như SVG data-URI. Màu chỉ minh hoạ; state Loaded/Loading cần ảnh thật load được.
const OK_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const FALLBACK_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
// Demo fallback dùng src RỖNG (null) — case xác định & rất thật ("chưa có ảnh").
// Ảnh hỏng thật (onError từ 404/decode-fail) đi CHUNG nhánh error → cùng UI này.

const LOADED_PARTS: Array<AnatomyNode> = [
    { name: "Frame", tier: "atom", role: "khung bo góc + surface + ép tỉ lệ (overflow-hidden)" },
    { name: "Img", tier: "atom", role: "ảnh thật (object-cover/contain), lazy" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Frame", tier: "atom", role: "khung giữ nguyên footprint" },
    { name: "Skeleton", tier: "atom", role: "shimmer phủ khung lúc fetch (hybrid C)" },
]
const FALLBACK_PARTS: Array<AnatomyNode> = [
    { name: "Frame", tier: "atom", role: "khung surface" },
    { name: "Fallback", tier: "atom", role: "glyph Picture khi lỗi/rỗng + không có fallbackSrc" },
]
const FALLBACK_IMG_PARTS: Array<AnatomyNode> = [
    { name: "Frame", tier: "atom", role: "khung surface" },
    { name: "Img", tier: "atom", role: "ảnh fallbackSrc thay cho ảnh hỏng" },
]

/** Loaded — ảnh tải xong, hiện trong khung 16:9. */
export const Loaded: Story = {
    render: () => (
        <div className="w-80 p-8">
            <BlockAnatomy
                name="Image.Base"
                tier="atom"
                leaf="Loaded"
                parts={LOADED_PARTS}
                reason="Atom media bọc <img>; tự lo skeleton lúc fetch + fallback khi lỗi → media primitive (CoverImage) chỉ truyền src/alt."
                code={`<Image.Base src={url} alt="Ảnh khoá học" ratio="video" />`}
            >
                <Image.Base src={OK_SRC} alt="Ảnh khoá học" ratio="video" loading="eager" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — skeleton phủ khung lúc fetch (như HeroUI v2 Image); `isSkeleton` ép từ ngoài. */
export const Loading: Story = {
    render: () => (
        <div className="w-80 p-8">
            <BlockAnatomy
                name="Image.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="Đang fetch → shimmer; ảnh opacity-0 tới onLoad. isSkeleton ép skeleton khi parent còn tải data."
                code={`<Image.Base isSkeleton alt="Đang tải" ratio="video" />`}
            >
                <Image.Base isSkeleton src={OK_SRC} alt="Đang tải" ratio="video" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Fallback — src lỗi/rỗng + KHÔNG có fallbackSrc → glyph Picture (không khung trắng). */
export const Fallback: Story = {
    render: () => (
        <div className="w-80 p-8">
            <BlockAnatomy
                name="Image.Base"
                tier="atom"
                leaf="Fallback"
                parts={FALLBACK_PARTS}
                note="src rỗng/onError → glyph Picture trên surface; alt vào sr-only. Không bao giờ để khung trống."
                code={`<Image.Base src={null} alt="Ảnh bìa" ratio="video" />   // hoặc src ảnh hỏng → cùng nhánh`}
            >
                <Image.Base src={null} alt="Ảnh bìa" ratio="video" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** FallbackImage — src lỗi + có `fallbackSrc` → hiện ảnh thay thế thay vì glyph. */
export const FallbackImage: Story = {
    render: () => (
        <div className="w-80 p-8">
            <BlockAnatomy
                name="Image.Base"
                tier="atom"
                leaf="FallbackImage"
                parts={FALLBACK_IMG_PARTS}
                note="src rỗng/hỏng + có fallbackSrc → dùng ảnh thay thế (vd avatar mặc định) thay glyph."
                code={`<Image.Base src={null} fallbackSrc={defaultUrl} alt="Avatar" ratio="square" />`}
            >
                <Image.Base src={null} fallbackSrc={FALLBACK_SRC} alt="Avatar" ratio="video" loading="eager" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Ratios — cùng atom, đổi `ratio`/`radius`/`fit`. */
export const Ratios: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Image.Base"
                tier="atom"
                leaf="Ratios"
                parts={LOADED_PARTS}
                note="ratio: square/video/wide/portrait/photo · radius: md/lg/full · fit: cover/contain."
                code={`<Image.Base src={url} alt="…" ratio="square" radius="full" />
<Image.Base src={url} alt="…" ratio="video" />
<Image.Base src={url} alt="…" ratio="portrait" fit="contain" />`}
            >
                <div className="flex items-start gap-4">
                    <div className="w-24"><Image.Base src={OK_SRC} alt="square full" ratio="square" radius="full" loading="eager" showAnatomy /></div>
                    <div className="w-40"><Image.Base src={OK_SRC} alt="video" ratio="video" loading="eager" /></div>
                    <div className="w-24"><Image.Base src={OK_SRC} alt="portrait" ratio="portrait" fit="contain" loading="eager" /></div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
