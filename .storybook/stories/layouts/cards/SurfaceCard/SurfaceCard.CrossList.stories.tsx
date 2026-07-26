import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (Layouts) — danh sách "brief" TĨNH các hàng CÓ DẤU (✓ / ✗ / none) trong một khung
 * `bg-surface` bounded với divider full-bleed: MỘT danh sách có thể trộn cả ✓ (gồm) lẫn ✗
 * (chưa gồm). Chỉ-đọc; muốn hàng BẤM ĐƯỢC thì dùng `SurfaceCard.List`.
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): là danh sách LẶP nên `items` BẮT BUỘC là dữ liệu
 * (cấm children). Story ở đây chỉ render state của CHÍNH nó: `mark` (check/cross/none),
 * `tone` (success/muted/danger), `variant`, và mirror `isSkeleton`.
 *
 * 2026-07-26 (thầy, BA TRỤC ĐỘC LẬP): `bordered?: boolean` → `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`, mặc định `"surface"`). Ánh xạ 1-1: `bordered=true` →
 * `variant="nested"`. Leaf trước đây tách riêng `Bordered` nay gộp thành MỘT leaf `Variant`
 * render đủ hai giá trị cạnh nhau (§ union side-by-side, cùng nếp với `MutedTone`).
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
 *
 * 2026-07-26 (thầy): bỏ hẳn prop `parts` (đường CŨ, `type AnatomyNode`) — leaf lặp
 * `CrossListItem` của khung này không có story riêng nên không có `storyId` THẬT; theo
 * luật whitelist mới của panel (chỉ nhận entry có `storyId` bấm-nhảy-được), khai `parts`/
 * `annotate` ở đây chỉ tạo ra một "dep" không bấm đi đâu được. Bỏ hẳn prop thay vì khai rỗng.
 */

