import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowCounterClockwiseIcon, HouseIcon, MagnifyingGlassIcon, PackageIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 * 📐 LEAF = CẤU TRÚC (§14d.2, ĐÚNG cho khung — khác atom, xem cảnh báo ở
 * `Alert.Base.stories.tsx`): leaf chỉ tách khi cây DOM thêm/bớt node (`Icon` ·
 * `Description` · `Body` · `Action` · `Code`). `tone` chỉ đổi MÀU icon, và số nút
 * trong `action` là nội dung của slot ⇒ cả hai là STATE, nằm TRONG leaf.
 *
 * ⛔ KHÔNG có `annotate`: `action` là NODE tuỳ ý caller đưa vào (khung không tự
 * dựng `Button.Base` bên trong như `Feedback.Callout`), nên không có node nào ở
 * đây trỏ sang được một story khác — bỏ hẳn prop thay vì để rác.
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

/** Biên gọn nhất: chỉ `title` — không icon, không mô tả, không CTA. */
export const TitleOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="primitive"
                leaf="TitleOnly"
                reason="The frame that FILLS AN EMPTY SPOT: every 'nothing here' in the app should read the same — centered, same slot order — whether it's plain-empty or broken (tone), compact/default/page. This leaf has the fewest slots."
                code={`<Feedback.Empty
  title="No data yet"
/>`}
            >
                <Feedback.Empty showAnatomy title="No data yet" />
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
                note="`icon` takes a COMPONENT (not JSX) — the frame owns the size and colour, the caller never sets an icon class (§4/§5)."
                code={`<Feedback.Empty
  icon={PackageIcon}
  title="No courses yet"
/>`}
            >
                <Feedback.Empty showAnatomy icon={PackageIcon} title="No courses yet" />
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
                note="Adding `description` — a muted supporting line, smaller than the title."
                code={`<Feedback.Empty
  icon={MagnifyingGlassIcon}
  title="No results found"
  description="…"
/>`}
            >
                <Feedback.Empty
                    showAnatomy
                    icon={MagnifyingGlassIcon}
                    title="No results found"
                    description="Try different filters or a shorter search term."
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
                note={"`action` is the way out of an empty state (don't leave the reader stuck). The row below is the SAME shape with `tone=\"danger\"` — only the icon colour differs."}
                code={`<Feedback.Empty
  icon={PackageIcon}
  title="This list is empty"
  description="…"
  action={<Button.Base label="Add an item" />}
/>`}
            >
                <div className="flex flex-col gap-8">
                    <Feedback.Empty
                        showAnatomy
                        icon={PackageIcon}
                        title="This list is empty"
                        description="You haven't saved any items to this list yet."
                        action={<Button.Base label="Add an item" />}
                    />
                    <Feedback.Empty
                        tone="danger"
                        icon={WarningCircleIcon}
                        title="Couldn't load the data"
                        description="Something went wrong. Please try again."
                        action={<Button.Base label="Retry" variant="danger" prefixIcon={ArrowCounterClockwiseIcon} />}
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
                note="The frame WRAPS (§13b): `body` is the free-form body slot, `children` is its shorthand — here it's a hint list before the CTA."
                code={`<Feedback.Empty
  icon={MagnifyingGlassIcon}
  title="No results found"
  description="…"
  body={<ul>…</ul>}
  action={…}
/>`}
            >
                <Feedback.Empty
                    showAnatomy
                    icon={MagnifyingGlassIcon}
                    title="No results found"
                    description="A few things that usually help:"
                    body={(
                        <ul className="list-disc space-y-1 pl-4 text-left">
                            <li><Typography.Base size="xs" text="Clear some active filters" color="muted" /></li>
                            <li><Typography.Base size="xs" text="Use a shorter search term" color="muted" /></li>
                        </ul>
                    )}
                    action={<Button.Base label="Clear filters" variant="secondary" size="sm" />}
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
            note={"`size=\"page\"` gives the frame a 70vh height + a larger title + room for a `code` numeral. The row below has 2 buttons in `action` — the frame centers and wraps them automatically (size=\"page\" only)."}
            code={`<Feedback.Empty
  size="page"
  code="404"
  title="Page not found"
  action={<Button.Base label="Go home" prefixIcon={HouseIcon} />}
/>`}
        >
            <div className="flex flex-col">
                <Feedback.Empty
                    showAnatomy
                    size="page"
                    code="404"
                    title="Page not found"
                    description="The page you're looking for doesn't exist or has moved."
                    action={<Button.Base label="Go home" prefixIcon={HouseIcon} />}
                />
                <Feedback.Empty
                    size="page"
                    code="500"
                    title="Something went wrong"
                    description="The server ran into a problem handling your request. Try again in a moment."
                    action={(
                        <>
                            <Button.Base label="Retry" prefixIcon={ArrowCounterClockwiseIcon} />
                            <Button.Base label="Go home" variant="secondary" prefixIcon={HouseIcon} />
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
                note={"`size=\"compact\"` drops EVERY icon/description/body/CTA — a different shape from the default. Merged from the deleted `SimpleEmptyState` frame."}
                code={`<Feedback.Empty
  size="compact"
  title="No submissions yet for this assignment."
/>`}
            >
                <div className="w-64">
                    <Feedback.Empty
                        showAnatomy
                        size="compact"
                        title="No submissions yet for this assignment."
                        icon={WarningIcon}
                        description="This line does NOT render — compact drops every secondary slot."
                    />
                </div>
            </BlockAnatomy>,
        ),
}
