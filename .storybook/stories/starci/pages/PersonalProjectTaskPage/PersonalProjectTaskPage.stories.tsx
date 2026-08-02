import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonalProjectTaskPage } from "@sb-components/starci/pages/PersonalProjectTaskPage/PersonalProjectTaskPage"
import type { PersonalProjectTaskSubmissionPanelProps } from "@sb-components/starci/pages/PersonalProjectTaskPage/PersonalProjectTaskPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PersonalProjectTaskPage` — the screen to solve one personal-project task. A
 * screen owns a list of functions. Split workspace: a reading column that swaps
 * per task (task identity, the locked-preview banner, the authored brief or the
 * legacy rubric/implementation guides, and related lessons) beside a
 * persistent, sticky act column (repo URL, the settings-drawer trigger,
 * evaluate/secondary actions, and the latest graded result). Two columns
 * composed with `SplitWorkspace`: a `min-w-0 flex-1` reading column beside a
 * `shrink-0 w-[360px]` sticky aside, stacked on mobile/tablet →
 * `@app-xl:flex-row` on desktop. The grading-settings drawer content is not
 * built — `onOpenSettings` is a chrome trigger only.
 */
const meta: Meta<typeof PersonalProjectTaskPage> = {
    title: "StarCi/Pages/PersonalProjectTaskPage/PersonalProjectTaskPage",
    component: PersonalProjectTaskPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PersonalProjectTaskPage>

const CRUMBS = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "personal-project", label: "Personal Project", onPress: () => {} },
    { key: "task", label: "Task 3 — Dockerize service" },
]

const RELATED_ITEMS = [
    { key: "lesson-1", title: "Writing an optimized Dockerfile", snippet: "Layers, caching, and multi-stage builds.", href: "#" },
    { key: "lesson-2", title: "Environment variables & secrets in containers", href: "#" },
]

