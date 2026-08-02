import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonalProjectDashboard } from "@sb-components/starci/blocks/learn/PersonalProjectDashboard/PersonalProjectDashboard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PersonalProjectDashboard` — the capstone landing overview ("where am I + what's
 * next"), shown when the personal-project route carries no `taskId`: breadcrumb →
 * title/description/GitHub-status header, over a continue hero + completion meter,
 * over the current milestone's tasks as a two-column grid.
 *
 * Shapes:
 *   • `Full` — a next task exists, so the continue hero renders; GitHub connected
 *     vs not are states inside it.
 *   • `AllDone` — no `currentTask`, so the hero is gone, replaced by an "all done" line.
 *   • `Loading` — `AsyncContent` falls to the shimmer mirror.
 *   • `Empty` — `AsyncContent` falls to the empty message; the header is unaffected.
 */
const meta: Meta<typeof PersonalProjectDashboard> = {
    title: "StarCi/Blocks/Learn/PersonalProjectDashboard/PersonalProjectDashboard",
    component: PersonalProjectDashboard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PersonalProjectDashboard>

const CRUMBS = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "personal-project", label: "Personal Project" },
]

const TASKS = [
    { id: "t1", sortIndex: 1, title: "Design the infrastructure schema", subtitleState: "done" as const },
    { id: "t2", sortIndex: 2, title: "Write a multi-stage Dockerfile", subtitleState: "active" as const },
    { id: "t3", sortIndex: 3, title: "Configure the CI image build", subtitleState: "todo" as const },
    { id: "t4", sortIndex: 4, title: "Deploy to staging", subtitleState: "locked" as const },
]

