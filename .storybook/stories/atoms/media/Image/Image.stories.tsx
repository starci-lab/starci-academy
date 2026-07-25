import type { Meta, StoryObj } from "@storybook/nextjs"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Image`: framed image bọc `<img>`, tự lo skeleton lúc fetch + fallback
 * khi lỗi/rỗng. Icon lib = `@phosphor-icons/react` (§5.0).
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

// PNG base64 1×1 (object-cover phủ khung) — load CHẮC CHẮN (onLoad bắn), không kén
// như SVG data-URI. Màu chỉ minh hoạ; state Loaded/Loading cần ảnh thật load được.
const OK_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const FALLBACK_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
// Demo fallback dùng src RỖNG (null) — case xác định & rất thật ("chưa có ảnh").
// Ảnh hỏng thật (onError từ 404/decode-fail) đi CHUNG nhánh error → cùng UI này.

const IMG_PARTS: Array<AnatomyNode> = [
    { name: "Frame", tier: "atom", role: "khung bo góc + surface + ép tỉ lệ (overflow-hidden)" },
    { name: "Img", tier: "atom", role: "ảnh thật (object-cover/contain), lazy" },
    { name: "Skeleton", tier: "atom", role: "shimmer phủ khung lúc fetch (hybrid C) — state, không phải leaf" },
]
const FALLBACK_PARTS: Array<AnatomyNode> = [
    { name: "Frame", tier: "atom", role: "khung surface" },
    { name: "Fallback", tier: "atom", role: "glyph ảnh (Phosphor ImageIcon) khi lỗi/rỗng + không có fallbackSrc" },
]

/**
 * Leaf 1 — CÓ node `Img`. Render đủ state/variant cùng cây: loaded · loading
 * (skeleton) · fallbackSrc · ratio/radius/fit.
 */
export const WithImage: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Image"
                tier="atom"
                leaf="Có ảnh"
                parts={IMG_PARTS}
                reason="Atom media bọc <img>; tự lo skeleton lúc fetch + fallback khi lỗi → media primitive (CoverImage) chỉ truyền src/alt."
                note="Loading/fallbackSrc/ratio đều KHÔNG đổi cây (vẫn Frame > Img) ⇒ state trong cùng một leaf, §14d.2."
                code={`<Image src={url} alt="Ảnh khoá học" ratio="video" />
<Image isSkeleton src={url} alt="Đang tải" ratio="video" />
<Image src={null} fallbackSrc={defaultUrl} alt="Avatar" ratio="video" />
<Image src={url} alt="…" ratio="square" radius="full" />`}
            >
                <div className="flex flex-col gap-6">
                    {/* Hàng 1 — ba state của cùng cây: loaded · loading · fallbackSrc. */}
                    <div className="flex items-start gap-4">
                        <div className="w-40">
                            <Image src={OK_SRC} alt="Ảnh khoá học" ratio="video" loading="eager" showAnatomy />
                        </div>
                        <div className="w-40">
                            {/* isSkeleton ép skeleton từ ngoài; ảnh opacity-0 tới onLoad. */}
                            <Image isSkeleton src={OK_SRC} alt="Đang tải" ratio="video" showAnatomy />
                        </div>
                        <div className="w-40">
                            {/* src rỗng + CÓ fallbackSrc → vẫn là <img>, chỉ đổi nguồn. */}
                            <Image src={null} fallbackSrc={FALLBACK_SRC} alt="Avatar" ratio="video" loading="eager" />
                        </div>
                    </div>

                    {/* Hàng 2 — variant hình: ratio · radius · fit. */}
                    <div className="flex items-start gap-4">
                        <div className="w-24">
                            <Image src={OK_SRC} alt="square full" ratio="square" radius="full" loading="eager" />
                        </div>
                        <div className="w-40">
                            <Image src={OK_SRC} alt="video" ratio="video" loading="eager" />
                        </div>
                        <div className="w-24">
                            <Image src={OK_SRC} alt="portrait" ratio="portrait" fit="contain" loading="eager" />
                        </div>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf 2 — MẤT node `Img`: src lỗi/rỗng + KHÔNG có `fallbackSrc` → glyph trên surface. */
export const FallbackGlyph: Story = {
    render: () => (
        <div className="w-80 p-8">
            <BlockAnatomy
                name="Image"
                tier="atom"
                leaf="Fallback glyph"
                parts={FALLBACK_PARTS}
                note="src rỗng/onError → glyph ImageIcon trên surface; alt vào sr-only. Không bao giờ để khung trống."
                code={"<Image src={null} alt=\"Ảnh bìa\" ratio=\"video\" />   // hoặc src ảnh hỏng → cùng nhánh"}
            >
                <Image src={null} alt="Ảnh bìa" ratio="video" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
