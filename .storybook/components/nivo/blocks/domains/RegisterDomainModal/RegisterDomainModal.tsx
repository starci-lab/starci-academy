import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `RegisterDomainModal` — overlay modal that registers a new `DomainEntity`:
 * type a fully-qualified name, check it, register it. The only failure this
 * modal itself surfaces is name unavailability, rendered inline on the field.
 */

/** Props for {@link RegisterDomainModal}. */
export interface RegisterDomainModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The domain name being typed (controlled) — `DomainEntity.name`. */
    domainName: string
    /** Fires as the domain-name field changes. */
    onDomainNameChange: (value: string) => void
    /** Check availability and register — the connected layer runs the `addDomain` mutation. */
    onRegister: () => void
    /** `true` → the availability check + registration is in flight (field locks, button busy). */
    isRegistering?: boolean
    /**
     * Set once the mock registrar rejects the name as already taken (the real
     * `DomainNameUnavailable` error) — renders inline under the field. Cleared
     * by the connected layer the next time the field changes.
     */
    unavailableError?: string | null
    /**
     * `true` → the modal's own first fetch (e.g. resolving this account's
     * remaining domain quota) is in flight: the field shimmers. Threaded
     * straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: RegisterDomainModalLabels
}

/** The already-resolved copy the modal renders. */
export interface RegisterDomainModalLabels {
    /** Modal title. */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Label above the domain-name field. */
    fieldLabel: string
    /** Placeholder in the domain-name field. */
    placeholder: string
    /** Cancel button label. */
    cancelLabel: string
    /** Register button label. */
    registerLabel: string
}

/**
 * The register-domain modal. See the file header for why the only error this
 * modal ever shows is name unavailability, rendered inline on the field.
 *
 * @param props - {@link RegisterDomainModalProps}
 */
const RegisterDomainModal = ({
    isOpen,
    onOpenChange,
    domainName,
    onDomainNameChange,
    onRegister,
    isRegistering = false,
    unavailableError = null,
    isSkeleton = false,
    labels,
}: RegisterDomainModalProps) => (
    <ModalShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={labels.title}
        description={labels.description}
        size="md"
        isSkeleton={isSkeleton}
        body={({ isSkeleton }: SkeletonProps) => (
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <InputText
                            label={labels.fieldLabel}
                            placeholder={labels.placeholder}
                            value={domainName}
                            onValueChange={onDomainNameChange}
                            errorMessage={unavailableError ?? undefined}
                            isDisabled={isRegistering}
                            isSkeleton={isSkeleton}
                        />
                    ),
                ]}
            />
        )}
        footer={() => (
            <>
                <Button variant="ghost" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={isRegistering} />
                <Button
                    variant="primary"
                    label={labels.registerLabel}
                    onPress={onRegister}
                    isPending={isRegistering}
                    isDisabled={domainName.trim().length === 0}
                />
            </>
        )}
    />
)

export { RegisterDomainModal }
