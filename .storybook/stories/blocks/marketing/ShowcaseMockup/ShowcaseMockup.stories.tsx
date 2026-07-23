import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShowcaseMockup, SHOWCASE_THEMES } from "./ShowcaseMockup"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a reusable "browser window" showcase frame: window chrome (3 dots +
 * address bar) + a fanned card behind + a coloured backdrop, holding any content.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. Most leaves share the base
 * composition; `Không nền` drops the backdrop layer and `Không address bar` drops
 * the URL. This block emits NO anchors → parts are decoded by number in the legend.
 */
const meta: Meta<typeof ShowcaseMockup> = {
    title: "Design/Marketing/ShowcaseMockup",
    component: ShowcaseMockup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ShowcaseMockup>

/** Plain canvas — each story wraps its render in its own BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** Sample content inside the mockup — a condensed course list. */
const DemoContent = () => (
    <div className="flex flex-col gap-2 p-4">
        <span className="text-sm font-semibold text-foreground">Khoá học nổi bật</span>
        <div className="flex flex-col gap-1 text-xs text-muted">
            <span>Fullstack Mastery — 128 học viên đang học</span>
            <span>System Design Mastery — 64 học viên đang học</span>
            <span>DevOps Mastery — 41 học viên đang học</span>
        </div>
    </div>
)

// The foreground window card CONTAINS chrome + content, and it sits INSIDE the
// `.group` stack next to the card-behind. So the real tree nests: stack → (card
// sau + window card) → window card → (chrome[URL] + content). The 3 chrome dots
// are raw aria-hidden decorative <span>s (not primitives) → folded into the chrome
// role, not modelled as separate leaves.

/** Foreground window card: bg-surface + border + rounded frame that OWNS the chrome
 *  bar and the content area. `withUrl` toggles the address-bar Typography child. */
const windowCard = (withUrl: boolean): AnatomyNode => ({
    name: "Window card",
    tier: "design",
    role: "thẻ cửa sổ nền surface, viền default, bo góc 3xl (overflow-hidden) — CHỨA chrome + nội dung",
    children: [
        {
            name: "Window chrome",
            tier: "design",
            role: withUrl
                ? "thanh cửa sổ (border-b): 3 chấm đỏ/vàng/lục + address bar"
                : "thanh cửa sổ (border-b): chỉ 3 chấm đỏ/vàng/lục, KHÔNG address bar",
            children: withUrl
                ? [{ name: "Typography", tier: "primitive", role: "chuỗi URL trên address bar (type=code)" }]
                : undefined,
        },
        { name: "Content", tier: "design", role: "vùng bọc nội dung children (khoá 16:9 khi aspect='video')" },
    ],
})

/** The fanned stack (`.group`): the card-behind + the foreground window card, splayed
 *  in opposite tilts; hover flattens both. */
const cardStack = (withUrl: boolean): AnatomyNode => ({
    name: "Khối xoè thẻ",
    tier: "design",
    role: "wrapper .group xếp 2 thẻ nghiêng ngược nhau → chiều sâu 'xoè'; hover ép cả 2 phẳng lại",
    children: [
        { name: "Card sau", tier: "design", role: "thẻ nền nghiêng NGƯỢC, tô màu theme (KHÔNG viền), aria-hidden → chiều sâu 'xoè'" },
        windowCard(withUrl),
    ],
})

// BASE composition — decorative backdrop (sibling) + the fanned card stack. Shared by
// every leaf that keeps both the backdrop and the URL (theme / tilt / backdrop-style /
// aspect variants only change look, not parts).
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Backdrop", tier: "design", role: "lớp trang trí sau thẻ (glow / grid / stars), aria-hidden", state: "glow" },
    cardStack(true),
]

// NO-BACKDROP leaf: backdrop="none" → the decorative sibling layer is gone; the fanned
// card stack (card-behind + window card + chrome[URL] + content) stays.
const NO_BACKDROP_PARTS: Array<AnatomyNode> = [cardStack(true)]

