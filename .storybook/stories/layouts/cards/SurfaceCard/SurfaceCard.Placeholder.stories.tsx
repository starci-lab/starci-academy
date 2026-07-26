import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { FilePlusIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"

/**
 * KHUNG (Layouts) — ô "thêm mới": card bo `rounded-3xl` viền ĐỨT NÉT, bấm được, icon + nhãn
 * canh giữa, muted. Không mang chức năng nào ngoài việc CHỖ NÀY còn trống và bấm vào thì tạo.
 *
 * Hợp đồng press §7: chỉ `active:scale`, KHÔNG hover-bg — ô đứt nét nằm im lúc nghỉ và lúc
 * hover, phản hồi duy nhất là cú bấm.
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): đây là member DUY NHẤT không nhận nội dung
 * (không slot, không `items`) — story chỉ có state của chính nó: icon mặc định vs thay icon,
 * `isSelected`, `isDisabled`, `isSkeleton`. Không có BlockAnatomy vì khung này không phơi
 * `showAnatomy`/`anatPart` (§11a: chỉ gắn cây anatomy khi có `data-anat-part` thật).
 *
 * 2026-07-26 (thầy, BA TRỤC ĐỘC LẬP): `.Placeholder` KHÔNG nằm trong danh sách member đổi
 * `bordered`/`flushContent`/`compact` — `SurfaceCardPlaceholderProps` không có prop nào
 * trong ba trục đó (chỉ `icon`/`label`/`onPress`/`isSelected`/`isDisabled`/`isSkeleton`/
 * `className`), nên story này không đổi gì ở codemod prop.
 */
const meta: Meta<typeof SurfaceCard.Placeholder> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Placeholder",
    component: SurfaceCard.Placeholder,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Placeholder>

/**
 * Ô lấp đầy chiều cao của cell trong grid — mọi story ghim tile vào một hộp cố định
 * (khớp cell ~19rem của gallery CV mà nó được port sang) để `h-full w-full` có chỗ để lấp.
 */
const Cell = ({ children }: { children: ReactNode }) => (
    <div className="p-8">
        <div className="h-80 w-64">{children}</div>
    </div>
)

/** Default — `PlusIcon` trần + nhãn, thả được vào cuối bất kỳ grid "thêm mới" nào. */
export const Default: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" onPress={() => {}} />
        </Cell>
    ),
}

/** Icon tuỳ biến — caller đổi glyph dẫn đầu (vd file-plus cho grid tài liệu). Icon đi TRẦN, khung tự ép `size-8` (§4). */
export const CustomIcon: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder icon={<FilePlusIcon />} label="Import from file" onPress={() => {}} />
        </Cell>
    ),
}

/** `isSelected` — ô được chọn trong grid chọn (ring accent), cùng hợp đồng với `SurfaceCard.Pressable`. */
export const Selected: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" isSelected onPress={() => {}} />
        </Cell>
    ),
}

/** `isDisabled` — vd trong lúc mutation tạo đang chạy, hoặc đã chạm giới hạn của gói. */
export const Disabled: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" isDisabled onPress={() => {}} />
        </Cell>
    ),
}

/** `isSkeleton` — mirror tự vẽ (khối icon + 1 vạch chữ), cùng khung đứt nét, cùng footprint. */
export const Loading: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" isSkeleton onPress={() => {}} />
        </Cell>
    ),
}
