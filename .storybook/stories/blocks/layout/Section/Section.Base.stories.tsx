import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRight } from "@gravity-ui/icons"
import { Section, type SectionGap } from "@sb-components/layouts/layout/Section/Section"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Section.Base` — khung của MỘT VÙNG trong trang: xếp `header` ↔ `body` ↔ `footer`
 * theo MỘT nhịp dọc (`gap`) và không làm gì khác. KHÔNG chrome: không nền, không viền,
 * không bo, không padding — mặt phẳng nằm BÊN TRONG nó (`SurfaceCard.*`/`SectionCard`).
 *
 * ⚠️ Đừng nhầm với `SectionCard` (tầng design, `blocks/cards/SectionCard`): thằng đó LÀ
 * một cái thẻ — có chrome HeroUI Card (viền + bo + padding), skin `accent`, dải
 * `withVerdict` theo DATA và `isSkeleton` riêng. `Section.Base` là khung TRẦN bao quanh.
 *
 * ⚠️ PHẠM VI STATE (§12f/§13): ở đây chỉ có state của CHÍNH khung — tổ hợp slot và thang
 * `gap`. Bộ slot của header (eyebrow/description/action/level) là tài sản của
 * `Section.Header`, xem story riêng; loading/empty/error là state của BLOCK bên trong
 * body, khung không sở hữu (nên không có cờ `isSkeleton`).
 */
const meta: Meta<typeof Section.Base> = {
    title: "Layouts/Layout/Section/Section.Base",
    component: Section.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Section.Base>

/** Fixture chuẩn (C-fixture) = ProfileCard — avatar + title + description trong một mặt card. */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar.Base name="StarCi Academy" size="md" />
        <div className="flex min-w-0 flex-col">
            <Typography.Base size="sm" text="StarCi Academy" weight="medium" truncate />
            <Typography.Base size="xs" text="Học fullstack, system design và DevOps theo lộ trình phỏng vấn." color="muted" truncate />
        </div>
    </div>
)

/** Body mẫu: vùng thường chứa một (hoặc nhiều) mặt card, không phải chữ trần. */
const CardBody = () => (
    <SurfaceCard.Base>
        <ProfileRow />
    </SurfaceCard.Base>
)

const HEADER_BODY_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "vùng trên — khung tự dựng Section.Header từ props" },
    { name: "Body", tier: "primitive", role: "vùng chính (`body`, hoặc `children` rút gọn)" },
]
const BODY_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Body", tier: "primitive", role: "vùng chính — `children` là lối rút gọn của `body`" },
]
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "vùng trên — ở leaf này là NODE tự do, không phải props Section.Header" },
    { name: "Body", tier: "primitive", role: "vùng chính" },
    { name: "Footer", tier: "primitive", role: "vùng dưới (CTA đóng vùng, caption, link xem thêm)" },
]

/** `children` = lối rút gọn của `body`: khung-BỌC nhận nội dung bất kỳ, không header. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Base"
                    tier="primitive"
                    leaf="Default"
                    parts={BODY_ONLY_PARTS}
                    reason="Khung của một VÙNG trong trang — chỉ xếp header/body/footer theo một nhịp dọc. Nó KHÔNG vẽ mặt phẳng (không nền/viền/bo/padding): mặt phẳng là `SurfaceCard.*` nằm TRONG body. Vì là khung-BỌC nên `children` vẫn hợp lệ (= `body` rút gọn, §13b)."
                    code={`<Section.Base>
  <SurfaceCard.Base><ProfileRow /></SurfaceCard.Base>
</Section.Base>`}
                >
                    <Section.Base showAnatomy>
                        <CardBody />
                    </Section.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `header` nhận PROPS của `Section.Header` — đường CHÍNH: khung tự dựng header. */
export const HeaderProps: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Base"
                    tier="primitive"
                    leaf="HeaderProps"
                    parts={HEADER_BODY_PARTS}
                    note="Truyền OBJECT `{ title, description, action… }` → khung render `Section.Header` bên trong, và `showAnatomy` chảy tiếp xuống nó."
                    code={`<Section.Base
  header={{
    title: "Khoá của tôi",
    description: "Sắp theo lần học gần nhất.",
    action: <Button.Base label="Xem tất cả" variant="ghost" size="sm" icon={ArrowRight} />,
  }}
>
  <SurfaceCard.Base><ProfileRow /></SurfaceCard.Base>
</Section.Base>`}
                >
                    <Section.Base
                        showAnatomy
                        header={{
                            title: "Khoá của tôi",
                            description: "Sắp theo lần học gần nhất.",
                            action: <Button.Base label="Xem tất cả" variant="ghost" size="sm" icon={ArrowRight} onPress={() => {}} />,
                        }}
                    >
                        <CardBody />
                    </Section.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Đủ 3 slot — `header` ở leaf này là NODE tự do (lối thoát khi header không do vùng tự viết). */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Base"
                    tier="primitive"
                    leaf="Slots"
                    parts={FULL_PARTS}
                    note="`header` chấp nhận CẢ node: dùng khi hàng trên là thứ khác (toolbar, tab row) chứ không phải tiêu đề. `body` thắng `children` khi truyền cả hai."
                    code={`<Section.Base
  header={<Section.Header level={3} title="Bài đã lưu" />}
  body={<SurfaceCard.Base><ProfileRow /></SurfaceCard.Base>}
  footer={<Typography.Base size="xs" text="Cập nhật 5 phút trước" color="muted" />}
/>`}
                >
                    <Section.Base
                        showAnatomy
                        header={<Section.Header level={3} title="Bài đã lưu" />}
                        body={<CardBody />}
                        footer={<Typography.Base size="xs" text="Cập nhật 5 phút trước" color="muted" />}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Một cột `gap` (§10c) để đối chiếu nhịp — mỗi mẫu là cùng composition, chỉ đổi token. */
const GapSample = ({ gap, note }: { gap: SectionGap; note: ReactNode }) => (
    <Section.Base
        gap={gap}
        header={{ level: 3, title: `gap=${gap}`, description: note }}
        body={<CardBody />}
    />
)

/**
 * `gap` — nhịp dọc giữa các vùng, ÉP theo thang §10c bằng union literal
 * (`0 · 1 · 2 · 3 · 6 · 8`). `gap-4`/`gap-5` là LỖI TYPE, không phải lỗi review.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex max-w-2xl flex-col gap-8">
                <BlockAnatomy
                    name="Section.Base"
                    tier="primitive"
                    leaf="Gaps"
                    parts={HEADER_BODY_PARTS}
                    note="Mặc định `6` (section) = nhịp giữa các vùng của trang; hạ xuống `3` (grouped) khi header chỉ là nhãn dán sát một danh sách. Off-scale bị TYPE chặn."
                    code={"<Section.Base gap={3} header={{ title: \"…\" }} body={…} />"}
                >
                    <Section.Base
                        showAnatomy
                        gap={6}
                        header={{ level: 3, title: "gap=6", description: "mặc định — nhịp giữa các VÙNG của trang." }}
                        body={<CardBody />}
                    />
                </BlockAnatomy>
                <GapSample gap={3} note="grouped — header dán sát một danh sách/khối." />
                <GapSample gap={2} note="related — header và body là cùng một cụm." />
                <GapSample gap={8} note="page — dải lớn nhất, dùng ở khung trang." />
            </div>
        </div>
    ),
}
