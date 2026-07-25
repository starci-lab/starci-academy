import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Label, Typography } from "@heroui/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Avatar as AtomAvatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography as AtomTypography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.Base` là KHUNG-BỌC tổng quát
 * của họ card — nó SỞ HỮU header section (`SurfaceCardHeader`: label/labelEnd/see-more/
 * action/subtleLabel), bộ slot `header`/`body`/`footer` (+ `children` = body rút gọn),
 * `description` ngoài card, và hai công tắc khung `bordered`/`flushContent`.
 *
 * Vì HEADER và SLOT là tài sản của khung-bọc này, mọi state của chúng nằm HẾT ở đây;
 * `.List`/`.Accordion` (cũng nhận `SurfaceLabelProps`) chỉ giữ MỘT leaf `WithLabel` để
 * chứng minh header bật được, KHÔNG lặp lại cả bộ.
 */
const meta: Meta<typeof SurfaceCard.Base> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Base",
    component: SurfaceCard.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Base>

/**
 * Fixture chuẩn (C-fixture) = ProfileCard (avatar + title + description). LƯU Ý:
 * `SurfaceCard.Base` tự vẽ khung surface (`rounded-3xl bg-surface` + shadow/border, §1a),
 * nên ở đây KHÔNG bọc thêm `Card`/`CardContent` ngoài — chỉ giữ row bên trong, tránh
 * card-in-card.
 */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Học fullstack, system design và DevOps theo lộ trình phỏng vấn.
            </span>
        </div>
    </div>
)

/** Skeleton mirror của ProfileRow — cùng khung, swap từng node sang Skeleton.*. */
const ProfileRowSkeleton = () => (
    <div className="flex items-center gap-3">
        <AtomAvatar.Base isSkeleton size="md" className="shrink-0" />
        <div className="flex min-w-0 grow flex-col">
            <AtomTypography size="sm" isSkeleton className="w-1/3" />
            <AtomTypography size="xs" isSkeleton className="w-2/3" />
        </div>
    </div>
)

/**
 * ANATOMY IS PER-LEAF: mỗi story bọc render của CHÍNH nó trong một BlockAnatomy riêng.
 * `SurfaceCard.Base` compose một `SurfaceCardHeader` TUỲ CHỌN (label/action/see-more —
 * file dùng chung, gắn nhãn bằng wrapper `data-anat-part` vì nó không có prop `anatPart`
 * riêng để thread), khung surface `Content` bọc body, và slot `Description` phía dưới.
 * `SurfaceCardHeader` + `Description` chỉ tồn tại như node ở những leaf thực sự render chúng.
 */
const BARE_PARTS: Array<AnatomyNode> = [
    { name: "Content", tier: "primitive", role: "khung bg-surface bọc body (khung, không mang chức năng)" },
]
const HEADER_PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCardHeader", tier: "primitive", role: "label + action/see-more/labelEnd bên phải" },
    { name: "Content", tier: "primitive", role: "khung bg-surface bọc body" },
]
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCardHeader", tier: "primitive", role: "label section" },
    { name: "Content", tier: "primitive", role: "khung bg-surface bọc body" },
    { name: "Description", tier: "primitive", role: "caption/prompt NGOÀI card, dưới Content" },
]
/** Ba slot CÓ TÊN chỉ dựng thành cột khi có `header` hoặc `footer` (children-only → DOM y như cũ). */
const SLOT_PARTS: Array<AnatomyNode> = [
    {
        name: "Content",
        tier: "primitive",
        role: "khung bg-surface bọc cột 3 slot",
        children: [
            { name: "Header", tier: "primitive", role: "slot trên trong khung (title row / toolbar)" },
            { name: "Body", tier: "primitive", role: "slot chính (`body`, hoặc `children` rút gọn)" },
            { name: "Footer", tier: "primitive", role: "slot dưới trong khung (CTA row / caption)" },
        ],
    },
]

