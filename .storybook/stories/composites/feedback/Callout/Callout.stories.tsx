import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE (§13) — `Callout`: a FLAT tint strip placed INSIDE a
 * surface (surface-in-surface), not a floating card. The shell owns the tint
 * + icon per `status`; content goes through the named slots
 * `title`/`description`/`body` (+`children`)/`action` + an optional close button.
 *
 * ⚠️ Split out of the `Feedback.*` namespace (2026-08-01) — this shell was
 * `Feedback.Callout` / `FeedbackCallout`. Props/behaviour UNCHANGED.
 *
 * ⚠️ STATE SCOPE (§12f): every story below only renders state that THIS shell
 * itself produces — `status`, with/without `description`, `body`, `action`,
 * `onClose`, `icon`. The CTA button's own state (pending/disabled) lives in
 * the `Atoms/Buttons/Button` story — this shell only accepts
 * `actionLabel`/`onAction`, never a node.
 *
 * 📐 LEAF = STRUCTURE (§14d.2, holds for a shell — unlike an atom, see the
 * warning in `Alert.stories.tsx`): `status` does NOT change the DOM tree — every
 * tone shares the same `Icon · Content(Title · Description)`, only the tint +
 * default glyph + Title colour differ ⇒ those are STATE, merged into ONE leaf.
 * The remaining leaves stay separate because each one adds/removes a REAL node
 * (drops `Description`, adds `Body`/`Action`/`Close`).
 *
 * Real deps: `Action` (the shell builds its own `Button` from `actionLabel`)
 * and `Close` (the shell forwards `onClose` down to the `Alert` atom, which
 * builds its own `Button` for the × button) — both are OTHER components with
 * their own story that the shell rebuilds. `Icon`/`Content`/`Title`/
 * `Description`/`Body` are the `Alert` atom's own internals (this shell
 * composes from it), NOT deps.
 */
const meta: Meta<typeof Callout> = {
    title: "Composites/Feedback/Callout",
    component: Callout,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Callout>

/** Two REAL nodes with their own story to jump to — both are `Button`s the shell/atom builds itself. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // The frame this composite is built ON. Without it the Deps tab was empty on every state
    // that passes neither `actionLabel` nor `onClose`, which is most of them.
    "Alert": {
        tier: "atom",
        role: "the whole SHAPE comes from this atom; the callout only sets content and tone",
        storyId: "atoms-feedback-alert-alert--action",
    },
    Action: {
        tier: "atom",
        role: "the CTA button, built from `actionLabel`/`onAction`, always a Button",
        storyId: "atoms-buttons-button-button--default",
    },
    Close: {
        tier: "atom",
        role: "the × button, forwarded to Alert, which always builds it from Button",
        storyId: "atoms-buttons-button-button--default",
    },
}

/**
 * The `status` axis — same DOM tree, only tint + default glyph + Title colour
 * change. So the whole set sits WITHIN one leaf (§14d.2), each tone is ONE
 * state, not split into its own story per tone.
 */

/** The base leaf — renders EVERY tone of the shell, each tone its own state (not a separate leaf). */
export const Default: Story = {
    name: "Tones",
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Callout"
                tier="composite"
                leaf="Full tone set"
                annotate={ANNOTATE}
                reason="The IN-PLACE notice frame: a flat tint strip (shadow-none) that sits INSIDE an existing surface, so it reads as a highlight, not a card-in-card. The frame owns the tint and default icon per status; the caller just supplies the copy. Every tone shares the same part tree (§14d.2); only the icon, tint, and title colour change, which is why the five below are states of one leaf rather than five leaves."
                states={[
                    {
                        name: "status = default",
                        why: "The strip carries a neutral tint and a default icon, with the same part tree as every other tone below. This is the shape for a low-stakes notice, such as confirming an autosave, that does not need to read as good or bad news.",
                        code: `<Callout
  status="default"
  title="Draft saved"
  description="Your changes are kept automatically."
/>`,
                        render: <Callout showAnatomy status="default" title="Draft saved" description="Your changes are kept automatically." />,
                    },
                    {
                        name: "status = accent",
                        why: "Only the tint, icon colour, and title colour switch to accent; the node tree stays identical to the default tone. This tone marks something worth a look rather than a warning, such as a chapter that just gained new content.",
                        code: `<Callout
  status="accent"
  title="Chapter 3 just got a new practice section"
  description="Reopen the chapter to try what's new."
/>`,
                        render: <Callout showAnatomy status="accent" title="Chapter 3 just got a new practice section" description="Reopen the chapter to try what's new." />,
                    },
                    {
                        name: "status = success",
                        why: "Only the tint, icon colour, and title colour switch to success; the node tree still matches the other tones. This tone confirms an outcome landed correctly, such as a submission the grader has accepted.",
                        code: `<Callout
  status="success"
  title="Submission successful"
  description="Results will be ready in a few minutes."
/>`,
                        render: <Callout showAnatomy status="success" title="Submission successful" description="Results will be ready in a few minutes." />,
                    },
                    {
                        name: "status = warning",
                        why: "Only the tint, icon colour, and title colour switch to warning; the node tree still matches the other tones. This tone flags something approaching that is not broken yet, such as a deadline a few days out.",
                        code: `<Callout
  status="warning"
  title="Deadline coming up"
  description="2 days left to finish this milestone."
/>`,
                        render: <Callout showAnatomy status="warning" title="Deadline coming up" description="2 days left to finish this milestone." />,
                    },
                    {
                        name: "status = danger",
                        why: "Only the tint, icon colour, and title colour switch to danger; the node tree still matches the other tones. This tone marks a real failure the reader has to act on, such as a dropped connection to the server.",
                        code: `<Callout
  status="danger"
  title="Couldn't reach the server"
  description="Check your connection and try again."
/>`,
                        render: <Callout showAnatomy status="danger" title="Couldn't reach the server" description="Check your connection and try again." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Edge case: `title` only — Content shrinks to exactly ONE line, no Description. */
export const TitleOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Callout"
                tier="composite"
                leaf="TitleOnly"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "description not set",
                        why: "Content shrinks to just the title, the thinnest strip this frame renders. A description line is only worth the space when there is a second sentence to add, and a short tip does not need one.",
                        code: `<Callout
  status="accent"
  title="Tip: highlight a passage to ask AI about it"
/>`,
                        render: <Callout showAnatomy status="accent" title="Tip: highlight a passage to ask AI about it" />,
                    },
                ]}
            />
        </div>
    ),
}

