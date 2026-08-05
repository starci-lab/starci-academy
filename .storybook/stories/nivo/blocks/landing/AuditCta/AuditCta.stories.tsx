import type { Meta, StoryObj } from "@storybook/nextjs"
import { AuditCta } from "@sb-components/nivo/blocks/landing/AuditCta/AuditCta"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AuditCta` — the landing's dark diagnostic band: "Where are you losing
 * leads?" over the one path for an unsure visitor, the Lead-Leakage Audit.
 * `eyebrow` is the one optional prop, so its presence is the leaf.
 */
const meta: Meta<typeof AuditCta> = {
    title: "Nivo/Blocks/Landing/AuditCta/AuditCta",
    component: AuditCta,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AuditCta>

const NOOP = () => {}

const TITLE = "Where are you losing leads?"
const DESCRIPTION = "Take the Lead-Leakage Audit to see exactly where leads are slipping through today — before you pick a plan."
const CTA_LABEL = "Take the Lead-Leakage Audit"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the centered eyebrow / title / description / CTA stack" },
    Typography: { tier: "atom", role: "the eyebrow, headline, and description" },
    Button: { tier: "atom", role: "the one CTA into the Lead-Leakage Audit" },
}

/** LEAF — `eyebrow`: full coverage of both members of the optional-string union. */
export const Eyebrow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AuditCta"
                tier="block"
                leaf="eyebrow"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. This band forces the dark palette regardless of the shell's own light/dark toggle — the same recipe `OperatingLoopHero` uses for the page's other premium ink-and-crimson surface — because it is brand chrome, not a themed content section. The one prop this band leaves optional is `eyebrow`, so its presence is the leaf."
                states={[
                    {
                        name: "eyebrow set",
                        why: "The default marketing placement: a small crimson kicker sits above the headline, matching the hero's own eyebrow.",
                        code: `<AuditCta
    eyebrow="Quick diagnosis"
    title="Where are you losing leads?"
    description="Take the Lead-Leakage Audit to see exactly where leads are slipping through today — before you pick a plan."
    ctaLabel="Take the Lead-Leakage Audit"
    onCtaPress={openAudit}
/>`,
                        render: <AuditCta eyebrow="Quick diagnosis" title={TITLE} description={DESCRIPTION} ctaLabel={CTA_LABEL} onCtaPress={NOOP} />,
                    },
                    {
                        name: "eyebrow omitted",
                        why: "A bare variant with no kicker line — the headline sits alone above the description and CTA.",
                        code: "<AuditCta title=\"Where are you losing leads?\" description={description} ctaLabel=\"Take the Lead-Leakage Audit\" onCtaPress={openAudit} />",
                        render: <AuditCta title={TITLE} description={DESCRIPTION} ctaLabel={CTA_LABEL} onCtaPress={NOOP} />,
                    },
                ]}
            />
        </div>
    ),
}
