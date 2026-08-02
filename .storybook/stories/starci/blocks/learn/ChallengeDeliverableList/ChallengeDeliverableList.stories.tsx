import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeDeliverableList, type ChallengeDeliverableItem } from "@sb-components/starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChallengeDeliverableList` — the "Submit assignment" card: one
 * `SurfaceCard.Accordion` row per challenge requirement, its trigger a live
 * status, its panel the submission form plus, once graded, the verdict and its
 * reasons. `graded` toggles a state inside the same leaf. How many requirements,
 * which are graded, and whether a submission is mid-flight are all data.
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
        title: "Design the API",
        points: 30,
        status: "todo",
        description: "Sketch the **resource** diagram and list the method/status code for each endpoint.",
        url: "",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
    {
        id: "readme",
        title: "Write the README",
        points: 10,
        status: "todo",
        url: "github.com/hocvien/api-design",
        urlError: "URL must start with https://",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
    {
        id: "unit-test",
        title: "Write unit tests",
        points: 24,
        status: "failed",
        description: "Cover the error branches of the order-creation endpoint.",
        url: "https://github.com/hocvien/api-design/pull/12",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "fail",
            earnedScore: 12,
            requiredScore: 24,
            attemptNumber: 2,
            processedAt: "09:12 15/07",
            shortFeedback: "Order-creation logic looks solid, but the test suite is still missing some important error branches.",
        },
    },
    {
        id: "deploy",
        title: "Deploy to staging",
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
            attemptNumber: 1,
            processedAt: "14:03 15/07",
            shortFeedback: "Deployment ran smoothly, just one small thing worth noting.",
        },
    },
]

const PENDING_ITEMS: Array<ChallengeDeliverableItem> = BASE_ITEMS.map((item) =>
    item.id === "api-design"
        ? { ...item, url: "https://github.com/hocvien/api-design/pull/1", isPending: true }
        : item,
)

/**
 * Grading runs in the
 * BACKGROUND, so a row has to hold up under all four job branches; these are
 * the two most worth seeing — in progress and failed.
 */
const GRADING_ITEMS: Array<ChallengeDeliverableItem> = BASE_ITEMS.map((item) =>
    item.id === "api-design"
        ? { ...item, url: "https://github.com/hocvien/api-design/pull/1", isPending: true, jobStatus: "processing" as const }
        : item,
)

