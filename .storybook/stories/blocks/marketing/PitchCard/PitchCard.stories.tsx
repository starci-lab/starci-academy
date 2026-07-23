import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { LightningIcon, ShieldCheckIcon, RocketLaunchIcon, WarningIcon, StackIcon } from "@phosphor-icons/react"
import { PitchCard } from "./PitchCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one landing "beat": a tinted icon tile, a bold claim, supporting copy,
 * and an optional CTA footer. Presentational (content via props), built on
 * `SectionCard` + `IconTile`.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. Most leaves share the base
 * composition; only `WithFooter` adds the CTA slot.
 */
const meta: Meta<typeof PitchCard> = {
    title: "Design/Marketing/PitchCard",
    component: PitchCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PitchCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

// The base pitch composition (icon tile + claim + copy) — shared by every leaf without a footer.
const PITCH_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface (h-full để đều hàng)" },
    { name: "IconTile", tier: "primitive", role: "ô icon tô nền theo tone" },
    { name: "Typography · h5", tier: "primitive", role: "claim đậm (tiêu đề)" },
    { name: "Typography · body-sm", tier: "primitive", role: "đoạn giải thích (muted)" },
]

// With-footer leaf: same base + an optional CTA slot at the bottom.
const PITCH_FOOTER_PARTS: Array<AnatomyNode> = [
    ...PITCH_PARTS,
    { name: "footer › Button", tier: "primitive", role: "slot CTA tuỳ chọn vào surface liên quan" },
]

export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PitchCard"
                tier="design"
                leaf="Mặc định"
                parts={PITCH_PARTS}
                reason="Một 'beat' landing lặp lại: một icon có nhãn màu, một claim đậm, một đoạn giải thích, đôi khi một CTA. Gói SectionCard + IconTile + typography vào một block để mọi beat (wedge/outcome/methodology) dùng chung một khung nhất quán, đều chiều cao khi xếp lưới — feature chỉ đổi icon/tone/chữ."
            >
                <div className="max-w-sm">
                    <PitchCard
                        icon={<LightningIcon weight="duotone" />}
                        title="Học nhanh gấp đôi"
                        body="Lộ trình cô đọng, mỗi tuần một chủ đề với bài tập tự chấm — không lan man."
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const WithFooter: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PitchCard"
                tier="design"
                leaf="Có CTA"
                parts={PITCH_FOOTER_PARTS}
                note="Truyền `footer` → thêm slot CTA dưới đáy, composition khác leaf mặc định (có Button)."
            >
                <div className="max-w-sm">
                    <PitchCard
                        icon={<ShieldCheckIcon weight="duotone" />}
                        tone="success"
                        title="Cam kết đầu ra"
                        body="Hoàn thành dự án cuối là có sản phẩm bỏ thẳng vào CV."
                        footer={<Button variant="secondary" size="sm">Xem lộ trình</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const ToneVariants: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PitchCard"
                tier="design"
                leaf="Bộ tone"
                parts={PITCH_PARTS}
                note="Ba thẻ CÙNG composition base, chỉ đổi tone của IconTile (accent · success · warning)."
            >
                <div className="grid max-w-3xl grid-cols-1 gap-3 @app-md:grid-cols-3">
                    <PitchCard icon={<LightningIcon weight="duotone" />} tone="accent" title="Nhanh" body="Cô đọng, đúng trọng tâm." />
                    <PitchCard icon={<ShieldCheckIcon weight="duotone" />} tone="success" title="Chắc" body="Cam kết đầu ra rõ ràng." />
                    <PitchCard icon={<RocketLaunchIcon weight="duotone" />} tone="warning" title="Xa" body="Nền tảng để đi đường dài." />
                </div>
            </BlockAnatomy>,
        ),
}

/** `IconTileTone` còn 2 giá trị chưa lên story: `danger` (cảnh báo) và `neutral` (mặc định trung tính). */
export const RemainingTones: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PitchCard"
                tier="design"
                leaf="Tone còn lại"
                parts={PITCH_PARTS}
                note="Hai thẻ CÙNG composition base, phủ nốt tone danger + neutral của IconTile."
            >
                <div className="grid max-w-2xl grid-cols-1 gap-3 @app-sm:grid-cols-2">
                    <PitchCard
                        icon={<WarningIcon weight="duotone" />}
                        tone="danger"
                        title="Rủi ro nếu bỏ nền tảng"
                        body="Học nhảy cóc mà bỏ qua nền tảng thường phải học lại từ đầu khi vào dự án thật."
                    />
                    <PitchCard
                        icon={<StackIcon weight="duotone" />}
                        tone="neutral"
                        title="Tự học theo nhịp riêng"
                        body="Không ép tiến độ — mỗi module có deadline mềm, học viên tự sắp xếp thời gian."
                    />
                </div>
            </BlockAnatomy>,
        ),
}
