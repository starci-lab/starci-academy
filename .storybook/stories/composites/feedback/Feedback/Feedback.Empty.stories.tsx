import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowCounterClockwiseIcon, HouseIcon, MagnifyingGlassIcon, PackageIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (composite tier) — `Feedback.Empty`: chồng dọc CANH GIỮA lấp một chỗ trống
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
    title: "Composites/Feedback/Feedback/Feedback.Empty",
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
                tier="composite"
                leaf="TitleOnly"
                reason="This is the frame that fills an empty spot: every 'nothing here' in the app reads the same, centered, in the same slot order, whether it's plain-empty or broken (tone), compact, default, or page-sized."
                states={[
                    {
                        name: "icon unset, description unset, action unset",
                        why: "Only the title text renders, since none of the optional slots have content to show. This leaf has the fewest slots of the whole family, the shape to reach for when the title alone already says enough.",
                        code: `<Feedback.Empty
  title="No data yet"
/>`,
                        render: <Feedback.Empty showAnatomy title="No data yet" />,
                    },
                ]}
            />,
        ),
}

/** Thêm icon minh hoạ (component phosphor — khung tự ép `size-8` + tone màu). */
export const IconAndTitle: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="composite"
                leaf="IconAndTitle"
                states={[
                    {
                        name: "icon set, description unset, action unset",
                        why: "An icon node appears above the title, sized and colored by the frame itself rather than by classes the caller sets. `icon` takes a component reference, not JSX, which is why the frame owns the size and color instead of the caller (§4/§5).",
                        code: `<Feedback.Empty
  icon={PackageIcon}
  title="No courses yet"
/>`,
                        render: <Feedback.Empty showAnatomy icon={PackageIcon} title="No courses yet" />,
                    },
                ]}
            />,
        ),
}

