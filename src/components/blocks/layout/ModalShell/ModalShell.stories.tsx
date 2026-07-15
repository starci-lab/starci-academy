import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Input, Label, ScrollShadow, Tabs, TextField, Typography } from "@heroui/react"

import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { ModalShell } from "./index"

const meta: Meta<typeof ModalShell> = {
    title: "Core/Layout/ModalShell",
    component: ModalShell,
}
export default meta
type Story = StoryObj<typeof ModalShell>

/**
 * Spacing inside modal (ba tầng):
 * 1. header→body — do ModalShell: plain = gap-4; category tabs (first child =
 *    Tabs/TabBar) = `bodyStartsWithTabs` → gap-3. Không áp cho TabsCard pill
 *    trong form. Header đơn giản: `title` (+ optional `description`) — Typography
 *    body bold + body-sm muted.
 * 2. tabs→panel — do caller: gap-4; dải Tabs không nằm trong scroller.
 *    Panel khung cố định: dài → scroll, ngắn → giữ chiều cao.
 * 3. inside cluster — do caller: gap-3; tách footer/CTA = gap-4.
 */

const ControlledModal = ({
    label,
    trigger,
    hint,
    children,
    ...rest
}: {
    /** Story-level Label naming the STATE this demo shows. */
    label: string
    /** Trigger copy — the modal opens on mount, this reopens it after a close. */
    trigger: string
    /** When this state is the right one, per §2b. */
    hint: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof ModalShell>, "isOpen" | "onOpenChange" | "children">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <Typography type="body-sm" color="muted">
                    {hint}
                </Typography>
            </div>
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setIsOpen(true)}>
                {trigger}
            </Button>
            <ModalShell isOpen={isOpen} onOpenChange={setIsOpen} {...rest}>
                {children}
            </ModalShell>
        </div>
    )
}

/** Dùng cho modal xác nhận/form đơn giản: truyền `title` (+ optional `description`) — block render header stack + pr-8. Header→plain = gap-4. */
export const Default: Story = {
    parameters: {
        usage: "Dùng khi cần CHẶN người dùng lại để họ trả lời một câu rồi mới đi tiếp — xác nhận một hành động không hoàn tác được, hoặc một form ngắn. `title` + optional `description` nằm trong header (body bold + body-sm muted); body chỉ còn form/CTA. Header→body mặc định gap-4. Chỉ cần báo tin rồi thôi thì dùng toast; nội dung đọc song song với trang thì dùng Drawer.",
    },
    render: () => (
        <ControlledModal
            label="Title + description"
            trigger="Mở modal"
            hint="header→plain = gap-4. Title + description do block render trong header (pr-8); body chỉ còn CTA."
            title="Xác nhận huỷ ghi danh"
            description="Bạn sẽ mất toàn bộ tiến độ học của khoá này. Hành động này không thể hoàn tác."
            bodyClassName="flex flex-col gap-4"
        >
            <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm">Đóng</Button>
                <Button variant="danger" size="sm">Huỷ ghi danh</Button>
            </div>
        </ControlledModal>
    ),
}

/** Dùng khi `title`/`description` không đủ — cần header phi chuẩn (chip, identity `body-xs`, layout riêng). Đủ title (+ description) thì dùng story Default, đừng với tay `header`. */
export const CustomHeader: Story = {
    parameters: {
        usage: "Dùng khi `title` + `description` không đủ — cần header phi chuẩn (chip, dòng identity `body-xs`, layout riêng). Đủ title (+ description giải thích) thì dùng story Default. Header do caller dựng nên phải TỰ chừa chỗ nút đóng (`pr-8`).",
    },
    render: () => (
        <ControlledModal
            label="Header tuỳ chỉnh"
            trigger="Mở modal có header tuỳ chỉnh"
            hint="khác nhánh title/description ở chỗ header là node do caller dựng, nên phải TỰ chừa chỗ cho nút đóng — đó là lý do có pr-8 trong ví dụ này."
            header={
                <div className="flex flex-col gap-1 pr-8">
                    <Typography type="body" weight="bold">Mời học viên</Typography>
                    <Typography type="body-xs" color="muted">Khoá Fullstack Mastery</Typography>
                </div>
            }
        >
            <Typography type="body-sm" color="muted">
                Nhập email học viên, mỗi dòng một địa chỉ.
            </Typography>
        </ControlledModal>
    ),
}

