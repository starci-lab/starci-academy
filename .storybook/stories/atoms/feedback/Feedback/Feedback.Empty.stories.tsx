import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowCounterClockwiseIcon, HouseIcon, MagnifyingGlassIcon, PackageIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier) — `Feedback.Empty`: chồng dọc CANH GIỮA lấp một chỗ trống
 * (danh sách rỗng, tìm không ra) HOẶC một chỗ hỏng (`tone="danger"` + nút thử
 * lại). Gộp luôn 3 khung cũ đã xoá: `ErrorState` (tone danger) · `ErrorPageState`
 * (`size="page"` + `code`) · `SimpleEmptyState` (`size="compact"`).
 *
 * ⚠️ PHẠM VI STATE (§12f): mỗi story chỉ render state do CHÍNH khung đẻ — số slot
 * bật/tắt (`code`/`icon`/`description`/`body`/`action`), `tone`, `size`. State của
 * nút trong `action` (pending/disabled) sống ở story `Atoms/Buttons/Button`.
 *
 * ⚠️ KHÔNG có leaf "loading" ở đây: khung này LÀ trạng thái rỗng/lỗi — skeleton
 * của một vùng đang tải là việc của chính block/khung vùng đó (§11f).
 *
 * 📐 LEAF = CẤU TRÚC (§14d.2, thầy chốt 2026-07-26): leaf chỉ tách khi cây DOM
 * thêm/bớt node (`Icon` · `Description` · `Body` · `Action` · `Code`). `tone` chỉ
 * đổi MÀU icon, và số nút trong `action` là nội dung của slot ⇒ cả hai là STATE,
 * nằm TRONG leaf, không đẻ story riêng.
 */
const meta: Meta<typeof Feedback.Empty> = {
    title: "Layouts/Feedback/Feedback/Feedback.Empty",
    component: Feedback.Empty,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Feedback.Empty>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8">{node}</div>

// §11a: chỉ badge slot TRỰC TIẾP của chồng dọc (code/icon/title/description/body/
// action) — thứ caller nhét VÀO `action` là part của story component đó.

const TITLE_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "dòng chính giải thích vì sao khu vực rỗng" },
]

const ICON_TITLE_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "icon minh hoạ (component phosphor, khung ép size-8)" },
    ...TITLE_PARTS,
]

const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    ...ICON_TITLE_PARTS,
    { name: "Description", tier: "primitive", role: "dòng phụ (muted) dưới tiêu đề" },
]

const ACTION_PARTS: Array<AnatomyNode> = [
    ...DESCRIPTION_PARTS,
    { name: "Action", tier: "primitive", role: "slot CTA (thường là Button) dưới thân" },
]

const BODY_PARTS: Array<AnatomyNode> = [
    ...DESCRIPTION_PARTS,
    { name: "Body", tier: "primitive", role: "slot TỰ DO (`body`/`children`) giữa mô tả và CTA" },
    { name: "Action", tier: "primitive", role: "slot CTA dưới thân" },
]

const PAGE_PARTS: Array<AnatomyNode> = [
    { name: "Code", tier: "primitive", role: "số trạng thái to (muted) — CHỈ có ở size=\"page\"" },
    { name: "Title", tier: "primitive", role: "tiêu đề cỡ lớn hơn shape mặc định" },
    { name: "Description", tier: "primitive", role: "dòng phụ (muted) dưới tiêu đề" },
    { name: "Action", tier: "primitive", role: "slot CTA — size=\"page\" cho nhiều nút canh giữa, tự wrap" },
]

const COMPACT_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "size=\"compact\" thu về ĐÚNG một dòng chữ muted (không icon/mô tả/CTA)" },
]

/** Biên gọn nhất: chỉ `title` — không icon, không mô tả, không CTA. */
export const TitleOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="TitleOnly"
                parts={TITLE_PARTS}
                reason="Khung LẤP CHỖ TRỐNG: mọi 'không có gì ở đây' của app phải đọc giống nhau (canh giữa, cùng thứ tự slot), dù là rỗng bình thường hay hỏng (tone), dù compact/default/page. Leaf này ít slot nhất."
                code={`<Feedback.Empty
  title="Chưa có dữ liệu"
/>`}
            >
                <Feedback.Empty showAnatomy title="Chưa có dữ liệu" />
            </BlockAnatomy>,
        ),
}

/** Thêm icon minh hoạ (component phosphor — khung tự ép `size-8` + tone màu). */
export const IconAndTitle: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="IconAndTitle"
                parts={ICON_TITLE_PARTS}
                note="`icon` nhận COMPONENT (không JSX) — khung sở hữu size + màu, caller không set class icon (§4/§5)."
                code={`<Feedback.Empty
  icon={PackageIcon}
  title="Chưa có khoá học"
/>`}
            >
                <Feedback.Empty showAnatomy icon={PackageIcon} title="Chưa có khoá học" />
            </BlockAnatomy>,
        ),
}

/** Thêm dòng mô tả (muted) dưới tiêu đề. */
export const Description: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="Description"
                parts={DESCRIPTION_PARTS}
                note="Thêm `description` — dòng phụ muted, cỡ nhỏ hơn tiêu đề."
                code={`<Feedback.Empty
  icon={MagnifyingGlassIcon}
  title="Không tìm thấy kết quả"
  description="…"
/>`}
            >
                <Feedback.Empty
                    showAnatomy
                    icon={MagnifyingGlassIcon}
                    title="Không tìm thấy kết quả"
                    description="Thử đổi bộ lọc hoặc từ khoá để thấy nhiều kết quả hơn."
                />
            </BlockAnatomy>,
        ),
}

