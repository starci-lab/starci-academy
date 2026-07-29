import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeDeliverableList, type ChallengeDeliverableItem } from "@sb-components/starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ChallengeDeliverableList`: the "Nộp bài" card — one accordion row per
 * challenge requirement, its trigger a live status, its panel the submission
 * form plus, once graded, the verdict and the reasons behind it.
 *
 * ⭐ REUSES `SurfaceCard.Accordion` instead of hand-rolling an accordion — see the
 * component file's header for the `src` drift this run exists to avoid.
 *
 * ⭐ ONE COMPONENT, NOT TWO. `src` keeps the ungraded form and the graded result
 * in sibling files that always render together; here `graded` toggles a STATE
 * inside the same leaf, the same treatment `QuizQuestion` gives its `verdict`.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): how many requirements, which are graded, and
 * whether a submission is mid-flight are all DATA ⇒ states inside one leaf. The
 * accordion shell, the trigger's icon+score slots, and the graded block's shape
 * never change.
 */
const meta: Meta<typeof ChallengeDeliverableList> = {
    title: "StarCi/Blocks/Learn/ChallengeDeliverableList/ChallengeDeliverableList",
    component: ChallengeDeliverableList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeDeliverableList>

const BASE_ITEMS: Array<ChallengeDeliverableItem> = [
    {
        id: "api-design",
        title: "Thiết kế API",
        points: 30,
        status: "todo",
        description: "Vẽ sơ đồ **resource** và liệt kê method/status code cho từng endpoint.",
        url: "",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
    {
        id: "readme",
        title: "Viết README",
        points: 10,
        status: "todo",
        url: "github.com/hocvien/api-design",
        urlError: "URL phải bắt đầu bằng https://",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
    {
        id: "unit-test",
        title: "Viết unit test",
        points: 24,
        status: "failed",
        description: "Phủ test cho các nhánh lỗi của endpoint tạo đơn hàng.",
        url: "https://github.com/hocvien/api-design/pull/12",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "fail",
            earnedScore: 12,
            requiredScore: 24,
            feedback: [
                {
                    id: "f1",
                    severity: "high",
                    message: "Không có test cho trường hợp trùng SKU.",
                    location: "test/order.spec.ts:42",
                    suggestion: "Thêm case tạo đơn với SKU đã tồn tại.",
                },
                {
                    id: "f2",
                    severity: "medium",
                    message: "Test bỏ qua nhánh timeout khi gọi payment service.",
                    location: "test/order.spec.ts:88",
                },
                {
                    id: "f3",
                    severity: "low",
                    message: "Tên test chưa mô tả rõ hành vi đang kiểm.",
                },
            ],
        },
    },
    {
        id: "deploy",
        title: "Triển khai lên staging",
        points: 20,
        status: "done",
        url: "https://github.com/hocvien/api-design/actions/runs/933",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "pass",
            earnedScore: 20,
            requiredScore: 16,
            feedback: [
                {
                    id: "f4",
                    severity: "low",
                    message: "Health check endpoint phản hồi hơi chậm khi cold start.",
                    suggestion: "Cân nhắc warm-up job sau deploy.",
                },
            ],
        },
    },
]

const PENDING_ITEMS: Array<ChallengeDeliverableItem> = BASE_ITEMS.map((item) =>
    item.id === "api-design"
        ? { ...item, url: "https://github.com/hocvien/api-design/pull/1", isPending: true }
        : item,
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the \"Nộp bài\" card face, carrying the section label and the settings-trigger action in its header", storyId: "composites-cards-surfacecard-surfacecard--with-action" },
    "SurfaceCardAccordion": { tier: "composite", role: "one bounded surface of collapsible rows, taking each requirement's trigger + panel as data — the composite this run reuses instead of hand-rolling an accordion", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "StackV": { tier: "frame", role: "the vertical frame separating a panel's description, field, actions and graded result", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the action row, or a feedback item's severity chip beside its text", storyId: "frames-stack-stackh--default" },
    "InputText": { tier: "atom", role: "the submission URL field, its error line driven by `urlError`", storyId: "atoms-forms-input-inputtext--default" },
    "Button": { tier: "atom", role: "the settings trigger, or a panel's submit / view-history action", storyId: "atoms-buttons-button-button--default" },
    "MarkdownContent": { tier: "composite", role: "the requirement's own description, at the compact measure since it is a passenger inside the accordion rather than the page", storyId: "composites-viewers-markdowncontent--compact" },
    "EnumChip": { tier: "composite", role: "the pass/fail verdict chip, or one feedback item's severity chip", storyId: "composites-chips-enumchip--overview" },
    "Typography": { tier: "atom", role: "the trigger's points-or-score line, the graded score line, or one line of feedback text", storyId: "atoms-text-typography-typography--plain" },
    "ScoreValue": { tier: "composite", role: "the trigger's points-before-grading or earned/required-after-grading line, riding in `titleEnd`", storyId: "composites-texts-scorevalue--default" },
    "StatusIcon": { tier: "heroui", role: "the requirement's todo/done/failed mark, riding in `titleStart` — its own colour, independent of the title text" },
}

/** LEAF — the deliverables card. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ChallengeDeliverableList"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "4 requirements: chưa nộp · URL sai · rớt có phản hồi · đạt",
                        why: "One row shows the untouched state, one shows a URL validation error, one shows a failed grade with three feedback items across every severity, and one shows a pass with a single low-severity note. The first requirement still short of a pass — the failed one — opens by default rather than requirement #1, since that is the one the learner still owes.",
                        code: `<ChallengeDeliverableList
    items={items}
    onOpenGradingSettings={openSettings}
/>`,
                        render: (
                            <ChallengeDeliverableList
                                anatPart="ChallengeDeliverableList"
                                showAnatomy
                                items={BASE_ITEMS}
                                onOpenGradingSettings={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = true trên một yêu cầu",
                        why: "The requirement being submitted shows a busy submit button and a locked URL field, while its three siblings stay fully interactive. Grading one requirement never freezes the rest of the card, since each row's job is independent of the others.",
                        code: `<ChallengeDeliverableList
    items={items.map((item) => item.id === "api-design" ? { ...item, isPending: true } : item)}
    onOpenGradingSettings={openSettings}
/>`,
                        render: (
                            <ChallengeDeliverableList
                                items={PENDING_ITEMS}
                                onOpenGradingSettings={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The card header and the accordion both swap to their own shimmer mirrors, the accordion keeping the same row count as the real data so the layout does not jump once it lands. No parallel skeleton tree is built here — the flag reaches straight into `SurfaceCard` and `SurfaceCard.Accordion`.",
                        code: `<ChallengeDeliverableList
    items={items}
    onOpenGradingSettings={openSettings}
    isSkeleton
/>`,
                        render: (
                            <ChallengeDeliverableList
                                items={BASE_ITEMS}
                                onOpenGradingSettings={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
