import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react"
import { ConsultantProfileBody } from "@sb-components/starci/blocks/consultant/ConsultantProfileBody/ConsultantProfileBody"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ConsultantProfileBody`: the full DETAIL content of one consultant's
 * profile — photo, name+role, a pressable company row, the full bio, and a
 * fork on the way out: real contact links once unlocked, or a locked callout
 * with a way to unlock them.
 *
 * THE DETAIL SIBLING OF `ConsultantCard` (see that block's own file header,
 * which named this exact gap), not a copy of it — the company row is a real
 * `Button` here (the tile's whole-card press is already spent by the time
 * this renders) and the bio runs in full instead of clamping to a teaser.
 *
 * 📐 ONE LEAF (§14d.2). `contactUnlocked` never changes the composed OUTER
 * frame (photo → identity → bio → contact area) — only which content fills
 * the last slot — same precedent as `FoundationModal`'s `kind` switch cited
 * in the task brief. So unlocked/locked are two STATES of `Default`, not two
 * leaves.
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
    "FeedbackCallout": { tier: "composite", role: "the locked-contact notice — a status alert with one built-in CTA button, reused rather than hand-rolled (same precedent as TaskLockedAlert)", storyId: "composites-feedback-feedback-feedbackcallout--with-action" },
}

const FULL_CONSULTANT = {
    fullName: "Nguyễn Thu Hà",
    jobTitle: "Chuyên viên tuyển dụng Backend",
    companyTitle: "TechCorp Việt Nam",
    description:
        "5 năm tuyển dụng kỹ sư backend cho các công ty product tại Việt Nam. Từng phỏng vấn hơn 300 ứng viên cho các vị trí từ Junior đến Staff Engineer, ưu tiên tuyển các bạn có nền tảng hệ thống phân tán vững và từng làm việc với đội ngũ đa quốc gia.",
    avatarUrl: PHOTO_SRC,
    contactUnlocked: true,
    contactLinks: [
        { key: "email", label: "hoa.nguyen@techcorp.vn", href: "mailto:hoa.nguyen@techcorp.vn", icon: EnvelopeSimpleIcon },
        { key: "phone", label: "090 123 4567", href: "tel:0901234567", icon: PhoneIcon },
    ],
}

/** LEAF — full profile, contact unlocked: photo → name+role → company → bio → contact links. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
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
        fullName: "Nguyễn Thu Hà",
        jobTitle: "Chuyên viên tuyển dụng Backend",
        companyTitle: "TechCorp Việt Nam",
        description: "5 năm tuyển dụng kỹ sư backend...",
        avatarUrl: photoUrl,
        contactUnlocked: true,
        contactLinks: [
            { key: "email", label: "hoa.nguyen@techcorp.vn", href: "mailto:hoa.nguyen@techcorp.vn", icon: EnvelopeSimpleIcon },
            { key: "phone", label: "090 123 4567", href: "tel:0901234567", icon: PhoneIcon },
        ],
    }}
    onOpenCompany={() => openCompany()}
/>`,
                        render: (
                            <ConsultantProfileBody
                                anatPart="ConsultantProfileBody"
                                showAnatomy
                                consultant={FULL_CONSULTANT}
                                onOpenCompany={() => {}}
                            />
                        ),
                    },
                    {
                        name: "contactUnlocked = false",
                        why: "Contact not yet unlocked: the same outer frame ends with a locked callout and one CTA ('Cải thiện CV') instead of the link list — a STATE of this same leaf, not a different shape.",
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
