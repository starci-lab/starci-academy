import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tabs as HeroTabs } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tabs.Extended`: StarCi tab strip, bọc HeroUI `Tabs` root. Chuyển vào
 * namespace `Tabs.*` 2026-07-26 (trước đây là `ExtendedTabs.Base` đứng riêng —
 * xem header `TabsExtended.tsx` cho lý do gộp, và vì sao `children` ở đây là
 * NGOẠI LỆ hợp lệ chứ không phải nợ).
 *
 * 📐 **1 PROP CÓ HÌNH = 1 LEAF** (§12g — luật TẦNG ATOM, khác §14d.2 của tầng trên).
 * Bộ leaf = `Default` (trần) + một leaf mỗi prop CÓ HÌNH: `variant` · `size`.
 * `selectedKey`/`onSelectionChange` là cơ chế controlled bắt buộc (không phải giá
 * trị-để-so-sánh nên KHÔNG có leaf riêng), `className` là escape hatch (KHÔNG có
 * leaf, cùng lý do `Chip.Base` loại `className`).
 *
 * `children` là NGOẠI LỆ CÓ TÊN §12b (atom-WRAPPER) — thẩm tra lại 2026-07-26 và
 * GIỮ NGUYÊN kết luận gốc. Bản ghi giữa chừng từng gọi đây là "nợ thật" vì thấy
 * `Tabs.Base` đi được bằng `items`; sai, vì nó không đọc consumer: `Toolbar` gắn vào
 * mỗi tab class theo `accent`/`muted` và ẩn nhãn responsive — thứ một `TabItem` dữ
 * liệu không chở nổi. Xem header `TabsExtended.tsx`. Theo §12g.2, prop kiểu
 * "dựng ra N con" (ở đây là `children` thay vì `items`) CÓ leaf và leaf đó CHÍNH LÀ
 * `Default` — không đẻ thêm leaf `Children`.
 *
 * BỘ LEAF BÊ NGUYÊN từ `ExtendedTabs.Base.stories.tsx` (đã audit lượt trước, KHÔNG
 * audit lại ở lượt gộp này) — chỉ đổi import/tên hiển thị sang `Tabs.Extended`:
 *
 * ⚠️ ĐÃ GỘP 2026-07-26 (leaf, trước khi namespace gộp): bản trước tách 5 leaf theo
 * CẤU LỚP (`InputWFit` / `FullWidthTruncate` / `PrimaryLarge` / `Secondary` /
 * `SecondaryWithIcons`) — đúng luật §14d.2 (cấu trúc) chứ không phải §12g (prop) của
 * tầng atom. Kết quả: prop `variant` không có chỗ nào render đủ union trong MỘT
 * leaf, và `size` bị xé thành hai leaf không tên theo prop. Gộp lại:
 * `InputWFit`+`FullWidthTruncate` → leaf `Size` (đúng là hai GIÁ TRỊ của `size`, hoá
 * ra khớp luôn với đoạn comment "truncates (w-full) or sizes to label (w-fit)" trong
 * `TabsExtended.tsx`); `PrimaryLarge`+`Secondary` → leaf `Variant`.
 * `SecondaryWithIcons` không phải giá trị mới của prop nào (icon nằm trong
 * `children`, không phải prop của atom này) — nội dung của nó chuyển vào làm ví dụ
 * `secondary` bên trong leaf `Variant` thay vì đứng tên leaf riêng.
 *
 * `annotate` (2026-07-27, heroui tier thêm vào canon): atom bọc thẳng HeroUI `Tabs`
 * (không qua atom `Tabs.Base` của hệ, alias `HeroTabs`), và phần DOM duy nhất nó SỞ
 * HỮU là gốc `<Tabs>` — còn cây `Tabs.ListContainer > Tabs.List > Tabs.Tab` là của
 * STORY dựng (chính là `children`), nên CHỈ gốc `<Tabs>` được tag (`"Tabs"`, tier
 * heroui, khớp identifier import). Trước đây bỏ hẳn `showAnatomy`/`data-anat-part` —
 * đúng là "cây nói dối bằng cách bỏ sót" (Popover mở được mà cây không hiện gì): atom
 * này render một `HeroTabs` THẬT mà không nút nào của cây từng thấy nó.
 *
 * 🔎 GHI NHẬN (không sửa ở đây — ngoài phạm vi soát leaf, xem header component cho
 * bản đầy đủ): component tự khai trong header là "full port of
 * `@/components/blocks/navigation/ExtendedTabs`" — một block cũ bê thẳng vào atom,
 * chưa qua thiết kế atom. Không dùng atom `Tabs.Base` của hệ (import thẳng HeroUI
 * `Tabs`) nên trùng lặp một phần bề mặt với `Tabs.Base`; so với `Tabs.Base` (nhận
 * `items`, tự dựng DOM, chọn-1-trong-N — đúng hình atom khép kín), `Tabs.Extended`
 * nhận `children` thô và không tự giới hạn N tab hay cấu trúc mỗi tab — gần hình một
 * khung slot-trơ (`frame`) hơn là atom nội dung.
 *
 * 2026-07-27: migrated to the `states` API (§8) — `Variant`/`Size` now render their
 * union as `states[]` tabs instead of a stacked column under one shared `note`.
 */
const meta: Meta<typeof Tabs.Extended> = {
    title: "Atoms/Navigation/Tabs/Tabs.Extended",
    component: Tabs.Extended,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Tabs.Extended>

/** heroui TIER (2026-07-27) — the only DOM node this atom owns, the root `<Tabs>`. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tabs": { tier: "heroui", role: "the root strip; the Tabs.ListContainer > Tabs.List > Tabs.Tab tree inside is the CALLER's own children" },
}

/** Owns the selected-tab state since `Tabs.Extended` is fully controlled. */
const Controlled = ({
    defaultKey,
    variant,
    size,
    children,
}: {
    defaultKey: string
    variant?: "primary" | "secondary"
    size?: "sm" | "md"
    children: ReactNode
}) => {
    const [selectedKey, setSelectedKey] = useState(defaultKey)
    return (
        <Tabs.Extended selectedKey={selectedKey} onSelectionChange={setSelectedKey} variant={variant} size={size} showAnatomy>
            {children}
        </Tabs.Extended>
    )
}

/** Leaf TRẦN — `variant="secondary"` mặc định, `children` là ví dụ tối thiểu (§12g.2). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Extended"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Default"
                reason="The StarCi tab strip — a thin wrapper over the HeroUI Tabs root. `children` stays the caller's own `Tabs.ListContainer > Tabs.List > Tabs.Tab (+ Tabs.Indicator)` tree — a NAMED §12b exception (atom-wrapper), because each tab may carry chrome only the caller knows: accent/muted classes, a label hidden on mobile. Reach for `Tabs.Base` (`items`) when the tabs are plain content."
                states={[
                    {
                        name: "variant and size both unset",
                        why: "`secondary` (the default variant) bakes in the underline look and hugs its own label width rather than stretching full-width. This is the bare rendering before either `variant` or `size` is touched — every leaf below only flips one of those two props on top of it.",
                        code: `<Tabs.Extended selectedKey="overview" onSelectionChange={setKey}>
    <HeroTabs.ListContainer>
        <HeroTabs.List aria-label="Content filter">
            <HeroTabs.Tab id="overview">Overview<HeroTabs.Indicator /></HeroTabs.Tab>
            <HeroTabs.Tab id="reviews">Reviews<HeroTabs.Indicator /></HeroTabs.Tab>
            <HeroTabs.Tab id="qna">Q&A<HeroTabs.Indicator /></HeroTabs.Tab>
        </HeroTabs.List>
    </HeroTabs.ListContainer>
