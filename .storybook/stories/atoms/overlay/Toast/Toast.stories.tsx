import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button as HeroButton } from "@heroui/react"
import { Toast } from "@sb-components/atoms/overlay/Toast/Toast"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Toast`: notification-surface DUY NHẤT, compose từ `Alert`
 * (`tone="plain"` + glyph `sm`). Port xuống HeroUI nằm hẳn ở `Alert`.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bản trước tách bốn leaf `Success`/`Warning`/
 * `Danger`/`Info` — đúng anti-pattern "tách leaf theo GIÁ TRỊ" (như tách
 * `Small`/`Medium` thay vì gộp `Sizes`). Gộp lại MỘT leaf `Statuses` render đủ
 * union `ToastStatus`, khớp cách `Alert.stories.tsx` đã làm với `status`.
 * Leaf thứ hai `WithAction` giữ nguyên vì nó mọc THÊM node thật (`Action`/`Close`).
 *
 * ⚠️ KHÔNG có `annotate`: Toast không tự phát `data-anat-part` cho ranh giới
 * `Alert` (không truyền `anatPart` xuống) — mọi tên phát ra
 * (`Icon`/`Content`/`Title`/`Description`/`Action`/`Close`) là SPAN NỘI BỘ của
 * `Alert`, không có story riêng để nhảy tới ⇒ không phải deps thật. Xem
 * `issues` trong báo cáo audit: muốn có deps tới `Alert` thì `Toast.tsx`
 * phải truyền `anatPart="Alert"` xuống — đó là sửa component, ngoài phạm vi
 * file story này.
 *
 * MIGRATED TO `states` (2026-07-27): `Statuses` used to map the full `ToastStatus`
 * union into one stacked block with no room to explain any one tone on its own —
 * now each tone is its own `states[]` entry.
 */
const meta: Meta<typeof Toast> = {
    title: "Atoms/Overlay/Toast/Toast",
    component: Toast,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Toast>

/** Leaf prop `status` — render ĐỦ union, mỗi giá trị một state (§12g, gộp leaf, tách state). Migrated 2026-07-27. */
export const Statuses: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast"
                tier="atom"
                leaf="Prop `status`"
                reason="The one toast atom, composed from Alert. Status picks the tint and the icon together, so a caller can never pair the wrong icon with a tone — it only ever hands over a title and description."
                states={[
                    {
                        name: "status = \"success\"",
                        why: "The surface tints success and mounts a `CheckCircleIcon`, wrapping the given title and description. This tone confirms an action already completed, like a submission that saved.",
                        code: "<Toast status=\"success\" title=\"Submission saved\" description=\"Grading results will be ready in a few minutes.\" />",
                        render: (
                            <Toast
                                status="success"
                                title="Submission saved"
                                description="Grading results will be ready in a few minutes."
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "status = \"warning\"",
                        why: "The surface tints warning and mounts a `WarningIcon`, same shape as the success state otherwise. This tone flags something the learner should act on soon but hasn't failed yet, like a quiz about to auto-submit.",
                        code: "<Toast status=\"warning\" title=\"Running out of time\" description=\"The quiz submits itself in 10 minutes.\" />",
                        render: (
                            <Toast
                                status="warning"
                                title="Running out of time"
                                description="The quiz submits itself in 10 minutes."
                            />
                        ),
                    },
                    {
                        name: "status = \"danger\"",
                        why: "The surface tints danger and mounts an `XCircleIcon`, again the same shape as the other tones. This tone reports an action that actually failed, like a submission the server never received.",
                        code: "<Toast status=\"danger\" title=\"Submission failed\" description=\"Could not reach the server — try again.\" />",
                        render: (
                            <Toast
                                status="danger"
                                title="Submission failed"
                                description="Could not reach the server — try again."
                            />
                        ),
                    },
                    {
                        name: "status = \"info\"",
                        why: "The surface folds to the accent tint and mounts an `InfoIcon`, still the identical shape as the other three tones. This tone is for a neutral update that isn't a success or a problem, like new content landing on a lesson already open.",
                        code: "<Toast status=\"info\" title=\"Content just updated\" description=\"This lesson has a new version, reload to see it.\" />",
                        render: (
                            <Toast
                                status="info"
                                title="Content just updated"
                                description="This lesson has a new version, reload to see it."
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf props `action` / `onClose` — mọc thêm node Action + nút × thật. Migrated to `states` 2026-07-27. */
export const WithAction: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast"
                tier="atom"
                leaf="Props `action` / `onClose`"
                states={[
                    {
                        name: "action set, onClose set",
                        why: "An `Action` node mounts before a real `×` close button, both new nodes that don't exist in the bare toast. `action` sits before the close control because it is content this atom keeps on purpose — unlike `children`, which it never accepts at all.",
                        code: "<Toast status=\"info\" title=\"Card removed\" action={<Button>Undo</Button>} onClose={fn} />",
                        render: (
                            <Toast
                                status="info"
                                title="Flashcard removed"
                                action={
                                    <HeroButton size="sm" variant="tertiary">
                                        Undo
                                    </HeroButton>
                                }
                                onClose={() => {}}
                                closeLabel="Dismiss notification"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