/** `body` (≡ `children`) — a FREE slot below the description, for content that isn't a single line of text. */
export const WithBody: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Callout"
                tier="composite"
                leaf="WithBody"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "body set (free-form node below description)",
                        why: "A free-form body region grows below the description, here a bulleted list rather than another line of text. The frame wraps this content (§13b) for a message that needs more than one line to say, such as naming the missing items one by one.",
                        code: `<Callout status="warning" title="Submission is missing 2 items" description="…">
  <ul className="list-disc pl-4">…</ul>
</Callout>`,
                        render: (
                            <Callout
                                showAnatomy
                                status="warning"
                                title="Submission is missing 2 items"
                                description="Add them, then resubmit for grading."
                                body={(
                                    <ul data-tier="fixture" className="list-disc space-y-1 pl-4">
                                        <li><Typography size="xs" text="A README describing how to run the project" color="muted" /></li>
                                        <li><Typography size="xs" text="A screenshot of the result" color="muted" /></li>
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

/**
 * `actionLabel`/`onAction` — a secondary CTA on the same row. The shell builds
 * the button ITSELF and applies its own skin per `status`; the caller only
 * supplies TEXT, never a `Button` (teacher confirmed 2026-07-25: a screen must
 * never hold an atom directly).
 */
export const WithAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Callout"
                tier="composite"
                leaf="WithAction"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "actionLabel set",
                        why: "A footer button grows before where the close button would sit, built by the frame itself with a solid background matched to the status. The caller only supplies the text, never a node, so a secondary CTA can never drift from the status tint it sits inside.",
                        code: `<Callout
  status="accent"
  title="Upgrade to unlock AI"
  actionLabel="Upgrade"
/>`,
                        render: (
                            <Callout
                                showAnatomy
                                status="accent"
                                title="Upgrade to unlock AI"
                                description="The paid plan enables advanced grading."
                                actionLabel="Upgrade"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `icon` — swaps the tone's default glyph for a different icon COMPONENT (the shell still forces size-6). */
export const CustomIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Callout"
                tier="composite"
                leaf="CustomIcon"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "icon set (overrides the status default)",
                        why: "The leading glyph swaps from the status's own default to whatever component is passed in, here the GitHub logo. The frame keeps forcing size-6 and the tone colour regardless, so the caller only ever chooses which glyph, never its size or colour.",
                        code: `<Callout
  status="warning"
  icon={GithubLogoIcon}
  title="You haven't joined the GitHub team"
  …
/>`,
                        render: (
                            <Callout
                                showAnatomy
                                status="warning"
                                icon={GithubLogoIcon}
                                title="You haven't joined the course's GitHub team"
                                description="Premium content lives in the course's GitHub repo, so you need to join the team to unlock it."
                                actionLabel="Join team"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `onClose` — a self-dismissible strip: adds a `Close` node (`Button` atom) at the end of the row. */
export const Dismissible: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Callout"
                tier="composite"
                leaf="Dismissible"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "onClose set",
                        why: "A × button grows at the tail, a ghost Button toned to the status rather than a raw glyph. The badge stops at that Close node and does not drill into the atom's own internals (§11a), so this leaf marks the strip as one a reader can dismiss on their own.",
                        code: `<Callout
  status="accent"
  title="…"
  onClose={() => {}}
  closeAriaLabel="Dismiss tip"
/>`,
                        render: (
                            <Callout
                                showAnatomy
                                status="accent"
                                title="Tip: highlight text to ask AI"
                                onClose={() => {}}
                                closeAriaLabel="Dismiss tip"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