// NO-URL leaf: no `url` → the address-bar Typography is dropped, chrome shows only the
// 3 dots. Backdrop and the rest of the stack stay.
const NO_URL_PARTS: Array<AnatomyNode> = [
    { name: "Backdrop", tier: "design", role: "lớp trang trí sau thẻ (glow), aria-hidden", state: "glow" },
    cardStack(false),
]

/** DEFAULT — glow backdrop, tilt-left, URL address bar, sample content. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Mặc định"
                parts={BASE_PARTS}
                reason="Khung cửa sổ trình duyệt tái dùng (3 chấm + address bar) bọc bất kỳ nội dung nào, nghiêng 3D + quầng sáng màu — cái look hero StarCi/Uni-Education gói thành một block. Feature chỉ đổi theme/tilt/backdrop/url + children; surface card luôn theo token light/dark."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/khoa-hoc" showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** THEME StarCi — pink · amber · teal glow triad; SAME composition as mặc định. */
export const ThemeStarci: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Theme StarCi"
                parts={BASE_PARTS}
                note="Chỉ đổi màu quầng sáng (theme) → CÙNG composition với leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/kien-truc" theme={SHOWCASE_THEMES.starci} showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** THEME Aqua — blue · teal · violet glow triad; SAME composition as mặc định. */
export const ThemeAqua: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Theme Aqua"
                parts={BASE_PARTS}
                note="Chỉ đổi màu quầng sáng (theme) → CÙNG composition với leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="uni-education.vn/demo" theme={SHOWCASE_THEMES.aqua} showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** TILT right — the card + card-behind splay the other way; SAME composition. */
export const TiltRight: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Nghiêng phải"
                parts={BASE_PARTS}
                note="Chỉ đổi hướng nghiêng 3D → CÙNG composition với leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/lo-trinh" tilt="right" showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** TILT none — card sits flat (card-behind still rendered); SAME composition. */
export const TiltNone: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Không nghiêng"
                parts={BASE_PARTS}
                note="Tắt nghiêng 3D nhưng thẻ-sau VẪN dựng → CÙNG composition với leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/gia" tilt="none" showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** BACKDROP grid — dotted-grid decorative layer; SAME parts, backdrop restyled. */
export const BackdropGrid: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Nền lưới"
                parts={BASE_PARTS}
                note="Lớp Backdrop đổi sang lưới chấm → vẫn CÙNG composition với leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/tai-lieu" backdrop="grid" showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** BACKDROP stars — scattered star dots; SAME parts, backdrop restyled. */
export const BackdropStars: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Nền sao"
                parts={BASE_PARTS}
                note="Lớp Backdrop đổi sang các chấm sao → vẫn CÙNG composition với leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/cong-dong" backdrop="stars" showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** BACKDROP none — the decorative layer is dropped entirely (distinct composition). */
export const BackdropNone: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Không nền"
                parts={NO_BACKDROP_PARTS}
                note="backdrop='none' → BỎ hẳn lớp Backdrop, khác leaf 'Mặc định' (thiếu một part)."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/lien-he" backdrop="none" showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** ASPECT video — content locked to 16:9 (a full-page screenshot); SAME parts. */
export const AspectVideo: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Tỉ lệ 16:9"
                parts={BASE_PARTS}
                note="Vùng Content khoá tỉ lệ 16:9 (ảnh chụp toàn trang) → parts giữ nguyên như leaf 'Mặc định'."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup url="starci.edu.vn/preview" aspect="video" showAnatomy>
                        <div className="flex size-full items-center justify-center bg-surface-2 text-xs text-muted">
                            Ảnh chụp toàn trang web
                        </div>
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}

/** NO address bar — `url` omitted → chrome shows only the 3 dots (distinct composition). */
export const NoAddressBar: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ShowcaseMockup"
                tier="design"
                leaf="Không address bar"
                parts={NO_URL_PARTS}
                note="Bỏ prop url → BỎ Typography address bar, chrome chỉ còn 3 chấm (khác leaf 'Mặc định')."
            >
                <div className="max-w-lg">
                    <ShowcaseMockup showAnatomy>
                        <DemoContent />
                    </ShowcaseMockup>
                </div>
            </BlockAnatomy>,
        ),
}
