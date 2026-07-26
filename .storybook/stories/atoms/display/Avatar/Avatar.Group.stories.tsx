import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, type AvatarSize } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Avatar.Group`: hàng avatar chồng mép ("who follows") + chip "+N".
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). `items`/mapping là leaf `Default` (trần, chưa bật
 * prop nào có hình). `max` và `total` CÙNG đẻ ra một hình — chip "+N" — nên đi
 * chung leaf `Overflow` thay vì tách đôi (giống ngoại lệ chấm ở `Chip.Base`, nơi
 * `dotColor`/`dotClassName` cũng gộp một leaf vì cùng một hình). `size` đặt ở CẤP
 * CỤM nên có leaf riêng `Sizes`. `isSkeleton` là ngoại lệ đúng luật: leaf của nó
 * render lại đúng HÌNH mà atom sinh ra khi đang tải — cả hàng mirror, giữ nguyên
 * footprint.
 *
 * ⛔ KHÔNG có leaf `Status`/`Colors`/`Fallback`: đó là state của member
 * `Avatar.Base`, cụm này không lặp lại (§12f) — bấm vào part `Avatar` ở tab Deps
 * để nhảy sang đúng chỗ những state đó sống.
 *
 * ⭐ DEPS thật: `Avatar.Group` `import { AvatarBase }` để dựng từng avatar — component
 * DUY NHẤT trong họ Avatar có deps, nên annotate part `Avatar` với storyId nhảy
 * sang `Avatar.Base`.
 */

// Stable local data-URI "photo" so image avatars render without an external host.
const PHOTO = (hue: number) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='hsl(${hue}%2C60%25%2C55%25)'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E`

const members = [
    { key: "minh.tran", name: "Noah Mitchell", src: PHOTO(210) },
    { key: "lan.pham", name: "Ava Parker", src: PHOTO(320) },
    { key: "hoang.le", name: "Liam Harper" },
    { key: "an.nguyen", name: "Emma Nelson" },
    { key: "thu.vo", name: "Mia Vaughn" },
    { key: "khoa.dinh", name: "Lucas Dean" },
]

/** ĐỦ union `AvatarSize` (§12d — size đặt ở CẤP CỤM, item không mang size riêng). */
const SIZES: Array<{ size: AvatarSize; hint: string }> = [
    { size: "sm", hint: "compact — table rows, comment threads" },
    { size: "md", hint: "default — cards, panels" },
    { size: "lg", hint: "hero — profile headers" },
]

/**
 * `Avatar` = một member chồng mép (lặp ×N, có story riêng để nhảy tới).
 * `Overflow` chỉ có HÌNH ở leaf `Overflow` nên không cần `storyId` — chưa có
 * story nào là chính chip "+N" đó để nhảy sang.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Avatar: {
        storyId: "atoms-display-avatar-avatar-base--default",
        tier: "atom",
        role: "One Avatar.Base per person, overlapped — the ring separates it from the one beneath.",
    },
    Overflow: {
        tier: "atom",
        role: "The \"+N\" chip counts the rest. It is a number, not a person, so it is not an Avatar.Base.",
    },
}

const meta: Meta<typeof Avatar.Group> = {
    title: "Atoms/Display/Avatar/Avatar.Group",
    component: Avatar.Group,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Avatar.Group>

/** Leaf TRẦN — `items` map thẳng ra hàng, chưa bật `max`/`total`/`size`/`isSkeleton`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Default"
                annotate={ANNOTATE}
                reason="The overlapping row is a MEMBER of the Avatar atom (§13c), not its own scaffold — the group builds every Avatar.Base itself from `items`; callers never pass children."
                note="Each avatar rides a ring-2 ring-background so it separates from the one underneath. No cap, no cut — four people fit, so no '+N' chip shows up."
                code={"<Avatar.Group items={[{ key: \"u1\", name: \"Noah\", src: \"…\" }, …]} />"}
            >
                <Avatar.Group items={members.slice(0, 4)} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf props `max` / `total` — HAI đường ra CÙNG MỘT hình (chip "+N"), nên gộp
 * chung một leaf thay vì tách đôi (song song với chấm ở `Chip.Base`).
 */
export const Overflow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Props `max` / `total`"
                annotate={ANNOTATE}
                reason="The '+N' chip is a count, not a face, and it has two different triggers. `max` cuts a row you already hold in full. `total` covers the page-one case — you only fetched a handful of members but the server told you the real count."
                note="Both roads land on the exact same Overflow chip; nothing distinguishes which one fired. That is by design — the reader only needs to know more exist, not why."
                code={`<Avatar.Group max={3} items={/* 6 members */} />
<Avatar.Group items={/* first 4 loaded */} total={12} />`}
            >
                <div className="flex flex-wrap items-start gap-10">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted">max=3 on a six-person row</p>
                        <Avatar.Group max={3} items={members} showAnatomy />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted">total=12, only 4 loaded</p>
                        <Avatar.Group items={members.slice(0, 4)} total={12} />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — CẤP CỤM (§12d), cả hàng luôn đồng cỡ. ĐỦ union 3 bậc. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Size lives on the group, not the member — a row of mismatched avatars would read as a layout bug, not a feature. `Avatar.Base` itself never sees a size prop from here; the group hands the same value to every one it builds."
                note="All three tiers share the exact same DOM shape (row of rings + optional chip), so they live in one leaf instead of three."
                code={`<Avatar.Group size="sm" items={[…]} />
<Avatar.Group size="md" items={[…]} />
<Avatar.Group size="lg" items={[…]} />`}
            >
                <div className="flex flex-col gap-4">
                    {SIZES.map(({ size }, index) => (
                        <Avatar.Group key={size} size={size} items={members.slice(0, 3)} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — ngoại lệ đúng luật §12g: render lại đúng HÌNH mà chính
 * prop này sinh ra khi tải. Group không tự vẽ shimmer riêng, nó chuyển `isSkeleton`
 * xuống từng `Avatar.Base` nên mỗi slot mirror thành vòng tròn, giữ nguyên footprint.
 *
 * Hai ca: hàng KHÔNG dư (4/4, không chip) và hàng CÓ dư (`max` cắt bớt, `extra >
 * 0`) — ca sau mới lộ ra chip "+N" cũng phải shimmer (§D: một mẩu số thật lọt
 * giữa hàng đang tải là lỗi), không được để "+2" hiện chữ thật lúc loading.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="The group does not own a shimmer shape of its own — it flips isSkeleton down to every Avatar.Base it builds, so the whole row mirrors as circles instead of growing a separate loading component to keep in sync. The overflow chip mirrors too, so no real count sneaks into a loading row."
                note="Left: 4 of 4, no overflow, row of plain circles. Right: max=4 on a six-person row — the '+2' chip that would normally show a real number is a matching circle shimmer instead, same size and ring as every avatar slot."
                code={`<Avatar.Group isSkeleton items={/* 4 members */} />
<Avatar.Group isSkeleton max={4} items={/* 6 members */} />`}
            >
                <div className="flex flex-wrap items-start gap-10">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted">no overflow</p>
                        <Avatar.Group isSkeleton items={members.slice(0, 4)} showAnatomy />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted">max=4, extra=2</p>
                        <Avatar.Group isSkeleton max={4} items={members} />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
