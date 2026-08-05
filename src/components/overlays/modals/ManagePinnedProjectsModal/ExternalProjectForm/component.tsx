import { InputText, InputTextarea } from "@/components/atoms/forms"
import React from "react"

import { Button } from "@/components/atoms/buttons/Button"
import { Form } from "@/components/composites/form/Form"
import { StackV } from "@/components/frames/Stack"

/** Editable values {@link _ExternalProjectForm} renders — mirrors {@link PinExternalProjectFormValues} field-for-field. */
export interface ExternalProjectFormValues {
    /** Project title (required). */
    title: string
    /** Optional description shown under the pin. */
    description: string
    /** Optional project URL. */
    url: string
    /** Comma/newline-separated tech-stack tags (parsed to an array on submit). */
    techStack: string
}

/** Which fields currently fail validation — drives the error line + border on each. */
export interface ExternalProjectFormErrors {
    title?: boolean
    url?: boolean
}

/** Already-translated strings {@link _ExternalProjectForm} renders — resolved by the connected `ExternalProjectForm`, never `t()` itself. */
export interface ExternalProjectFormLabels {
    title: string
    titlePlaceholder: string
    titleRequired: string
    url: string
    urlPlaceholder: string
    urlInvalid: string
    techStack: string
    techStackPlaceholder: string
    techStackHint: string
    description: string
    descriptionPlaceholder: string
    submit: string
}

/** Props for {@link _ExternalProjectForm}. */
export interface ExternalProjectFormProps {
    /** Current field values (RHF-controlled from the connected half). */
    values: ExternalProjectFormValues
    /** Fired with the field name + new value on every keystroke. */
    onValueChange: (field: keyof ExternalProjectFormValues, value: string) => void
    /** Which fields currently fail validation. */
    errors: ExternalProjectFormErrors
    /** True while the pin mutation is in flight — locks every field + the submit button. */
    isSubmitting?: boolean
    /** Already-translated strings — see {@link ExternalProjectFormLabels}. */
    labels: ExternalProjectFormLabels
    /** Submit the form (the connected half runs validation + the mutation). */
    onSubmit: () => void
}

/**
 * Presentational form for pinning a free-form external project (title +
 * optional description / url / tech-stack tags). Built on the `Form` composite
 * shell — field state, validation, and the mutation all live in the connected
 * {@link ExternalProjectForm}; this half only binds the fields and surfaces the
 * in-flight submit state.
 *
 * @param props - {@link ExternalProjectFormProps}
 */
export const _ExternalProjectForm = ({
    values,
    onValueChange,
    errors,
    isSubmitting = false,
    labels,
    onSubmit,
}: ExternalProjectFormProps) => (
    <Form
        onSubmit={onSubmit}
        isDisabled={isSubmitting}
        gap={4}
        body={() => (
            <StackV
                gap={4}
                items={[
                    () => (
                        <InputText
                            label={labels.title}
                            placeholder={labels.titlePlaceholder}
                            value={values.title}
                            onValueChange={(value) => onValueChange("title", value)}
                            isInvalid={errors.title}
                            errorMessage={errors.title ? labels.titleRequired : undefined}
                        />
                    ),
                    () => (
                        <InputText
                            label={labels.url}
                            placeholder={labels.urlPlaceholder}
                            value={values.url}
                            onValueChange={(value) => onValueChange("url", value)}
                            isInvalid={errors.url}
                            errorMessage={errors.url ? labels.urlInvalid : undefined}
                        />
                    ),
                    () => (
                        <InputText
                            label={labels.techStack}
                            placeholder={labels.techStackPlaceholder}
                            hint={labels.techStackHint}
                            value={values.techStack}
                            onValueChange={(value) => onValueChange("techStack", value)}
                        />
                    ),
                    () => (
                        <InputTextarea
                            label={labels.description}
                            placeholder={labels.descriptionPlaceholder}
                            rows={3}
                            value={values.description}
                            onValueChange={(value) => onValueChange("description", value)}
                        />
                    ),
                ]}
            />
        )}
        actions={() => (
            <Button
                variant="primary"
                classNames={["w-full"]}
                isDisabled={isSubmitting}
                isPending={isSubmitting}
                label={labels.submit}
                onPress={onSubmit}
            />
        )}
    />
)
