import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { RocketLaunchIcon } from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { PressableCard } from "./index"

const meta: Meta<typeof PressableCard> = {
    title: "Core/Card/PressableCard",
    component: PressableCard,
}

export default meta

type Story = StoryObj<typeof PressableCard>

/**
 * Generic navigation-tile content — icon + title + subtitle. The leading icon is
 * a real {@link IconTile} (this row represents ONE object — a course roadmap —
 * per the biz→ui lookup "leading của row = 1 đối tượng → IconTile"), not a
 * hand-rolled emoji circle (emoji are banned from UI copy either way).
 */
const NavTileContent = () => (
    <div className="flex items-center gap-3">
        <IconTile size="sm" icon={<RocketLaunchIcon />} />
        <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
                Lộ trình Fullstack Mastery
            </span>
            <span className="text-xs text-muted">
                12 module · 48 bài học
            </span>
        </div>
    </div>
)

/** Generic option-card content — used for "pick a card" demos. */
const OptionCardContent = ({ label, price }: { label: string; price: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted">{price}</span>
    </div>
)

/**
 * PROTOTYPE của biến thể "link-card" sắp thêm vào PressableCard (dựng tay tại story để
 * chốt HÌNH trước, chưa bake prop `title`/`subtitle`/`hover="underline"` vào component
 * thật). Cả card là MỘT đích điều hướng — `router.push` sang trang khác; hover cả card
 * thì GẠCH CHÂN label (bản chất là một liên kết) và KHÔNG tô nền; không có CTA
 * "Đọc→/Ôn→" trailing. Giữ `shadow-surface` lúc nghỉ để vẫn đọc là card.
 */
const LinkCardPrototype = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <button
        type="button"
        onClick={() => {}}
        className="group block w-full cursor-pointer rounded-3xl bg-surface px-4 py-3 text-left shadow-surface outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
        <div className="flex flex-col gap-0">
            <Typography type="body-sm" className="group-hover:underline">
                {title}
            </Typography>
            <Typography type="body-xs" color="muted">
                {subtitle}
            </Typography>
        </div>
    </button>
)

/** Dùng cho ô điều hướng bấm được (vào lộ trình, mở khóa học) — bấm là chuyển màn ngay, không phải chọn lựa. */
export const Default: Story = {
    parameters: {
        usage: "Dùng cho ô điều hướng bấm được (vào lộ trình, mở khóa học) — bấm là chuyển màn ngay, không phải chọn lựa.",
    },
    args: {
        onPress: () => {},
        children: <NavTileContent />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Cả card chỉ có MỘT đích bấm duy nhất, không nút con nào bên trong. Chữ trong children chính là tên đọc được của card nên không cần truyền label — chỉ truyền khi card không có chữ nào (tile chỉ icon).
                </Typography>
            </div>
            <PressableCard {...args} />
        </div>
    ),
}

/** PROTOTYPE link-card (chờ chốt hình rồi mới bake vào PressableCard): cả card = đích `router.push`, hover gạch chân label, không tô nền, không CTA trailing. */
export const LinkCard: Story = {
    parameters: {
        usage: "PROTOTYPE link-card (chưa bake vào component) — cả card là MỘT đích điều hướng, bấm là router.push sang trang khác; di chuột vào card thì gạch chân tiêu đề (bản chất nó là một liên kết), KHÔNG tô nền, KHÔNG có CTA Đọc/Ôn trailing. Chốt hình xong sẽ thêm prop title/subtitle/hover=\"underline\" vào PressableCard.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Link card (hover gạch chân)</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi cả card chỉ để điều hướng sang một trang khác (bài đọc, lộ trình) — di chuột vào card thì gạch chân tiêu đề để lộ rõ nó là liên kết, không cần nút CTA riêng.
                </Typography>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <LinkCardPrototype title="Vì sao học viên bỏ dở khoá học?" subtitle="12.4k lượt đọc" />
                <LinkCardPrototype title="Lộ trình trở thành Senior Backend" subtitle="9.1k lượt đọc" />
            </div>
        </div>
    ),
}

/**
 * Card điều hướng NHƯNG có nút riêng bên trong (vd card tiến độ khóa học: bấm card = mở
 * khóa, nút "Tiếp tục" = vào đúng bài đang dở, nút "…" = menu). Truyền qua `actions` +
 * `label` → card chuyển sang pattern **stretched-link**: cả card là 1 overlay trong suốt
 * phủ lên (bấm-cả-card), 2 nút nằm ĐÈ LÊN overlay (source-order + z-10) nên bấm độc lập.
 * KHÔNG lồng `<button>` trong `<button>`/`<a>` (HTML sai + hỏng focus order + là nguyên
 * nhân card bị CAO khi nhét 2 nút vào children như cách cũ). Ref Inclusive Components /
 * Adrian Roselli.
 */
export const WithActions: Story = {
    name: "With actions (2 buttons inside)",
    parameters: {
        usage: "Card bấm-được có nút riêng bên trong (card tiến độ: bấm card mở khóa, nút Tiếp tục vào bài dở). Dùng `actions` + `label` → stretched-link: overlay phủ cả card + nút đè lên (z-10), bấm độc lập, KHÔNG lồng interactive, không bị cao.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có nút riêng</Label>
                <Typography type="body-sm" color="muted">
                    Chọn state này khi card cần đích bấm THỨ HAI hành động độc lập với cú bấm cả-card — nút Tiếp tục nhảy thẳng vào bài đang dở, còn bấm card thì mở trang khóa. Nút chỉ lặp lại đúng đích của card thì bỏ đi, để card làm.
                </Typography>
            </div>
            <PressableCard
                onPress={() => {}}
                label="Mở lộ trình Fullstack Mastery"
                actions={(
                    <>
                        <Button size="sm" variant="secondary" onPress={() => {}}>
                            Tiếp tục
                        </Button>
                        <Button size="sm" variant="tertiary" isIconOnly aria-label="Thêm tùy chọn" onPress={() => {}}>
                            ⋯
                        </Button>
                    </>
                )}
            >
                <NavTileContent />
            </PressableCard>
        </div>
    ),
}

/** Dùng khi lựa chọn đó tạm thời không khả dụng (gói hết slot) — vẫn hiện để user biết nó tồn tại, nhưng chặn bấm + tắt hover. */
export const Disabled: Story = {
    parameters: {
        usage: "Dùng khi lựa chọn đó tạm thời không khả dụng (gói hết slot) — vẫn hiện để user biết nó tồn tại, nhưng chặn bấm + tắt hover.",
    },
    args: {
        isDisabled: true,
        onPress: () => {},
        children: <OptionCardContent label="Gói 12 tháng (đã hết slot)" price="3.490.000đ" />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không khả dụng</Label>
                <Typography type="body-sm" color="muted">
                    State này chỉ dành cho card hành động có onPress; card điều hướng bằng href không tắt được bằng isDisabled mà phải gỡ href. Card vẫn đọc được đầy đủ, chỉ mờ đi, nên lý do không bấm được phải nằm trong chữ của children (ở đây là "đã hết slot"), đừng để mắt tự đoán qua độ mờ.
                </Typography>
            </div>
            <PressableCard {...args} />
        </div>
    ),
}
