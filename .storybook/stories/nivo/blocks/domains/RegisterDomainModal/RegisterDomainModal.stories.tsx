import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    RegisterDomainModal,
    type RegisterDomainModalLabels,
} from "@sb-components/nivo/blocks/domains/RegisterDomainModal/RegisterDomainModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `RegisterDomainModal` — overlay modal that registers a new `DomainEntity`:
 * type a fully-qualified name, check it, register it. The only failure this
 * modal itself surfaces is name unavailability, rendered inline on the field.
 */
const meta: Meta<typeof RegisterDomainModal> = {
    title: "Nivo/Blocks/Domains/RegisterDomainModal/RegisterDomainModal",
    component: RegisterDomainModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof RegisterDomainModal>

const LABELS: RegisterDomainModalLabels = {
    title: "Register a domain",
    description: "Point a domain you own at your nivo site, or register a new one through nivo.",
    fieldLabel: "Domain name",
    placeholder: "example.com",
    cancelLabel: "Cancel",
    registerLabel: "Check & register",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    InputText: { tier: "atom", role: "the domain name — its own `errorMessage` slot carries the name-unavailable rejection" },
    Button: { tier: "atom", role: "cancel (ghost) and check-&-register (primary, busy while checking, disabled while empty)" },
}

/** Shared controlled wrapper — one `isOpen`/field state feeds every leaf state below. */
const ControlledRegisterDomainModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [domainName, setDomainName] = useState("")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        domainName,
        onDomainNameChange: setDomainName,
        onRegister: () => setIsOpen(false),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Register domain" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="RegisterDomainModal"
                tier="block"
                leaf="Register a domain"
                annotate={ANNOTATE}
                reason="A presentational overlay modal that only names a domain and hands off to the mock registrar — it never edits an existing domain (that is `DomainDetailModal`'s job). The register action stays disabled until a name is typed, and the one failure this modal itself renders — the name is already taken — surfaces inline on the field rather than a separate banner."
                states={[
                    {
                        name: "domainName = \"\" (register disabled)",
                        why: "Nothing typed yet — the register action stays disabled so an empty name is never submitted.",
                        code: `<RegisterDomainModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  domainName=""
  onDomainNameChange={setDomainName}
  onRegister={register}
  labels={labels}
/>`,
                        render: <RegisterDomainModal {...base} />,
                    },
                    {
                        name: "domainName filled in",
                        why: "Once a name is typed, the register action lights up and the field is ready to submit.",
                        code: "<RegisterDomainModal domainName=\"anduc-studio.vn\" … />",
                        render: <RegisterDomainModal {...base} domainName="anduc-studio.vn" onDomainNameChange={() => {}} />,
                    },
                    {
                        name: "isRegistering = true",
                        why: "The availability check + registration is running — the field locks and the button shows its busy state so the owner can't double-submit.",
                        code: "<RegisterDomainModal isRegistering … />",
                        render: <RegisterDomainModal {...base} domainName="anduc-studio.vn" onDomainNameChange={() => {}} isRegistering />,
                    },
                    {
                        name: "unavailableError set",
                        why: "The mock registrar rejected the name as already taken — the field itself renders the rejection inline rather than a separate banner, and the owner can edit the same field and retry.",
                        code: `<RegisterDomainModal
  domainName="anduc-studio.vn"
  unavailableError="This domain is already registered."
  …
/>`,
                        render: (
                            <RegisterDomainModal
                                {...base}
                                domainName="anduc-studio.vn"
                                onDomainNameChange={() => {}}
                                unavailableError="This domain is already registered."
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch (this account's remaining domain quota) hasn't resolved yet, so the field shimmers.",
                        code: "<RegisterDomainModal isSkeleton … />",
                        render: <RegisterDomainModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All five states (empty, filled, registering, rejected, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledRegisterDomainModal />,
}