</Tabs.Extended>`,
                        render: (
                            <Controlled defaultKey="overview">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Content filter">
                                        <HeroTabs.Tab id="overview" aria-controls="panel-overview">
                                            Overview
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="reviews" aria-controls="panel-reviews">
                                            Reviews
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="qna" aria-controls="panel-qna">
                                            Q&A
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `variant` — ĐỦ union `"primary" | "secondary"`, render trong CÙNG một leaf. */
export const Variant: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Extended"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `variant`"
                reason="`variant` decides whether the strip claims a full-width baseline row or hugs its own content — the underlying `Tabs.ListContainer > Tabs.List > Tabs.Tab` tree the caller supplies stays the same shape either way."
                states={[
                    {
                        name: "variant = \"primary\"",
                        why: "The strip renders HeroUI's own default Tabs look: a full-width segmented pill spanning the row. Pick this for a page-level FEATURE switch that swaps the entire panel below it, such as Overview/Explore/Courses.",
                        code: "<Tabs.Extended variant=\"primary\" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>",
                        render: (
                            <Controlled defaultKey="overview" variant="primary">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Dashboard navigation">
                                        <HeroTabs.Tab id="overview" aria-controls="panel-overview">
                                            <span className="flex items-center gap-2">
                                                <HouseIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span>Overview</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="explore" aria-controls="panel-explore">
                                            <span className="flex items-center gap-2">
                                                <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span>Explore</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="courses" aria-controls="panel-courses">
                                            <span className="flex items-center gap-2">
                                                <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span>Courses</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                    {
                        name: "variant = \"secondary\"",
                        why: "The strip drops the built-in full-width baseline and hugs its content instead, with a responsive label hidden below `md`. Pick this for a content filter or language switcher riding alongside a reading column, one that shouldn't claim the full row.",
                        code: "<Tabs.Extended variant=\"secondary\" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>",
                        render: (
                            <Controlled defaultKey="courses" variant="secondary">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Learning categories">
                                        <HeroTabs.Tab id="courses" aria-controls="panel-courses">
                                            <span className="flex items-center gap-2">
                                                <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span className="hidden @app-md:inline">Courses</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="explore" aria-controls="panel-explore">
                                            <span className="flex items-center gap-2">
                                                <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span className="hidden @app-md:inline">Explore</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — ĐỦ union `"sm" | "md"`, cả hai đặt trên `variant="primary"` vì `size` không có tác dụng trên `secondary`. */
export const Size: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Extended"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason={"`size` only shows up on `variant=\"primary\"` — `secondary` is already hug-content via its own override, so `size` has no visible effect there, and both states below are demonstrated on `primary`."}
                states={[
                    {
                        name: "variant = \"primary\", size = \"sm\"",
                        why: "The strip shrinks to `w-fit` — segments size to their own label instead of splitting the row evenly. Reach for this in a compact choice that shouldn't claim the full row width, such as a setting nested in a modal.",
                        code: "<Tabs.Extended variant=\"primary\" size=\"sm\" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>",
                        render: (
                            <Controlled defaultKey="monthly" variant="primary" size="sm">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Billing cycle">
                                        <HeroTabs.Tab id="monthly" aria-controls="panel-monthly">
                                            Monthly
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="yearly" aria-controls="panel-yearly">
                                            Yearly
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                    {
                        name: "variant = \"primary\", size = \"md\"",
                        why: "The strip stretches to `w-full` and splits its segments evenly (the default). Inside a squeezed container a segment truncates its label instead of wrapping, since every `Tabs.Tab` is forced `whitespace-nowrap`.",
                        code: "<Tabs.Extended variant=\"primary\" size=\"md\" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>",
                        render: (
                            <div className="w-64">
                                <Controlled defaultKey="grid" variant="primary" size="md">
                                    <HeroTabs.ListContainer>
                                        <HeroTabs.List aria-label="View mode">
                                            <HeroTabs.Tab id="grid" aria-controls="panel-grid" aria-label="Detailed grid view" className="min-w-0">
                                                <span className="block truncate">Detailed grid view</span>
                                                <HeroTabs.Indicator />
                                            </HeroTabs.Tab>
                                            <HeroTabs.Tab id="list" aria-controls="panel-list" aria-label="Compact list view" className="min-w-0">
                                                <span className="block truncate">Compact list view</span>
                                                <HeroTabs.Indicator />
                                            </HeroTabs.Tab>
                                        </HeroTabs.List>
                                    </HeroTabs.ListContainer>
                                </Controlled>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
