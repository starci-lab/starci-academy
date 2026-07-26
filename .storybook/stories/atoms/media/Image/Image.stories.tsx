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
                reason="A media atom that wraps <img>, owning its own loading skeleton and error fallback — media primitives (like CoverImage) only ever pass src/alt down to it."
                note="Loading / fallbackSrc / ratio never change the tree (still Frame > Img), so they're states inside one leaf, per §14d.2."
                code={`<Image src={url} alt="Course cover" ratio="video" />
<Image isSkeleton src={url} alt="Loading" ratio="video" />
<Image src={null} fallbackSrc={defaultUrl} alt="Avatar" ratio="video" />
<Image src={url} alt="…" ratio="square" radius="full" />`}
            >
                <div className="flex flex-col gap-6">
                    {/* Row 1 — three states of the same tree: loaded · loading · fallbackSrc. */}
                    <div className="flex items-start gap-4">
                        <div className="w-40">
                            <Image src={OK_SRC} alt="Course cover" ratio="video" loading="eager" showAnatomy />
                        </div>
                        <div className="w-40">
                            {/* isSkeleton forces the skeleton from outside; the image stays opacity-0 until onLoad. */}
                            <Image isSkeleton src={OK_SRC} alt="Loading" ratio="video" showAnatomy />
                        </div>
                        <div className="w-40">
                            {/* Empty src + a fallbackSrc → still renders an <img>, just from a different source. */}
                            <Image src={null} fallbackSrc={FALLBACK_SRC} alt="Avatar" ratio="video" loading="eager" />
                        </div>
                    </div>

                    {/* Row 2 — shape variants: ratio · radius · fit. */}
                    <div className="flex items-start gap-4">
                        <div className="w-24">
                            <Image src={OK_SRC} alt="Square, full radius" ratio="square" radius="full" loading="eager" />
                        </div>
                        <div className="w-40">
                            <Image src={OK_SRC} alt="Video ratio" ratio="video" loading="eager" />
                        </div>
                        <div className="w-24">
                            <Image src={OK_SRC} alt="Portrait, contain" ratio="portrait" fit="contain" loading="eager" />
                        </div>
                    </div>
                </div>
            </BlockAnatomy>
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
                note="Empty src / onError with no fallbackSrc shows an ImageIcon glyph, and alt moves into sr-only text. The frame is never left blank."
                code={"<Image src={null} alt=\"Course cover\" ratio=\"video\" />   // or a broken image src — same branch"}
            >
                <Image src={null} alt="Course cover" ratio="video" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