/** Default — `children` là lối rút gọn của `body`: khung-BỌC nhận nội dung bất kỳ. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Default"
                parts={BARE_PARTS}
                reason="Khung bg-surface tổng quát của namespace SurfaceCard, với header section TÙY CHỌN baked-in — bỏ `label` thì render trần. Là khung-BỌC nên vẫn cho `children` (= `body` rút gọn); không có `header`/`footer` thì DOM đúng bằng một div surface bọc nội dung."
                code={`<SurfaceCard.Base>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

/** Slot CÓ TÊN — `header`/`body`/`footer` là đường chính của tầng khung (Layouts). */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Slots"
                parts={SLOT_PARTS}
                note="Có `header`/`footer` → khung dựng cột `flex flex-col gap-3` với đủ 3 slot. `body` thắng `children` khi truyền cả hai."
                code={`<SurfaceCard.Base
  header={<Typography type="body-sm" weight="medium">Hồ sơ</Typography>}
  body={<ProfileRow />}
  footer={<Button size="sm" variant="secondary">Xem hồ sơ</Button>}
/>`}
            >
                <SurfaceCard.Base
                    showAnatomy
                    header={<Typography type="body-sm" weight="medium">Hồ sơ</Typography>}
                    body={<ProfileRow />}
                    footer={<Button size="sm" variant="secondary">Xem hồ sơ</Button>}
                />
            </BlockAnatomy>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="WithLabel"
                parts={HEADER_PARTS}
                note="`label` bật SurfaceCardHeader NGOÀI (trên) khung surface, gap-3."
                code={`<SurfaceCard.Base label="Khoá của tôi">
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Khoá của tôi" showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="SeeMore"
                parts={HEADER_PARTS}
                note="`onSeeMore` → SurfaceCardHeader tự render SeeMoreLink thay cho labelEnd, cùng 1 node header."
                code={`<SurfaceCard.Base label="Khoá nổi bật" onSeeMore={() => {}}>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Khoá nổi bật" onSeeMore={() => {}} showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="LabelEnd"
                parts={HEADER_PARTS}
                note="`labelEnd` → tag muted bên phải (đơn vị/số lượng), không phải action."
                code={`<SurfaceCard.Base label="Học phí còn lại" labelEnd="VND">
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Học phí còn lại" labelEnd="VND" showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="WithAction"
                parts={HEADER_PARTS}
                note="`action` thắng `onSeeMore`/`labelEnd` — vẫn cùng slot phải của SurfaceCardHeader."
                code={`<SurfaceCard.Base
  label="Phương thức thanh toán"
  action={<Button variant="secondary" size="sm">Quản lý</Button>}
>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    label="Phương thức thanh toán"
                    action={<Button variant="secondary" size="sm">Quản lý</Button>}
                    showAnatomy
                >
                    <ProfileRow />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div className="p-8">
            {/* subtleLabel = a MINOR header (eyebrow) over a block, sitting UNDER a
                primary section Label — e.g. time-buckets under "Nhật ký luyện tập". */}
            <div className="flex flex-col gap-3">
                <Label>Nhật ký luyện tập</Label>
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="SubtleLabel"
                    parts={HEADER_PARTS}
                    note="`subtleLabel` → SurfaceCardHeader render label như eyebrow text-xs muted thay vì Label đậm, gap-2 thay gap-3 — cùng node."
                    code={`<SurfaceCard.Base label="Hôm nay" subtleLabel>
  <ProfileRow />
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Hôm nay" subtleLabel showAnatomy><ProfileRow /></SurfaceCard.Base>
                </BlockAnatomy>
                <SurfaceCard.Base label="Hôm qua" subtleLabel><ProfileRow /></SurfaceCard.Base>
                <SurfaceCard.Base label="Tuần trước" subtleLabel><ProfileRow /></SurfaceCard.Base>
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Description"
                parts={DESCRIPTION_PARTS}
                note="`description` render NGOÀI (dưới) Content, gap-2 — một caption/prompt, không phải chrome nội tại của Content."
                code={`<SurfaceCard.Base
  label="Nhiệm vụ tuần"
  description={<Typography type="body-xs" color="muted">Hoàn thành cả 3 để nhận thưởng.</Typography>}
>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    label="Nhiệm vụ tuần"
                    description={<Typography type="body-xs" color="muted">Hoàn thành cả 3 để nhận thưởng.</Typography>}
                    showAnatomy
                >
                    <ProfileRow />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            {/* surface-in-surface: a nested bordered card delineates with a BORDER, not a
                shadow that can render invisible against the parent surface (dark mode).
                Shown INSIDE a parent bg-surface panel so the point of `bordered` reads. */}
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="Bordered"
                    parts={HEADER_PARTS}
                    note="`bordered` → Content đổi border thay shadow (surface-in-surface), composition không đổi."
                    code={`<SurfaceCard.Base label="Câu hỏi" bordered>
  <ProfileRow />
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Câu hỏi" bordered showAnatomy><ProfileRow /></SurfaceCard.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `flushContent` — bỏ padding khung để một child TỰ SỞ HỮU mép (ảnh bìa, bảng full-bleed) sát viền. */
export const FlushContent: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="FlushContent"
                parts={HEADER_PARTS}
                note="`flushContent` → Content bỏ `p-3` và bật `overflow-hidden`; child tự lo padding của mình để mép ảnh/bảng bo theo khung."
                code={`<SurfaceCard.Base label="Khoá nổi bật" flushContent>
  <div className="h-28 bg-accent-soft" />
  <div className="p-3"><ProfileRow /></div>
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Khoá nổi bật" flushContent showAnatomy>
                    <div className="h-28 w-full bg-accent-soft" aria-hidden />
                    <div className="p-3"><ProfileRow /></div>
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Loading: khung-BỌC KHÔNG có cờ `isSkeleton` (nó không biết nội dung là gì) — caller
 * MIRROR cây thật: giữ nguyên header + khung Content, chỉ swap body sang mirror skeleton.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Loading"
                parts={HEADER_PARTS}
                note="Content vẫn là 1 node — bên trong caller swap ProfileRow sang ProfileRowSkeleton. Khung không sở hữu state loading (không có `isSkeleton`)."
                code={`<SurfaceCard.Base label="Khoá của tôi">
  <ProfileRowSkeleton />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Khoá của tôi" showAnatomy>
                    <ProfileRowSkeleton />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}
