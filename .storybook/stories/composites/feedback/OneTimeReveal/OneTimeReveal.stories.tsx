import type { Meta, StoryObj } from "@storybook/nextjs"
import { OneTimeReveal, type OneTimeRevealLabels } from "@sb-components/composites/feedback/OneTimeReveal/OneTimeReveal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OneTimeReveal` — a value the issuing server will never show again: the warning
 * FIRST, then the value beside a copy control, then a deliberate two-step
 * acknowledgement (tick, then press) that hides it.
 *
 * `value` is `string | null` and the composite owns the null branch itself, so a
 * caller cannot forget it. A null value is not an error and not an empty box: it
 * is the ordinary answer when the server minted nothing this time, and it renders
 * as its own explanatory note with no copy control, no placeholder frame, and
 * never the literal text "null".
 *
 * Acknowledgement is deliberately NOT the copy button. Copying is one click and
 * happens by reflex; hiding a value that can never be recovered should cost a tick
 * and a press, and the composite keeps the two separate for exactly that reason.
 */
const meta: Meta<typeof OneTimeReveal> = {
    title: "Composites/Feedback/OneTimeReveal/OneTimeReveal",
    component: OneTimeReveal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OneTimeReveal>

const LABELS: OneTimeRevealLabels = {
    acknowledgeLabel: "I have stored it",
    acknowledgeCheckboxLabel: "I have copied this value somewhere safe",
}

const TOKEN = "regtok_9f2c41ae7b0d4c5f8e13a6b27d94f7f3a"

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: {
        tier: "atom",
        role: "the heading, the value itself at code scale, and the after-hiding summary",
        storyId: "atoms-text-typography-typography--default",
    },
    SnippetIcon: {
        tier: "atom",
        role: "the one copy control in this system — present only when there is a value to copy",
        storyId: "atoms-display-snippeticon-snippeticon--default",
    },
    ChoiceCheckbox: {
        tier: "atom",
        role: "the tick that unlocks the confirm button, so hiding is never a reflex click",
        storyId: "atoms-forms-choicecheckbox--default",
    },
    Button: {
        tier: "atom",
        role: "confirms the value has been stored and hides it for good",
        storyId: "atoms-buttons-button-button--default",
    },
    Callout: {
        tier: "composite",
        role: "carries the shown-once warning, and — in the null branch — the explanation instead",
        storyId: "composites-feedback-callout--default",
    },
}

/** LEAF — one shape; the null value and the acknowledged value are DATA states, not other components. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OneTimeReveal"
                tier="composite"
                leaf="Once-only value"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Composites take no `className`: this one owns the SHAPE of a value that cannot be retrieved. The null branch lives INSIDE it rather than at the call site, because a caller who forgets it ships an empty copy box around nothing — and an empty box that looks copy-pasteable is worse than no box."
                states={[
                    {
                        name: "value = a token",
                        why: "The warning is above the value, not below it, because a reader who has already scrolled past the box has already decided whether to copy.",
                        code: "<OneTimeReveal value={token} title=\"Registration token\" warningTitle=\"Shown exactly once\" isAcknowledged={false} onAcknowledge={ack} labels={labels} />",
                        render: (
                            <OneTimeReveal
                                title="Registration token"
                                value={TOKEN}
                                absenceTitle="No new token was created"
                                absenceDescription="Your pod already has a live registration."
                                warningTitle="Shown exactly once"
                                warningDescription="The server keeps only a hash — nobody can retrieve this later, including us. Copy and store it before you leave this page."
                                isAcknowledged={false}
                                onAcknowledge={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "value = null",
                        why: "The COMMON case, not an error: a call without rotation reuses the live registration, so there is no raw value to hand over. No box, no copy control, no placeholder frame — just the reason and what to do about it.",
                        code: "<OneTimeReveal value={null} absenceTitle=\"No new token was created\" absenceDescription=\"…\" … />",
                        render: (
                            <OneTimeReveal
                                title="Registration token"
                                value={null}
                                absenceTitle="No new token was created"
                                absenceDescription="Your pod already has a live registration, so nothing was minted and there is nothing to show. Switch rotation on if you want to replace the old one."
                                warningTitle="Shown exactly once"
                                warningDescription="The server keeps only a hash."
                                isAcknowledged={false}
                                onAcknowledge={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isAcknowledged = true, with a summary",
                        why: "After hiding, the value is dropped from state and only the tail the caller kept is left — enough to tell two tokens apart in a password manager, not enough to be one.",
                        code: "<OneTimeReveal value={token} isAcknowledged acknowledgedSummary=\"Hidden · ending 7f3a\" … />",
                        render: (
                            <OneTimeReveal
                                title="Registration token"
                                value={TOKEN}
                                absenceTitle="No new token was created"
                                warningTitle="Shown exactly once"
                                isAcknowledged
                                acknowledgedSummary="Hidden · ending 7f3a"
                                onAcknowledge={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isAcknowledged = true, acknowledgedSummary = null",
                        why: "A caller with no tail to show says nothing rather than printing an empty line — the same rule as a missing timestamp.",
                        code: "<OneTimeReveal value={token} isAcknowledged acknowledgedSummary={null} … />",
                        render: (
                            <OneTimeReveal
                                title="Gateway token"
                                value={TOKEN}
                                absenceTitle="No new token was created"
                                warningTitle="Shown exactly once"
                                isAcknowledged
                                acknowledgedSummary={null}
                                onAcknowledge={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isCopied = true",
                        why: "The copy control's confirmed glyph, pinned from outside so the state is readable here. Copying does NOT hide the value — that still takes the tick and the press.",
                        code: "<OneTimeReveal value={token} isCopied … />",
                        render: (
                            <OneTimeReveal
                                title="Gateway token"
                                value={TOKEN}
                                absenceTitle="No new token was created"
                                warningTitle="Shown exactly once"
                                warningDescription="Copy and store it before you leave this page."
                                isAcknowledged={false}
                                onAcknowledge={NOOP}
                                isCopied
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The minting call has not returned. The real structure stays — heading, warning strip, value row, tick, button — with each atom shimmering at its own size, so the layout does not move when the token lands.",
                        code: "<OneTimeReveal isSkeleton title=\"Registration token\" … />",
                        render: (
                            <OneTimeReveal
                                title="Registration token"
                                absenceTitle="No new token was created"
                                warningTitle="Shown exactly once"
                                isAcknowledged={false}
                                onAcknowledge={NOOP}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