const JOB_FAILED_ITEMS: Array<ChallengeDeliverableItem> = BASE_ITEMS.map((item) =>
    item.id === "api-design"
        ? {
            ...item,
            url: "https://github.com/hocvien/api-design/pull/1",
            jobStatus: "failed" as const,
            // RAW server error string, not translated — matches exactly what `src` prints (`activeJobError`).
            jobError: "Repository not accessible: 404 Not Found (github.com/hocvien/api-design)",
        }
        : item,
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the \"Submission\" card face, carrying the section label and the settings-trigger action in its header", storyId: "composites-cards-surfacecard-surfacecard--with-action" },
    "SurfaceCardAccordion": { tier: "composite", role: "one bounded surface of collapsible rows, taking each requirement's trigger + panel as data — the composite this run reuses instead of hand-rolling an accordion", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "StackV": { tier: "frame", role: "the vertical frame separating a panel's description, field, actions and graded result", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the action row, or a feedback item's severity chip beside its text", storyId: "frames-stack-stackh--default" },
    "InputText": { tier: "atom", role: "the submission URL field, its error line driven by `urlError`", storyId: "atoms-forms-input-inputtext--default" },
    "Button": { tier: "atom", role: "the settings trigger, or a panel's submit / view-history action", storyId: "atoms-buttons-button-button--default" },
    "MarkdownContent": { tier: "composite", role: "the requirement's own description, at the compact measure since it is a passenger inside the accordion rather than the page", storyId: "composites-viewers-markdowncontent--compact" },
    "EnumChip": { tier: "composite", role: "the pass/fail verdict chip", storyId: "composites-chips-enumchip--overview" },
    "Typography": { tier: "atom", role: "the trigger's points-or-score line, the graded score/requirement sentence, `shortFeedback`, or one feedback item's message/location/suggestion — flat list inside the graded `Disclosure`, ground truth `src`'s `LastAttemptResult.tsx`", storyId: "atoms-text-typography-typography--overview" },
    "ScoreValue": { tier: "composite", role: "the trigger's points-before-grading or earned/required-after-grading line, riding in `titleEnd`", storyId: "composites-texts-scorevalue--default" },
    "StatusIcon": { tier: "heroui", role: "the requirement's todo/done/failed mark, riding in `titleStart` — its own colour, independent of the title text" },
    "Disclosure": { tier: "composite", role: "the \"Latest feedback\" trigger — collapses `shortFeedback` + the itemized feedback list behind a click, since it's SECONDARY detail", storyId: "composites-layout-disclosure-disclosure--default" },
    "Callout": { tier: "composite", role: "the background grading job's status strip — warning while queued/processing, success once done, danger on failure with the raw server error as its body", storyId: "composites-feedback-callout--with-body" },
}

const autosaveStates = [
    () => (
        <ChallengeDeliverableList
            items={BASE_ITEMS}
            autosaveStatus="saving"
            onOpenGradingSettings={() => {}}
        />
    ),
    () => (
        <ChallengeDeliverableList
            items={BASE_ITEMS}
            autosaveStatus="failed"
            onOpenGradingSettings={() => {}}
        />
    ),
]

/** LEAF — the deliverables card. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeDeliverableList"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "4 requirements: not submitted · bad URL · failed with feedback · passed",
                        why: "One row shows the untouched state, one shows a URL validation error, one shows a failed grade with three feedback items across every severity, and one shows a pass with a single low-severity note. The first requirement still short of a pass — the failed one — opens by default rather than requirement #1, since that is the one the learner still owes.",
                        code: `<ChallengeDeliverableList
    items={items}
    onOpenGradingSettings={openSettings}
/>`,
                        render: (
                            <ChallengeDeliverableList

                               
                                items={BASE_ITEMS}
                                onOpenGradingSettings={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = true on one requirement",
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
                    {
                        name: "jobStatus = \"processing\" — AI is grading",
                        why: "Grading runs in the BACKGROUND: the submit mutation hands back a job id and the screen listens on a socket, so a row has to say where that job stands while nothing else about it has changed yet. The callout sits between the URL field and the action row — exactly where `src`'s `SubmissionRow` puts its own processing strip — and the row keeps `isPending` so the field stays locked underneath it.",
                        code: `<ChallengeDeliverableList
    items={items.map((item) => item.id === "api-design"
        ? { ...item, isPending: true, jobStatus: "processing" }
        : item)}
    onOpenGradingSettings={openSettings}
/>`,
                        render: (
                            <ChallengeDeliverableList
                                items={GRADING_ITEMS}
                                onOpenGradingSettings={() => {}}
                            />
                        ),
                    },
                    {
                        name: "jobStatus = \"failed\" + jobError",
                        why: "A failed grading job is not a validation error — the URL was fine, the run itself broke — so it reads as a danger callout rather than a red field. `jobError` prints VERBATIM: it is the server's own untranslated string, and dressing it up as friendly copy would hide which repository actually failed. The field unlocks again so the learner can fix the link and retry.",
                        code: `<ChallengeDeliverableList
    items={items.map((item) => item.id === "api-design"
        ? { ...item, jobStatus: "failed", jobError: "Repository not accessible: 404 Not Found" }
        : item)}
    onOpenGradingSettings={openSettings}
/>`,
                        render: (
                            <ChallengeDeliverableList
                                items={JOB_FAILED_ITEMS}
                                onOpenGradingSettings={() => {}}
                            />
                        ),
                    },
                    {
                        name: "autosaveStatus = \"saving\" · \"failed\"",
                        why: "Autosave is a PANEL-wide fact, not a per-row one: every URL field debounces into one batch sync, so one quiet line above the whole list carries it. `\"idle\"` has no member — the real panel draws nothing at all then, so \"no line\" is said by omitting the prop instead of by a value meaning \"draw nothing\". Only `failed` turns danger; `saving`/`saved` stay muted, since a save in progress is not a problem.",
                        code: `<ChallengeDeliverableList
    items={items}
    autosaveStatus="saving"
    onOpenGradingSettings={openSettings}
/>`,
                        render: (
                            <StackV gap={6} items={autosaveStates} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
