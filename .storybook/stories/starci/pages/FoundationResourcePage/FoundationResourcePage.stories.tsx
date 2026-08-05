import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationResourcePage } from "@sb-components/starci/pages/FoundationResourcePage/FoundationResourcePage"
import { FoundationKind } from "@sb-components/starci/blocks/learn/FoundationHeader/FoundationHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FoundationResourcePage` — the screen for one foundation resource's own page.
 * Three functions, in reading order: say if this trial learner should upgrade ·
 * what the resource is · the resource itself. The trial banner sits outside the
 * `isEmpty` switch — it answers whether the learner is on a trial, unrelated to
 * whether the resource id resolved, and self-hides on its own grounds. Three
 * leaves: `Resource` (identity + body, kind switched as data inside
 * `FoundationResourceBody`) · `Empty` (the id resolved to nothing) · `Skeleton`.
 */
const meta: Meta<typeof FoundationResourcePage> = {
    title: "StarCi/Pages/FoundationResourcePage/FoundationResourcePage",
    component: FoundationResourcePage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationResourcePage>

const CRUMBS = [
    { key: "home", label: "Home", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "hub", label: "Foundations", onPress: () => {} },
    { key: "category", label: "Linux basics", onPress: () => {} },
]

const TAGS = [
    { key: "linux", label: "Linux" },
    { key: "shell", label: "Shell" },
]

const MARKDOWN_BODY = `## Managing processes in Linux

Every process has a PID, a state, and a set of signals it can receive —
\`kill -9\` isn't the only "correct" way to stop a program.

- \`ps aux\` lists every process currently running on the system
- \`SIGTERM\` gives a process a chance to clean up before exiting, \`SIGKILL\` does not

\`\`\`bash
kill -TERM 1234
\`\`\`

Keep reading below to see how the shell tracks its child processes.`

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning the seam between the trial banner and the resource below it, and again between the resource's identity and its body", storyId: "frames-stack-stackv--default" },
    "TrialEnrollBanner": { tier: "block", role: "say if this trial learner should upgrade; self-hides once enrolled or before status is known", storyId: "starci-blocks-learn-trialenrollbanner-trialenrollbanner--banner" },
    "FoundationHeader": { tier: "block", role: "what this resource is: trail, title, description, kind, recommended flag, tags and author", storyId: "starci-blocks-learn-foundationheader-foundationheader--overview" },
    "FoundationResourceBody": { tier: "block", role: "the resource itself, shaped by its kind: a reading article, an honestly-gapped video slot, or an open-link button", storyId: "starci-blocks-learn-foundationresourcebody-foundationresourcebody--document" },
    "FoundationResourceEmpty": { tier: "block", role: "the resource id resolved to nothing; replaces the identity + body pair wholesale", storyId: "starci-blocks-learn-foundationresourceempty-foundationresourceempty--empty" },
}

/** LEAF — the resource open: trial banner (if applicable), identity, then body. Kind is a DATA condition, not a structural one — the screen's own tree never changes across it. */
export const Resource: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationResourcePage"
                tier="screen"
                leaf="Resource"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "kind = document, trial learner, fully described",
                        why: "Every optional field is present and the viewer is on an unconverted trial, so both the nudge banner and the richest header shape show together: kind chip, recommended pill, tags, author, then the article in its own card. This is the anatomy reference.",
                        code: `<FoundationResourcePage
    breadcrumbItems={crumbs}
    title="Managing processes in Linux"
    kind={FoundationKind.Document}
    isRecommended
    tags={tags}
    author="Rob Pike"
    markdownBody={body}
    isEnrollmentKnown
    isEnrolled={false}
    onEnroll={handleEnroll}
/>`,
                        render: (
                            <FoundationResourcePage

                                breadcrumbItems={CRUMBS}
                                title="Managing processes in Linux"
                                description="Processes, signals, and how the shell tracks a running program."
                                kind={FoundationKind.Document}
                                isRecommended
                                tags={TAGS}
                                author="Rob Pike"
                                markdownBody={MARKDOWN_BODY}
                                isEnrollmentKnown
                                isEnrolled={false}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                    {
                        name: "kind = video, already enrolled",
                        why: "The viewer has already paid, so the trial banner renders nothing at all — the screen hands over the same facts either way, the block decides. The header drops to its bare required chip, and the body draws the honest §B3 gap in place of a player nobody built yet.",
                        code: `<FoundationResourcePage
    kind={FoundationKind.Video}
    isEnrollmentKnown
    isEnrolled
    …
/>`,
                        render: (
                            <FoundationResourcePage
                                breadcrumbItems={CRUMBS}
                                title="Introduction to Docker networking"
                                kind={FoundationKind.Video}
                                isEnrollmentKnown
                                isEnrolled
                                onEnroll={() => {}}
                            />
                        ),
                    },
                    {
                        name: "kind = external_link, enrollment not known yet",
                        why: "Status hasn't resolved, so the banner stays hidden rather than guess — same self-hiding ground as the block's own `Hidden` leaf. The body draws a single \"open\" button and hands the resolved URL to `onOpenLink`; the screen decides nothing about what \"open\" means.",
                        code: `<FoundationResourcePage
    kind={FoundationKind.ExternalLink}
    linkTitle="Official Docker documentation"
    linkUrl="https://docs.docker.com"
    onOpenLink={(url) => window.open(url, "_blank", "noopener,noreferrer")}
    isEnrollmentKnown={false}
    isEnrolled={false}
    …
/>`,
                        render: (
                            <FoundationResourcePage
                                breadcrumbItems={CRUMBS}
                                title="Official Docker networking documentation"
                                kind={FoundationKind.ExternalLink}
                                linkTitle="Official Docker documentation"
                                linkUrl="https://docs.docker.com"
                                onOpenLink={() => {}}
                                isEnrollmentKnown={false}
                                isEnrolled={false}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the resource id resolved to nothing ⇒ **the identity + body pair is replaced wholesale**, not just emptied out one field at a time. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationResourcePage"
                tier="screen"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isEmpty = true",
                        why: "The resource id didn't resolve to anything — a stale link or a removed resource. The trial banner keeps its own place above it (it answers a different question), but the header and body are gone, replaced by one honest empty message instead of a blank card or a dangling title.",
                        code: `<FoundationResourcePage
    isEmpty
    isEnrollmentKnown
    isEnrolled={false}
    …
/>`,
                        render: (
                            <FoundationResourcePage

                                breadcrumbItems={CRUMBS}
                                title=""
                                kind={FoundationKind.Document}
                                isEmpty
                                isEnrollmentKnown
                                isEnrolled={false}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every mirrorable block draws its own resting shape. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationResourcePage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The header and body each mirror their own resting shape — the flag flows straight down, the screen builds no shimmer tree of its own. The trial banner has no `isSkeleton` of its own (its file header: the real banner only appears or stays absent, never shimmers), so it is held back by `isEnrollmentKnown = false` until the caller actually knows the answer.",
                        code: "<FoundationResourcePage {...props} isSkeleton isEnrollmentKnown={false} />",
                        render: (
                            <FoundationResourcePage

                                breadcrumbItems={CRUMBS}
                                title=""
                                kind={FoundationKind.Document}
                                isSkeleton
                                isEnrollmentKnown={false}
                                isEnrolled={false}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
