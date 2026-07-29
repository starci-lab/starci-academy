import type { Meta, StoryObj } from "@storybook/nextjs"
import { LearnShell } from "@sb-components/starci/layouts/LearnShell/LearnShell"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT — `LearnShell`: the wrapper mounted once per `/learn/**` scope. See the
 * component's own file header for the full contract, the scope gaps left
 * deliberately open (rail body, `GithubLinkGate`), and why `LeaderboardCategoryNav`
 * was NOT reused despite the inventory hint (that block's own file header states
 * the desktop rail half it would need is itself out of scope, unbuilt).
 *
 * FIVE LEAVES BY STRUCTURE (§14d.2) — each one GAINS or LOSES a whole node,
 * never just a prop flip on one existing part:
 *   - `RailSurface`        — rail mounted beside `children`, one floating FAB.
 *   - `NoRailSurface`       — no rail at all, `children` fills the width.
 *   - `SelectionAskActive` — **gains** the `ContentAiSelectionAsk` pill node
 *     alongside the FAB (mirrors `EnrollGate.WithPreview`'s "whole extra layer"
 *     reasoning).
 *   - `AiSuppressed`        — `isAssessmentLive` **loses** BOTH AI trigger nodes
 *     at once (mirrors `MindMapPage.StandaloneLoading`'s "structurally absent,
 *     not just hidden" reasoning).
 *   - `EnrollGated`         — the whole rail+children row is **replaced** by
 *     `EnrollGate`.
 */
const meta: Meta<typeof LearnShell> = {
    title: "StarCi/Layouts/LearnShell/LearnShell",
    component: LearnShell,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnShell>

/** Props for the local {@link RouteContent} story fixture. */
interface RouteContentProps {
    /** Caption explaining which route this stand-in represents. */
    label: string
}

/** Stand-in for a real `/learn/**` route's own content — this layout never knows what it is. */
const RouteContent = ({ label }: RouteContentProps) => (
    <div className="flex h-full flex-col gap-3 p-8">
        <div className="h-6 w-1/3 rounded bg-default" />
        <div className="h-4 w-2/3 rounded bg-default" />
        <div className="h-40 rounded-2xl bg-surface shadow-surface" />
        <p className="text-xs text-muted">{label}</p>
    </div>
)

// A stand-in for a real teaser block (e.g. `PersonalProjectGatePreview`) — same
// "representative, non-interactive content, no `data-anat-part` of its own"
// contract `EnrollGate`'s own story already uses for this exact prop.
const MockPreview = () => (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div className="rounded-3xl bg-surface p-6 shadow-surface">
            <div className="h-5 w-2/3 rounded bg-default" />
            <div className="mt-3 h-3 w-1/3 rounded bg-default" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-2xl bg-surface shadow-surface" />
            <div className="h-24 rounded-2xl bg-surface shadow-surface" />
        </div>
    </div>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the root row splitting the resizable rail from the route's own content — flush, no gap, the rail's own border draws the seam", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the rail's own centering column around the `Spinner` scope-gap placeholder", storyId: "frames-stack-stackv--default" },
    "ResizableRail": { tier: "frame", role: "drag-to-resize wrapper around the rail body, persisting the chosen width — reused verbatim", storyId: "behaviors-resizablerail-resizablerail--default" },
    "Spinner": { tier: "atom", role: "scope-gap placeholder standing in for the real rail body (`ContentMap`/`OnThisPage`/`MilestoneOutline`/the desktop `LeaderboardCategoryRail` half) — none are in this task's compose list", storyId: "atoms-display-spinner-spinner--default" },
    "EnrollGate": { tier: "block", role: "the conversion card replacing the whole rail+children row when the active surface requires enrollment the viewer does not have", storyId: "starci-blocks-learn-enrollgate-enrollgate--with-preview" },
    "ContentAiFab": { tier: "block", role: "the floating \"ask StarCi AI\" trigger, mounted once for every `/learn/**` route", storyId: "starci-blocks-learn-contentaifab-contentaifab--default" },
    "ContentAiSelectionAsk": { tier: "block", role: "the \"ask AI about this passage\" pill, planted at the caller-resolved selection point", storyId: "starci-blocks-learn-contentaiselectionask-contentaiselectionask--full" },
}

/** LEAF — a rail-bearing surface: `ResizableRail` (Spinner gap body) beside the route's own content, one floating FAB. */
export const RailSurface: Story = {
    render: () => (
        <BlockAnatomy
            name="LearnShell"
            tier="screen"
            leaf="Rail surface"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "activeSurface = \"content\"",
                    why: "The reading route: the real layout mounts `ContentMap`/`OnThisPage`/`MilestoneOutline` in the rail — out of this task's compose list, so `Spinner` marks the honest gap instead of a hand-rolled placeholder. The FAB floats, ready to open the AI chat rail.",
                    code: `<LearnShell
    activeSurface="content"
    isEnrollGated={false}
    isAssessmentLive={false}
    onOpenAiChat={openAiChat}
    onOpenSelectionAsk={openSelectionAsk}
>
    {routeContent}
</LearnShell>`,
                    render: (
                        <LearnShell
                            showAnatomy
                            anatPart="LearnShell"
                            activeSurface="content"
                            isEnrollGated={false}
                            isAssessmentLive={false}
                            onOpenAiChat={() => {}}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="Lesson reading route — this layout never knows what its children render." />
                        </LearnShell>
                    ),
                },
                {
                    name: "activeSurface = \"leaderboard\"",
                    why: "Same shape, different surface: the real layout would mount the desktop `LeaderboardCategoryRail` half here instead — also out of this task's compose list, so the rail still resolves to the same `Spinner` gap. Proof the rail's PRESENCE, not its body, is what `activeSurface` decides here.",
                    code: "<LearnShell activeSurface=\"leaderboard\" isEnrollGated={false} isAssessmentLive={false} onOpenAiChat={openAiChat} onOpenSelectionAsk={openSelectionAsk}>{routeContent}</LearnShell>",
                    render: (
                        <LearnShell
                            activeSurface="leaderboard"
                            isEnrollGated={false}
                            isAssessmentLive={false}
                            onOpenAiChat={() => {}}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="Leaderboard route." />
                        </LearnShell>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — a surface with no rail at all: `children` fills the full width. */
export const NoRailSurface: Story = {
    render: () => (
        <BlockAnatomy
            name="LearnShell"
            tier="screen"
            leaf="No rail surface"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "activeSurface = \"personalProject\"",
                    why: "The personal-project workspace is its own full-bleed area (if anything, it owns its own internal chrome) — the shared rail simply does not mount, so this loses the whole `ResizableRail` node rather than rendering it empty.",
                    code: "<LearnShell activeSurface=\"personalProject\" isEnrollGated={false} isAssessmentLive={false} onOpenAiChat={openAiChat} onOpenSelectionAsk={openSelectionAsk}>{routeContent}</LearnShell>",
                    render: (
                        <LearnShell
                            showAnatomy
                            anatPart="LearnShell"
                            activeSurface="personalProject"
                            isEnrollGated={false}
                            isAssessmentLive={false}
                            onOpenAiChat={() => {}}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="Personal-project workspace — full width, no shared rail." />
                        </LearnShell>
                    ),
                },
                {
                    name: "activeSurface = \"other\"",
                    why: "The safe default for any surface not named above: no rail unless a surface is explicitly known to have one.",
                    code: "<LearnShell activeSurface=\"other\" isEnrollGated={false} isAssessmentLive={false} onOpenAiChat={openAiChat} onOpenSelectionAsk={openSelectionAsk}>{routeContent}</LearnShell>",
                    render: (
                        <LearnShell
                            activeSurface="other"
                            isEnrollGated={false}
                            isAssessmentLive={false}
                            onOpenAiChat={() => {}}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="Some other learn surface." />
                        </LearnShell>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — a live text selection **gains** the `ContentAiSelectionAsk` pill alongside the FAB. */
export const SelectionAskActive: Story = {
    render: () => (
        <BlockAnatomy
            name="LearnShell"
            tier="screen"
            leaf="Selection-ask active"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "selectionAsk = { anchor, isNew: true }",
                    why: "The real route (`ContentArticle`'s owner, per `ContentAiSelectionAsk`'s own file header) resolved a live, non-collapsed text selection and handed this layout the viewport point — this layout only draws the pill there, it never tracks the selection itself. A whole extra floating node appears alongside the FAB, not a prop flip on the FAB.",
                    code: `<LearnShell
    activeSurface="content"
    isEnrollGated={false}
    isAssessmentLive={false}
    onOpenAiChat={openAiChat}
    selectionAsk={{ anchor: { x: 420, y: 220 }, isNew: true }}
    onOpenSelectionAsk={openSelectionAsk}
>
    {routeContent}
</LearnShell>`,
                    render: (
                        <LearnShell
                            showAnatomy
                            anatPart="LearnShell"
                            activeSurface="content"
                            isEnrollGated={false}
                            isAssessmentLive={false}
                            onOpenAiChat={() => {}}
                            selectionAsk={{ anchor: { x: 420, y: 220 }, isNew: true }}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="A reader just selected a passage of this content." />
                        </LearnShell>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — `isAssessmentLive` **loses** BOTH AI trigger nodes at once. */
export const AiSuppressed: Story = {
    render: () => (
        <BlockAnatomy
            name="LearnShell"
            tier="screen"
            leaf="AI suppressed"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isAssessmentLive = true",
                    why: "A timed/live assessment is running — asking AI would be cheating, so BOTH triggers are structurally absent, not merely hidden behind a disabled state. Mirrors `MindMapPage`'s `StandaloneLoading` leaf: multiple floating nodes disappear together as one structural change.",
                    code: `<LearnShell
    activeSurface="content"
    isEnrollGated={false}
    isAssessmentLive
    onOpenAiChat={openAiChat}
    onOpenSelectionAsk={openSelectionAsk}
>
    {routeContent}
</LearnShell>`,
                    render: (
                        <LearnShell
                            showAnatomy
                            anatPart="LearnShell"
                            activeSurface="content"
                            isEnrollGated={false}
                            isAssessmentLive
                            onOpenAiChat={() => {}}
                            selectionAsk={{ anchor: { x: 420, y: 220 } }}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="A live challenge/assessment route." />
                        </LearnShell>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — `isEnrollGated` **replaces** the whole rail+children row with `EnrollGate`. */
export const EnrollGated: Story = {
    render: () => (
        <BlockAnatomy
            name="LearnShell"
            tier="screen"
            leaf="Enroll gated"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isEnrollGated = true, enrollGateProps.preview set",
                    why: "A trial viewer hit the personal-project surface without enrollment. `EnrollGate` — shown IN PLACE OF the surface, per its own file header — takes over completely: no rail, no children, no AI triggers (there is nothing real yet to ask about). `preview` is relayed straight through from the caller, the same slot `EnrollGate` already owns one layer down.",
                    code: `<LearnShell
    activeSurface="personalProject"
    isEnrollGated
    isAssessmentLive={false}
    enrollGateProps={{
        title: "Mở khoá Dự án cá nhân",
        description: "Ghi danh để làm capstone thật, chấm điểm bằng AI.",
        preview: <PersonalProjectGatePreview {...} />,
        price: { discountedVnd: 1990000, originalVnd: 2990000 },
        onEnroll: () => {},
    }}
    onOpenAiChat={openAiChat}
    onOpenSelectionAsk={openSelectionAsk}
>
    {routeContent}
</LearnShell>`,
                    render: (
                        <LearnShell
                            showAnatomy
                            anatPart="LearnShell"
                            activeSurface="personalProject"
                            isEnrollGated
                            isAssessmentLive={false}
                            enrollGateProps={{
                                title: "Mở khoá Dự án cá nhân",
                                description: "Ghi danh để làm capstone thật, chấm điểm bằng AI.",
                                preview: <MockPreview />,
                                price: { discountedVnd: 1_990_000, originalVnd: 2_990_000 },
                                onEnroll: () => {},
                            }}
                            onOpenAiChat={() => {}}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="Never reached — EnrollGate replaces this entirely." />
                        </LearnShell>
                    ),
                },
                {
                    name: "isEnrollGated = true, enrollGateProps.preview omitted",
                    why: "No teaser was resolved for this surface — `EnrollGate` falls back to its own `Standalone` shape, the card centered alone. `LearnShell` never decides this itself; it only forwards whatever `preview` the caller resolved.",
                    code: `<LearnShell
    activeSurface="personalProject"
    isEnrollGated
    isAssessmentLive={false}
    enrollGateProps={{
        title: "Mở khoá Dự án cá nhân",
        description: "Ghi danh để làm capstone thật, chấm điểm bằng AI.",
        price: { discountedVnd: 1990000, originalVnd: 2990000 },
        onEnroll: () => {},
    }}
    onOpenAiChat={openAiChat}
    onOpenSelectionAsk={openSelectionAsk}
>
    {routeContent}
</LearnShell>`,
                    render: (
                        <LearnShell
                            activeSurface="personalProject"
                            isEnrollGated
                            isAssessmentLive={false}
                            enrollGateProps={{
                                title: "Mở khoá Dự án cá nhân",
                                description: "Ghi danh để làm capstone thật, chấm điểm bằng AI.",
                                price: { discountedVnd: 1_990_000, originalVnd: 2_990_000 },
                                onEnroll: () => {},
                            }}
                            onOpenAiChat={() => {}}
                            onOpenSelectionAsk={() => {}}
                        >
                            <RouteContent label="Never reached — EnrollGate replaces this entirely." />
                        </LearnShell>
                    ),
                },
            ]}
        />
    ),
}