export const Checks: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="primitive"
                leaf="Checks"
                reason="A marked (✓/✗) brief list inside a bounded bg-surface frame, reused by PricingTable/CourseCard for value-props. `mark` defaults to 'check', so an item only needs `text`."
                code={`<SurfaceCard.CrossList
  items={[
    { key: "projects", text: <Typography type="body-sm">Build 3 real-world projects…</Typography> },
    { key: "grading", text: <Typography type="body-sm">AI-graded assignments…</Typography> },
  ]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "projects", mark: "check", text: row("Build 3 real-world projects from scratch to deployment") },
                        { key: "grading", mark: "check", text: row("AI-graded assignments using real hiring checklists") },
                        { key: "mock", mark: "check", text: row("Unlimited mock interviews") },
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
                note="`mark='cross'` → XCircleIcon, default tone 'muted' (not included — recede, not a warning)."
                code={`<SurfaceCard.CrossList
  items={[{ key: "cert", mark: "cross", text: <Typography type="body-sm">No certificate…</Typography> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "cert", mark: "cross", text: row("No certificate to submit to employers") },
                        { key: "mentor", mark: "cross", text: row("No 1-on-1 mentor support") },
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
                note="One CrossList mixing both `mark: 'check'` and `mark: 'cross'` — mark lives on the ITEM, not the frame."
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
                        { key: "content", mark: "check", text: row("All 12 weeks of content + self-graded exercises") },
                        { key: "mock", mark: "check", text: row("Unlimited mock interviews") },
                        { key: "mentor", mark: "cross", text: row("Not included: 1-on-1 mentor review") },
                        { key: "referral", mark: "cross", text: row("Not included: job referral support") },
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
                note="`mark: 'none'` → the row renders no icon, only content — still the same composition (1 row = 1 part)."
                code={`<SurfaceCard.CrossList
  items={[{ key: "lang", mark: "none", text: <Typography type="body-sm">Know any programming language</Typography> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "lang", mark: "none", text: row("Know any programming language") },
                        { key: "node", mark: "none", text: row("A computer with Node.js installed") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `variant` — surface-in-surface (§1a). `"surface"` (mặc định) khi render THẲNG trên
 * `bg-background`; `"nested"` (border thay shadow) khi khung này lồng trong một mặt khác
 * (modal/drawer/panel).
 *
 * 2026-07-26 (thầy): gộp từ leaf `Bordered` cũ (chỉ render MỘT giá trị `bordered=true`)
 * thành MỘT leaf `Variant` render đủ union cạnh nhau — composition hàng không đổi giữa
 * hai giá trị, chỉ khung ngoài đổi.
 */
export const Variant: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">variant=&quot;surface&quot; (default) — shadow-surface, rendered directly on bg-background</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="primitive"
                    leaf="Variant / surface"
                    code={`<SurfaceCard.CrossList items={[…]} />`}
                >
                    <SurfaceCard.CrossList
                        showAnatomy
                        items={[
                            { key: "included", mark: "check", text: row("Included: full course content") },
                            { key: "excluded", mark: "cross", text: row("Not included: 1-on-1 mentor") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">variant=&quot;nested&quot; — border instead of shadow, when nested inside another surface</Typography>
                <div className="rounded-3xl bg-surface p-3 shadow-surface">
                    <BlockAnatomy
                        name="SurfaceCard.CrossList"
                        tier="primitive"
                        leaf="Variant / nested"
                        note={"`variant=\"nested\"` changes the outer frame (border instead of shadow) when nested in another surface — row composition stays the same."}
                        code={`<SurfaceCard.CrossList variant="nested" items={[…]} />`}
                    >
                        <SurfaceCard.CrossList
                            variant="nested"
                            showAnatomy
                            items={[
                                { key: "included", mark: "check", text: row("Included: full course content") },
                                { key: "excluded", mark: "cross", text: row("Not included: 1-on-1 mentor") },
                            ]}
                        />
                    </BlockAnatomy>
                </div>
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
                note="`tone: 'danger'` only changes the mark icon's color inside the row — composition (1 row = 1 part) stays the same."
                code={`<SurfaceCard.CrossList
  items={[{ key: "progress", mark: "cross", tone: "danger", text: <…/> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "progress", mark: "cross", tone: "danger", text: row("Lose all AI-graded assignment progress") },
                        { key: "mock", mark: "cross", tone: "danger", text: row("Lose unlimited mock interview access") },
                        { key: "mentor", mark: "cross", text: row("Not included: 1-on-1 mentor (unchanged)") },
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
                <Typography type="body-xs" color="muted">tone=&quot;success&quot; (default) — green check, an &quot;included&quot; signal</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="primitive"
                    leaf="MutedTone / success"
                    code={`<SurfaceCard.CrossList
  variant="nested"
  items={[{ key: "projects", mark: "check", text: <…/> }]}
/>`}
                >
                    <SurfaceCard.CrossList
                        variant="nested"
                        showAnatomy
                        items={[
                            { key: "projects", mark: "check", text: row("Build 3 real-world projects") },
                            { key: "grading", mark: "check", text: row("AI-graded assignments") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">tone=&quot;muted&quot; — faded check, text leads (value-props inside another card)</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="primitive"
                    leaf="MutedTone / muted"
                    note="`tone: 'muted'` only changes the icon color — composition stays the same as the success leaf above."
                    code={`<SurfaceCard.CrossList
  variant="nested"
  items={[{ key: "projects", mark: "check", tone: "muted", text: <…/> }]}
/>`}
                >
                    <SurfaceCard.CrossList
                        variant="nested"
                        showAnatomy
                        items={[
                            { key: "projects", mark: "check", tone: "muted", text: row("Build 3 real-world projects") },
                            { key: "grading", mark: "check", tone: "muted", text: row("AI-graded assignments") },
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
                note="`isSkeleton` → the frame self-generates `skeletonRows` rows in skeleton state (ignores `items`), same single part 'CrossListItem'."
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
