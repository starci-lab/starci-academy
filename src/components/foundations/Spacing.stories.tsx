import type { Meta, StoryObj } from "@storybook/nextjs"
import { Table } from "@heroui/react"

/**
 * Thang SPACING (gap + padding) — nguồn: canon `foundations/gap.md` (CHỐT 2026-06-24).
 * Thang chuẩn `0 · 2 · 3 · 6 · 8` cho MỌI spacing; ngoài thang là CẤM (trừ ngoại lệ có tên).
 *
 * Trình bày bằng HeroUI `Table` (như cách các design-system lớn document 1 space scale —
 * Atlassian, Carbon, Polaris): mỗi token 1 hàng gồm tên · px · dòng "khi nào dùng".
 */
const meta: Meta = {
    title: "Core/Foundations/Spacing",
}
export default meta
type Story = StoryObj

interface ScaleItem {
    token: string
    px: number
    note: string
}

/** Bảng scale dùng HeroUI `Table` (full-width): Token · px · Khi nào dùng. */
const ScaleTable = ({ rows, ariaLabel }: { rows: Array<ScaleItem>; ariaLabel: string }) => (
    <Table variant="primary" className="w-full">
        <Table.ScrollContainer>
            <Table.Content aria-label={ariaLabel}>
                <Table.Header>
                    <Table.Column isRowHeader>Token</Table.Column>
                    <Table.Column>px</Table.Column>
                    <Table.Column>Khi nào dùng</Table.Column>
                </Table.Header>
                <Table.Body>
                    {rows.map((row) => (
                        <Table.Row key={row.token}>
                            <Table.Cell>
                                <code className="text-xs font-semibold text-foreground">{row.token}</code>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-xs tabular-nums text-muted">{row.px}px</span>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-sm text-muted">{row.note}</span>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
    </Table>
)

/** Thang gap chuẩn — 5 nấc, chọn nấc theo QUAN HỆ giữa 2 phần tử. */
export const GapScale: Story = {
    render: () => (
        <ScaleTable
            ariaLabel="Thang gap chuẩn"
            rows={[
                { token: "gap-0", px: 0, note: "Dính nhau — số ↔ đơn vị, ký tự liền một cụm." },
                { token: "gap-2", px: 8, note: "Cụm con sát — icon ↔ label, chip ↔ chip." },
                { token: "gap-3", px: 12, note: "Trong 1 khối — label ↔ control, row ↔ row." },
                { token: "gap-6", px: 24, note: "Giữa 2 khối — section ↔ section." },
                { token: "gap-8", px: 32, note: "Giữa 2 vùng rộng — nhịp lớn giữa 2 cụm lớn." },
            ]}
        />
    ),
    parameters: {
        usage: "Thang gap chuẩn `0 · 2 · 3 · 6 · 8` (canon foundations/gap). CẤM giá trị ngoài thang (1/1.5/4/5/7…). Chọn nấc theo QUAN HỆ: dính(0) · cụm con(2) · trong khối(3) · giữa khối(6) · giữa vùng rộng(8). gap-6 theo ĐỘ LỚN của khối — 3 component nhỏ xếp dọc vẫn gap-3, KHÔNG gap-6.",
    },
}

/** Ngoại lệ CÓ TÊN — chỉ dùng đúng ngữ cảnh của nó, không lan ra thang chung. */
export const NamedExceptions: Story = {
    render: () => (
        <ScaleTable
            ariaLabel="Ngoại lệ spacing có tên"
            rows={[
                { token: "gap-10", px: 40, note: "APP — PageHeader → nội dung. Khoảng thở lớn sau header." },
                { token: "gap-16", px: 64, note: "LANDING — SectionHeading → nội dung (thở kiểu landing)." },
                { token: "gap-3 (divider)", px: 12, note: "Trên–dưới 1 divider trong card — divider đã gánh phân tách." },
            ]}
        />
    ),
    parameters: {
        usage: "Ngoại lệ CÓ TÊN: `gap-10` (app, PageHeader→content) · `gap-16` (landing, SectionHeading→content) · `gap-3` quanh divider trong card. Mỗi cái chỉ dùng đúng ngữ cảnh của nó, không lan ra thang chung.",
    },
}

interface PadItem {
    token: string
    note: string
}

/** Padding — block SỞ HỮU padding của nó (theo thang 0/2/3/6/8). */
export const Padding: Story = {
    render: () => {
        const rows: Array<PadItem> = [
            { token: "p-3", note: "Card / LabeledCard — padding card mặc định (block sở hữu). List-có-divider = card flush + mỗi row p-3." },
            { token: "p-6", note: "Panel / thân modal — vùng lớn thở đều 4 phía." },
            { token: "p-3", note: "Ô nhỏ — thumbnail, icon-tile, row compact." },
        ]
        return (
            <Table variant="primary" className="w-full">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Thang padding">
                        <Table.Header>
                            <Table.Column isRowHeader>Token</Table.Column>
                            <Table.Column>Khi nào dùng</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.token}>
                                    <Table.Cell>
                                        <code className="text-xs font-semibold text-foreground">{row.token}</code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-muted">{row.note}</span>
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
        usage: "Padding cũng theo thang `0/2/3/6/8`. Card mặc định `p-3` (block sở hữu padding — feature không tự set; list-có-divider = card flush + mỗi row p-3). Panel/modal body `p-6`. Đừng rải gap-6 đều mọi nơi (thưa) hay ép tất cả gap-3 (mất ranh giới vùng).",
    },
}
