import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tabs as HeroTabs } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 * ⚠️ KHÔNG có `annotate`/deps: atom bọc thẳng HeroUI `Tabs` (không qua atom `Tabs.Base`
 * của hệ, alias `HeroTabs`), và phần DOM duy nhất nó SỞ HỮU là gốc `<Tabs>` — còn cây
 * `Tabs.ListContainer > Tabs.List > Tabs.Tab` là của STORY dựng (chính là `children`),
 * giống hệt lý do `Tooltip.Base` bỏ `annotate` (xem header file đó).
 *
 * 🔎 GHI NHẬN (không sửa ở đây — ngoài phạm vi soát leaf, xem header component cho
 * bản đầy đủ): component tự khai trong header là "full port of
 * `@/components/blocks/navigation/ExtendedTabs`" — một block cũ bê thẳng vào atom,
 * chưa qua thiết kế atom. Không dùng atom `Tabs.Base` của hệ (import thẳng HeroUI
 * `Tabs`) nên trùng lặp một phần bề mặt với `Tabs.Base`; so với `Tabs.Base` (nhận
 * `items`, tự dựng DOM, chọn-1-trong-N — đúng hình atom khép kín), `Tabs.Extended`
 * nhận `children` thô và không tự giới hạn N tab hay cấu trúc mỗi tab — gần hình một
 * khung slot-trơ (`frame`) hơn là atom nội dung. Cũng KHÔNG có `showAnatomy`/
 * `data-anat-part` như `Chip.Base`/`Tabs.Base`/`Tooltip.Base` — bỏ ngỏ, không thêm ở
 * đợt soát leaf này vì không ảnh hưởng tính đúng của bộ leaf.
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
        <Tabs.Extended selectedKey={selectedKey} onSelectionChange={setSelectedKey} variant={variant} size={size}>
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
                leaf="Default"
                reason="The StarCi tab strip — a thin wrapper over the HeroUI Tabs root. `secondary` (the default) bakes in the underline look and hugs its own label width; this is the bare rendering before `variant`/`size` are touched."
                note="`children` stays the caller's own `Tabs.ListContainer > Tabs.List > Tabs.Tab (+ Tabs.Indicator)` tree — a NAMED §12b exception (atom-wrapper), because each tab may carry chrome only the caller knows: accent/muted classes, a label hidden on mobile. Reach for `Tabs.Base` (`items`) when the tabs are plain content. Every leaf below only flips `variant`/`size`; the tree shape stays the same."
                code={`<Tabs.Extended selectedKey="overview" onSelectionChange={setKey}>
  <HeroTabs.ListContainer>
    <HeroTabs.List aria-label="Content filter">
      <HeroTabs.Tab id="overview">Overview<HeroTabs.Indicator /></HeroTabs.Tab>
      <HeroTabs.Tab id="reviews">Reviews<HeroTabs.Indicator /></HeroTabs.Tab>
      <HeroTabs.Tab id="qna">Q&A<HeroTabs.Indicator /></HeroTabs.Tab>
    </HeroTabs.List>
  </HeroTabs.ListContainer>
</Tabs.Extended>`}
            >
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
            </BlockAnatomy>
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
                leaf="Prop `variant`"
                reason="`primary` renders HeroUI's own default Tabs — a full-width segmented pill for a page-level FEATURE switch that swaps the entire panel. `secondary` drops the built-in baseline and hugs content, for a content filter riding alongside a reading column."
                note="Pick `primary` for top-level section switches (e.g. Overview/Explore/Courses); `secondary` for a filter or language-switcher that shouldn't claim the full row baseline. The second row also carries a responsive label (hidden below `md`) — a realistic `secondary` composition, not a new prop value."
                code={`<Tabs.Extended variant="primary" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>
<Tabs.Extended variant="secondary" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>`}
            >
                <div className="flex flex-col gap-8">
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
                </div>
            </BlockAnatomy>
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
                leaf="Prop `size`"
                reason={"`size` only shows up on `variant=\"primary\"` — `secondary` is already hug-content via the `.extended-tabs` override, so `size` has no visible effect there."}
                note={"`sm` shrinks the strip to `w-fit` — segments size to their own label, for a compact choice that shouldn't claim the full row (e.g. a setting nested in a modal). `md` (default) stretches to `w-full` and splits evenly; inside a squeezed container a segment truncates its label instead of wrapping, since every `Tabs.Tab` is forced `whitespace-nowrap`."}
                code={`<Tabs.Extended variant="primary" size="sm" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>
<Tabs.Extended variant="primary" size="md" selectedKey={key} onSelectionChange={setKey}>…</Tabs.Extended>`}
            >
                <div className="flex flex-col gap-8">
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
                </div>
            </BlockAnatomy>
        </div>
    ),
}
