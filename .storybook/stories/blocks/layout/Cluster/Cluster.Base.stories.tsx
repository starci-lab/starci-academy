import type { Meta, StoryObj } from "@storybook/nextjs"
import { Cluster } from "@sb-components/blocks/layout/Cluster/Cluster"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `Cluster.Base` là KHUNG DANH SÁCH LẶP — hàng tràn dòng của N phần
 * tử CÙNG KIỂU (chip/tag/nút). State nó sinh ra = `gap` (§10), `justify`, `align`.
 * `wrap` KHÔNG phải state ở đây: cluster LUÔN tràn dòng (đó là định nghĩa của nó) —
 * hàng có-thể-không-wrap là `Stack.H`. Danh sách RỖNG chỉ ra track rỗng: câu chữ
 * "chưa có gì" thuộc về caller, không phải về khung (§13 — khung không mang nội dung).
 */
const meta: Meta<typeof Cluster.Base> = {
    title: "Layouts/Layout/Cluster/Cluster.Base",
    component: Cluster.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Cluster.Base>

const ITEM_PARTS: Array<AnatomyNode> = [
    { name: "Item", tier: "primitive", role: "một phần tử của danh sách lặp — đến từ `items` DỮ LIỆU, không phải children" },
]

/** Danh sách DỮ LIỆU — `items`, không phải JSX con (§13b). */
const TAGS = ["Docker", "Kubernetes", "CI/CD", "Terraform", "Observability", "GitOps", "Helm"]

const tagItems = (tags: ReadonlyArray<string>) =>
    tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))

/** Sáu nấc HỢP LỆ của §10 — `gap` là union literal nên không có nấc thứ bảy. */
const SCALE = [
    { gap: 0, name: "flush (0)" },
    { gap: 1, name: "tight (1)" },
    { gap: 2, name: "related (2)" },
    { gap: 3, name: "grouped (3)" },
    { gap: 6, name: "section (6)" },
    { gap: 8, name: "page (8)" },
] as const

/** Default — hàng chip tràn dòng ở seam `related(2)`: nhịp chuẩn của một cụm cùng loại. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="primitive"
                leaf="Default"
                parts={ITEM_PARTS}
                reason="Nội dung là N phần tử CÙNG KIỂU lặp lại ⇒ theo test §13b, API là `items` DỮ LIỆU và CẤM `children` — children sẽ cho phép lén một node lạc loài vào một hàng mà tiền đề là đồng nhất. `gap` áp cho cả hai trục nên các dòng đã tràn cũng cách đều."
                code={`<Cluster.Base
  gap={2}
  items={tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))}
/>`}
            >
                <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                    <Cluster.Base showAnatomy gap={2} items={tagItems(TAGS)} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Gaps — LÝ DO khung này tồn tại: `gap` nhận ĐÚNG sáu nấc `0·1·2·3·6·8` (§10c) và
 * BẮT BUỘC; `gap={4}` là LỖI BIÊN DỊCH. Với cụm chip, `related(2)` là nấc đúng.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="primitive"
                leaf="Gaps"
                parts={ITEM_PARTS}
                note="Nấc lớn (6/8) làm cụm rã ra thành các phần tử rời — đó là tín hiệu sai cho một cụm CÙNG loại; để đây để thấy vì sao thang có nấc chứ không phải số tuỳ ý."
                code={`<Cluster.Base
  gap={2}
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {SCALE.map((step, index) => (
                        <div key={step.gap} className="flex flex-col gap-2">
                            <Typography.Xs text={step.name} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Cluster.Base showAnatomy={index === 0} gap={step.gap} items={tagItems(TAGS.slice(0, 4))} />
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Justify — phân bố các phần tử trên MỖI dòng. `start` (mặc định) là mặc định đọc
 * tự nhiên; `between` chỉ hợp lý khi cụm phủ trọn bề ngang.
 */
export const Justify: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="primitive"
                leaf="Justify"
                parts={ITEM_PARTS}
                note="Ít phần tử để còn chỗ trống mà đọc được phân bố; `between` áp cho TỪNG dòng, nên với cụm đã tràn dòng thì dòng cuối sẽ trông lệch — đó là hành vi của flexbox, không phải lỗi khung."
                code={`<Cluster.Base
  gap={2}
  justify="between"
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {(["start", "center", "end", "between"] as const).map((justify, index) => (
                        <div key={justify} className="flex flex-col gap-2">
                            <Typography.Xs text={justify} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Cluster.Base
                                    showAnatomy={index === 0}
                                    gap={2}
                                    justify={justify}
                                    items={tagItems(TAGS.slice(0, 3))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
