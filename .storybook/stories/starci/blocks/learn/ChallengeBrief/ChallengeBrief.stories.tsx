import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeBrief } from "@sb-components/starci/blocks/learn/ChallengeBrief/ChallengeBrief"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ChallengeBrief`: the reading column of a challenge, ported from
 * `src`'s `ChallengeView` — prerequisites, requirements (points-per-row),
 * guided steps, expected outputs, and a hint, each present only when the
 * challenge actually carries it.
 *
 * ONE LEAF, THREE STATES. `src` gates each of the five sections on
 * `items.length > 0`, and so does this block — but which of the five show up
 * is DATA (§14d.2), not a different shape of block, so this stays a single
 * leaf. The three states below are: every section present, some sections
 * genuinely absent (the real conditional path), and the loading mirror.
 *
 * ⛔ No "empty everything" leaf/state. A challenge with all five sections
 * blank never reaches this block in `src` — the caller simply would not
 * render a `ChallengeBrief` with nothing to say, so that case is not one this
 * story invents (§14d.3).
 */
const meta: Meta<typeof ChallengeBrief> = {
    title: "StarCi/Blocks/Learn/ChallengeBrief/ChallengeBrief",
    component: ChallengeBrief,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeBrief>

const PREREQUISITES = [
    { key: "prereq-1", body: "Đã cài Node.js 20 trở lên" },
    { key: "prereq-2", body: "Có tài khoản GitHub và biết tạo repo mới" },
]

const REQUIREMENTS = [
    {
        key: "req-1",
        title: "Dựng API CRUD cho Task",
        points: 40,
        body: "Xây REST API `/tasks` hỗ trợ tạo, đọc, sửa, xoá — mỗi route trả đúng mã trạng thái HTTP.",
    },
    {
        key: "req-2",
        title: "Viết test cho từng route",
        points: 30,
        body: "Ít nhất một test integration cho mỗi route, chạy được bằng `npm test`.",
    },
    {
        key: "req-3",
        title: "Validate input",
        body: "Từ chối payload thiếu trường bắt buộc bằng lỗi 400 rõ ràng — không tính điểm riêng, nhưng vẫn được chấm khi review.",
    },
]

const STEPS = [
    { key: "step-1", title: "Khởi tạo dự án", body: "Chạy `npm init` rồi cài Express và TypeORM." },
    { key: "step-2", body: "Định nghĩa entity `Task` với các trường `title`, `done`, `createdAt`." },
    { key: "step-3", title: "Nối route vào controller", body: "Map từng route `/tasks/*` sang hàm xử lý tương ứng." },
]

const OUTPUTS = [
    { key: "out-1", body: "`GET /tasks` trả về mảng JSON các task hiện có" },
    { key: "out-2", body: "`POST /tasks` trả về task vừa tạo kèm `id`" },
]

const HINT = "Nếu route trả 500 khi test, kiểm tra lại xem đã `await` migration trước khi server lắng nghe request chưa."

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking the (up to) five sections, owning the section-wide seam between them", storyId: "frames-stack-stackv--default" },
    "SurfaceCardList": { tier: "composite", role: "the prerequisites/outputs card — free-form rows so this block can lead an outputs row with a check and leave a prerequisites row bare", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
    "SurfaceCardAccordion": { tier: "composite", role: "the requirements/steps card — collapsible rows, the requirements instance carrying a points chip on its trigger via `titleEnd`", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "SurfaceCard": { tier: "composite", role: "the hint card — a labelled face holding ONE markdown paragraph, no rows and no collapse (AUDIT 2026-07-30, feedback ChallengePage/Graded round-12)", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "MarkdownContent": { tier: "composite", role: "a requirement/step/hint panel body — the ONLY three sections that stay markdown", storyId: "composites-viewers-markdowncontent--compact" },
    "Typography": { tier: "atom", role: "a prerequisite/output row — plain text, no markdown (AUDIT 2026-07-30, feedback ChallengePage/Graded round-3: backend content schema names this field \"text\", not \"body\" — a different tier from requirements/steps)", storyId: "atoms-text-typography-typography--plain" },
    "ScoreValue": { tier: "composite", role: "a requirement's point value, riding on its accordion trigger via `titleEnd`", storyId: "composites-texts-scorevalue--default" },
    "CheckCircleIcon": { tier: "heroui", role: "the leading mark on an expected-output row — only drawn once the row is real, never on its shimmer" },
}

/** LEAF — full set: prerequisites → requirements → steps → outputs → hint. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ChallengeBrief"
                tier="block"
                leaf="ChallengeBrief"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "all five sections present",
                        why: "The challenge carries every section it can, so the reading column shows all five cards in their fixed order. Requirements without a `points` value (Validate input) simply have no trailing chip — the chip is not a placeholder, it only exists when there is a number to show.",
                        code: `<ChallengeBrief
    prerequisites={prerequisites}
    requirements={requirements}
    steps={steps}
    outputs={outputs}
    hint={hint}
/>`,
                        render: (
                            <ChallengeBrief
                                anatPart="ChallengeBrief"
                                showAnatomy
                                prerequisites={PREREQUISITES}
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                                outputs={OUTPUTS}
                                hint={HINT}
                            />
                        ),
                    },
                    {
                        name: "only requirements + steps present",
                        why: "Prerequisites, outputs and hint all come back empty for this challenge, so those three cards are not drawn at all — the column goes straight from requirements to steps with no gap or placeholder standing in for the missing sections. This is the real conditional path `src` takes, not a degraded version of the full state.",
                        code: `<ChallengeBrief
    requirements={requirements}
    steps={steps}
/>`,
                        render: (
                            <ChallengeBrief
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Before the challenge entity hydrates, every section renders its own shimmer — all five, since the block cannot yet know which of them this challenge will end up having. The two list sections build their own placeholder rows (two apiece); the three accordion sections mirror themselves, and hint always guesses exactly one collapsible row, never a generic count.",
                        code: "<ChallengeBrief isSkeleton />",
                        render: <ChallengeBrief isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
