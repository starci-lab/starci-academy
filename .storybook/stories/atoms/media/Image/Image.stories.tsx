import type { Meta, StoryObj } from "@storybook/nextjs"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Image`: framed image bọc `<img>`, tự lo skeleton lúc fetch + fallback
 * khi lỗi/rỗng. Icon lib = `@phosphor-icons/react` (§5.0). Không compose atom
 * nào có story riêng ⇒ ATOM LÁ, không có `annotate` (§12 — bỏ hẳn prop, đừng
 * để `{}`). `Frame`/`Img`/`Skeleton`/`Fallback` chỉ là KHE nội bộ, không phải
 * deps — không trỏ đi đâu được nên không khai vào cây.
 *
 * 📐 **HAI LEAF** (§14d.2 — leaf tách theo CẤU TRÚC):
 *   • `WithImage` — cây có node `Img`. Loaded · loading (skeleton phủ) · dùng
 *     `fallbackSrc` · các `ratio`/`radius`/`fit` đều CÙNG cây DOM ⇒ chúng là
 *     STATE/VARIANT nằm trong MỘT leaf, không tách story riêng.
 *   • `FallbackGlyph` — node `Img` BIẾN MẤT, thay bằng node `Fallback`. Mất node
 *     ⇒ đây mới đúng là leaf thứ hai.
 */
const meta: Meta<typeof Image> = {
    title: "Atoms/Media/Image/Image",
    component: Image,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Image>

// PNG base64 1×1 (object-cover fills the frame) — loads reliably (fires onLoad),
// unlike an SVG data-URI. Colour is just illustrative; Loaded/Loading need an
// image that actually loads.
const OK_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const FALLBACK_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
// Demo fallback uses a NULL src — a clear, realistic case ("no image yet").
// A genuinely broken image (onError from a 404/decode failure) takes the same
// branch → same UI as this one.

/**
 * Leaf 1 — HAS an `Img` node. Renders every state/variant that keeps the same
 * tree: loaded · loading (skeleton) · fallbackSrc · ratio/radius/fit.
 */
export const WithImage: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Image"
                tier="atom"
                leaf="With image"
                reason="A media atom that wraps <img>, owning its own loading skeleton and error fallback: media atoms (like CoverImage) only ever pass src/alt down to it. Loading, fallbackSrc and ratio never change the tree, still Frame containing Img, so they live as states inside this one leaf per §14d.2."
                states={[
                    {
                        name: "src set, image loaded",
                        why: "The real `<img>` renders at full opacity inside the frame. This is the resting shape every other state below is compared against.",
                        code: "<Image src={url} alt=\"Course cover\" ratio=\"video\" />",
                        render: (
                            <div className="w-40">
                                <Image src={OK_SRC} alt="Course cover" ratio="video" loading="eager" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true (forced from outside)",
                        why: "A skeleton shimmer covers the frame and the `<img>` itself sits underneath at opacity-0 until it fires `onLoad`. The atom manages this on its own so a parent that's still fetching data only has to flip one flag.",
                        code: "<Image isSkeleton src={url} alt=\"Loading\" ratio=\"video\" />",
                        render: (
                            <div className="w-40">
                                <Image isSkeleton src={OK_SRC} alt="Loading" ratio="video" />
                            </div>
                        ),
                    },
                    {
                        name: "src = null, fallbackSrc set",
                        why: "An `<img>` still renders, just sourced from `fallbackSrc` instead of the missing `src`. The tree stays the same shape as the loaded state, only which URL feeds the tag differs.",
                        code: "<Image src={null} fallbackSrc={defaultUrl} alt=\"Avatar\" ratio=\"video\" />",
                        render: (
                            <div className="w-40">
                                <Image src={null} fallbackSrc={FALLBACK_SRC} alt="Avatar" ratio="video" loading="eager" />
                            </div>
                        ),
                    },
                    {
                        name: "ratio = square, radius = full",
                        why: "The frame becomes a perfect circle instead of the default rounded rectangle. This shape is used for avatar-style images.",
                        code: "<Image src={url} alt=\"…\" ratio=\"square\" radius=\"full\" />",
                        render: (
                            <div className="w-24">
                                <Image src={OK_SRC} alt="Square, full radius" ratio="square" radius="full" loading="eager" />
                            </div>
                        ),
                    },
                    {
                        name: "ratio = video",
                        why: "The frame locks to a 16:9 box. This is the ratio used for course covers and thumbnails.",
                        code: "<Image src={url} alt=\"Course cover\" ratio=\"video\" />",
                        render: (
                            <div className="w-40">
                                <Image src={OK_SRC} alt="Video ratio" ratio="video" loading="eager" />
                            </div>
                        ),
                    },
                    {
                        name: "ratio = portrait, fit = contain",
                        why: "The frame locks to a tall 3:4 box and the image shrinks to fit entirely inside it instead of cropping to cover the box. Use `contain` when clipping the image would cut off meaningful content.",
                        code: "<Image src={url} alt=\"…\" ratio=\"portrait\" fit=\"contain\" />",
                        render: (
                            <div className="w-24">
                                <Image src={OK_SRC} alt="Portrait, contain" ratio="portrait" fit="contain" loading="eager" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf 2 — the `Img` node is GONE: an errored/empty src with no `fallbackSrc` shows a glyph instead. */
export const FallbackGlyph: Story = {
    render: () => (
        <div className="w-80 p-8">
            <BlockAnatomy
                name="Image"
                tier="atom"
                leaf="Fallback glyph"
                states={[
                    {
                        name: "src = null, fallbackSrc not set",
                        why: "The `Img` node disappears entirely and a `Fallback` node with an image glyph takes its place, with `alt` moving into screen-reader-only text. A genuinely broken image, an `onError` from a 404 or a decode failure, takes this same branch, so the frame is never left blank.",
                        code: "<Image src={null} alt=\"Course cover\" ratio=\"video\" />   // or a broken image src — same branch",
                        render: <Image src={null} alt="Course cover" ratio="video" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
