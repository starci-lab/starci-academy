import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Grid } from "@sb-components/blocks/layout/Grid/Grid"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/blocks/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `Grid.Base` là KHUNG DANH SÁCH LẶP hai chiều. State nó sinh ra =
 * `columns` (số cột theo mốc CONTAINER — state đặc trưng, không khung nào khác có),
 * và `gap` (§10). Không có `align`/`justify`: ô lưới mặc định kéo đầy ô, việc canh
 * bên trong ô là của component trong ô. Danh sách rỗng → track rỗng, câu chữ "chưa có
 * gì" thuộc caller (§13 — khung không mang nội dung).
 */
const meta: Meta<typeof Grid.Base> = {
    title: "Layouts/Layout/Grid/Grid.Base",
    component: Grid.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Grid.Base>

const CELL_PARTS: Array<AnatomyNode> = [
    { name: "Cell", tier: "primitive", role: "một ô của lưới — đến từ `items` DỮ LIỆU, không phải children" },
]

/** Khung không mang nội dung — fixture là card thật để thấy ô và seam. */
const cellItems = (labels: ReadonlyArray<string>) =>
    labels.map((label) => ({
        key: label,
        content: (
            <SurfaceCard.Base>
                <Typography.Sm text={label} />
            </SurfaceCard.Base>
        ),
    }))

const MODULES = ["Nhập môn", "Container", "Orchestration", "CI/CD", "Quan trắc", "Bảo mật"]

/**
 * `@app-*` đo CONTAINER gần nhất, không đo cửa sổ — muốn demo mốc thì phải tự mở một
 * `@container` đúng bề ngang (đúng như app shell làm). `--container-app-sm = 40rem`,
 * `-md = 48rem`, `-lg = 64rem`.
 */
const Frame = ({ width, label, children }: { width: string; label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-2">
        <Typography.Xs text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** Sáu nấc HỢP LỆ của §10 — `gap` là union literal nên không có nấc thứ bảy. */
const SCALE = [
    { gap: 0, name: "flush (0)" },
    { gap: 1, name: "tight (1)" },
    { gap: 2, name: "related (2)" },
    { gap: 3, name: "grouped (3)" },
    { gap: 6, name: "section (6)" },
    { gap: 8, name: "page (8)" },
] as const

/** Default — lưới card 1 cột hẹp → 2 cột từ `@app-sm` → 3 cột từ `@app-md`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid.Base"
                tier="primitive"
                leaf="Default"
                parts={CELL_PARTS}
                reason="Danh sách lặp hai chiều ⇒ `items` DỮ LIỆU, CẤM children (§13b) — tiền đề của lưới là mọi ô cùng một loại. Mốc reflow là CONTAINER QUERY `@app-*` chứ không phải `md:`: app shell là cột trái mà rail AI bóp được bất cứ lúc nào, lưới phải nghe theo cột của chính nó, không nghe cửa sổ."
                code={`<Grid.Base
  gap={3}
  columns={{ base: 1, sm: 2, md: 3 }}
  items={modules.map((m) => ({ key: m, content: <ModuleCard name={m} /> }))}
/>`}
            >
                <Frame width="48rem" label="container 768px — mốc @app-md → 3 cột">
                    <Grid.Base showAnatomy gap={3} columns={{ base: 1, sm: 2, md: 3 }} items={cellItems(MODULES)} />
                </Frame>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Columns — state ĐẶC TRƯNG của lưới: CÙNG một `columns`, chỉ đổi bề ngang container
 * là số cột đổi theo. Mỗi mốc KẾ THỪA mốc nhỏ hơn liền trước, nên `{base:1, md:3}`
 * nghĩa là 1 cột cho tới `@app-md` rồi 3 cột từ đó lên.
 */
export const Columns: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid.Base"
                tier="primitive"
                leaf="Columns"
                parts={CELL_PARTS}
                note="Số cột bị CHẶN theo mốc bằng TYPE (`sm` tối đa 3, `base` tối đa 2): 4 cột trong một shell hẹp thì không đọc được, nên type từ chối thẳng thay vì để review bắt."
                code={`<Grid.Base
  gap={3}
  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    <Frame width="20rem" label="container 320px — dưới @app-sm → base = 1 cột">
                        <Grid.Base showAnatomy gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                    <Frame width="40rem" label="container 640px — @app-sm → 2 cột">
                        <Grid.Base gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                    <Frame width="48rem" label="container 768px — @app-md → 3 cột">
                        <Grid.Base gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                    <Frame width="64rem" label="container 1024px — @app-lg → 4 cột">
                        <Grid.Base gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Gaps — `gap` nhận ĐÚNG sáu nấc `0·1·2·3·6·8` (§10c) và BẮT BUỘC; `gap={4}` là LỖI
 * BIÊN DỊCH. Áp cho CẢ hai trục nên khoảng giữa các hàng bằng khoảng giữa các cột.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid.Base"
                tier="primitive"
                leaf="Gaps"
                parts={CELL_PARTS}
                note="Lưới card thường ở `grouped(3)`; `section(6)` dành cho lưới các VÙNG lớn (§10b), không dùng cho lưới thẻ thường."
                code={`<Grid.Base
  gap={3}
  columns={{ base: 2 }}
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {SCALE.map((step, index) => (
                        <Frame key={step.gap} width="32rem" label={step.name}>
                            <Grid.Base
                                showAnatomy={index === 0}
                                gap={step.gap}
                                columns={{ base: 2 }}
                                items={cellItems(MODULES.slice(0, 4))}
                            />
                        </Frame>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