const BASE_SUBMISSION: PersonalProjectTaskSubmissionPanelProps = {
    repoUrl: "",
    onRepoUrlChange: () => {},
    settingsLangLabel: "TypeScript",
    settingsBranch: "main",
    onOpenSettings: () => {},
    onEvaluate: () => {},
    onOpenFeedbackDetails: () => {},
    onOpenAttempts: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SplitWorkspace": { tier: "frame", role: "the reading-column + persistent sticky-aside workspace — stacked below @app-xl, side-by-side (`min-w-0 flex-1` beside a `w-[360px]` sticky rail) from @app-xl up", storyId: "frames-splitworkspace-splitworkspace--default" },
    "StackV": { tier: "frame", role: "one column's own vertical rhythm — the reading column (header above brief above legacy/related sections) or the act column (repo card above the score card)", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the act column's own evaluate/secondary-actions row — unrelated to the outer split, wraps onto a new line when the three buttons run out of width", storyId: "frames-stack-stackh--default" },
    "PageHeader": { tier: "composite", role: "the task's own identity: breadcrumb trail, title, description — no meta row, a task carries no score/difficulty of its own", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the reading column builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "one of the screen's own text lines — the task title/description, a skeleton mirror, or an owned label like a hint heading", storyId: "atoms-text-typography-typography--plain" },
    "Callout": { tier: "composite", role: "the locked-preview warning banner shown while `isLocked` and the task is not yet unlocked for the learner", storyId: "composites-feedback-callout-callout--default" },
    "SurfaceCard": { tier: "composite", role: "a labeled surface in the reading or act column — the authored brief, the legacy rubric wrapper, or the repo-submission card", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "MarkdownContent": { tier: "composite", role: "one authored markdown document — the brief itself, or a legacy criterion hint / implementation guide", storyId: "composites-viewers-markdowncontent--reading" },
    "SurfaceCardAccordion": { tier: "composite", role: "the legacy rubric or the legacy per-language implementation guides, each row collapsible", storyId: "composites-cards-surfacecard-surfacecardaccordion--default" },
    "Chip": { tier: "atom", role: "a legacy criterion's point value, riding on its accordion trigger", storyId: "atoms-chips-chip-chip--default" },
    "ContentRelatedList": { tier: "block", role: "lessons related to this task's own subject — self-hides entirely when the caller found nothing related", storyId: "starci-blocks-learn-contentrelatedlist-contentrelatedlist--full" },
    "InputText": { tier: "atom", role: "the GitHub repo URL field, the panel's primary input", storyId: "atoms-forms-input-inputtext--default" },
    "ListRow": { tier: "composite", role: "the read-only grading-config summary row (language · branch) that opens the settings drawer — chrome trigger only, see the file header", storyId: "composites-lists-list-listrow--clickable" },
    "Button": { tier: "atom", role: "the evaluate CTA or one of the two secondary actions (feedback details / attempts history)", storyId: "atoms-buttons-button-button--default" },
    "SubmissionScoreCard": { tier: "block", role: "the latest graded attempt's score, verdict and grader byline — omitted entirely until a first attempt exists", storyId: "starci-blocks-learn-submissionscorecard-submissionscorecard--score-card" },
}

/** LEAF — a fresh schema-v2 task: authored brief, no attempt submitted yet. */
export const SchemaV2: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectTaskPage"
                tier="screen"
                leaf="Schema v2 — not attempted"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "brief present, submissionPanelProps.result = undefined",
                        why: "The task carries an authored brief, so the reading column shows it directly and the legacy rubric section stays hidden entirely. The act column's score card does not render at all — nothing has been graded yet, so there is nothing to show rather than a card claiming a result of zero.",
                        code: `<PersonalProjectTaskPage
    breadcrumbItems={crumbs}
    task={{ title: "Task 3 — Dockerize service", description: "…" }}
    brief={{ body: "…" }}
    relatedItems={relatedItems}
    relatedLabel="You might want to read"
    submissionPanelProps={{ repoUrl: "", … }}
/>`,
                        render: (
                            <PersonalProjectTaskPage
                               
                                breadcrumbItems={CRUMBS}
                                task={{
                                    title: "Task 3 — Dockerize service",
                                    description: "Package the Task API service into a production-ready image that runs with `docker run` without needing Node installed on the host.",
                                }}
                                brief={{
                                    body: "## Requirements\n\nWrite a multi-stage `Dockerfile` for the existing service.\n\n1. Build stage: install dependencies, compile TypeScript.\n2. Run stage: copy only the production `dist/` + `node_modules`, no toolchain along for the ride.\n\n:::muted\nThe final image must be under 200MB.\n:::",
                                }}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="You might want to read"
                                submissionPanelProps={BASE_SUBMISSION}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a graded schema-v2 attempt: passing score, model byline. */
export const SchemaV2Graded: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectTaskPage"
                tier="screen"
                leaf="Schema v2 — graded"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "submissionPanelProps.result present, isPassing = true, hasAttempts = true",
                        why: "Once a result exists the score card appears in the act column, the evaluate CTA relabels to \"Re-evaluate\", and the two secondary actions (feedback details, attempts history) unlock — mirroring `src`'s `TaskActions`, which gates those same two buttons on whether any attempt exists yet.",
                        code: `<PersonalProjectTaskPage
    …
    submissionPanelProps={{
        repoUrl: "https://github.com/hocvien/task-api",
        hasAttempts: true,
        result: { score: 17, maxScore: 20, isPassing: true, gradedByModel: "GPT-4.1 mini", modelCategory: "economy", timeAgo: "5 minutes ago" },
        …
    }}
/>`,
                        render: (
                            <PersonalProjectTaskPage
                               
                                breadcrumbItems={CRUMBS}
                                task={{
                                    title: "Task 3 — Dockerize service",
                                    description: "Package the Task API service into a production-ready image that runs with `docker run` without needing Node installed on the host.",
                                }}
                                brief={{
                                    body: "## Requirements\n\nWrite a multi-stage `Dockerfile` for the existing service.",
                                }}
                                relatedItems={RELATED_ITEMS}
                                relatedLabel="You might want to read"
                                submissionPanelProps={{
                                    ...BASE_SUBMISSION,
                                    repoUrl: "https://github.com/hocvien/task-api",
                                    hasAttempts: true,
                                    result: {
                                        score: 17,
                                        maxScore: 20,
                                        isPassing: true,
                                        shortFeedback: "Clean image, multi-stage done right. Missing a `.dockerignore`, so the build context is a bit heavy.",
                                        gradedByModel: "GPT-4.1 mini",
                                        modelCategory: "economy",
                                        timeAgo: "5 minutes ago",
                                    },
                                }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a schema-v1 (legacy) task: no authored brief, public criteria + implementation guides instead. */
export const LegacySchema: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectTaskPage"
                tier="screen"
                leaf="Schema v1 — legacy rubric"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "brief.body = \"\", legacyCriteria + legacyCodeImplementations present",
                        why: "Old tasks authored before the brief schema carry no Markdown brief at all, so the \"Instructions\" card is not drawn — the legacy rubric card takes its place, one accordion for the public scoring criteria and a second for the per-language implementation guide, both nested inside ONE outer labeled surface rather than two title-less cards stacked (mirrors `src`'s own single `LabeledCard` wrapping both).",
                        code: `<PersonalProjectTaskPage
    …
    brief={{ body: "" }}
    legacyCriteria={[{ key: "c1", text: "API returns the correct HTTP status code", score: 20, hint: "…" }]}
    legacyCodeImplementations={[{ key: "ts", lang: "TypeScript", guide: "…", example: "…" }]}
/>`,
                        render: (
                            <PersonalProjectTaskPage
                               
                                breadcrumbItems={CRUMBS}
                                task={{
                                    title: "Task 1 — Build a CRUD API for Task",
                                    description: "Build a REST API `/tasks` supporting create, read, update, delete.",
                                }}
                                brief={{ body: "" }}
                                legacyCriteria={[
                                    { key: "c1", text: "API returns the correct HTTP status code for each route", score: 40, hint: "`201` when created, `404` when deleting a nonexistent id." },
                                    { key: "c2", text: "Has an integration test for each route", score: 30 },
                                ]}
                                legacyCodeImplementations={[
                                    {
                                        key: "ts",
                                        lang: "TypeScript",
                                        guide: "Uses Express + TypeORM, a `Task` entity with `title`/`done`/`createdAt`.",
                                        example: "```ts\napp.post(\"/tasks\", async (req, res) => {\n  const task = await taskRepo.save(req.body)\n  res.status(201).json(task)\n})\n```",
                                    },
                                ]}
                                relatedItems={[]}
                                relatedLabel="You might want to read"
                                submissionPanelProps={BASE_SUBMISSION}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — previewing a task ahead of the learner's own unlocked position. */
export const Locked: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectTaskPage"
                tier="screen"
                leaf="isLocked = true"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = true",
                        why: "A warning banner sits between the task header and the brief. Nothing else in the reading column changes shape — the learner can still read ahead, they just can't submit yet for real (a business rule the act column's own `isEvaluateDisabled` enforces, not this banner).",
                        code: "<PersonalProjectTaskPage … isLocked />",
                        render: (
                            <PersonalProjectTaskPage
                               
                                breadcrumbItems={CRUMBS}
                                task={{
                                    title: "Task 5 — Deploy to staging",
                                    description: "This task unlocks once Task 4 is graded as passing.",
                                }}
                                isLocked
                                brief={{ body: "## Preview\n\nThis task asks you to deploy the service to the staging environment." }}
                                relatedItems={[]}
                                relatedLabel="You might want to read"
                                submissionPanelProps={{ ...BASE_SUBMISSION, isEvaluateDisabled: true }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every composed part mirrors itself. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectTaskPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every composed part that can mirror itself does — the flag flows straight down into `PageHeader`'s title/description, the brief card, both legacy accordions (drawn with placeholder rows since the caller hasn't said yet whether this task even HAS a legacy rubric), `ContentRelatedList`, the repo field, the settings row, every button, and the score card. The two-column layout keeps its exact shape, so nothing reflows once the task entity lands.",
                        code: "<PersonalProjectTaskPage {...props} isSkeleton />",
                        render: (
                            <PersonalProjectTaskPage
                               
                                task={{ title: "" }}
                                brief={{ body: "" }}
                                relatedItems={[]}
                                relatedLabel="You might want to read"
                                submissionPanelProps={BASE_SUBMISSION}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
