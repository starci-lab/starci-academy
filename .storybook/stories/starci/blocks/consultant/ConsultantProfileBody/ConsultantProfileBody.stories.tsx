import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react"
import { ConsultantProfileBody } from "@sb-components/starci/blocks/consultant/ConsultantProfileBody/ConsultantProfileBody"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ConsultantProfileBody` — the full detail content of one consultant's profile:
 * photo, name+role, a pressable company row, the full bio, and either real
 * contact links once unlocked or a locked callout with a way to unlock them.
 * The detail sibling of `ConsultantCard`. `contactUnlocked` only changes which
 * content fills the last slot, not the outer frame.
 */
const meta: Meta<typeof ConsultantProfileBody> = {
    title: "StarCi/Blocks/Consultant/ConsultantProfileBody/ConsultantProfileBody",
    component: ConsultantProfileBody,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConsultantProfileBody>

// PNG base64 1×1 — loads reliably (fires onLoad) without a network fetch, same
// convention as `ConsultantCard`'s own story.
const PHOTO_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking identity, bio and the contact fork as one profile body — reused at two nesting levels, the inner one holding just name + role as a tighter unit", storyId: "frames-stack-stackv--default" },
    "Image": { tier: "atom", role: "the consultant's photo, owning its own loading skeleton and fallback glyph so the block never has to branch on load state itself", storyId: "atoms-media-image-image--with-image" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — name, role, bio or a contact link — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the pressable company row — opens the company the consultant works at, disabled while there is nowhere to open yet", storyId: "atoms-buttons-button-button--default" },
    "Callout": { tier: "composite", role: "the locked-contact notice — a status alert with one built-in CTA button, reused rather than hand-rolled (same precedent as TaskLockedAlert)", storyId: "composites-feedback-callout-callout--with-action" },
}

const FULL_CONSULTANT = {
    fullName: "Sarah Bennett",
    jobTitle: "Backend Recruiting Specialist",
    companyTitle: "TechCorp Vietnam",
    description:
        "5 years recruiting backend engineers for product companies in Vietnam. Has interviewed more than 300 candidates for roles ranging from Junior to Staff Engineer, with a preference for candidates who have a solid distributed-systems background and experience working with multinational teams.",
    avatarUrl: PHOTO_SRC,
    contactUnlocked: true,
    contactLinks: [
        { key: "email", label: "sarah.bennett@techcorp.vn", href: "mailto:sarah.bennett@techcorp.vn", icon: EnvelopeSimpleIcon },
        { key: "phone", label: "090 123 4567", href: "tel:0901234567", icon: PhoneIcon },
    ],
}

/** LEAF — full profile, contact unlocked: photo → name+role → company → bio → contact links. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConsultantProfileBody"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "contactUnlocked = true",
                        why: "Once contact is unlocked, the profile ends with the consultant's real reach-out links (email, phone) instead of an offer to unlock them — the fork this block exists to draw.",
                        code: `<ConsultantProfileBody
    consultant={{
        fullName: "Sarah Bennett",
        jobTitle: "Backend Recruiting Specialist",
        companyTitle: "TechCorp Vietnam",
        description: "5 years recruiting backend engineers...",
        avatarUrl: photoUrl,
        contactUnlocked: true,
        contactLinks: [
            { key: "email", label: "sarah.bennett@techcorp.vn", href: "mailto:sarah.bennett@techcorp.vn", icon: EnvelopeSimpleIcon },
            { key: "phone", label: "090 123 4567", href: "tel:0901234567", icon: PhoneIcon },
        ],
    }}
    onOpenCompany={() => openCompany()}
/>`,
                        render: (
                            <ConsultantProfileBody

                               
                                consultant={FULL_CONSULTANT}
                                onOpenCompany={() => {}}
                            />
                        ),
                    },
                    {
                        name: "contactUnlocked = false",
                        why: "Contact not yet unlocked: the same outer frame ends with a locked callout and one CTA ('Improve resume') instead of the link list — a STATE of this same leaf, not a different shape.",
                        code: `<ConsultantProfileBody
    consultant={{
        ...consultant,
        contactUnlocked: false,
    }}
    onOpenCompany={() => openCompany()}
    onImproveCv={() => openCvImprove()}
/>`,
                        render: (
                            <ConsultantProfileBody
                                consultant={{ ...FULL_CONSULTANT, contactUnlocked: false, contactLinks: undefined }}
                                onOpenCompany={() => {}}
                                onImproveCv={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Photo and every text line switch to their own shimmer, the company button is disabled, and the contact area shows a NEUTRAL shimmer rather than picking unlocked or locked — the caller does not yet know contactUnlocked while loading.",
                        code: `<ConsultantProfileBody
    consultant={{ fullName: "", contactUnlocked: false }}
    isSkeleton
/>`,
                        render: (
                            <ConsultantProfileBody
                                consultant={{ fullName: "", contactUnlocked: false }}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
