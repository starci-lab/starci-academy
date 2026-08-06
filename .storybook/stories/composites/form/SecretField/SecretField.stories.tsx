import type { Meta, StoryObj } from "@storybook/nextjs"
import { SecretField, type SecretFieldLabels } from "@sb-components/composites/form/SecretField/SecretField"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SecretField` — one write-only secret: a summary row that says what the server
 * knows about the stored value, and an entry row that replaces it. Domain-blind
 * on purpose (no channel, no provider, no pod), which is what keeps it a
 * composite rather than a block.
 *
 * `status` has THREE values, not two, because a server that offers no read path
 * is not the same as a server that says "nothing stored": `unknown` means the
 * client cannot tell, `unset` means it has been told there is nothing, and `set`
 * means a value is on file. Collapsing `unknown` into `unset` would print a
 * confident falsehood on first paint.
 *
 * The value itself is never displayed: `valueHint` is the last few characters and
 * may legitimately be `null` (a value shorter than the hint window has no tail to
 * show). `deliveryLabel` is a SEPARATE line from the stored/not-stored fact —
 * saved and delivered are different states, and a field that merges them tells a
 * reader a key is live while the running process still holds the old one.
 */
const meta: Meta<typeof SecretField> = {
    title: "Composites/Form/SecretField/SecretField",
    component: SecretField,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SecretField>

const LABELS: SecretFieldLabels = {
    editLabel: "Set key",
    saveLabel: "Save",
    cancelLabel: "Cancel",
    unknownLabel: "Not known — this server cannot be asked",
    unsetLabel: "Nothing stored",
    setLabel: "Saved",
    endingLabel: "ending",
    revealLabel: "Show the value",
    hideLabel: "Hide the value",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: {
        tier: "atom",
        role: "the label, the hint, and the warning note",
        storyId: "atoms-text-typography-typography--default",
    },
    Chip: {
        tier: "atom",
        role: "the status summary and, separately, the delivery line",
        storyId: "atoms-chips-chip-chip--default",
    },
    Button: {
        tier: "atom",
        role: "enters entry mode, then saves or discards; carries the spinner while a write runs",
        storyId: "atoms-buttons-button-button--default",
    },
    InputPassword: {
        tier: "atom",
        role: "the masked control — for a value that is genuinely a secret",
        storyId: "atoms-forms-inputpassword--default",
    },
    InputText: {
        tier: "atom",
        role: "the plain control — a hostname or a port, where masking would hide a typo",
        storyId: "atoms-forms-inputtext--default",
    },
}

/** LEAF — one shape; every state below is DATA about a single secret, not a different component. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SecretField"
                tier="composite"
                leaf="Secret"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Composites take no `className`: this one owns the SHAPE of a write-only secret and knows no domain. `status` is three-valued because a server with no read path cannot be quoted as saying 'nothing stored', and delivery is its own line because a stored key and a delivered key are different facts."
                states={[
                    {
                        name: "status = \"unknown\"",
                        why: "The default wherever the server offers no way to list stored keys. It says the client cannot tell — not that the field is empty, which would be a claim nobody made.",
                        code: "<SecretField status=\"unknown\" mode=\"summary\" label=\"Bot token\" value=\"\" onValueChange={set} onEdit={edit} onCancel={cancel} onSubmit={save} labels={labels} />",
                        render: (
                            <SecretField
                                label="Bot token"
                                hint="From @BotFather after you create the bot."
                                status="unknown"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"unset\"",
                        why: "The server was asked and answered that nothing is stored. Only reachable once a listing query exists — today no surface can produce it, and that is exactly why it is not the default.",
                        code: "<SecretField status=\"unset\" mode=\"summary\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="unset"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"set\", valueHint = \"7f3a\"",
                        why: "A value is on file and the server returned its tail, which is the only part of it anyone will ever see again.",
                        code: "<SecretField status=\"set\" valueHint=\"7f3a\" mode=\"summary\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="set"
                                valueHint="7f3a"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"set\", valueHint = null",
                        why: "Stored, but too short for the server to derive a tail from. The row must not invent one, so it says only that something is saved.",
                        code: "<SecretField status=\"set\" valueHint={null} mode=\"summary\" … />",
                        render: (
                            <SecretField
                                label="Verify token"
                                status="set"
                                valueHint={null}
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "deliveryTone = \"warning\" (stored, not delivered)",
                        why: "The key is written down but the running process has not been handed it yet. Merging this into \"saved\" is what tells a customer their channel is connected while the agent still holds the old token.",
                        code: "<SecretField status=\"set\" valueHint=\"7f3a\" deliveryLabel=\"Not delivered to the pod yet\" deliveryTone=\"warning\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="set"
                                valueHint="7f3a"
                                deliveryLabel="Not delivered to the pod yet"
                                deliveryTone="warning"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "deliveryTone = \"success\" (delivered)",
                        why: "The value reached the running process. The wording is \"last delivered\" rather than \"this key was delivered at\", because the server stamps every deliverable key for that pod at once.",
                        code: "<SecretField status=\"set\" valueHint=\"7f3a\" deliveryLabel=\"Last delivered 14:32 06/08\" deliveryTone=\"success\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="set"
                                valueHint="7f3a"
                                deliveryLabel="Last delivered 14:32 06/08"
                                deliveryTone="success"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "mode = \"editing\", nothing typed",
                        why: "The row the reader gets after pressing the edit action. The control is empty because the server never returns the stored value — there is nothing to prefill it with.",
                        code: "<SecretField mode=\"editing\" isMasked value=\"\" onValueChange={set} … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                hint="From @BotFather after you create the bot."
                                status="unknown"
                                mode="editing"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isMasked = true, value typed",
                        why: "A real secret: the control masks it and offers a reveal toggle, so a reader can check what they pasted without it sitting on screen.",
                        code: "<SecretField mode=\"editing\" isMasked value=\"8100000000:AAH…\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="unknown"
                                mode="editing"
                                value="8100000000:AAHkq2y0d3wKQ1p9ZtR7f3a"
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isMasked = false",
                        why: "A hostname is not a secret. Masking it hides typos and helps nobody, so the plain control is the right one for a host, a port, or a from-address.",
                        code: "<SecretField mode=\"editing\" isMasked={false} value=\"smtp.gmail.com\" … />",
                        render: (
                            <SecretField
                                label="SMTP host"
                                hint="The host name only, for example smtp.gmail.com."
                                status="unknown"
                                mode="editing"
                                value="smtp.gmail.com"
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "This row's own write is in flight. The save button carries an explicit spinner — the vendor's busy flag draws none by itself — and the control locks so the value cannot change under the request.",
                        code: "<SecretField mode=\"editing\" isPending … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="unknown"
                                mode="editing"
                                value="8100000000:AAHkq2y0d3wKQ1p9ZtR7f3a"
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                isPending
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isDisabled = true (another row is saving)",
                        why: "Saving one key restarts the whole pod, so a second write must not start while the first is running. Every other row goes inert rather than queueing a second restart.",
                        code: "<SecretField mode=\"summary\" isDisabled … />",
                        render: (
                            <SecretField
                                label="OA access token"
                                status="unknown"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                isDisabled
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "errorMessage set",
                        why: "The write failed and the reason belongs on the row that failed, not in a toast that outlives the field. The server replaces its own per-field reasons with a generic string, so this sentence is written on the client.",
                        code: "<SecretField mode=\"editing\" errorMessage=\"Your session has expired.\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="unknown"
                                mode="editing"
                                value="8100000000:AAH"
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                errorMessage="Your session has expired. Sign in again and retry."
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "noticeMessage set",
                        why: "A caveat that is not a failure — the value was stored but not delivered, or the value is too short for the server to derive a tail from. Warning-toned, never red: painting a stored key red makes a reader retype one that already works.",
                        code: "<SecretField mode=\"summary\" noticeMessage=\"Sent. This build of the server cannot confirm it back.\" … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                status="unknown"
                                mode="summary"
                                value=""
                                onValueChange={NOOP}
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
                                noticeMessage="Sent. This build of the server cannot confirm it back."
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "A listing of stored keys is still in flight. The row keeps its real structure — label, status pill, action — with each atom shimmering at its own size, so nothing jumps when the answer lands.",
                        code: "<SecretField mode=\"summary\" isSkeleton … />",
                        render: (
                            <SecretField
                                label="Bot token"
                                hint="From @BotFather after you create the bot."
                                status="unknown"
                                mode="summary"
                                onEdit={NOOP}
                                onCancel={NOOP}
                                onSubmit={NOOP}
                                isMasked
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
