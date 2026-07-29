import type { Meta, StoryObj } from "@storybook/nextjs"
import { TaskBriefBody } from "@sb-components/starci/blocks/learn/TaskBriefBody/TaskBriefBody"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `TaskBriefBody`: the reading column of a personal-project milestone
 * task, ported from `src`'s `Task` + `TaskBrief` + `TaskLockedAlert` +
 * `TaskCriteriaList`/`TaskCodeImplementations`.
 *
 * ⚠️ TWO LEAVES, NOT ONE — a real structural fork (§14d.2), not a data STATE.
 * `src` resolves a task into exactly one of two shapes depending on whether it
 * carries a SCHEMA V2 brief: `SchemaV2Brief` (the modern per-language markdown
 * instructions) or `LegacySchemaV1` (the old public criteria accordion + code
 * guides, for tasks authored before the brief system existed). A single task
 * is never both, so this is the same kind of fork `ContentRelatedList` draws
 * between its `Full` and `Hidden` leaves — a different render SHAPE, not a
 * variant of one shape. `Skeleton` is its own third leaf: the block cannot
 * know which of the two shapes a loading task will resolve to (see the
 * component's own file header for why it guesses SCHEMA V2).
 *
 * Within each of the two schema leaves, `isLocked` toggling the notice IS a
 * plain data state (the tree's SHAPE does not change kind, only whether one
 * optional section mounts) — same treatment `ContentArticle` gives its own
 * `isLocked`.
 */
const meta: Meta<typeof TaskBriefBody> = {
    title: "StarCi/Blocks/Learn/TaskBriefBody/TaskBriefBody",
    component: TaskBriefBody,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TaskBriefBody>

const BRIEF_BODY = `Đóng gói ứng dụng NestJS của bạn bằng Dockerfile multi-stage để tối ưu hoá dung lượng image.

## Yêu cầu

1. Viết \`Dockerfile\` với ít nhất hai stage: một stage build (cài devDependencies, chạy \`npm run build\`) và một stage runtime chỉ chép ra \`dist\` + \`node_modules\` production.
2. Build image và push lên một container registry (Docker Hub, GHCR đều được).
3. Image cuối cùng phải nhỏ hơn 200MB.

> Gợi ý: dùng \`node:20-alpine\` cho stage runtime để giữ image gọn.`

const RELATED_ITEMS = [
    { key: "layer-cache", title: "Image layer và cache hoạt động ra sao", snippet: "Mỗi lệnh trong Dockerfile đẻ một layer, và thứ tự lệnh quyết định cache còn dùng được không.", href: "#cache" },
    { key: "registry-push", title: "Đẩy image lên registry và ghim tag cho production", href: "#registry" },
]

const LEGACY_CRITERIA = [
    { key: "crit-1", text: "Dockerfile có ít nhất hai stage build/runtime tách biệt", hint: "Kiểm tra bằng `docker history <image>` — stage runtime không được chứa compiler/devDependencies.", score: 40 },
    { key: "crit-2", text: "Image build thành công và chạy được container từ nó", hint: "`docker build -t app . && docker run -p 3000:3000 app`", score: 30 },
    { key: "crit-3", text: "Image cuối cùng nhỏ hơn 200MB", score: 30 },
]

const LEGACY_CODE_IMPLEMENTATIONS = [
    {
        key: "impl-ts",
        lang: "typescript",
        guide: "Stage `build` chạy `npm ci && npm run build`; stage `runtime` chỉ `COPY --from=build /app/dist ./dist` cùng `node_modules` production.",
        example: "```dockerfile\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runtime\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/node_modules ./node_modules\nCMD [\"node\", \"dist/main.js\"]\n```",
    },
    {
        key: "impl-go",
        lang: "go",
        guide: "Stage `build` biên dịch binary tĩnh bằng `CGO_ENABLED=0`; stage `runtime` dùng `scratch` hoặc `alpine` và chỉ chép binary sang.",
        example: "```dockerfile\nFROM golang:1.22-alpine AS build\nWORKDIR /app\nCOPY . .\nRUN CGO_ENABLED=0 go build -o server .\n\nFROM alpine\nCOPY --from=build /app/server /server\nCMD [\"/server\"]\n```",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking every section of this reading column, owning the section-wide seam between them", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "title/description text and the legacy card's own sub-labels", storyId: "atoms-text-typography-typography--plain" },
    "FeedbackCallout": { tier: "composite", role: "the locked-preview notice, sitting inside the reading column with a single \"go to current task\" action", storyId: "composites-feedback-feedback-feedbackcallout--with-action" },
    "MarkdownContent": { tier: "composite", role: "the SCHEMA V2 brief body, and each legacy criterion hint / implementation guide-example pair at the compact measure", storyId: "composites-viewers-markdowncontent--reading" },
    "SurfaceCardAccordion": { tier: "composite", role: "the SCHEMA V1 fallback — one instance for criteria (points chip on the trigger), one for per-language implementation guides", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "Chip": { tier: "atom", role: "a legacy criterion's point value, riding on its accordion trigger", storyId: "atoms-chips-chip-chip--default" },
    "ContentRelatedList": { tier: "block", role: "the quiet related-reading list under the task, self-hiding when the course has nothing else on this subject", storyId: "starci-blocks-learn-contentrelatedlist-contentrelatedlist--full" },
}

/** LEAF — SCHEMA V2: the per-language markdown brief. */
export const SchemaV2Brief: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TaskBriefBody"
                tier="block"
                leaf="SchemaV2Brief"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLocked = false",
                        why: "A modern task carries a resolved brief, so the reading column is title + description, the markdown instructions, then related reading — no rubric card, since a SCHEMA V2 brief keeps its criteria internal to the text.",
                        code: `<TaskBriefBody
    title="Đóng gói ứng dụng bằng Docker multi-stage"
    description="Tối ưu dung lượng image trước khi đẩy lên registry."
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    briefBody={briefBody}
    relatedItems={related}
    relatedLabel="Bài nên đọc trước khi làm"
/>`,
                        render: (
                            <TaskBriefBody
                                anatPart="TaskBriefBody"
                                showAnatomy
                                title="Đóng gói ứng dụng bằng Docker multi-stage"
                                description="Tối ưu dung lượng image trước khi đẩy lên registry."
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                briefBody={BRIEF_BODY}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="Bài nên đọc trước khi làm"
                            />
                        ),
                    },
                    {
                        name: "isLocked = true",
                        why: "The learner jumped ahead of their own progress: the brief still reads in full (§7 — a preview is still a preview, not a lesser task), but a warning notice takes the graded panel's place with one way back to the task they are actually on.",
                        code: `<TaskBriefBody
    title="Đóng gói ứng dụng bằng Docker multi-stage"
    isLocked
    onGoToCurrentTask={goToCurrentTask}
    briefBody={briefBody}
    relatedItems={related}
    relatedLabel="Bài nên đọc trước khi làm"
/>`,
                        render: (
                            <TaskBriefBody
                                title="Đóng gói ứng dụng bằng Docker multi-stage"
                                description="Tối ưu dung lượng image trước khi đẩy lên registry."
                                isLocked
                                onGoToCurrentTask={() => {}}
                                briefBody={BRIEF_BODY}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="Bài nên đọc trước khi làm"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — SCHEMA V1: no brief, the legacy criteria + implementation-guide fallback. */
export const LegacySchemaV1: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TaskBriefBody"
                tier="block"
                leaf="LegacySchemaV1"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "criteria + implementation guides present",
                        why: "An old task with no authored brief falls back to its original public rubric: a criteria accordion (points chip per row, a plain italic line replacing the hint when a criterion never got one) plus per-language implementation guides, both under one shared label.",
                        code: `<TaskBriefBody
    title="Deploy container lên VPS bằng Docker Compose"
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    legacyCriteria={criteria}
    legacyCodeImplementations={implementations}
    relatedItems={related}
    relatedLabel="Bài nên đọc trước khi làm"
/>`,
                        render: (
                            <TaskBriefBody
                                anatPart="TaskBriefBody"
                                showAnatomy
                                title="Deploy container lên VPS bằng Docker Compose"
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                legacyCriteria={LEGACY_CRITERIA}
                                legacyCodeImplementations={LEGACY_CODE_IMPLEMENTATIONS}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="Bài nên đọc trước khi làm"
                            />
                        ),
                    },
                    {
                        name: "no criteria authored yet",
                        why: "A legacy task can exist with its rubric not yet written: the accordion draws its own centered empty state INSIDE the same surface (never a bare, broken card), and with no matching implementation guide either, that whole second accordion does not render at all.",
                        code: `<TaskBriefBody
    title="Deploy container lên VPS bằng Docker Compose"
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    legacyCriteria={[]}
    relatedItems={[]}
    relatedLabel="Bài nên đọc trước khi làm"
/>`,
                        render: (
                            <TaskBriefBody
                                title="Deploy container lên VPS bằng Docker Compose"
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                legacyCriteria={[]}
                                relatedItems={[]}
                                relatedLabel="Bài nên đọc trước khi làm"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — loading, before the milestone task query resolves. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TaskBriefBody"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The task hasn't hydrated yet, so title/description shimmer and the block guesses a SCHEMA V2 brief (a shimmer paragraph, not a real `MarkdownContent` call with no source) — the far more common shape for a task that was just authored. The legacy fallback and the locked notice never render while loading; `ContentRelatedList` keeps its own row mirror going underneath.",
                        code: `<TaskBriefBody
    isSkeleton
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    relatedItems={[]}
    relatedLabel="Bài nên đọc trước khi làm"
/>`,
                        render: (
                            <TaskBriefBody
                                title=""
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                relatedItems={[]}
                                relatedLabel="Bài nên đọc trước khi làm"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