const STATS = { done: 1, total: 4, attempts: 3, avgLabel: "18/20" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking the header, the continue+progress region and the keep-going card, owning every seam between them", storyId: "frames-stack-stackv--default" },
    "PageHeader": { tier: "composite", role: "the header frame lining up the trail, title, description and the GitHub-status chip", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Chip": { tier: "atom", role: "the GitHub connection status, or its own shimmer mirror while that data is still loading", storyId: "atoms-chips-chip-chip--default" },
    "ContinueCardHero": { tier: "block", role: "the one highlight card for the next task to work on, carrying the continue CTA", storyId: "starci-blocks-learn-continuecard-hero-progress--overview" },
    "ProgressMeter": { tier: "composite", role: "the capstone's own overall completion, kept separate from the hero's card so the two don't compete over what 'progress' means", storyId: "composites-stats-progressmeter--overview" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the all-done line or the stats sentence — real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "SurfaceCard": { tier: "composite", role: "the labeled card framing the keep-going grid, owning the 'Continue · <milestone>' heading row", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "ContinueCardItem": { tier: "block", role: "one task tile in the keep-going grid, its subtitle line picked from the task's own state", storyId: "starci-blocks-learn-continuecard-continuecarditem--content" },
}

/** LEAF — a next task exists: header → continue hero + progress → keep-going grid. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectDashboard"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "githubStatus.isConnected = true",
                        why: "The learner already linked a repo, so the header's chip switches to its success tone and shows the already-formatted `owner/repo · branch` string — parsing that URL stays the caller's job, the block only reacts to the connected flag.",
                        code: `<PersonalProjectDashboard
    breadcrumbItems={crumbs}
    title="Personal Project"
    description="Build a complete deployment system end to end."
    githubStatus={{ isConnected: true, label: "starci183/final-project · main" }}
    currentTask={{ sortIndex: 2, title: "Write a multi-stage Dockerfile" }}
    onContinue={onContinue}
    milestoneLabel="Containerization"
    tasks={tasks}
    onSelectTask={onSelectTask}
    stats={{ done: 1, total: 4, attempts: 3, avgLabel: "18/20" }}
/>`,
                        render: (
                            <PersonalProjectDashboard

                               
                                breadcrumbItems={CRUMBS}
                                title="Personal Project"
                                description="Build a complete deployment system end to end."
                                githubStatus={{ isConnected: true, label: "starci183/final-project · main" }}
                                currentTask={{ sortIndex: 2, title: "Write a multi-stage Dockerfile" }}
                                onContinue={() => {}}
                                milestoneLabel="Containerization"
                                tasks={TASKS}
                                onSelectTask={() => {}}
                                stats={STATS}
                            />
                        ),
                    },
                    {
                        name: "githubStatus.isConnected = false",
                        why: "No repo linked yet, so the chip drops to its neutral tone and shows the caller's own 'not connected' copy instead of a repo label. Nothing else in the tree changes shape.",
                        code: `<PersonalProjectDashboard
    ...
    githubStatus={{ isConnected: false, label: "GitHub not connected" }}
/>`,
                        render: (
                            <PersonalProjectDashboard
                                breadcrumbItems={CRUMBS}
                                title="Personal Project"
                                description="Build a complete deployment system end to end."
                                githubStatus={{ isConnected: false, label: "GitHub not connected" }}
                                currentTask={{ sortIndex: 2, title: "Write a multi-stage Dockerfile" }}
                                onContinue={() => {}}
                                milestoneLabel="Containerization"
                                tasks={TASKS}
                                onSelectTask={() => {}}
                                stats={STATS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — every task is finished ⇒ **loses** the `ContinueCardHero` node entirely. */
export const AllDone: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectDashboard"
                tier="block"
                leaf="No current task"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "currentTask = undefined",
                        why: "There is no next task to continue, so the hero card is not drawn at all — a plain 'all done' line takes its place. The progress meter still shows the (now full) completion bar underneath it.",
                        code: `<PersonalProjectDashboard
    ...
    currentTask={undefined}
    stats={{ done: 4, total: 4, attempts: 6, avgLabel: "19/20" }}
/>`,
                        render: (
                            <PersonalProjectDashboard

                               
                                breadcrumbItems={CRUMBS}
                                title="Personal Project"
                                description="Build a complete deployment system end to end."
                                githubStatus={{ isConnected: true, label: "starci183/final-project · main" }}
                                onContinue={() => {}}
                                milestoneLabel="Containerization"
                                tasks={TASKS.map((task) => ({ ...task, subtitleState: "done" as const }))}
                                onSelectTask={() => {}}
                                stats={{ done: 4, total: 4, attempts: 6, avgLabel: "19/20" }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the milestone/progress fetch is running ⇒ `AsyncContent` falls to the shimmer mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectDashboard"
                tier="block"
                leaf="Prop `isLoading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The header (trail/title/description) never waits on this fetch, so it renders as usual; only the continue hero, progress stats and keep-going grid fall to their guessed shimmer shape below it.",
                        code: `<PersonalProjectDashboard
    ...
    isLoading
/>`,
                        render: (
                            <PersonalProjectDashboard

                               
                                breadcrumbItems={CRUMBS}
                                title="Personal Project"
                                description="Build a complete deployment system end to end."
                                githubStatus={{ isConnected: false, label: "" }}
                                onContinue={() => {}}
                                tasks={[]}
                                onSelectTask={() => {}}
                                stats={{ done: 0, total: 0, attempts: 0, avgLabel: "" }}
                                isLoading
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the course has no capstone tasks configured at all ⇒ `AsyncContent`'s empty message. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectDashboard"
                tier="block"
                leaf="Prop `isEmpty`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isEmpty = true",
                        why: "No milestone was ever configured for this course's capstone, so the continue hero and keep-going grid are replaced by the block's own empty message instead of an empty progress bar and a blank card.",
                        code: `<PersonalProjectDashboard
    ...
    isEmpty
/>`,
                        render: (
                            <PersonalProjectDashboard

                               
                                breadcrumbItems={CRUMBS}
                                title="Personal Project"
                                description="Build a complete deployment system end to end."
                                githubStatus={{ isConnected: false, label: "GitHub not connected" }}
                                onContinue={() => {}}
                                tasks={[]}
                                onSelectTask={() => {}}
                                stats={{ done: 0, total: 0, attempts: 0, avgLabel: "—" }}
                                isEmpty
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
