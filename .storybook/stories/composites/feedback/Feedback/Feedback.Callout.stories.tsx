import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE (§13) — `Feedback.Callout`: dải tint PHẲNG đặt BÊN TRONG một
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
    title: "Composites/Feedback/Feedback/Feedback.Callout",
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
        role: "the CTA button, built from `actionLabel`/`onAction`, always a Button.Base",
        storyId: "atoms-buttons-button-button-base--default",
    },
    Close: {
        tier: "atom",
        role: "the × button, forwarded to Alert.Base, which always builds it from Button.Base",
        storyId: "atoms-buttons-button-button-base--default",
    },
}

/**
 * Trục `status` — cùng cây DOM, chỉ đổi tint + glyph mặc định + màu Title. Vì thế
 * cả bộ nằm TRONG một leaf (§14d.2), mỗi tone là MỘT state, không tách mỗi tone
 * một story riêng.
 */

/** Leaf gốc — render ĐỦ tone của khung, mỗi tone một state (không phải leaf riêng). */
export const Default: Story = {
    name: "Tones",
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="composite"
                leaf="Full tone set"
                annotate={ANNOTATE}
                reason="The IN-PLACE notice frame: a flat tint strip (shadow-none) that sits INSIDE an existing surface, so it reads as a highlight, not a card-in-card. The frame owns the tint and default icon per status; the caller just supplies the copy. Every tone shares the same part tree (§14d.2); only the icon, tint, and title colour change, which is why the five below are states of one leaf rather than five leaves."
                states={[
                    {
                        name: "status = default",
                        why: "The strip carries a neutral tint and a default icon, with the same part tree as every other tone below. This is the shape for a low-stakes notice, such as confirming an autosave, that does not need to read as good or bad news.",
                        code: `<Feedback.Callout
  status="default"
  title="Draft saved"
  description="Your changes are kept automatically."
/>`,
                        render: <Feedback.Callout showAnatomy status="default" title="Draft saved" description="Your changes are kept automatically." />,
                    },
                    {
                        name: "status = accent",
                        why: "Only the tint, icon colour, and title colour switch to accent; the node tree stays identical to the default tone. This tone marks something worth a look rather than a warning, such as a chapter that just gained new content.",
                        code: `<Feedback.Callout
  status="accent"
  title="Chapter 3 just got a new practice section"
  description="Reopen the chapter to try what's new."
/>`,
                        render: <Feedback.Callout showAnatomy status="accent" title="Chapter 3 just got a new practice section" description="Reopen the chapter to try what's new." />,
                    },
                    {
                        name: "status = success",
                        why: "Only the tint, icon colour, and title colour switch to success; the node tree still matches the other tones. This tone confirms an outcome landed correctly, such as a submission the grader has accepted.",
                        code: `<Feedback.Callout
  status="success"
  title="Submission successful"
  description="Results will be ready in a few minutes."
/>`,
                        render: <Feedback.Callout showAnatomy status="success" title="Submission successful" description="Results will be ready in a few minutes." />,
                    },
                    {
                        name: "status = warning",
                        why: "Only the tint, icon colour, and title colour switch to warning; the node tree still matches the other tones. This tone flags something approaching that is not broken yet, such as a deadline a few days out.",
                        code: `<Feedback.Callout
  status="warning"
  title="Deadline coming up"
  description="2 days left to finish this milestone."
/>`,
                        render: <Feedback.Callout showAnatomy status="warning" title="Deadline coming up" description="2 days left to finish this milestone." />,
                    },
                    {
                        name: "status = danger",
                        why: "Only the tint, icon colour, and title colour switch to danger; the node tree still matches the other tones. This tone marks a real failure the reader has to act on, such as a dropped connection to the server.",
                        code: `<Feedback.Callout
  status="danger"
  title="Couldn't reach the server"
  description="Check your connection and try again."
/>`,
                        render: <Feedback.Callout showAnatomy status="danger" title="Couldn't reach the server" description="Check your connection and try again." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Biên: chỉ `title` — Content thu về đúng MỘT dòng, không có Description. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="composite"
                leaf="TitleOnly"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "description not set",
                        why: "Content shrinks to just the title, the thinnest strip this frame renders. A description line is only worth the space when there is a second sentence to add, and a short tip does not need one.",
                        code: `<Feedback.Callout
  status="accent"
  title="Tip: highlight a passage to ask AI about it"
/>`,
                        render: <Feedback.Callout showAnatomy status="accent" title="Tip: highlight a passage to ask AI about it" />,
                    },
                ]}
            />
        </div>
    ),
}

/** `body` (≡ `children`) — slot TỰ DO dưới mô tả, cho nội dung không phải một dòng chữ. */
export const WithBody: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="composite"
                leaf="WithBody"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "body set (free-form node below description)",
                        why: "A free-form body region grows below the description, here a bulleted list rather than another line of text. The frame wraps this content (§13b) for a message that needs more than one line to say, such as naming the missing items one by one.",
                        code: `<Feedback.Callout status="warning" title="Submission is missing 2 items" description="…">
  <ul className="list-disc pl-4">…</ul>
</Feedback.Callout>`,
                        render: (
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
                        ),
                    },
                ]}
            />
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
                tier="composite"
                leaf="WithAction"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "actionLabel set",
                        why: "A footer button grows before where the close button would sit, built by the frame itself with a solid background matched to the status. The caller only supplies the text, never a node, so a secondary CTA can never drift from the status tint it sits inside.",
                        code: `<Feedback.Callout
  status="accent"
  title="Upgrade to unlock AI"
  actionLabel="Upgrade"
/>`,
                        render: (
                            <Feedback.Callout
                                showAnatomy
                                status="accent"
                                title="Upgrade to unlock AI"
                                description="The paid plan enables advanced grading."
                                actionLabel="Upgrade"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `icon` — thay glyph mặc định của tone bằng một icon COMPONENT khác (khung vẫn ép size-6). */
export const CustomIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="composite"
                leaf="CustomIcon"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "icon set (overrides the status default)",
                        why: "The leading glyph swaps from the status's own default to whatever component is passed in, here the GitHub logo. The frame keeps forcing size-6 and the tone colour regardless, so the caller only ever chooses which glyph, never its size or colour.",
                        code: `<Feedback.Callout
  status="warning"
  icon={GithubLogoIcon}
  title="You haven't joined the GitHub team"
  …
/>`,
                        render: (
                            <Feedback.Callout
                                showAnatomy
                                status="warning"
                                icon={GithubLogoIcon}
                                title="You haven't joined the course's GitHub team"
                                description="Premium content lives in the course's GitHub repo, so you need to join the team to unlock it."
                                actionLabel="Join team"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `onClose` — dải tự tắt được: thêm node `Close` (atom `Button.Base`) ở cuối hàng. */
export const Dismissible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="composite"
                leaf="Dismissible"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "onClose set",
                        why: "A × button grows at the tail, a ghost Button.Base toned to the status rather than a raw glyph. The badge stops at that Close node and does not drill into the atom's own internals (§11a), so this leaf marks the strip as one a reader can dismiss on their own.",
                        code: `<Feedback.Callout
  status="accent"
  title="…"
  onClose={() => {}}
  closeAriaLabel="Dismiss tip"
/>`,
                        render: (
                            <Feedback.Callout
                                showAnatomy
                                status="accent"
                                title="Tip: highlight text to ask AI"
                                onClose={() => {}}
                                closeAriaLabel="Dismiss tip"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