/**
 * Dùng khi nội dung dài hơn màn: `scroll="inside"` + max-h-[85vh] (shell tự gắn).
 * List trong modal = surface-in-surface → `SurfaceListCard bordered`, không hàng
 * `border-b` trần trên body.
 */
export const ScrollableBody: Story = {
    parameters: {
        usage: "Dùng khi nội dung dài hơn màn hình — `scroll=\"inside\"` giữ header đứng yên, body cuộn trong `max-h-[85vh]`. Rule list: trong modal/drawer phải `SurfaceListCard bordered` (surface-in-surface — shadow vô hình trên nền surface, cần viền). Không rải hàng border-b trần trên body.",
    },
    render: () => (
        <ControlledModal
            label="Thân cuộn + surface list"
            trigger="Mở modal cuộn dài"
            hint="scroll=inside → shell gắn max-h-[85vh]. List lồng trong modal dùng SurfaceListCard bordered (surface-in-surface)."
            title="Lịch sử giao dịch"
            size="lg"
            scroll="inside"
        >
            <SurfaceListCard bordered>
                {Array.from({ length: 12 }).map((_, index) => (
                    <SurfaceListCardRow
                        key={index}
                        title={`Giao dịch #${1000 + index}`}
                        meta={
                            <Typography type="body-sm" color="muted">
                                1.200.000đ
                            </Typography>
                        }
                    />
                ))}
            </SurfaceListCard>
        </ControlledModal>
    ),
}

/**
 * Leading tabs: dải tab CỐ ĐỊNH (không cuộn), panel dưới cùng chiều cao.
 * Dài → ScrollShadow trong khung cố định; ngắn → vẫn chiếm đủ chiều cao khung.
 */
const LeadingTabsDemo = () => {
    const [tab, setTab] = useState<"email" | "push">("email")

    return (
        <>
            <Tabs
                selectedKey={tab}
                onSelectionChange={(key) => setTab(String(key) as "email" | "push")}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Kênh thông báo">
                        <Tabs.Tab id="email">
                            Email
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="push">
                            Đẩy
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            {/* Cùng h cho mọi tab — tabs không nằm trong scroller. Dài thì cuộn, ngắn vẫn giữ khung. */}
            <ScrollShadow
                hideScrollBar
                offset={8}
                className="h-72 overflow-y-auto"
            >
                {tab === "email" ? (
                    <div className="flex min-h-full flex-col gap-3">
                        <Typography type="body-sm" color="muted">
                            Chọn kênh nhận thông báo khi có bài học mới.
                        </Typography>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email">Email nhận thông báo</Label>
                            <Input id="notify-email" type="email" placeholder="ban@email.com" defaultValue="ban@email.com" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-cc">Email phụ (CC)</Label>
                            <Input id="notify-email-cc" type="email" placeholder="phu@email.com" defaultValue="phu@email.com" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-subject">Tiêu đề mẫu</Label>
                            <Input id="notify-email-subject" placeholder="[StarCi] Bài học mới" defaultValue="[StarCi] Bài học mới" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-reply">Reply-to</Label>
                            <Input id="notify-email-reply" type="email" placeholder="noreply@starci.academy" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-footer">Chữ ký cuối email</Label>
                            <Input id="notify-email-footer" placeholder="StarCi Academy" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-digest">Tóm tắt tuần gửi lúc</Label>
                            <Input id="notify-email-digest" placeholder="08:00 thứ Hai" />
                        </TextField>
                    </div>
                ) : (
                    <div className="flex min-h-full flex-col gap-3">
                        <Typography type="body-sm" color="muted">
                            Thông báo đẩy trên trình duyệt hoặc thiết bị đã đăng ký.
                        </Typography>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-device">Tên thiết bị</Label>
                            <Input id="notify-device" placeholder="Laptop cá nhân" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-push-token">Push token</Label>
                            <Input id="notify-push-token" placeholder="fcm_…" />
                        </TextField>
                    </div>
                )}
            </ScrollShadow>
        </>
    )
}

