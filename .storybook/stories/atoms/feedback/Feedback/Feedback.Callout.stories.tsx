import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback, type FeedbackCalloutStatus } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier) — `Feedback.Callout`: dải tint PHẲNG đặt BÊN TRONG một
 * surface (surface-in-surface), không phải card nổi. Khung sở hữu tint + icon
 * theo `status`; nội dung đi bằng slot có tên `title`/`description`/`body`
 * (+`children`)/`action` + nút đóng tuỳ chọn.
 *
 * ⚠️ PHẠM VI STATE (§12f): mỗi story dưới đây chỉ render state do CHÍNH khung này
 * đẻ ra — `status`, có/không `description`, `body`, `action`, `onClose`, `icon`.
 * State của nút CTA (pending/disabled) sống ở story `Atoms/Buttons/Button` — khung
 * này chỉ nhận `actionLabel`/`onAction`, không nhận node.
 *
 * 📐 LEAF = CẤU TRÚC (§14d.2, ĐÚNG cho khung — khác atom, xem cảnh báo ở
 * `Alert.Base.stories.tsx`): `status` KHÔNG đổi cây DOM — mọi tone dùng chung
 * `Icon · Content(Title · Description)`, chỉ khác tint + glyph mặc định + màu Title
 * ⇒ chúng là STATE, gộp trong MỘT leaf. Mấy leaf còn lại giữ riêng vì mỗi cái
 * thêm/bớt node THẬT (bỏ `Description`, thêm `Body`/`Action`/`Close`).
 *
 * DEPS thật: `Action` (khung tự dựng `Button.Base` từ `actionLabel`) và `Close`
 * (khung forward `onClose` xuống atom `Alert.Base`, atom đó tự dựng `Button.Base`
 * cho nút ×) — cả hai đều là component KHÁC có story riêng mà khung dựng lại.
 * `Icon`/`Content`/`Title`/`Description`/`Body` là ruột của atom `Alert.Base`
 * (khung này compose từ nó), KHÔNG phải deps.
 */
