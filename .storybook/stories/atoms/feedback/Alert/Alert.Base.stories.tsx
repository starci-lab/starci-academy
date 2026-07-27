import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Alert, type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Alert.Base`: the ONE port down to HeroUI Alert (`Feedback.Callout`
 * and `Toast.Base` both compose from here).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the law of the ATOM TIER). This file's earlier
 * version used §14d.2's reasoning ("leaf = structure, state shares a leaf") —
 * WRONG for an atom: §14d.2 is for design/block/screen (see the warning at
 * the top of `Chip.Base.stories.tsx`). At the atom tier, `tone`/`icon`/`body`/
 * `action`/`onClose` each change a real SHAPE (a different fill, a different
 * added node), so each gets its own leaf; the two old leaves (`Statuses`,
 * `WithActionAndClose`) completely missed `icon` and `body` — two props whose
 * shape had never once been shown anywhere.
 *
 * The ONE true DEP: the `Close` node — the atom builds the × button ITSELF
 * from `Button.Base` (not a slot the caller supplies), so it's clickable
 * through to its story. `action` is a slot where the caller supplies ANY node
 * (not specifically `Button.Base`), so it does not count as a dep.
 */
const meta: Meta<typeof Alert.Base> = {
    title: "Atoms/Feedback/Alert/Alert.Base",
    component: Alert.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Alert.Base>

/** The one node pointing to ANOTHER story: the × button is always `Button.Base` (the atom builds it itself, not a caller slot). */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Close: {
        tier: "atom",
        role: "the × button — Alert.Base always builds it from Button.Base, ghost variant toned to status",
        storyId: "atoms-buttons-button-button-base--default",
    },
}

/** The FULL `AlertStatus` union — miss one value and it grows into a stray leaf somewhere else. */
const STATUSES: Array<{ status: AlertStatus; title: string; description: string }> = [
    { status: "default", title: "Neutral note", description: "Carries no valence — for supporting information." },
    { status: "accent", title: "Study tip", description: "Review the cards due today before starting a new lesson." },
    { status: "success", title: "Submission saved", description: "Grading results will be ready in a few minutes." },
    { status: "warning", title: "You haven't joined the course's GitHub team", description: "Some labs need repo access — join to unlock them." },
    { status: "danger", title: "Couldn't load the content", description: "The connection dropped — try again in a moment." },
]

/** The BARE leaf — only `title`, every other prop stays default (status=default, tone=soft, no icon/description/body/action/close). */
export const Default: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Bare alert"
                annotate={ANNOTATE}
                reason="The one port down to HeroUI Alert — Feedback.Callout and Toast.Base both compose from here. Every leaf below differs by exactly one prop, so this is the baseline you compare against."
                note="Only `title` — default status, default soft tone, no description, body, custom icon, action, or close."
                code={"<Alert.Base title=\"Note saved\" />"}
            >
                <Alert.Base title="Note saved" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `status` — 5 MEANINGS, renders the FULL union. Changes the tint + default icon + Title colour all at once. */
export const Statuses: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `status`"
                annotate={ANNOTATE}
                reason="`status` picks the tint, the default icon, and the title colour at once — so you cannot accidentally pair a glyph with the wrong valence of text."
                note="All five statuses share one DOM tree and differ only in tint, glyph, and colour — a value never earns its own leaf."
                code={STATUSES.map(({ status, title, description }) => `<Alert.Base status="${status}" title="${title}" description="${description}" />`).join("\n")}
            >
                <div className="flex w-full flex-col gap-3">
                    {STATUSES.map(({ status, title, description }, index) => (
                        <Alert.Base key={status} status={status} title={title} description={description} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — about WHERE it sits, not a new colour: `soft` is flat, INSIDE a surface; `plain` keeps HeroUI's own tint so the alert floats (toast). */
export const Tone: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `tone`"
                annotate={ANNOTATE}
                reason="`tone` is about WHERE the alert sits, not a new colour — same status, two tones, two different contexts to read."
                note="`soft` is the shape Feedback.Callout uses (a flat tint strip inside a surface). `plain` is the shape Toast.Base uses (HeroUI's own tint, meant to float)."
                code={"<Alert.Base tone=\"soft\" status=\"warning\" title=\"…\" />\n<Alert.Base tone=\"plain\" status=\"warning\" title=\"…\" />"}
            >
                <div className="flex flex-col gap-3">
                    <Alert.Base tone="soft" status="warning" title="Flat tint (soft)" description="The shape Feedback.Callout uses — a flat strip inside a surface." showAnatomy />
                    <Alert.Base tone="plain" status="warning" title="Default tint (plain)" description="The shape Toast.Base uses — HeroUI's own tint, meant to float." />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `icon` — replaces the status's default glyph with a different icon COMPONENT. */
export const Icon: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `icon`"
                annotate={ANNOTATE}
                note="Leave it out and the status glyph shows. Pass `icon` and the atom still pins size-5 itself (§4/§5) — only the glyph changes."
                code={"<Alert.Base status=\"warning\" title=\"…\" />\n<Alert.Base status=\"warning\" icon={GithubLogoIcon} title=\"…\" />"}
            >
                <div className="flex flex-col gap-3">
                    <Alert.Base status="warning" title="Default icon" description="No `icon` passed — falls back to the status glyph." showAnatomy />
                    <Alert.Base status="warning" icon={GithubLogoIcon} title="Join the GitHub team" description="A custom icon replaces the status default." />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `body` (§12b) — the free-form area under the description, the ONLY way in since the atom does not open `children`. */
export const Body: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `body`"
                annotate={ANNOTATE}
                reason="The atom does not open `children` (§12b) — `body` is the only way in for free-form content (a short list, a meta row) under the description."
                note="`body` renders directly below Description, indented to the same column as Content."
                code={"<Alert.Base status=\"warning\" title=\"…\" description=\"…\" body={<ul>…</ul>} />"}
            >
                <Alert.Base
                    status="warning"
                    title="Submission is missing 2 items"
                    description="Add them, then resubmit for grading."
                    body={(
                        <ul className="list-disc space-y-1 pl-4 text-sm">
                            <li>A README describing how to run the project</li>
                            <li>A screenshot of the result</li>
                        </ul>
                    )}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `action` — a free-form NODE slot from the caller, placed before the × button. NOT a dep since the atom owns nothing inside it. */
export const Action: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `action`"
                annotate={ANNOTATE}
                note="`action` takes any node (usually `Button.Base`, but the atom does not force it) — the atom only places it before the ×, and owns nothing inside, so it is not a dep."
                code={"<Alert.Base status=\"warning\" title=\"…\" action={<Button.Base size=\"sm\" label=\"Join team\" onPress={fn} />} />"}
            >
                <Alert.Base
                    status="warning"
                    title="You haven't joined the course's GitHub team"
                    description="Some labs need repo access — join to unlock them."
                    action={<Button.Base size="sm" label="Join team" onPress={() => {}} />}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `onClose` — the atom builds the × button ITSELF from `Button.Base`. The `Close` node is this atom's ONE true DEP. */
export const Close: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `onClose`"
                annotate={ANNOTATE}
                reason="Pass a handler and the alert grows a status-toned × — built internally from Button.Base, so this is the one node in the atom that jumps to another story."
                note="`closeAriaLabel` gives the × its accessible name."
                code={"<Alert.Base status=\"warning\" title=\"…\" onClose={fn} closeAriaLabel=\"Close\" />"}
            >
                <Alert.Base
                    status="warning"
                    title="You haven't joined the course's GitHub team"
                    description="Some labs need repo access — join to unlock them."
                    onClose={() => {}}
                    closeAriaLabel="Close"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c): the frame + icon stay REAL, only the text turns to bars. */
export const Skeleton: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state — the atom draws its own shimmer instead of leaning on a shared skeleton component."
                note="The bars match the real line boxes (title 24px, description 20px) so the layout does not jump when the data lands (§8). `title` becomes optional under `isSkeleton` (union type)."
                code={"<Alert.Base status=\"accent\" isSkeleton />\n<Alert.Base status=\"danger\" tone=\"plain\" isSkeleton />"}
            >
                <div className="flex flex-col gap-3">
                    <Alert.Base status="accent" isSkeleton showAnatomy />
                    <Alert.Base status="danger" tone="plain" isSkeleton />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
