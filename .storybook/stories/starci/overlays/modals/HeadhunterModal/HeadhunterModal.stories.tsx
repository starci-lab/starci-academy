import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { HeadhunterModal } from "@sb-components/starci/overlays/modals/HeadhunterModal/HeadhunterModal"
import type { HeadhunterModalProps } from "@sb-components/starci/overlays/modals/HeadhunterModal/HeadhunterModal"
import type { ConsultantProfileBodyConsultant } from "@sb-components/starci/blocks/consultant/ConsultantProfileBody/ConsultantProfileBody"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HeadhunterModal` — global overlay that shows ONE recruiting consultant's
 * profile (avatar, name, role, company link, blurb, contact links or a
 * CV-score gate). Opened from anywhere via the app's global overlay store;
 * this port takes plain `isOpen`/`onOpenChange` props instead of reading
 * Zustand/Redux directly (Rule 13).
 *
 * ONE LEAF (`Default`). The wrapper shape never changes — only whether a
 * consultant is present (renders the profile body vs. an empty modal body,
 * mirroring `src`'s own `{headhunter ? (...) : null}` guard) is a STATE of
 * this one leaf, not a second leaf, since the wrapper tree itself never
 * changes shape.
 */
const meta: Meta<typeof HeadhunterModal> = {
    title: "StarCi/Overlays/Modals/HeadhunterModal/HeadhunterModal",
    component: HeadhunterModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HeadhunterModal>

// The real DOM (containerClassName="modal__container--narrow", scroll="inside"):
// Modal.CloseTrigger + Modal.Header > Typography(title) + Modal.Body >
// ConsultantProfileBody (its own contact-fork switch lives one level down in
// its own story, see storyId below).
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Typography": { tier: "atom", role: "the modal's own generic title, hardcoded (`Headhunter profile`) — the block owns its wording, this is not per-consultant data", storyId: "atoms-text-typography-typography--plain" },
    "Modal.Body": { tier: "heroui", role: "the body region — capped at 85vh with inner scroll, narrower container than the default modal size" },
    "ConsultantProfileBody": { tier: "block", role: "renders the actual profile — photo, identity, bio, and the contact-unlocked/locked fork; its own state switch lives one level down in its own story", storyId: "starci-blocks-consultant-consultantprofilebody-consultantprofilebody--default" },
}

/** One recruiting consultant, unlocked contact — the common happy path. */
const UNLOCKED_CONSULTANT: ConsultantProfileBodyConsultant = {
    fullName: "Hannah Ngo",
    jobTitle: "Senior IT Recruiter",
    companyTitle: "TechTalent Partners",
    description:
        "5 years recruiting backend/DevOps engineers for product companies in Vietnam. Prefers candidates with a clear personal project.",
    avatarUrl: "https://i.pravatar.cc/240?img=47",
    contactUnlocked: true,
    contactLinks: [
        { key: "email", label: "hannah.ngo@techtalent.example", href: "mailto:hannah.ngo@techtalent.example", icon: EnvelopeSimpleIcon },
        { key: "phone", label: "090 123 4567", href: "tel:0901234567", icon: PhoneIcon },
    ],
}

/** Same consultant, contact still gated behind the CV-score threshold. */
const LOCKED_CONSULTANT: ConsultantProfileBodyConsultant = {
    ...UNLOCKED_CONSULTANT,
    contactUnlocked: false,
    contactLinks: undefined,
}

/** Controlled wrapper — the trigger reopens the modal after it closes. */
const ControlledHeadhunterModal = ({
    triggerLabel,
    ...modalProps
}: {
    triggerLabel: string
} & Omit<HeadhunterModalProps, "isOpen" | "onOpenChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"
                classNames={["self-start"]}
                onPress={() => setIsOpen(true)}
            />
            <HeadhunterModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
               

                {...modalProps}
            />
        </div>
    )
}

/**
 * ONE LEAF. Consultant presence is a state of this one wrapper shape — the
 * modal chrome (title, narrow container, inside scroll) never changes;
 * only whether `ConsultantProfileBody` renders inside does, mirroring `src`'s
 * own `{headhunter ? (...) : null}` guard verbatim.
 */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="HeadhunterModal"
            tier="block"
            leaf="Default"
            parts={[]}
            annotate={ANNOTATE}
            reason={"Thin `ModalShell` wrapper: sizes the frame (narrow container, inside scroll) and hands the body straight to `ConsultantProfileBody`, mirroring the `FoundationModal`/`FoundationResourceBody` split already in this inventory."}
            states={[
                {
                    name: "consultant present, contact unlocked",
                    why: "The CV-score gate has been cleared, so the profile shows the real contact links (email/phone) instead of the locked callout.",
                    code: `<HeadhunterModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    consultant={consultant}
    onOpenCompany={() => router.push(companyPath)}
    onImproveCv={() => router.push(cvPath)}
/>`,
                    render: (
                        <ControlledHeadhunterModal
                            triggerLabel="Open unlocked consultant"
                            consultant={UNLOCKED_CONSULTANT}
                            onOpenCompany={() => {}}
                            onImproveCv={() => {}}
                        />
                    ),
                },
                {
                    name: "consultant present, contact locked",
                    why: "The viewer's CV score has not cleared the threshold yet, so `ConsultantProfileBody` swaps the contact row for a CV-score gate with an \"improve my CV\" CTA — the same entity, a different contact state.",
                    code: `<HeadhunterModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    consultant={lockedConsultant}
    onImproveCv={() => router.push(cvPath)}
/>`,
                    render: (
                        <ControlledHeadhunterModal
                            triggerLabel="Open locked consultant"
                            consultant={LOCKED_CONSULTANT}
                            onOpenCompany={() => {}}
                            onImproveCv={() => {}}
                        />
                    ),
                },
                {
                    name: "consultant = undefined",
                    why: "Mirrors `src`'s own `{headhunter ? (...) : null}` guard: before the entity resolves (or if it never does), the modal chrome still opens but the body stays empty rather than the wrapper changing shape.",
                    code: "<HeadhunterModal isOpen={isOpen} onOpenChange={setIsOpen} />",
                    render: <ControlledHeadhunterModal triggerLabel="Open with no consultant" />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The flag flows straight down into `ConsultantProfileBody` (the shell itself has no data of its own to shimmer besides the hardcoded title) — the profile mirrors itself while the consultant is still resolving.",
                    code: "<HeadhunterModal isOpen={isOpen} onOpenChange={setIsOpen} consultant={consultant} isSkeleton />",
                    render: (
                        <ControlledHeadhunterModal
                            triggerLabel="Open loading consultant"
                            consultant={UNLOCKED_CONSULTANT}
                            isSkeleton
                        />
                    ),
                },
            ]}
        />
    ),
}