const meta: Meta<typeof Feedback.Callout> = {
    title: "Layouts/Feedback/Feedback/Feedback.Callout",
    component: Feedback.Callout,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Feedback.Callout>

/** Hai node THẬT có story khác để nhảy tới — cả hai đều là `Button.Base` do khung/atom tự dựng. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Action: {
        tier: "atom",
        role: "the CTA button — built from `actionLabel`/`onAction`, always a Button.Base",
        storyId: "atoms-buttons-button-button-base--default",
    },
    Close: {
        tier: "atom",
        role: "the × button — forwarded to Alert.Base, which always builds it from Button.Base",
        storyId: "atoms-buttons-button-button-base--default",
    },
}

/** Trục `status` — cùng cây DOM, chỉ đổi tint + glyph mặc định + màu Title. Vì thế
 * cả bộ nằm TRONG một leaf (§14d.2), không tách mỗi tone một story. */
/**
 * One row of the status/tone demo table.
 */
interface ToneRow {
    /** the status token this row demonstrates */
    status: FeedbackCalloutStatus
    /** callout title rendered for this status */
    title: string
    /** callout description rendered for this status */
    description: string
}

const TONES: Array<ToneRow> = [
    { status: "default", title: "Draft saved", description: "Your changes are kept automatically." },
    { status: "accent", title: "Chapter 3 just got a new practice section", description: "Reopen the chapter to try what's new." },
    { status: "success", title: "Submission successful", description: "Results will be ready in a few minutes." },
    { status: "warning", title: "Deadline coming up", description: "2 days left to finish this milestone." },
    { status: "danger", title: "Couldn't reach the server", description: "Check your connection and try again." },
]

/** Leaf gốc — render ĐỦ tone của khung (state, không phải leaf riêng). */
export const Default: Story = {
    name: "Tones",
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Full tone set"
                annotate={ANNOTATE}
                reason="The IN-PLACE notice frame: a flat tint strip (shadow-none) that sits INSIDE an existing surface, so it reads as a highlight — not a card-in-card. The frame owns the tint and default icon per status; the caller just supplies the copy."
                note="Every tone (default/accent/success/warning/danger) shares the same part tree — only the icon, tint, and title colour change, so they share one leaf (§14d.2)."
                code={`<Feedback.Callout
  status="success"
  title="Submission successful"
  description="Results will be ready in a few minutes."
/>`}
            >
                <div className="flex flex-col gap-4">
                    {TONES.map(({ status, title, description }, index) => (
                        <Feedback.Callout
                            key={status}
                            showAnatomy={index === 0}
                            status={status}
                            title={title}
                            description={description}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Biên: chỉ `title` — Content thu về đúng MỘT dòng, không có Description. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="TitleOnly"
                annotate={ANNOTATE}
                note="Drop `description` and Content shrinks to just the title — the thinnest strip this frame renders."
                code={`<Feedback.Callout
  status="accent"
  title="Tip: highlight a passage to ask AI about it"
/>`}
            >
                <Feedback.Callout showAnatomy status="accent" title="Tip: highlight a passage to ask AI about it" />
            </BlockAnatomy>
        </div>
    ),
}

/** `body` (≡ `children`) — slot TỰ DO dưới mô tả, cho nội dung không phải một dòng chữ. */
export const WithBody: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="WithBody"
                annotate={ANNOTATE}
                note="The frame WRAPS (§13b): `body` is the free-form body slot, `children` is its shorthand — use it when the message needs more than one line of description."
                code={`<Feedback.Callout status="warning" title="Submission is missing 2 items" description="…">
  <ul className="list-disc pl-4">…</ul>
</Feedback.Callout>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="warning"
                    title="Submission is missing 2 items"
                    description="Add them, then resubmit for grading."
                    body={(
                        <ul className="list-disc space-y-1 pl-4">
                            <li><Typography.Base size="xs" text="A README describing how to run the project" color="muted" /></li>
                            <li><Typography.Base size="xs" text="A screenshot of the result" color="muted" /></li>
                        </ul>
                    )}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `actionLabel`/`onAction` — CTA phụ nằm cùng hàng. Khung TỰ dựng nút và tự bôi
 * skin đặc màu theo `status`; caller chỉ đưa CHỮ, không cầm `Button` (thầy chốt
 * 2026-07-25: screen tuyệt đối không xài atom).
 */
export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="WithAction"
                annotate={ANNOTATE}
                note="`actionLabel` is a horizontal footer slot, before the close button. The frame builds the button itself and paints a solid background per status — the caller never passes a node."
                code={`<Feedback.Callout
  status="accent"
  title="Upgrade to unlock AI"
  actionLabel="Upgrade"
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="accent"
                    title="Upgrade to unlock AI"
                    description="The paid plan enables advanced grading."
                    actionLabel="Upgrade"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `icon` — thay glyph mặc định của tone bằng một icon COMPONENT khác (khung vẫn ép size-6). */
export const CustomIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="CustomIcon"
                annotate={ANNOTATE}
                note="`icon` takes a COMPONENT (not JSX) — the frame keeps forcing size-6 + the tone colour, the caller never sets an icon class."
                code={`<Feedback.Callout
  status="warning"
  icon={GithubLogoIcon}
  title="You haven't joined the GitHub team"
  …
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="warning"
                    icon={GithubLogoIcon}
                    title="You haven't joined the course's GitHub team"
                    description="Premium content lives in the course's GitHub repo, so you need to join the team to unlock it."
                    actionLabel="Join team"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `onClose` — dải tự tắt được: thêm node `Close` (atom `Button.Base`) ở cuối hàng. */
export const Dismissible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Dismissible"
                annotate={ANNOTATE}
                note="`onClose` turns on the × (atom Button.Base, ghost, toned to the status). §11a: the badge stops at the Close node — it does not drill into the atom's own internals."
                code={`<Feedback.Callout
  status="accent"
  title="…"
  onClose={() => {}}
  closeAriaLabel="Dismiss tip"
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="accent"
                    title="Tip: highlight text to ask AI"
                    onClose={() => {}}
                    closeAriaLabel="Dismiss tip"
                />
            </BlockAnatomy>
        </div>
    ),
}
