import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Label, Typography } from "@heroui/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Avatar as AtomAvatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography as AtomTypography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.Base` là KHUNG-BỌC tổng quát
 * của họ card — nó SỞ HỮU header section (`SurfaceCardHeader`: label/labelEnd/see-more/
 * action/subtleLabel), bộ slot `header`/`body`/`footer` (+ `children` = body rút gọn),
 * `description` ngoài card, và HAI trục khung `variant`/`padding`.
 *
 * Vì HEADER và SLOT là tài sản của khung-bọc này, mọi state của chúng nằm HẾT ở đây;
 * `.List`/`.Accordion` (cũng nhận `SurfaceLabelProps`) chỉ giữ MỘT leaf `WithLabel` để
 * chứng minh header bật được, KHÔNG lặp lại cả bộ.
 *
 * 2026-07-26 (thầy, BA TRỤC ĐỘC LẬP): `bordered?: boolean` → `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`), `flushContent?: boolean` → `padding?: SpaceScale`. Hai leaf
 * đơn-giá-trị cũ (`Bordered`, `FlushContent`) gộp thành hai leaf mang TÊN PROP (`Variant`,
 * `Padding`), mỗi leaf render đủ union cạnh nhau thay vì chỉ mỗi giá trị lệch mặc định.
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
                Learn fullstack, system design, and DevOps on an interview-prep track.
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

