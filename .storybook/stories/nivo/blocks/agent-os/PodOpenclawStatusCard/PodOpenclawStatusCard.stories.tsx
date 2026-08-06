import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PodOpenclawStatusCard,
    type PodOpenclawStatusCardLabels,
} from "@sb-components/nivo/blocks/agent-os/PodOpenclawStatusCard/PodOpenclawStatusCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PodOpenclawStatusCard` — one live probe of the pod's agent, stated as FOUR
 * readings rather than an up/down boolean, because the four have four different
 * causes and three different fixes.
 *
 * `never-issued` is the one a boolean loses: no token has been minted, so no
 * probe was made at all. Reporting that as "down" would send a reader hunting a
 * network fault that does not exist, when the remedy is to issue a token.
 * `rejected` is the signature of a rotation whose restart never landed — the
 * control plane holds a new token and the container still holds the old one.
 *
 * The token line reads "a token is on file", never "the agent is authenticated".
 * What the server can see is its OWN record; whether the container is actually
 * running with that value is a different question, and only the probe answers it.
 *
 * `checkedAtLabel` is always rendered, because this card is a MEASUREMENT taken
 * at a moment rather than a state that persists — an untimed reading invites a
 * reader to trust a probe that ran an hour ago.
 */
const meta: Meta<typeof PodOpenclawStatusCard> = {
    title: "Nivo/Blocks/AgentOs/PodOpenclawStatusCard/PodOpenclawStatusCard",
    component: PodOpenclawStatusCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PodOpenclawStatusCard>

const LABELS: PodOpenclawStatusCardLabels = {
    title: "Your agent",
    readings: {
        "never-issued": "No token has been issued for this pod, so nothing was checked.",
        reachable: "The pod answered normally.",
        unreachable: "Nothing answered at the pod's address.",
        rejected: "The pod refused the token we have on file.",
    },
    readingChips: {
        "never-issued": "Not set up",
        reachable: "Answering",
        unreachable: "No answer",
        rejected: "Refused",
    },
    httpStatusRowLabel: "HTTP status",
    tokenRowLabel: "Token on file",
    tokenOnFileLabel: "A token is on file",
    tokenMissingLabel: "None",
    checkedAtLabel: "Checked at 14:32 on 06/08",
    refreshLabel: "Check again",
    issueTokensLabel: "Issue access tokens",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: {
        tier: "composite",
        role: "the titled card, with the re-probe action in its header slot",
        storyId: "composites-cards-surfacecard-surfacecard--default",
    },
    KeyValueList: {
        tier: "composite",
        role: "the two facts the probe returned — the HTTP status, and what the control plane has on file",
        storyId: "composites-data-keyvalue-keyvaluelist--default",
    },
    Chip: {
        tier: "atom",
        role: "the reading itself, toned per reading rather than per up/down",
        storyId: "atoms-chips-chip-chip--default",
    },
    Typography: {
        tier: "atom",
        role: "the reading sentence and the timestamp the card measures itself with",
        storyId: "atoms-text-typography-typography--default",
    },
    Button: {
        tier: "atom",
        role: "re-probes, and — in the never-issued reading only — offers the remedy",
        storyId: "atoms-buttons-button-button--default",
    },
}

/** LEAF — one shape; the four readings are DATA about one probe, not four components. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PodOpenclawStatusCard"
                tier="block"
                leaf="Agent probe"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: this one owns the probe, and it words the reading itself rather than taking a sentence. Four readings instead of a boolean, because 'no token was ever issued' and 'the pod refused the token' have nothing in common except that neither one is 'up' — and telling them apart is what decides which of three different fixes a reader reaches for."
                states={[
                    {
                        name: "reading = \"never-issued\"",
                        why: "No token exists, so the service short-circuits and NO probe is made. Calling this \"down\" would send somebody hunting a network fault that never happened; the fix is to mint a token, which is why this is the one reading that carries a remedy button.",
                        code: "<PodOpenclawStatusCard reading=\"never-issued\" checkedAtLabel=\"…\" onRefresh={probe} onIssueTokens={issue} labels={labels} />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="never-issued"
                                onRefresh={NOOP}
                                onIssueTokens={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "reading = \"reachable\"",
                        why: "The pod answered. The only reading where nothing needs doing — and it still carries its timestamp, because a probe from an hour ago proves nothing about now.",
                        code: "<PodOpenclawStatusCard reading=\"reachable\" httpStatusLabel=\"200\" onRefresh={probe} labels={labels} />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="reachable"
                                httpStatusLabel="200"
                                onRefresh={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "reading = \"unreachable\"",
                        why: "A token exists and nothing answered at all — DNS, a timeout, a transport failure. There is no HTTP status to show, because no response ever arrived.",
                        code: "<PodOpenclawStatusCard reading=\"unreachable\" httpStatusLabel={null} onRefresh={probe} labels={labels} />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="unreachable"
                                httpStatusLabel={null}
                                onRefresh={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "reading = \"rejected\"",
                        why: "The pod answered and refused the token. This is the signature of a rotation whose restart never landed: the control plane holds the new value, the container still holds the old one.",
                        code: "<PodOpenclawStatusCard reading=\"rejected\" httpStatusLabel=\"401\" onRefresh={probe} labels={labels} />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="rejected"
                                httpStatusLabel="401"
                                onRefresh={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "tokenHint = \"7f3a\"",
                        why: "The server returned a tail for the token it holds, which is enough to check against a password manager and not enough to be a token.",
                        code: "<PodOpenclawStatusCard reading=\"reachable\" tokenHint=\"7f3a\" onRefresh={probe} labels={labels} />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="reachable"
                                httpStatusLabel="200"
                                tokenHint="7f3a"
                                onRefresh={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "tokenHint = null",
                        why: "A token is on file but no tail came back. The row says exactly that and invents nothing — and it still does NOT say the agent is authenticated, because a record is not a running configuration.",
                        code: "<PodOpenclawStatusCard reading=\"reachable\" tokenHint={null} onRefresh={probe} labels={labels} />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="reachable"
                                httpStatusLabel="200"
                                tokenHint={null}
                                onRefresh={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first probe is in flight. The card keeps its title, its chip row, its fact rows, and its timestamp line, each shimmering at its own size, so nothing moves when the reading lands.",
                        code: "<PodOpenclawStatusCard reading=\"reachable\" onRefresh={probe} labels={labels} isSkeleton />",
                        render: (
                            <PodOpenclawStatusCard
                                reading="reachable"
                                httpStatusLabel="200"
                                onRefresh={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