/**
 * Shape đầy đủ của size mặc định: thêm CTA dưới thân.
 *
 * Gồm luôn `tone="danger"` (chỗ HỎNG, nút thử lại) — tone CHỈ đổi màu icon, cây DOM
 * y hệt ⇒ state trong leaf này, không phải leaf riêng (§14d.2). Gộp từ khung
 * `ErrorState` đã xoá.
 */
export const Action: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="Action"
                parts={ACTION_PARTS}
                note={"`action` = lối thoát khỏi trạng thái rỗng (đừng để người dùng bí). Hàng dưới là cùng shape với `tone=\"danger\"` — chỉ khác màu icon."}
                code={`<Feedback.Empty
  icon={PackageIcon}
  title="Danh sách trống"
  description="…"
  action={<Button.Base label="Thêm mục mới" />}
/>`}
            >
                <div className="flex flex-col gap-8">
                    <Feedback.Empty
                        showAnatomy
                        icon={PackageIcon}
                        title="Danh sách trống"
                        description="Bạn chưa lưu mục nào vào danh sách này."
                        action={<Button.Base label="Thêm mục mới" />}
                    />
                    <Feedback.Empty
                        tone="danger"
                        icon={WarningCircleIcon}
                        title="Không tải được dữ liệu"
                        description="Đã có lỗi xảy ra. Vui lòng thử lại sau."
                        action={<Button.Base label="Thử lại" variant="danger" prefixIcon={ArrowCounterClockwiseIcon} />}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** `body` (≡ `children`) — slot tự do giữa mô tả và CTA, cho nội dung không phải một dòng chữ. */
export const WithBody: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="WithBody"
                parts={BODY_PARTS}
                note="Khung BỌC (§13b): `body` là slot thân tự do, `children` là shorthand — ở đây là danh sách gợi ý trước khi tới CTA."
                code={`<Feedback.Empty
  icon={MagnifyingGlassIcon}
  title="Không tìm thấy kết quả"
  description="…"
  body={<ul>…</ul>}
  action={…}
/>`}
            >
                <Feedback.Empty
                    showAnatomy
                    icon={MagnifyingGlassIcon}
                    title="Không tìm thấy kết quả"
                    description="Vài cách thường ra kết quả hơn:"
                    body={(
                        <ul className="list-disc space-y-1 pl-4 text-left">
                            <li><Typography.Base size="xs" text="Bỏ bớt bộ lọc đang bật" color="muted" /></li>
                            <li><Typography.Base size="xs" text="Dùng từ khoá ngắn hơn" color="muted" /></li>
                        </ul>
                    )}
                    action={<Button.Base label="Xoá bộ lọc" variant="secondary" size="sm" />}
                />
            </BlockAnatomy>,
        ),
}

/**
 * `size="page"` — hỏng cả route: thêm slot `code` (số trạng thái to) phía trên tiêu đề.
 * Gộp từ khung `ErrorPageState` đã xoá.
 *
 * Render cả 404 (một nút) lẫn 500 (hai nút) trong CÙNG leaf: số nút nằm trong slot
 * `action` là NỘI DUNG của caller, cây part của khung không đổi một mảnh nào (§14d.2).
 */
export const FullPage: Story = {
    render: () => (
        <BlockAnatomy
            name="Feedback.Empty"
            tier="primitive"
            leaf="FullPage"
            parts={PAGE_PARTS}
            note={"`size=\"page\"` cho khung chiều cao 70vh + tiêu đề cỡ lớn + slot `code`. Hàng dưới có 2 nút trong `action` — khung tự canh giữa + wrap (chỉ size=\"page\")."}
            code={`<Feedback.Empty
  size="page"
  code="404"
  title="Không tìm thấy trang"
  action={<Button.Base label="Trang chủ" prefixIcon={HouseIcon} />}
/>`}
        >
            <div className="flex flex-col">
                <Feedback.Empty
                    showAnatomy
                    size="page"
                    code="404"
                    title="Không tìm thấy trang"
                    description="Trang bạn tìm không tồn tại hoặc đã được chuyển đi."
                    action={<Button.Base label="Trang chủ" prefixIcon={HouseIcon} />}
                />
                <Feedback.Empty
                    size="page"
                    code="500"
                    title="Đã có lỗi xảy ra"
                    description="Máy chủ gặp sự cố khi xử lý yêu cầu. Thử lại sau giây lát nhé."
                    action={(
                        <>
                            <Button.Base label="Thử lại" prefixIcon={ArrowCounterClockwiseIcon} />
                            <Button.Base label="Trang chủ" variant="secondary" prefixIcon={HouseIcon} />
                        </>
                    )}
                />
            </div>
        </BlockAnatomy>
    ),
}

/** `size="compact"` — thu cả khung về MỘT dòng chữ muted, cho chỗ hẹp (tab/panel body). */
export const Compact: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="Compact"
                parts={COMPACT_PARTS}
                note={"`size=\"compact\"` bỏ HẾT icon/mô tả/body/CTA — khác hẳn shape mặc định. Gộp từ khung `SimpleEmptyState` đã xoá."}
                code={`<Feedback.Empty
  size="compact"
  title="Chưa có bài nộp nào cho bài tập này."
/>`}
            >
                <div className="w-64">
                    <Feedback.Empty
                        showAnatomy
                        size="compact"
                        title="Chưa có bài nộp nào cho bài tập này."
                        icon={WarningIcon}
                        description="Dòng này KHÔNG render — compact bỏ hết slot phụ."
                    />
                </div>
            </BlockAnatomy>,
        ),
}
