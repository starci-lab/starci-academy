import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (Layouts) — danh sách "brief" TĨNH các hàng CÓ DẤU (✓ / ✗ / none) trong một khung
 * `bg-surface` bounded với divider full-bleed: MỘT danh sách có thể trộn cả ✓ (gồm) lẫn ✗
 * (chưa gồm). Chỉ-đọc; muốn hàng BẤM ĐƯỢC thì dùng `SurfaceCard.List`.
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): là danh sách LẶP nên `items` BẮT BUỘC là dữ liệu
 * (cấm children). Story ở đây chỉ render state của CHÍNH nó: `mark` (check/cross/none),
 * `tone` (success/muted/danger), `bordered`, và mirror `isSkeleton`.
 */
const meta: Meta<typeof SurfaceCard.CrossList> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.CrossList",
    component: SurfaceCard.CrossList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.CrossList>

const row = (text: string) => <Typography type="body-sm">{text}</Typography>

/**
 * ANATOMY IS PER-LEAF: mỗi story bọc render của chính nó trong một BlockAnatomy riêng.
 * Khung này compose MỘT hàng lặp — `CrossListItem` — không drill xuống chỗ tách mark/body
 * bên trong hàng (đó là việc nội tại của hàng, không phải của khung). Cùng shape một-part ở
 * mọi leaf, kể cả `isSkeleton` (hàng vẫn render, chỉ ở state mirror).
 */
const CROSS_LIST_PARTS: Array<AnatomyNode> = [
    { name: "CrossListItem", tier: "primitive", role: "mỗi hàng (mark ✓/✗/none + nội dung, hoặc skeleton mirror)" },
]