/**
 * Category tabs: first child = dải Tabs (không cuộn cùng body).
 * - header→tabs = gap-3 (`bodyStartsWithTabs`)
 * - tabs→panel = gap-4 (`bodyClassName`)
 * - panel khung cố định (`h-72`): dài → scroll; ngắn → vẫn đủ chiều cao (đổi tab không nhảy layout)
 */
export const WithLeadingTabs: Story = {
    parameters: {
        usage: "Category tabs: `bodyStartsWithTabs` — header→tabs = gap-3. Dải Tabs đứng riêng, KHÔNG cuộn theo body. Panel dưới cùng chiều cao (`h-72` + `ScrollShadow`): nội dung dài thì cuộn trong khung, ngắn vẫn giữ khung (đổi tab không co giãn modal). `bodyClassName=\"flex flex-col gap-4\"` giữa tab và panel. Mỗi tab có `Tabs.Indicator`. Form: `TextField` Label + Input, cluster gap-3.",
    },
    render: () => (
        <ControlledModal
            label="Thân mở đầu bằng tab"
            trigger="Mở modal có tab"
            hint="Tabs cố định (không scroll). Panel dưới cùng h-72: dài thì cuộn, ngắn vẫn đủ khung — đổi tab không nhảy chiều cao."
            title="Cài đặt thông báo"
            bodyStartsWithTabs
            bodyClassName="flex flex-col gap-4"
        >
            <LeadingTabsDemo />
        </ControlledModal>
    ),
}

/**
 * Plain body: header→body gap-4. Trong thân — cluster gap-3; tách footer/CTA gap-4.
 * List surface-in-surface: `LabeledCard frameless` + `CheckListCard bordered`
 * (viền XOR shadow — giống SurfaceListCard; không hack className).
 * Copy giải thích nằm ở `description` (header), không nhét vào body.
 */
export const PlainFormClusters: Story = {
    parameters: {
        usage: "Plain content (không tabs): `title` + `description` trong header; body = cluster gap-3 + footer/CTA gap-4. List trong modal = surface-in-surface: `LabeledCard frameless` (label ngoài) + `CheckListCard bordered` (VIỀN thay shadow vì shadow vô hình trên thân modal). Đứng trên page thì bỏ `bordered`. Không hand-roll ul/border/shadow-none. Không bật `bodyStartsWithTabs`.",
    },
    render: () => (
        <ControlledModal
            label="Cluster gap-3 + CTA gap-4"
            trigger="Mở modal form cluster"
            hint="Description trong header; body chỉ còn list + CTA. Surface-in-surface: LabeledCard frameless + CheckListCard bordered."
            title="Mở khoá khoá học"
            description="Mua một lần để mở toàn bộ bài học, bài tập và hỗ trợ trong khoá."
        >
            <div className="flex flex-col gap-4">
                <LabeledCard label="Bao gồm" frameless>
                    <CheckListCard bordered>
                        {["Toàn bộ lộ trình", "Chấm bài AI", "Cộng đồng khoá"].map((item) => (
                            <CheckListItem key={item}>
                                <Typography type="body-sm">{item}</Typography>
                            </CheckListItem>
                        ))}
                    </CheckListCard>
                </LabeledCard>
                <div className="flex justify-end gap-2">
                    <Button variant="tertiary" size="sm">Để sau</Button>
                    <Button variant="primary" size="sm">Tiếp tục thanh toán</Button>
                </div>
            </div>
        </ControlledModal>
    ),
}
