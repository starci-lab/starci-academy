import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button as HeroButton } from "@heroui/react"
import { Toast, type ToastStatus } from "@sb-components/atoms/overlay/Toast/Toast"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Toast.Base`: notification-surface DUY NHẤT, compose từ `Alert.Base`
 * (`tone="plain"` + glyph `sm`). Port xuống HeroUI nằm hẳn ở `Alert.Base`.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bản trước tách bốn leaf `Success`/`Warning`/
 * `Danger`/`Info` — đúng anti-pattern "tách leaf theo GIÁ TRỊ" (như tách
 * `Small`/`Medium` thay vì gộp `Sizes`). Gộp lại MỘT leaf `Statuses` render đủ
 * union `ToastStatus`, khớp cách `Alert.Base.stories.tsx` đã làm với `status`.
 * Leaf thứ hai `WithAction` giữ nguyên vì nó mọc THÊM node thật (`Action`/`Close`).
 *
 * ⚠️ KHÔNG có `annotate`: Toast không tự phát `data-anat-part` cho ranh giới
 * `Alert.Base` (không truyền `anatPart` xuống) — mọi tên phát ra
 * (`Icon`/`Content`/`Title`/`Description`/`Action`/`Close`) là SPAN NỘI BỘ của
 * `Alert.Base`, không có story riêng để nhảy tới ⇒ không phải deps thật. Xem
 * `issues` trong báo cáo audit: muốn có deps tới `Alert.Base` thì `Toast.tsx`
 * phải truyền `anatPart="Alert.Base"` xuống — đó là sửa component, ngoài phạm vi
 * file story này.
 */
const meta: Meta<typeof Toast.Base> = {
    title: "Atoms/Overlay/Toast/Toast.Base",
    component: Toast.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Toast.Base>

/** One row of the `status` demo table. */
interface StatusRow {
    /** The status value this row demonstrates. */
    status: ToastStatus
    /** Toast title shown for this row. */
    title: string
    /** Toast description shown for this row. */
    description: string
}

/** ĐỦ union `ToastStatus` — thiếu một giá trị là giá trị đó mọc thành leaf lạc chỗ. */
const STATUSES: Array<StatusRow> = [
    { status: "success", title: "Submission saved", description: "Grading results will be ready in a few minutes." },
    { status: "warning", title: "Running out of time", description: "The quiz submits itself in 10 minutes." },
    { status: "danger", title: "Submission failed", description: "Could not reach the server — try again." },
    { status: "info", title: "Content just updated", description: "This lesson has a new version, reload to see it." },
]

/** Leaf prop `status` — render ĐỦ union trong CÙNG một cây (§12g, không tách theo giá trị). */
export const Statuses: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="Prop `status`"
                reason="The one toast atom, composed from Alert.Base. Status picks the tint and the icon together, so a caller can never pair the wrong icon with a tone — it only ever hands over a title and description."
                note="success → CheckCircleIcon, warning → WarningIcon, danger → XCircleIcon, info folds to the accent tint with InfoIcon. All four share the same shape; only the tint and icon change."
                code={STATUSES.map(({ status, title, description }) =>
                    `<Toast.Base status="${status}" title="${title}" description="${description}" />`,
                ).join("\n")}
            >
                <div className="flex w-full flex-col gap-3">
                    {STATUSES.map(({ status, title, description }, index) => (
                        <Toast.Base
                            key={status}
                            status={status}
                            title={title}
                            description={description}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf props `action` / `onClose` — mọc thêm node Action + nút × thật. */
export const WithAction: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="Props `action` / `onClose`"
                reason="`action` sits before the × close button, and `onClose` is what turns the × on. `action` is content — a ReactNode this atom keeps on purpose, unlike `children`, which it does not accept at all."
                note="Pass closeLabel so a screen reader hears what is being dismissed, not just a bare 'close'."
                code={"<Toast.Base status=\"info\" title=\"Card removed\" action={<Button>Undo</Button>} onClose={fn} />"}
            >
                <Toast.Base
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
            </BlockAnatomy>
        </div>
    ),
}
