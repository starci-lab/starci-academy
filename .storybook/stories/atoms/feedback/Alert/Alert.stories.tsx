import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Alert`: the one port down to HeroUI Alert (`Callout` and `Toast` both compose from here).
 * 
 * 1 PROP = 1 LEAF. At the atom tier, `tone`/`icon`/`body`/`action`/`onClose` each change a
 * real shape (a different fill, a different added node), so each gets its own leaf.
 * 
 * The one true DEP: the `Close` node — the atom builds the × button itself from `Button`
 * (not a caller slot), so it's clickable through to its story. `action` is a slot where the
 * caller supplies any node, so it does not count as a dep.
 */
const meta: Meta<typeof Alert> = {
    title: "Atoms/Feedback/Alert/Alert",
    component: Alert,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Alert>

/**
 * `Alert.Indicator`/`Alert.Content`/`Alert.Title`/`Alert.Description` are direct
 * HeroUI compound-component renders — `tier: "heroui"`, no `storyId`. `Skeleton`
 * covers both shimmer bars (title + description), same HeroUI import either way.
 * `Button` is the one node pointing to ANOTHER story of ours: the × button
 * is always built from it (the atom builds it itself, not a caller slot).
 *
 * ⚠️ 2026-07-28 (naming pass): renamed from role-words `Icon`/`Content`/`Title`/
 * `Description`/`Close` to the real component each node renders.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Alert.Indicator": {
        tier: "heroui",
        role: "wraps the status glyph (default or caller-supplied icon) at a fixed size-5",
    },
    "Alert.Content": {
        tier: "heroui",
        role: "wraps the title, description, and optional body column",
    },
    "Alert.Title": {
        tier: "heroui",
        role: "the required title line, coloured by status",
    },
    "Alert.Description": {
        tier: "heroui",
        role: "the optional supporting line under the title",
    },
    "Skeleton": {
        tier: "heroui",
        role: "shimmer bar mirroring either the title or the description line box — the frame and icon stay real",
    },
    "Button": {
        tier: "atom",
        role: "the × button — Alert always builds it from Button, ghost variant toned to status",
        storyId: "atoms-buttons-button-button--default",
    },
}

/** The BARE leaf — only `title`, every other prop stays default (status=default, tone=soft, no icon/description/body/action/close). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Bare alert"
                annotate={ANNOTATE}
                reason="The one port down to HeroUI Alert — Callout and Toast both compose from here. Every leaf below differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "only title set, everything else default",
                        why: "Only the title line renders — default status tint, default soft tone, and no description, body, custom icon, action, or close button. This is what a caller gets by supplying nothing but the required text.",
                        code: "<Alert title=\"Note saved\" />",
                        render: <Alert title="Note saved" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `status` — 5 MEANINGS, renders the FULL union. Changes the tint + default icon + Title colour all at once. */
export const Statuses: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `status`"
                annotate={ANNOTATE}
                reason="`status` picks the tint, the default icon, and the title colour all at once, so a caller can never accidentally pair a glyph with the wrong valence of text. All five statuses share one DOM tree and differ only in tint, glyph, and colour."
                states={[
                    {
                        name: "status = \"default\"",
                        why: "The alert takes a neutral tint with no default icon and a plain title colour. This valence carries no urgency at all — it's for supporting information that isn't good or bad news.",
                        code: "<Alert status=\"default\" title=\"Neutral note\" description=\"Carries no valence — for supporting information.\" />",
                        render: <Alert status="default" title="Neutral note" description="Carries no valence — for supporting information." />,
                    },
                    {
                        name: "status = \"accent\"",
                        why: "The alert takes the accent tint and its matching default icon. This valence is for a helpful tip, not a warning or an error.",
                        code: "<Alert status=\"accent\" title=\"Study tip\" description=\"Review the cards due today before starting a new lesson.\" />",
                        render: <Alert status="accent" title="Study tip" description="Review the cards due today before starting a new lesson." />,
                    },
                    {
                        name: "status = \"success\"",
                        why: "The alert takes the success tint and its matching check-style icon. This valence confirms something the reader did went through correctly.",
                        code: "<Alert status=\"success\" title=\"Submission saved\" description=\"Grading results will be ready in a few minutes.\" />",
                        render: <Alert status="success" title="Submission saved" description="Grading results will be ready in a few minutes." />,
                    },
                    {
                        name: "status = \"warning\"",
                        why: "The alert takes the warning tint and its matching caution icon. This valence flags something worth the reader's attention before it becomes a real problem.",
                        code: "<Alert status=\"warning\" title=\"You haven't joined the course's GitHub team\" description=\"Some labs need repo access — join to unlock them.\" />",
                        render: <Alert status="warning" title="You haven't joined the course's GitHub team" description="Some labs need repo access — join to unlock them." />,
                    },
                    {
                        name: "status = \"danger\"",
                        why: "The alert takes the danger tint and its matching error icon. This valence marks something that already failed and needs the reader to act.",
                        code: "<Alert status=\"danger\" title=\"Couldn't load the content\" description=\"The connection dropped — try again in a moment.\" />",
                        render: <Alert status="danger" title="Couldn't load the content" description="The connection dropped — try again in a moment." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `tone` — about WHERE it sits, not a new colour: `soft` is flat, INSIDE a surface; `plain` keeps HeroUI's own tint so the alert floats (toast). */
export const Tone: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `tone`"
                annotate={ANNOTATE}
                reason="`tone` is about WHERE the alert sits, not a new colour — the same status renders in two different tones for two different contexts to read."
                states={[
                    {
                        name: "tone = \"soft\"",
                        why: "The alert renders as a flat tint strip, the shape `Callout` uses when it sits inside a surface. This tone reads as belonging to the page it's embedded in, not floating above it.",
                        code: "<Alert tone=\"soft\" status=\"warning\" title=\"…\" />",
                        render: <Alert tone="soft" status="warning" title="Flat tint (soft)" description="The shape Callout uses — a flat strip inside a surface." />,
                    },
                    {
                        name: "tone = \"plain\"",
                        why: "The alert keeps HeroUI's own default tint, the shape `Toast` uses. This tone reads as floating above the page rather than embedded in it, matching a toast's brief, detached appearance.",
                        code: "<Alert tone=\"plain\" status=\"warning\" title=\"…\" />",
                        render: <Alert tone="plain" status="warning" title="Default tint (plain)" description="The shape Toast uses — HeroUI's own tint, meant to float." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `icon` — replaces the status's default glyph with a different icon COMPONENT. */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `icon`"
                annotate={ANNOTATE}
                reason="A caller can replace the status's default glyph with any icon component while keeping the status's own tint — the size-5 dimension always stays pinned by the atom itself (§4/§5), only the glyph changes."
                states={[
                    {
                        name: "icon unset",
                        why: "The alert falls back to the status glyph — here, the warning triangle. This is the default whenever a caller doesn't need a more specific icon than the status already implies.",
                        code: "<Alert status=\"warning\" title=\"…\" />",
                        render: <Alert status="warning" title="Default icon" description="No `icon` passed — falls back to the status glyph." />,
                    },
                    {
                        name: "icon set",
                        why: "A custom icon component takes the glyph's place, still pinned to the same size-5 box and still coloured by the status. Only the shape of the glyph itself changes.",
                        code: "<Alert status=\"warning\" icon={GithubLogoIcon} title=\"…\" />",
                        render: <Alert status="warning" icon={GithubLogoIcon} title="Join the GitHub team" description="A custom icon replaces the status default." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `body` (§12b) — the free-form area under the description, the ONLY way in since the atom does not open `children`. */
export const Body: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `body`"
                annotate={ANNOTATE}
                reason="The atom does not open `children` (§12b) — `body` is the only way in for free-form content like a short list or a meta row underneath the description."
                states={[
                    {
                        name: "body set",
                        why: "A `body` node grows directly below `Description`, indented to the same column as the rest of the content. Here it holds a short bulleted checklist, but the atom accepts any node — it never inspects what's inside.",
                        code: "<Alert status=\"warning\" title=\"…\" description=\"…\" body={<ul>…</ul>} />",
                        render: (
                            <Alert
                                status="warning"
                                title="Submission is missing 2 items"
                                description="Add them, then resubmit for grading."
                                body={(
                                    <ul data-tier="fixture" className="list-disc space-y-1 pl-4 text-sm">
                                        <li>A README describing how to run the project</li>
                                        <li>A screenshot of the result</li>
                                    </ul>
                                )}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `action` — a free-form NODE slot from the caller, placed before the × button. NOT a dep since the atom owns nothing inside it. */
export const Action: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `action`"
                annotate={ANNOTATE}
                reason="`action` takes any node from the caller — usually `Button`, but the atom never forces that — and only places it before the × button. Because the atom owns nothing inside it, `action` is not a dep, unlike the `Close` node it sits beside."
                states={[
                    {
                        name: "action set",
                        why: "An action node renders before where the × button would sit, here a `Join team` button. This is how a caller gives the alert its own CTA without the atom needing to know what that control is.",
                        code: "<Alert status=\"warning\" title=\"…\" action={<Button size=\"sm\" label=\"Join team\" onPress={fn} />} />",
                        render: (
                            <Alert
                                status="warning"
                                title="You haven't joined the course's GitHub team"
                                description="Some labs need repo access — join to unlock them."
                                action={<Button size="sm" label="Join team" onPress={() => {}} />}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `onClose` — the atom builds the × button ITSELF from `Button`. The `Close` node is this atom's ONE true DEP. */
export const Close: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `onClose`"
                annotate={ANNOTATE}
                reason="Passing a handler grows a status-toned × button built internally from `Button` — the one node in this atom that jumps to another story, since the atom builds it itself rather than accepting it as a slot."
                states={[
                    {
                        name: "onClose set",
                        why: "A status-toned × button grows at the trailing edge of the alert, clickable through to its own `Button` story. `closeAriaLabel` gives that × its accessible name.",
                        code: "<Alert status=\"warning\" title=\"…\" onClose={fn} closeAriaLabel=\"Close\" />",
                        render: (
                            <Alert
                                status="warning"
                                title="You haven't joined the course's GitHub team"
                                description="Some labs need repo access — join to unlock them."
                                onClose={() => {}}
                                closeAriaLabel="Close"
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c): the frame + icon stay REAL, only the text turns to bars. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state — the atom draws its own shimmer instead of leaning on a shared skeleton component. The bars match the real line boxes (title 24px, description 20px) so the layout does not jump when data lands (§8); `title` becomes optional under `isSkeleton` (a union type)."
                states={[
                    {
                        name: "isSkeleton = true, status = \"accent\", tone = \"soft\" (default)",
                        why: "The frame and icon stay real — only the title and description turn into shimmer bars sized to the real line boxes they will become. The status tint is still visible on the frame even while the text is loading.",
                        code: "<Alert status=\"accent\" isSkeleton />",
                        render: <Alert status="accent" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, status = \"danger\", tone = \"plain\"",
                        why: "The same shimmer bars render, this time on the floating `plain` tone instead of the flat `soft` strip. Combining `tone` with `isSkeleton` proves the two props are independent of each other.",
                        code: "<Alert status=\"danger\" tone=\"plain\" isSkeleton />",
                        render: <Alert status="danger" tone="plain" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
