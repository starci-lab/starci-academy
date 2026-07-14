import type { Meta, StoryObj } from "@storybook/nextjs"
import { Table } from "@heroui/react"

/**
 * Thang RADIUS — nguồn: canon `foundations/radius.md` + `globals.css` (`--radius: 0.5rem` = 8px gốc;
 * `@heroui/styles` derive `xl=1.5× · 2xl=2× · 3xl=3× · 4xl=4×`; `--field-radius: 0.75rem` = `rounded-field`).
 * Chọn bậc theo VAI/ĐỘ LỒNG của phần tử — mapping component ↔ radius grounded từ source thật.
 */
const meta: Meta = {
    title: "Foundations/Radius",
    parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj

/** Ô vuông tô accent-nhạt để thấy rõ góc bo của token. */
const Swatch = ({ cls }: { cls: string }) => (
    <div className={`size-10 bg-accent/15 ${cls}`} />
)

interface RadiusItem {
    token: string
    px: string
    swatchCls: string
    use: string
}

/** Thang bo góc — derive từ `--radius: 8px`. Mỗi token → component cụ thể dùng nó. */
export const Scale: Story = {
    render: () => {
        const rows: Array<RadiusItem> = [
            { token: "rounded-full", px: "∞", swatchCls: "rounded-full", use: "Chip · badge · avatar · switch · nút pill / icon button (tròn hoàn toàn)." },
            { token: "rounded-3xl", px: "24px (3×)", swatchCls: "rounded-3xl", use: "CARD top-level · panel · modal · surface-list ngoài cùng." },
            { token: "rounded-2xl", px: "16px (2×)", swatchCls: "rounded-2xl", use: "Media · block LỒNG trong card (concentric — nấc trong 1 bậc)." },
            { token: "rounded-field", px: "12px (=xl)", swatchCls: "rounded-field", use: "INPUT · select · textarea · search · BUTTON (token riêng --field-radius)." },
            { token: "rounded-lg", px: "8px", swatchCls: "rounded-lg", use: "Ô nhỏ · tag · cell nén (Tailwind default, KHÔNG nhân --radius)." },
        ]
        return (
            <Table variant="primary" className="w-full">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Thang radius">
                        <Table.Header>
                            <Table.Column isRowHeader>Token</Table.Column>
                            <Table.Column>px</Table.Column>
                            <Table.Column>Ví dụ</Table.Column>
                            <Table.Column>Dùng cho</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.token}>
                                    <Table.Cell>
                                        <code className="text-xs font-semibold text-foreground">{row.token}</code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-xs tabular-nums text-muted">{row.px}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Swatch cls={row.swatchCls} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-muted">{row.use}</span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        )
    },
    parameters: {
        usage: "1 token GỐC `--radius: 0.5rem` (8px) là NGUỒN DUY NHẤT; heroui derive `xl=1.5× · 2xl=2× · 3xl=3× · 4xl=4×`. Input/select/button dùng token riêng `--field-radius: 0.75rem` (utility `rounded-field`, = xl). KHÔNG đặt tay radius rời cho block mới — chọn bậc theo vai (card 3xl · media/block-lồng 2xl · field/button `rounded-field` · chip/avatar/switch full).",
    },
}

interface ConcentricItem {
    layer: string
    token: string
    px: string
    calc: string
}

/** Concentric — CÔNG THỨC: `radius trong = radius ngoài − padding` (bảng, padding đều `p-2` = 8px). */
export const Concentric: Story = {
    render: () => {
        const rows: Array<ConcentricItem> = [
            { layer: "Card ngoài", token: "rounded-3xl", px: "24px", calc: "gốc" },
            { layer: "Block lồng (p-2)", token: "rounded-2xl", px: "16px", calc: "24 − 8" },
            { layer: "Lõi (p-2)", token: "rounded-lg", px: "8px", calc: "16 − 8" },
        ]
        return (
            <Table variant="primary" className="w-full">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Concentric radius">
                        <Table.Header>
                            <Table.Column isRowHeader>Lớp</Table.Column>
                            <Table.Column>Token</Table.Column>
                            <Table.Column>px</Table.Column>
                            <Table.Column>Cách tính (ngoài − padding)</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.layer}>
                                    <Table.Cell>
                                        <span className="text-sm text-foreground">{row.layer}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <code className="text-xs font-semibold text-foreground">{row.token}</code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-xs tabular-nums text-muted">{row.px}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-muted">{row.calc}</span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        )
    },
    parameters: {
        usage: "Concentric ĐÚNG NGHĨA: `radius trong = radius ngoài − padding` (Cloud Four / BetterCorners). Padding lớn hơn → bo trong nhỏ hơn NHIỀU (card `rounded-3xl` 24px + `p-4` 16px → trong = 8px `rounded-lg`, KHÔNG phải 2xl 16px); ra ≤0 → góc VUÔNG. Demo trên `p-2` (8px) nên chuỗi = 24→16→8. Chip/avatar/switch luôn `rounded-full`. CẤM thêm `rounded-*` qua className lên component HeroUI đã bake radius (`.card`/`.modal`…) — utility thua CSS bake, câm lặng vô dụng.",
    },
}
