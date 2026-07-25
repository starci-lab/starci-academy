import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { DatePicker } from "@sb-components/blocks/form/DatePicker/DatePicker"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * The date-selection field input — a controlled `DatePicker` composing
 * {@link FieldShell} (label / hint / error / skeleton, canon §4/§8) with
 * HeroUI's canonical `DateField.Group` segments + `Calendar` popover compound.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis. `FieldShell` lives in a sibling folder (not editable here) so
 * it is badged as ONE opaque node via a plain marker wrapper — its own
 * label/hint/error anatomy is that component's own story, not drilled into here.
 */
const meta: Meta<typeof DatePicker> = {
    title: "Primitives/Forms/DatePicker",
    component: DatePicker,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DatePicker>

// Fixed literal so stories are deterministic — never `new Date()`.
const INITIAL_DATE = new CalendarDate(2026, 7, 20)
const MIN_DATE = new CalendarDate(2026, 7, 1)

const FIELD_SHELL: AnatomyNode = { name: "FieldShell", tier: "primitive", role: "khung field dùng chung (label · hint · error · skeleton column)" }
const DATE_FIELD: AnatomyNode = { name: "DateField", tier: "primitive", role: "control ngày (DateField.Group segment day/month/year + Calendar popover trigger)" }
const PARTS: Array<AnatomyNode> = [FIELD_SHELL, DATE_FIELD]

/** Local controlled wrapper — holds the picked date so the field/calendar are clickable for real. */
const Controlled = ({
    initialValue = null,
    label = "Ngày sinh",
    description,
    errorMessage,
    isDisabled,
}: {
    initialValue?: DateValue | null
    label?: string
    description?: string
    errorMessage?: string
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState<DateValue | null>(initialValue)
    return (
        <DatePicker
            showAnatomy
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            value={value}
            onValueChange={setValue}
            minValue={MIN_DATE}
        />
    )
}

/** Default: empty field, ready to pick a date. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="DatePicker" tier="primitive" leaf="Default" parts={PARTS} reason="DatePicker luôn compose FieldShell (khung label/hint/error) bọc DateField (control ngày) — 2 phần trực tiếp cố định.">
                <Controlled />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a hint under the label explaining the field. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="DatePicker" tier="primitive" leaf="WithHint" parts={PARTS} note="`description` render bên trong FieldShell (hint dưới label) — không đổi composition 2 phần.">
                <Controlled description="Dùng để xác nhận độ tuổi tối thiểu" />
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: an invalid field with an error line below it. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="DatePicker" tier="primitive" leaf="WithError" parts={PARTS} note="`errorMessage` → FieldShell hiện dòng lỗi + DateField nhận `isInvalid`.">
                <Controlled initialValue={INITIAL_DATE} errorMessage="Ngày sinh không hợp lệ" />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: the field cannot be opened or edited. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="DatePicker" tier="primitive" leaf="Disabled" parts={PARTS} note="`isDisabled` truyền xuống cả FieldShell (label mờ) và DateField (control khoá).">
                <Controlled initialValue={INITIAL_DATE} isDisabled />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: loading mirror — label bar + field-box skeleton (canon §8). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="DatePicker"
                tier="primitive"
                leaf="Skeleton"
                parts={[{ name: "FieldShell", tier: "primitive", role: "khung field TỰ đổi sang mirror (label bar + field-box skeleton) khi isSkeleton — DateField không render" }]}
                note="`isSkeleton` → FieldShell tự render mirror; DateField hoàn toàn không mount (không có node control thật)."
            >
                <DatePicker
                    showAnatomy
                    label="Ngày sinh"
                    isSkeleton
                    value={null}
                    onValueChange={() => {}}
                />
            </BlockAnatomy>
        </div>
    ),
}