/** Default — `children` là lối rút gọn của `body`: khung-BỌC nhận nội dung bất kỳ. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Default"
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
                note="Có `header`/`footer` → khung dựng cột `flex flex-col gap-3` với đủ 3 slot. `body` thắng `children` khi truyền cả hai."
                code={`<SurfaceCard.Base
  header={<Typography type="body-sm" weight="medium">Profile</Typography>}
  body={<ProfileRow />}
  footer={<Button size="sm" variant="secondary">View profile</Button>}
/>`}
            >
                <SurfaceCard.Base
                    showAnatomy
                    header={<Typography type="body-sm" weight="medium">Profile</Typography>}
                    body={<ProfileRow />}
                    footer={<Button size="sm" variant="secondary">View profile</Button>}
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
                note="`label` bật SurfaceCardHeader NGOÀI (trên) khung surface, gap-3."
                code={`<SurfaceCard.Base label="My courses">
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="My courses" showAnatomy><ProfileRow /></SurfaceCard.Base>
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
                note="`onSeeMore` → SurfaceCardHeader tự render SeeMoreLink thay cho labelEnd, cùng 1 node header."
                code={`<SurfaceCard.Base label="Featured courses" onSeeMore={() => {}}>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Featured courses" onSeeMore={() => {}} showAnatomy><ProfileRow /></SurfaceCard.Base>
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
                note="`labelEnd` → tag muted bên phải (đơn vị/số lượng), không phải action."
                code={`<SurfaceCard.Base label="Remaining tuition" labelEnd="VND">
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Remaining tuition" labelEnd="VND" showAnatomy><ProfileRow /></SurfaceCard.Base>
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
                note="`action` thắng `onSeeMore`/`labelEnd` — vẫn cùng slot phải của SurfaceCardHeader."
                code={`<SurfaceCard.Base
  label="Payment method"
  action={<Button variant="secondary" size="sm">Manage</Button>}
>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    label="Payment method"
                    action={<Button variant="secondary" size="sm">Manage</Button>}
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
                primary section Label — e.g. time-buckets under "Practice log". */}
            <div className="flex flex-col gap-3">
                <Label>Practice log</Label>
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="SubtleLabel"
                    note="`subtleLabel` → SurfaceCardHeader render label như eyebrow text-xs muted thay vì Label đậm, gap-2 thay gap-3 — cùng node."
                    code={`<SurfaceCard.Base label="Today" subtleLabel>
  <ProfileRow />
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Today" subtleLabel showAnatomy><ProfileRow /></SurfaceCard.Base>
                </BlockAnatomy>
                <SurfaceCard.Base label="Yesterday" subtleLabel><ProfileRow /></SurfaceCard.Base>
                <SurfaceCard.Base label="Last week" subtleLabel><ProfileRow /></SurfaceCard.Base>
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
                note="`description` render NGOÀI (dưới) Content, gap-2 — một caption/prompt, không phải chrome nội tại của Content."
                code={`<SurfaceCard.Base
  label="Weekly quest"
  description={<Typography type="body-xs" color="muted">Complete all three to earn the reward.</Typography>}
>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    label="Weekly quest"
                    description={<Typography type="body-xs" color="muted">Complete all three to earn the reward.</Typography>}
                    showAnatomy
                >
                    <ProfileRow />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `variant` — trục ĐỘC LẬP đầu tiên (§1a): `"surface"` (mặc định) tự có nền + shadow
 * khi đứng TRỰC TIẾP trên `bg-background`; `"nested"` đổi sang border khi mặt này nằm
 * TRONG một mặt cha khác (shadow gần như vô hình chồng lên shadow của cha, nhất là
 * dark mode). Gộp từ hai leaf đơn-giá-trị cũ (`Default` ngầm định `surface`, `Bordered`)
 * thành MỘT leaf `Variant` render cả hai giá trị cạnh nhau.
 *
 * 2026-07-26 (thầy): đổi từ `bordered?: boolean` (`bordered=true` → `variant="nested"`).
 */
export const Variant: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard.Base label="Questions" variant="surface">
                    <ProfileRow />
                </SurfaceCard.Base>
            </div>
            <div className="w-72 rounded-3xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="Variant"
                    note={"`variant=\"nested\"` (phải, trong khung cha bg-surface) đổi Content sang border thay shadow (surface-in-surface, §1a); `variant=\"surface\"` (trái, mặc định) tự có shadow khi đứng trực tiếp trên nền — composition không đổi."}
                    code={`<SurfaceCard.Base label="Questions" variant="nested">
  <ProfileRow />
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Questions" variant="nested" showAnatomy>
                        <ProfileRow />
                    </SurfaceCard.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * `padding` — trục ĐỘC LẬP thứ hai, thang §10c. Mặc định `3` đệm chuẩn quanh nội
 * dung; `padding={0}` bỏ đệm (vẫn giữ `overflow-hidden`) để một child TỰ SỞ HỮU
 * mép (ảnh bìa, bảng full-bleed) sát viền. Gộp từ hai leaf đơn-giá-trị cũ (`Default`
 * ngầm định `3`, `FlushContent`) thành MỘT leaf `Padding` render cả hai cạnh nhau.
 *
 * 2026-07-26 (thầy): đổi từ `flushContent?: boolean` (`flushContent=true` →
 * `padding={0}`). Trục ĐỘC LẬP với `variant` — một thẻ `nested` VÀ `padding={0}`
 * là tổ hợp có thật (ảnh tràn viền trong thẻ lồng), gộp chung sẽ giết tổ hợp đó.
 */
export const Padding: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard.Base label="Featured course" padding={3}>
                    <ProfileRow />
                </SurfaceCard.Base>
            </div>
            <div className="w-72">
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="Padding"
                    note="`padding={0}` (phải) bỏ `p-3` và bật `overflow-hidden`; child tự lo padding của mình để mép ảnh/bảng bo theo khung. `padding={3}` (trái, mặc định) đệm chuẩn — hai giá trị dùng nhiều nhất của thang §10c cho trục này."
                    code={`<SurfaceCard.Base label="Featured course" padding={0}>
  <div className="h-28 bg-accent-soft" />
  <div className="p-3"><ProfileRow /></div>
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Featured course" padding={0} showAnatomy>
                        <div className="h-28 w-full bg-accent-soft" aria-hidden />
                        <div className="p-3"><ProfileRow /></div>
                    </SurfaceCard.Base>
                </BlockAnatomy>
            </div>
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
                note="Content vẫn là 1 node — bên trong caller swap ProfileRow sang ProfileRowSkeleton. Khung không sở hữu state loading (không có `isSkeleton`)."
                code={`<SurfaceCard.Base label="My courses">
  <ProfileRowSkeleton />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="My courses" showAnatomy>
                    <ProfileRowSkeleton />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}
