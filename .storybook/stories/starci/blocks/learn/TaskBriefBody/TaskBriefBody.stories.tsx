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

const BRIEF_BODY = `Package your NestJS app with a multi-stage Dockerfile to optimize image size.

## Requirements

1. Write a \`Dockerfile\` with at least two stages: a build stage (installs devDependencies, runs \`npm run build\`) and a runtime stage that copies out only \`dist\` + production \`node_modules\`.
2. Build the image and push it to a container registry (Docker Hub or GHCR both work).
3. The final image must be smaller than 200MB.

> Tip: use \`node:20-alpine\` for the runtime stage to keep the image lean.`

const RELATED_ITEMS = [
    { key: "layer-cache", title: "How image layers and caching actually work", snippet: "Every command in a Dockerfile produces a layer, and the command order decides whether the cache still holds.", href: "#cache" },
    { key: "registry-push", title: "Pushing an image to a registry and pinning tags for production", href: "#registry" },
]

const LEGACY_CRITERIA = [
    { key: "crit-1", text: "Dockerfile has at least two separate build/runtime stages", hint: "Check with `docker history <image>` — the runtime stage must not contain the compiler/devDependencies.", score: 40 },
    { key: "crit-2", text: "The image builds successfully and a container runs from it", hint: "`docker build -t app . && docker run -p 3000:3000 app`", score: 30 },
    { key: "crit-3", text: "The final image is smaller than 200MB", score: 30 },
]

const LEGACY_CODE_IMPLEMENTATIONS = [
    {
        key: "impl-ts",
        lang: "typescript",
        guide: "The `build` stage runs `npm ci && npm run build`; the `runtime` stage only does `COPY --from=build /app/dist ./dist` along with production `node_modules`.",
        example: "```dockerfile\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runtime\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/node_modules ./node_modules\nCMD [\"node\", \"dist/main.js\"]\n```",
    },
    {
        key: "impl-go",
        lang: "go",
        guide: "The `build` stage compiles a static binary with `CGO_ENABLED=0`; the `runtime` stage uses `scratch` or `alpine` and only copies the binary over.",
        example: "```dockerfile\nFROM golang:1.22-alpine AS build\nWORKDIR /app\nCOPY . .\nRUN CGO_ENABLED=0 go build -o server .\n\nFROM alpine\nCOPY --from=build /app/server /server\nCMD [\"/server\"]\n```",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking every section of this reading column, owning the section-wide seam between them", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "title/description text and the legacy card's own sub-labels", storyId: "atoms-text-typography-typography--plain" },
    "Callout": { tier: "composite", role: "the locked-preview notice, sitting inside the reading column with a single \"go to current task\" action", storyId: "composites-feedback-callout-callout--with-action" },
    "MarkdownContent": { tier: "composite", role: "the SCHEMA V2 brief body, and each legacy criterion hint / implementation guide-example pair at the compact measure", storyId: "composites-viewers-markdowncontent--reading" },
    "SurfaceCardAccordion": { tier: "composite", role: "the SCHEMA V1 fallback — one instance for criteria (points chip on the trigger), one for per-language implementation guides", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "Chip": { tier: "atom", role: "a legacy criterion's point value, riding on its accordion trigger", storyId: "atoms-chips-chip-chip--default" },
    "ContentRelatedList": { tier: "block", role: "the quiet related-reading list under the task, self-hiding when the course has nothing else on this subject", storyId: "starci-blocks-learn-contentrelatedlist-contentrelatedlist--full" },
}

/** LEAF — SCHEMA V2: the per-language markdown brief. */
export const SchemaV2Brief: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
    title="Package an app with a Docker multi-stage build"
    description="Optimize image size before pushing to the registry."
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    briefBody={briefBody}
    relatedItems={related}
    relatedLabel="Worth reading before you start"
/>`,
                        render: (
                            <TaskBriefBody

                               
                                title="Package an app with a Docker multi-stage build"
                                description="Optimize image size before pushing to the registry."
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                briefBody={BRIEF_BODY}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="Worth reading before you start"
                            />
                        ),
                    },
                    {
                        name: "isLocked = true",
                        why: "The learner jumped ahead of their own progress: the brief still reads in full (§7 — a preview is still a preview, not a lesser task), but a warning notice takes the graded panel's place with one way back to the task they are actually on.",
                        code: `<TaskBriefBody
    title="Package an app with a Docker multi-stage build"
    isLocked
    onGoToCurrentTask={goToCurrentTask}
    briefBody={briefBody}
    relatedItems={related}
    relatedLabel="Worth reading before you start"
/>`,
                        render: (
                            <TaskBriefBody
                                title="Package an app with a Docker multi-stage build"
                                description="Optimize image size before pushing to the registry."
                                isLocked
                                onGoToCurrentTask={() => {}}
                                briefBody={BRIEF_BODY}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="Worth reading before you start"
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
        <div data-tier="fixture" className="p-8">
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
    title="Deploy a container to a VPS with Docker Compose"
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    legacyCriteria={criteria}
    legacyCodeImplementations={implementations}
    relatedItems={related}
    relatedLabel="Worth reading before you start"
/>`,
                        render: (
                            <TaskBriefBody

                               
                                title="Deploy a container to a VPS with Docker Compose"
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                legacyCriteria={LEGACY_CRITERIA}
                                legacyCodeImplementations={LEGACY_CODE_IMPLEMENTATIONS}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="Worth reading before you start"
                            />
                        ),
                    },
                    {
                        name: "no criteria authored yet",
                        why: "A legacy task can exist with its rubric not yet written: the accordion draws its own centered empty state INSIDE the same surface (never a bare, broken card), and with no matching implementation guide either, that whole second accordion does not render at all.",
                        code: `<TaskBriefBody
    title="Deploy a container to a VPS with Docker Compose"
    isLocked={false}
    onGoToCurrentTask={goToCurrentTask}
    legacyCriteria={[]}
    relatedItems={[]}
    relatedLabel="Worth reading before you start"
/>`,
                        render: (
                            <TaskBriefBody
                                title="Deploy a container to a VPS with Docker Compose"
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                legacyCriteria={[]}
                                relatedItems={[]}
                                relatedLabel="Worth reading before you start"
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
        <div data-tier="fixture" className="p-8">
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
    relatedLabel="Worth reading before you start"
/>`,
                        render: (
                            <TaskBriefBody
                                title=""
                                isLocked={false}
                                onGoToCurrentTask={() => {}}
                                relatedItems={[]}
                                relatedLabel="Worth reading before you start"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
