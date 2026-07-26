import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Alert, type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Alert.Base`: port DUY NHẤT xuống HeroUI Alert (`Feedback.Callout` và
 * `Toast.Base` đều compose từ đây).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật của TẦNG ATOM). Bản trước file này dùng lý lẽ
 * §14d.2 ("leaf = cấu trúc, state gộp chung leaf") — SAI cho một atom: §14d.2 dành
 * cho design/block/screen (xem cảnh báo ở đầu `Chip.Base.stories.tsx`). Ở tầng atom,
 * `tone`/`icon`/`body`/`action`/`onClose` mỗi cái đổi một HÌNH thật (fill khác, thêm
 * node khác) nên mỗi cái một leaf; hai leaf cũ (`Statuses`, `WithActionAndClose`) bỏ
 * sót hẳn `icon` và `body` — hai prop có hình chưa từng lên hình ở đâu.
 *
 * DEPS thật DUY NHẤT: node `Close` — atom TỰ dựng nút × bằng `Button.Base` (không
 * phải slot caller đưa vào) nên bấm nhảy được sang story của nó. `action` là slot
 * caller đưa NODE TUỲ Ý (không riêng gì `Button.Base`) nên không tính là dep.
 */
const meta: Meta<typeof Alert.Base> = {
    title: "Atoms/Feedback/Alert/Alert.Base",
    component: Alert.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Alert.Base>

/** Node duy nhất trỏ sang story KHÁC: nút × luôn là `Button.Base` (atom tự dựng, không phải slot caller). */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Close: {
        tier: "atom",
        role: "the × button — Alert.Base always builds it from Button.Base, ghost variant toned to status",
        storyId: "atoms-buttons-button-button-base--default",
    },
}

/** ĐỦ union `AlertStatus` — thiếu một giá trị là giá trị đó mọc thành leaf lạc chỗ. */
const STATUSES: Array<{ status: AlertStatus; title: string; description: string }> = [
    { status: "default", title: "Neutral note", description: "Carries no valence — for supporting information." },
    { status: "accent", title: "Study tip", description: "Review the cards due today before starting a new lesson." },
    { status: "success", title: "Submission saved", description: "Grading results will be ready in a few minutes." },
    { status: "warning", title: "You haven't joined the course's GitHub team", description: "Some labs need repo access — join to unlock them." },
    { status: "danger", title: "Couldn't load the content", description: "The connection dropped — try again in a moment." },
]

/** Leaf TRẦN — chỉ `title`, mọi prop khác giữ mặc định (status=default, tone=soft, không icon/description/body/action/close). */
export const Default: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Bare alert"
                annotate={ANNOTATE}
                reason="Port DUY NHẤT xuống HeroUI Alert — Feedback.Callout và Toast.Base đều compose từ đây. Mỗi leaf dưới đây khác đúng MỘT prop so với cái này, nên đây là mốc so sánh."
                note="Chỉ `title` — status mặc định, tone mặc định soft, không description/body/icon riêng/action/close."
                code={"<Alert.Base title=\"Note saved\" />"}
            >
                <Alert.Base title="Note saved" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `status` — 5 Ý NGHĨA, render ĐỦ union. Đổi tint + icon mặc định + màu Title cùng lúc. */
export const Statuses: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `status`"
                annotate={ANNOTATE}
                reason="`status` chọn tint + icon mặc định + màu tiêu đề CÙNG LÚC — không thể lỡ ghép icon sai valence với chữ."
                note="Năm status dùng chung một cây DOM, chỉ khác tint/icon/màu — không tách leaf theo giá trị."
                code={STATUSES.map(({ status, title, description }) => `<Alert.Base status="${status}" title="${title}" description="${description}" />`).join("\n")}
            >
                <div className="flex w-full flex-col gap-3">
                    {STATUSES.map(({ status, title, description }, index) => (
                        <Alert.Base key={status} status={status} title={title} description={description} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — chỗ ĐẶT, không phải màu mới: `soft` phẳng TRONG surface, `plain` giữ tint HeroUI để alert nổi (toast). */
export const Tone: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `tone`"
                annotate={ANNOTATE}
                reason="`tone` là CHỖ ĐẶT chứ không phải một màu mới — cùng status, hai tone vẫn đọc ra hai NGỮ CẢNH khác nhau."
                note="`soft` là hình `Feedback.Callout` dùng (dải tint phẳng trong surface). `plain` là hình `Toast.Base` dùng (tint mặc định HeroUI, alert nổi)."
                code={"<Alert.Base tone=\"soft\" status=\"warning\" title=\"…\" />\n<Alert.Base tone=\"plain\" status=\"warning\" title=\"…\" />"}
            >
                <div className="flex flex-col gap-3">
                    <Alert.Base tone="soft" status="warning" title="Flat tint (soft)" description="The shape Feedback.Callout uses — a flat strip inside a surface." showAnatomy />
                    <Alert.Base tone="plain" status="warning" title="Default tint (plain)" description="The shape Toast.Base uses — HeroUI's own tint, meant to float." />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `icon` — thay glyph mặc định của status bằng một icon COMPONENT khác. */
export const Icon: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `icon`"
                annotate={ANNOTATE}
                note="Bỏ trống → icon mặc định của status. Truyền `icon` → atom vẫn tự ép size-5 (§4/§5), chỉ đổi glyph."
                code={"<Alert.Base status=\"warning\" title=\"…\" />\n<Alert.Base status=\"warning\" icon={GithubLogoIcon} title=\"…\" />"}
            >
                <div className="flex flex-col gap-3">
                    <Alert.Base status="warning" title="Default icon" description="No `icon` passed — falls back to the status glyph." showAnatomy />
                    <Alert.Base status="warning" icon={GithubLogoIcon} title="Join the GitHub team" description="A custom icon replaces the status default." />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `body` (§12b) — vùng tự do dưới description, đường DUY NHẤT vì atom không mở `children`. */
export const Body: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `body`"
                annotate={ANNOTATE}
                reason="Atom không mở `children` (§12b) — `body` là đường DUY NHẤT nhét nội dung tự do (list ngắn, meta row) dưới description."
                note="`body` render ngay dưới Description, thụt cùng cột với Content."
                code={"<Alert.Base status=\"warning\" title=\"…\" description=\"…\" body={<ul>…</ul>} />"}
            >
                <Alert.Base
                    status="warning"
                    title="Submission is missing 2 items"
                    description="Add them, then resubmit for grading."
                    body={(
                        <ul className="list-disc space-y-1 pl-4 text-sm">
                            <li>A README describing how to run the project</li>
                            <li>A screenshot of the result</li>
                        </ul>
                    )}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `action` — slot NODE tuỳ ý từ caller, đặt trước nút ×. KHÔNG phải dep vì atom không sở hữu nội dung bên trong. */
export const Action: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `action`"
                annotate={ANNOTATE}
                note="`action` nhận NODE tuỳ ý (thường là `Button.Base`, nhưng atom không ép) — atom chỉ đặt nó trước nút ×, không sở hữu ruột bên trong nên không phải dep."
                code={"<Alert.Base status=\"warning\" title=\"…\" action={<Button.Base size=\"sm\" label=\"Join team\" onPress={fn} />} />"}
            >
                <Alert.Base
                    status="warning"
                    title="You haven't joined the course's GitHub team"
                    description="Some labs need repo access — join to unlock them."
                    action={<Button.Base size="sm" label="Join team" onPress={() => {}} />}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `onClose` — atom TỰ dựng nút × từ `Button.Base`. Node `Close` là DEP THẬT duy nhất của atom này. */
export const Close: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `onClose`"
                annotate={ANNOTATE}
                reason="Pass a handler and the alert grows a status-toned × — built internally from Button.Base, so this is the one node in the atom that jumps to another story."
                note="`closeAriaLabel` gives the × its accessible name."
                code={"<Alert.Base status=\"warning\" title=\"…\" onClose={fn} closeAriaLabel=\"Close\" />"}
            >
                <Alert.Base
                    status="warning"
                    title="You haven't joined the course's GitHub team"
                    description="Some labs need repo access — join to unlock them."
                    onClose={() => {}}
                    closeAriaLabel="Close"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c): khung + icon giữ THẬT, chỉ chữ thành gạch. */
export const Skeleton: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state — the atom draws its own shimmer instead of leaning on a shared skeleton component."
                note="Bar khớp đúng hộp dòng thật (title 24px, description 20px) nên không nhảy layout khi dữ liệu tới (§8). `title` trở thành optional khi `isSkeleton` (union type)."
                code={"<Alert.Base status=\"accent\" isSkeleton />\n<Alert.Base status=\"danger\" tone=\"plain\" isSkeleton />"}
            >
                <div className="flex flex-col gap-3">
                    <Alert.Base status="accent" isSkeleton showAnatomy />
                    <Alert.Base status="danger" tone="plain" isSkeleton />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
