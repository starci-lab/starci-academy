import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowLeftIcon, ArrowRightIcon, FloppyDiskIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Button.Base`: nút có NHÃN.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật của TẦNG ATOM, thầy chốt 2026-07-26).
 * Mỗi prop có hình được một leaf, và leaf đó render ĐỦ giá trị của prop:
 * `variant` · `size` · `prefixIcon` · `suffixIcon` · `iconSlide` · `isIconOnly` ·
 * `isDisabled` · `isPending` · `isSkeleton`.
 *
 * ⚠️ Đừng lẫn với §14d.2 (leaf = CẤU TRÚC) — luật đó dành cho design/block/screen.
 * Bản trước của file này viện §14d.2 để nhồi variant + disabled + skeleton vào chung
 * leaf `Default`; ở tầng atom thế là SAI: atom là bảng tra, người đọc đến để xem "prop
 * này làm được gì", nên mỗi prop phải đứng riêng.
 *
 * 🧮 **Tab States** (panel 3 tab, thầy chốt 2026-07-26): mỗi leaf khai `states` =
 * bảng PHỦ của ĐÚNG prop sở hữu leaf đó. Ô đỏ (`rendered: false`) tố cáo giá trị bị
 * bỏ quên — đúng thứ đáng lẽ bắt được `danger` sót khỏi mảng `VARIANTS` trước khi nó
 * mọc thành story `Danger` lạc chỗ. Bảng KHÔNG vẽ lại hình: khung trên render rồi.
 * ⛔ Không kéo prop khác vào bảng: mọi ô phải là một cách gọi của CHÍNH prop này.
 *
 * ✍️ Chữ hiện trên panel (`leaf`/`reason`/`note`/`hint`/`code`) viết TIẾNG ANH; nhãn
 * demo trong khung render cũng tiếng Anh để tab Code khớp đúng từng chữ với hình.
 * JSDoc/comment thì vẫn tiếng Việt, và neo § chỉ nằm ở đây.
 *
 * 🎨 Icon = Phosphor (§5.0). Atom ép cả scale lẫn `weight` theo `size` (§5.0a) —
 * story chỉ chọn "hình gì", không chọn cỡ.
 */
const meta: Meta<typeof Button.Base> = {
    title: "Atoms/Buttons/Button/Button.Base",
    component: Button.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Base>


/** ĐỦ giá trị của union `ButtonVariant` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const VARIANTS = [
    { variant: "primary", label: "Save draft" },
    { variant: "secondary", label: "Preview" },
    { variant: "ghost", label: "Cancel" },
    { variant: "danger", label: "Delete" },
    { variant: "danger-soft", label: "Remove from list" },
] as const

const SIZES = ["sm", "md", "lg"] as const

/** Leaf TRẦN — chưa bật prop nào, để thấy hình mặc định (`variant="primary"`, `size="md"`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="No prop turned on"
                reason="The one button atom in the system, wrapping HeroUI Button. This leaf is the baseline: every leaf below differs from it by exactly one prop."
                note="Defaults are variant=primary and size=md. The DOM stays flat — button > label."
                states={[
                    {
                        value: "label=\"Save draft\"",
                        hint: "The only prop a labelled button needs.",
                        rendered: true,
                    },
                ]}
                code={"<Button.Base label=\"Save draft\" />"}
            >
                <Button.Base label="Save draft" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `variant` — 5 Ý NGHĨA hành động, render ĐỦ union. */
export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `variant`"
                reason="variant is the meaning of the action, not a colour. `danger` maps onto the destructive variant of our HeroUI fork — it is not the `color` prop."
                note="Two levels of danger: `danger` is the solid confirm button of a dialog, `danger-soft` is for destructive actions in a calmer place, like dropping one row from a list. HeroUI has no soft version, so the atom borrows a neutral variant and paints tokens over it."
                states={[
                    { value: "primary", hint: "Main action on the surface.", rendered: true },
                    { value: "secondary", hint: "Sits next to a primary.", rendered: true },
                    { value: "ghost", hint: "Quiet action, no fill.", rendered: true },
                    { value: "danger", hint: "Solid confirm in a dialog.", rendered: true },
                    { value: "danger-soft", hint: "Destructive, calm context.", rendered: true },
                ]}
                code={`<Button.Base variant="primary" label="Save draft" />