export const Checks: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="Checks"
                parts={CROSS_LIST_PARTS}
                reason="Danh sách brief marked (✓/✗) trong khung bg-surface, bounded, dùng lại ở PricingTable/CourseCard cho value-props. `mark` mặc định là 'check' nên item chỉ cần `text`."
                code={`<SurfaceCard.CrossList
  items={[
    { key: "projects", text: <Typography type="body-sm">Xây 3 dự án thực chiến…</Typography> },
    { key: "grading", text: <Typography type="body-sm">Chấm bài bằng AI…</Typography> },
  ]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "projects", mark: "check", text: row("Xây 3 dự án thực chiến từ đầu đến khi triển khai") },
                        { key: "grading", mark: "check", text: row("Chấm bài bằng AI theo checklist tuyển dụng thật") },
                        { key: "mock", mark: "check", text: row("Mock interview không giới hạn số lần") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

export const Crosses: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="Crosses"
                parts={CROSS_LIST_PARTS}
                note="`mark='cross'` → XCircleIcon, tone mặc định 'muted' (chưa gồm — lùi lại, không phải cảnh báo)."
                code={`<SurfaceCard.CrossList
  items={[{ key: "cert", mark: "cross", text: <Typography type="body-sm">Không có chứng chỉ…</Typography> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "cert", mark: "cross", text: row("Không có chứng chỉ nộp cho nhà tuyển dụng") },
                        { key: "mentor", mark: "cross", text: row("Không hỗ trợ 1-1 với mentor") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Lý do gộp: MỘT danh sách trộn cả hàng gồm (✓) lẫn hàng chưa gồm (✗). */
export const Mixed: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="Mixed"
                parts={CROSS_LIST_PARTS}
                note="Một CrossList trộn cả `mark: 'check'` và `mark: 'cross'` — mark sống trên ITEM, không phải trên khung."
                code={`<SurfaceCard.CrossList
  items={[
    { key: "content", mark: "check", text: <…/> },
    { key: "mentor", mark: "cross", text: <…/> },
  ]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "content", mark: "check", text: row("Toàn bộ 12 tuần nội dung + bài tập tự chấm") },
                        { key: "mock", mark: "check", text: row("Mock interview không giới hạn") },
                        { key: "mentor", mark: "cross", text: row("Chưa gồm 1-1 review với mentor") },
                        { key: "referral", mark: "cross", text: row("Chưa gồm hỗ trợ giới thiệu việc làm") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `mark="none"` — hàng trơn (vd một điều kiện tiên quyết, KHÔNG phải thành tích nên không tick). */
export const NoMark: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="NoMark"
                parts={CROSS_LIST_PARTS}
                note="`mark: 'none'` → hàng không render icon, chỉ còn nội dung — vẫn cùng composition (1 hàng = 1 part)."
                code={`<SurfaceCard.CrossList
  items={[{ key: "lang", mark: "none", text: <Typography type="body-sm">Biết một ngôn ngữ lập trình bất kỳ</Typography> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "lang", mark: "none", text: row("Biết một ngôn ngữ lập trình bất kỳ") },
                        { key: "node", mark: "none", text: row("Máy tính cài được Node.js") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Bordered — surface-in-surface (lồng trong modal/drawer/panel): border thay shadow. */
export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="primitive"
                    leaf="Bordered"
                    parts={CROSS_LIST_PARTS}
                    note="`bordered` đổi khung (border thay shadow) khi lồng trong surface khác — composition hàng không đổi."
                    code={`<SurfaceCard.CrossList
  bordered
  items={[…]}
/>`}
                >
                    <SurfaceCard.CrossList
                        bordered
                        showAnatomy
                        items={[
                            { key: "included", mark: "check", text: row("Gồm: toàn bộ nội dung khoá") },
                            { key: "excluded", mark: "cross", text: row("Chưa gồm: mentor 1-1") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * `tone="danger"` — mark ĐỎ cho hàng tiêu cực CỨNG (mất/chặn/cảnh báo thật), khác cross muted
 * "chỉ là chưa gồm". Cùng element mark, chỉ leo TONE (§2d) — vd danh sách hậu quả khi huỷ gói.
 */
export const DangerTone: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="DangerTone"
                parts={CROSS_LIST_PARTS}
                note="`tone: 'danger'` chỉ đổi màu icon mark bên trong hàng — composition (1 hàng = 1 part) không đổi."
                code={`<SurfaceCard.CrossList
  items={[{ key: "progress", mark: "cross", tone: "danger", text: <…/> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "progress", mark: "cross", tone: "danger", text: row("Mất toàn bộ tiến độ chấm bài bằng AI") },
                        { key: "mock", mark: "cross", tone: "danger", text: row("Mất quyền mock interview không giới hạn") },
                        { key: "mentor", mark: "cross", text: row("Chưa gồm: mentor 1-1 (như cũ)") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `tone="muted"` — check MỜ đi để chữ dẫn (dùng cho value-props NẰM TRONG card khác, vd CourseCard):
 * tránh nhiễu sắc khi card đã có điểm nổi khác (giá/CTA). So với `tone="success"` (mặc định, xanh — tín
 * hiệu "gồm" thật, như PricingTable). Xem `principles.md` §2.
 */
export const MutedTone: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">tone=&quot;success&quot; (mặc định) — tick xanh, tín hiệu &quot;gồm&quot;</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="primitive"
                    leaf="MutedTone / success"
                    parts={CROSS_LIST_PARTS}
                    code={`<SurfaceCard.CrossList
  bordered
  items={[{ key: "projects", mark: "check", text: <…/> }]}
/>`}
                >
                    <SurfaceCard.CrossList
                        bordered
                        showAnatomy
                        items={[
                            { key: "projects", mark: "check", text: row("Xây 3 dự án thực chiến") },
                            { key: "grading", mark: "check", text: row("Chấm bài bằng AI") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">tone=&quot;muted&quot; — tick mờ, chữ dẫn (value-props trong card)</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="primitive"
                    leaf="MutedTone / muted"
                    parts={CROSS_LIST_PARTS}
                    note="`tone: 'muted'` chỉ đổi màu icon — composition không đổi so với leaf success ở trên."
                    code={`<SurfaceCard.CrossList
  bordered
  items={[{ key: "projects", mark: "check", tone: "muted", text: <…/> }]}
/>`}
                >
                    <SurfaceCard.CrossList
                        bordered
                        showAnatomy
                        items={[
                            { key: "projects", mark: "check", tone: "muted", text: row("Xây 3 dự án thực chiến") },
                            { key: "grading", mark: "check", tone: "muted", text: row("Chấm bài bằng AI") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `isSkeleton` — `skeletonRows` hàng mirror (chấm tròn + vạch chữ) trong lúc danh sách chưa tải xong. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="Loading"
                parts={CROSS_LIST_PARTS}
                note="`isSkeleton` → khung tự sinh `skeletonRows` hàng ở state skeleton (bỏ qua `items`), cùng 1 part 'CrossListItem'."
                code={`<SurfaceCard.CrossList
  items={[]}
  isSkeleton
/>`}
            >
                <SurfaceCard.CrossList items={[]} isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