/** Thêm dòng mô tả (muted) dưới tiêu đề. */
export const Description: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="composite"
                leaf="Description"
                states={[
                    {
                        name: "icon set, description set, action unset",
                        why: "A muted supporting line appears under the title, smaller than the title itself. The action slot still holds nothing, so this shape says more about the empty state without yet offering a way out of it.",
                        code: `<Feedback.Empty
  icon={MagnifyingGlassIcon}
  title="No results found"
  description="…"
/>`,
                        render: (
                            <Feedback.Empty
                                showAnatomy
                                icon={MagnifyingGlassIcon}
                                title="No results found"
                                description="Try different filters or a shorter search term."
                            />
                        ),
                    },
                ]}
            />,
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
                tier="composite"
                leaf="Action"
                reason="`action` is the way out of an empty state, so nothing should ever leave the reader stuck at a dead end with no next step."
                states={[
                    {
                        name: "tone unset (default), action set",
                        why: "A button node fills the action slot below the description, giving the reader a next step for a plain empty state. The icon keeps the frame's default color, since nothing here is broken.",
                        code: `<Feedback.Empty
  icon={PackageIcon}
  title="This list is empty"
  description="…"
  action={<Button.Base label="Add an item" />}
/>`,
                        render: (
                            <Feedback.Empty
                                showAnatomy
                                icon={PackageIcon}
                                title="This list is empty"
                                description="You haven't saved any items to this list yet."
                                action={<Button.Base label="Add an item" />}
                            />
                        ),
                    },
                    {
                        name: "tone = \"danger\", action set",
                        why: "The same shape as the default tone carries over untouched, only the icon recolors to the danger tone because something actually went wrong here. tone changes color alone, never the node tree, which is why this stays a state of the Action leaf instead of a leaf of its own.",
                        code: `<Feedback.Empty
  tone="danger"
  icon={WarningCircleIcon}
  title="Couldn't load the data"
  description="…"
  action={<Button.Base label="Retry" variant="danger" prefixIcon={ArrowCounterClockwiseIcon} />}
/>`,
                        render: (
                            <Feedback.Empty
                                showAnatomy
                                tone="danger"
                                icon={WarningCircleIcon}
                                title="Couldn't load the data"
                                description="Something went wrong. Please try again."
                                action={<Button.Base label="Retry" variant="danger" prefixIcon={ArrowCounterClockwiseIcon} />}
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** `body` (≡ `children`) — slot tự do giữa mô tả và CTA, cho nội dung không phải một dòng chữ. */
export const WithBody: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Feedback.Empty"
                tier="composite"
                leaf="WithBody"
                reason="The frame wraps (§13b): `body` is the free-form body slot and `children` is its shorthand, sitting between the description and the action so a caller can drop in anything richer than one more line of text."
                states={[
                    {
                        name: "body set to a hint list",
                        why: "A bullet list of hints slots in between the description and the action button, content richer than a single line of text. This is the shape a caller reaches for when a plain description isn't enough to guide the reader back to results.",
                        code: `<Feedback.Empty
  icon={MagnifyingGlassIcon}
  title="No results found"
  description="…"
  body={<ul>…</ul>}
  action={…}
/>`,
                        render: (
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
                        ),
                    },
                ]}
            />,
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
            tier="composite"
            leaf="FullPage"
            reason={"`size=\"page\"` gives the frame a 70vh height, a larger title, and room for a `code` numeral, the shape for a route that failed to load at all rather than a section within a working page."}
            states={[
                {
                    name: "size = \"page\", code = \"404\", action = 1 button",
                    why: "One button sits in the centered action row below the code numeral and title, enough for a route that simply doesn't exist. size=\"page\" centers and wraps the action row automatically, so the frame never has to know in advance how many buttons will land there.",
                    code: `<Feedback.Empty
  size="page"
  code="404"
  title="Page not found"
  action={<Button.Base label="Go home" prefixIcon={HouseIcon} />}
/>`,
                    render: (
                        <Feedback.Empty
                            showAnatomy
                            size="page"
                            code="404"
                            title="Page not found"
                            description="The page you're looking for doesn't exist or has moved."
                            action={<Button.Base label="Go home" prefixIcon={HouseIcon} />}
                        />
                    ),
                },
                {
                    name: "size = \"page\", code = \"500\", action = 2 buttons",
                    why: "Two buttons sit in the same action row this time, retry first and go home second, since the caller's node tree simply carries more content. The count of buttons is content the caller decides, so it never opens a leaf of its own.",
                    code: `<Feedback.Empty
  size="page"
  code="500"
  title="Something went wrong"
  action={(
    <>
      <Button.Base label="Retry" prefixIcon={ArrowCounterClockwiseIcon} />
      <Button.Base label="Go home" variant="secondary" prefixIcon={HouseIcon} />
    </>
  )}
/>`,
                    render: (
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
                    ),
                },
            ]}
        />
    ),
}

/** `size="compact"` — thu cả khung về MỘT dòng chữ muted, cho chỗ hẹp (tab/panel body). */
export const Compact: Story = {
    render: () =>
        shell(
            <div className="w-64">
                <BlockAnatomy
                    name="Feedback.Empty"
                    tier="composite"
                    leaf="Compact"
                    reason={"`size=\"compact\"` was merged from the deleted `SimpleEmptyState` frame, and it drops every icon, description, body, and CTA down to one muted line, a different shape from the default reserved for a tight spot like a tab or panel body."}
                    states={[
                        {
                            name: "size = \"compact\"",
                            why: "Only the title text renders as a single muted line, even though icon and description are passed in, because compact drops every secondary slot on purpose. The frame chooses this shrink over letting a full-size empty state crowd a narrow container.",
                            code: `<Feedback.Empty
  size="compact"
  title="No submissions yet for this assignment."
/>`,
                            render: (
                                <Feedback.Empty
                                    showAnatomy
                                    size="compact"
                                    title="No submissions yet for this assignment."
                                    icon={WarningIcon}
                                    description="This line does NOT render — compact drops every secondary slot."
                                />
                            ),
                        },
                    ]}
                />
            </div>,
        ),
}