<Button.Base variant="secondary" label="Preview" />
<Button.Base variant="ghost" label="Cancel" />
<Button.Base variant="danger" label="Delete" />
<Button.Base variant="danger-soft" label="Remove from list" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {VARIANTS.map(({ variant, label }, index) => (
                        <Button.Base key={variant} variant={variant} label={label} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — 3 bậc TỈ LỆ, trục độc lập với `variant` (§12d). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="size is scale only — it never changes what the button means. The box also shrinks with the container it sits in (@app-md), not with the viewport."
                note="There is no icon-size prop: the glyph is read off `size` — see the prefixIcon leaf."
                states={[
                    { value: "sm", hint: "Dense rows and toolbars.", rendered: true },
                    { value: "md", hint: "Default.", rendered: true },
                    { value: "lg", hint: "Hero calls to action.", rendered: true },
                ]}
                code={`<Button.Base size="sm" label="Save draft" />
<Button.Base size="md" label="Save draft" />   // default
<Button.Base size="lg" label="Save draft" />`}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size, index) => (
                        <Button.Base key={size} size={size} label="Save draft" showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `prefixIcon` — glyph DẪN ĐẦU, đứng trước nhãn.
 *
 * `prefixIcon` không phải union nên bảng phủ khai theo CÁCH GỌI: đổi glyph (prop nhận
 * COMPONENT, không nhận JSX) và đổi `size` để thấy atom tự suy scale/weight (§5.0a).
 */
export const PrefixIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `prefixIcon` (leading)"
                reason="Renamed from `icon`: with a `suffixIcon` on the other end, a bare `icon` no longer read as one half of a pair. Both glyph slots now say the same thing from both sides, matching how Typography names them."
                note="The glyph has no size of its own. The atom reads it off `size` — 14px text takes a 14px icon, 16px text a 16px one — and forces bold weight, because every button glyph sits under 20px and thin strokes look weak there. Top row swaps the glyph, bottom row swaps the size."
                states={[
                    {
                        value: "prefixIcon={ArrowLeftIcon}",
                        hint: "Pass the component, not JSX.",
                        rendered: true,
                    },
                    {
                        value: "prefixIcon={FloppyDiskIcon}",
                        hint: "Swap the glyph, nothing else moves.",
                        rendered: true,
                    },
                    {
                        value: "prefixIcon={TrashIcon}",
                        hint: "Reads on a filled variant too.",
                        rendered: true,
                    },
                    {
                        value: "prefixIcon + size=\"sm|md|lg\"",
                        hint: "Scale and weight follow the button.",
                        rendered: true,
                    },
                ]}
                code={`<Button.Base prefixIcon={ArrowLeftIcon} label="Back" />
<Button.Base prefixIcon={FloppyDiskIcon} label="Save" />
<Button.Base size="lg" prefixIcon={FloppyDiskIcon} label="Save" />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button.Base prefixIcon={ArrowLeftIcon} label="Back" showAnatomy />
                        <Button.Base prefixIcon={FloppyDiskIcon} label="Save" />
                        <Button.Base variant="danger" prefixIcon={TrashIcon} label="Delete" />
                    </div>
                    <div className="flex items-center gap-3">
                        {SIZES.map((size) => (
                            <Button.Base key={size} size={size} prefixIcon={FloppyDiskIcon} label="Save" />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `suffixIcon` — glyph ĐUÔI. Node `SuffixIcon` đứng SAU `Label`. */
export const SuffixIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `suffixIcon` (trailing)"
                reason="Where the glyph sits carries meaning: leading says what kind of action this is (save, delete), trailing says where it takes you (onward, out to a doc). Without a trailing slot, a “Continue →” button gets hand-assembled at the call site — the thing this atom exists to stop."
                note="Both slots can be on at once (bottom row) — the atom lays them out as icon, label, icon."
                states={[
                    {
                        value: "suffixIcon={ArrowRightIcon}",
                        hint: "Trailing glyph, after the label.",
                        rendered: true,
                    },
                    {
                        value: "prefixIcon + suffixIcon",
                        hint: "Both slots at once, atom orders them.",
                        rendered: true,
                    },
                ]}
                code={`<Button.Base label="Continue" suffixIcon={ArrowRightIcon} />
<Button.Base prefixIcon={FloppyDiskIcon} label="Save and continue" suffixIcon={ArrowRightIcon} />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button.Base label="Continue" suffixIcon={ArrowRightIcon} showAnatomy />
                        <Button.Base variant="secondary" label="Open docs" suffixIcon={ArrowRightIcon} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button.Base prefixIcon={FloppyDiskIcon} label="Save and continue" suffixIcon={ArrowRightIcon} />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `iconSlide` (§5b) — mũi tên TRƯỢT khi hover. Rê chuột mới thấy. */
export const IconSlide: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `iconSlide`"
                reason="The arrow slides the way it points — a leading arrow backs off to the left (go back), a trailing one moves right (keep going). Navigation arrows only; a caret or a static glyph doing this just fidgets."
                note="Hover a button to see it. Tailwind v4 treats translate as its own property, so the atom transitions `translate`, not `transform` — get that wrong and the hover stutters."
                states={[
                    {
                        value: "iconSlide + suffixIcon",
                        hint: "Arrow moves right: keep going.",
                        rendered: true,
                    },
                    {
                        value: "iconSlide + prefixIcon",
                        hint: "Arrow moves left: go back.",
                        rendered: true,
                    },
                ]}
                code={`<Button.Base label="Continue" suffixIcon={ArrowRightIcon} iconSlide />
<Button.Base prefixIcon={ArrowLeftIcon} label="Back" iconSlide />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Button.Base label="Continue" suffixIcon={ArrowRightIcon} iconSlide showAnatomy />
                    <Button.Base variant="secondary" prefixIcon={ArrowLeftIcon} label="Back" iconSlide />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isIconOnly` — nút bỏ nhãn, chỉ còn glyph.
 *
 * Gộp 2026-07-26: trước đó là component RIÊNG `Button.Icon`. Nhưng nút chỉ-icon không
 * phải hình thái khác — nó là cùng cái nút bỏ nhãn đi. Nuôi hai component song song
 * nghĩa là mọi luật (variant · size · weight · skeleton) phải sửa hai chỗ.
 */
export const IsIconOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isIconOnly`"
                reason="Turn it on and `prefixIcon` + `ariaLabel` become required — the types enforce it, because a button with no text is silent to a screen reader. `label` and `suffixIcon` stop meaning anything, so the atom drops them."
                note="The box goes square with the size (36 / 40 / 44px) but the glyph still follows the font scale, exactly like a labelled button — one rule, not a second scale per box. That is why sm and md share a glyph size and differ only in the box."
                states={[
                    {
                        value: "isIconOnly prefixIcon={PlusIcon}",
                        hint: "Square box, glyph only.",
                        rendered: true,
                    },
                    {
                        value: "isIconOnly ariaLabel=\"Add item\"",
                        hint: "Required — no text, no name.",
                        rendered: true,
                    },
                    {
                        value: "isIconOnly + size=\"sm|md|lg\"",
                        hint: "Box grows, glyph keeps the font scale.",
                        rendered: true,
                    },
                ]}
                code={`<Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Add item" />
<Button.Base isIconOnly variant="danger" prefixIcon={TrashIcon} ariaLabel="Delete" />
<Button.Base isIconOnly size="lg" prefixIcon={PlusIcon} ariaLabel="Add item" />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Add item" showAnatomy />
                        <Button.Base isIconOnly variant="secondary" prefixIcon={ArrowLeftIcon} ariaLabel="Back" />
                        <Button.Base isIconOnly variant="ghost" prefixIcon={ArrowRightIcon} ariaLabel="Continue" />
                        <Button.Base isIconOnly variant="danger" prefixIcon={TrashIcon} ariaLabel="Delete" />
                    </div>
                    <div className="flex items-center gap-3">
                        {SIZES.map((size) => (
                            <Button.Base
                                key={size}
                                isIconOnly
                                size={size}
                                prefixIcon={PlusIcon}
                                ariaLabel={`Add item (${size})`}
                            />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isDisabled` — khoá press, KHÔNG kèm Spinner (khác `isPending`). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="isDisabled means not allowed yet — an invalid form, a missing permission. `isPending` means waiting on something already running. Two different messages; they don't stand in for each other."
                note="Forwarded straight to HeroUI: press is blocked and the button dims. No spinner."
                states={[
                    { value: "isDisabled", hint: "Press blocked, no spinner.", rendered: true },
                    {
                        value: "isDisabled on every variant",
                        hint: "Dimming reads the same on all five.",
                        rendered: true,
                    },
                ]}
                code={"<Button.Base variant=\"primary\" isDisabled label=\"Save draft\" />"}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {VARIANTS.map(({ variant, label }, index) => (
                        <Button.Base key={variant} variant={variant} label={label} isDisabled showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isPending` — Spinner THAY glyph dẫn đầu (không chồng hai tín hiệu cùng chỗ). */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isPending`"
                reason="react-aria's `isPending` draws nothing on its own — the atom renders the spinner itself, or the button goes silent for the whole wait."
                note="The spinner takes the leading slot instead of standing next to the glyph: two marks in one place are two signals fighting. That also means a button with an icon and one without look identical while pending, so this leaf only varies size — rendering both would render the same picture twice."
                states={[
                    {
                        value: "isPending",
                        hint: "Spinner takes the leading slot.",
                        rendered: true,
                    },
                    {
                        value: "isPending + size=\"sm|md|lg\"",
                        hint: "Spinner scales with the button.",
                        rendered: true,
                    },
                ]}
                code={"<Button.Base variant=\"primary\" isPending label=\"Saving…\" />"}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size, index) => (
                        <Button.Base key={size} size={size} isPending label="Saving…" showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED, khớp hộp nút từng size (§12c).
 *
 * Render ĐỦ HAI HÌNH: pill (nút có nhãn) và vuông (`isIconOnly`) — đó là toàn bộ tập
 * state mà prop này sinh ra. Hàng vuông trước nằm nhầm trong leaf `IsIconOnly`; skeleton
 * là prop RIÊNG nên phải về đây, không trộn hai prop trong một leaf (§12g).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its loading state, so the atom draws its own shimmer at button size. There is no shared skeleton component to keep in sync."
                note="The shimmer box tracks `size` (pills 80 / 96 / 112px, squares 36 / 40 / 44px) so a row of buttons doesn't jump when the data lands. It used to be one fixed width for all three steps — three boxes that looked alike and none of them the size of the real button."
                states={[
                    {
                        value: "isSkeleton",
                        hint: "Pill shimmer for a labelled button.",
                        rendered: true,
                    },
                    {
                        value: "isSkeleton isIconOnly",
                        hint: "Square shimmer for the icon button.",
                        rendered: true,
                    },
                    {
                        value: "isSkeleton + size=\"sm|md|lg\"",
                        hint: "Each size gets its own box.",
                        rendered: true,
                    },
                ]}
                code={`<Button.Base isSkeleton />
<Button.Base size="lg" isSkeleton />
<Button.Base isIconOnly isSkeleton />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        {SIZES.map((size) => (
                            <Button.Base key={size} size={size} isSkeleton />
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        {SIZES.map((size) => (
                            <Button.Base key={size} isIconOnly size={size} isSkeleton />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
