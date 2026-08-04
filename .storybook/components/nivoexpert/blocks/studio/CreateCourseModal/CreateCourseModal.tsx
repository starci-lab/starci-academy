import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputCurrency, InputText, InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { SelectSingle } from "@sb-components/atoms/forms/Select/Select"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CreateCourseModal` — overlay modal that creates a new `CourseEntity`:
 * name, slug, a short description, a price, and a starting status. The
 * primary action drops the expert straight into `CourseStudio` for the
 * just-created course. The one failure this modal itself surfaces is a
 * taken slug, rendered inline on the field.
 */

/** A newly-created course's starting lifecycle state — `CourseEntity.status` before it ever publishes. */
export type CourseDraftStatus = "draft" | "published"

/** Props for {@link CreateCourseModal}. */
export interface CreateCourseModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** Course title (controlled) — `CourseEntity.title`. */
    title: string
    /** Fires as the title field changes. */
    onTitleChange: (value: string) => void
    /** Course slug (controlled) — `CourseEntity.slug`, the classroom URL segment. */
    slug: string
    /** Fires as the slug field changes. */
    onSlugChange: (value: string) => void
    /** Short description (controlled) — `CourseEntity.summary`. */
    description: string
    /** Fires as the description field changes. */
    onDescriptionChange: (value: string) => void
    /** Price in VND, raw number — `CourseEntity.price`. `InputCurrency` owns the formatting. */
    price: number
    /** Fires as the price field changes. */
    onPriceChange: (value: number) => void
    /** Starting status — `CourseEntity.status`. */
    status: CourseDraftStatus
    /** Fires as the status field changes. */
    onStatusChange: (value: CourseDraftStatus) => void
    /** Create the course and route into `CourseStudio` for it — the connected layer runs `createCourse`. */
    onCreate: () => void
    /** `true` → the create mutation is in flight (fields lock, button busy). */
    isCreating?: boolean
    /**
     * Set once the slug is already taken by another course on this academy —
     * renders inline under the slug field. Cleared by the connected layer the
     * next time the field changes.
     */
    slugError?: string | null
    /**
     * `true` → the modal's own first fetch (e.g. resolving this academy's
     * slug availability rules) is in flight: every field shimmers.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CreateCourseModalLabels
}

/** The already-resolved copy the modal renders. */
export interface CreateCourseModalLabels {
    /** Modal title. */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Label above the title field. */
    nameLabel: string
    /** Placeholder in the title field. */
    namePlaceholder: string
    /** Label above the slug field. */
    slugLabel: string
    /** Placeholder in the slug field. */
    slugPlaceholder: string
    /** Label above the description field. */
    descriptionLabel: string
    /** Label above the price field. */
    priceLabel: string
    /** Label above the status field. */
    statusLabel: string
    /** The two status labels, keyed by status. */
    statusOptions: Record<CourseDraftStatus, string>
    /** Cancel button label. */
    cancelLabel: string
    /** Primary action label. */
    createLabel: string
    /** Primary action label while creating. */
    creatingLabel: string
}

/**
 * The create-course modal. See the file header for why the primary action
 * routes straight into the Studio rather than closing back to a list.
 *
 * @param props - {@link CreateCourseModalProps}
 */
const CreateCourseModal = ({
    isOpen,
    onOpenChange,
    title,
    onTitleChange,
    slug,
    onSlugChange,
    description,
    onDescriptionChange,
    price,
    onPriceChange,
    status,
    onStatusChange,
    onCreate,
    isCreating = false,
    slugError = null,
    isSkeleton = false,
    labels,
}: CreateCourseModalProps) => {
    const canCreate = title.trim().length > 0 && slug.trim().length > 0 && slugError == null
    const locked = isSkeleton || isCreating
    return (
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
                                label={labels.nameLabel}
                                placeholder={labels.namePlaceholder}
                                value={title}
                                onValueChange={onTitleChange}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <InputText
                                label={labels.slugLabel}
                                placeholder={labels.slugPlaceholder}
                                value={slug}
                                onValueChange={onSlugChange}
                                errorMessage={slugError ?? undefined}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <InputTextarea
                                label={labels.descriptionLabel}
                                rows={3}
                                value={description}
                                onValueChange={onDescriptionChange}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <InputCurrency
                                label={labels.priceLabel}
                                value={price}
                                onValueChange={onPriceChange}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <SelectSingle
                                label={labels.statusLabel}
                                value={status}
                                onValueChange={(value) => onStatusChange(value as CourseDraftStatus)}
                                options={[
                                    { value: "draft", label: labels.statusOptions.draft },
                                    { value: "published", label: labels.statusOptions.published },
                                ]}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    ]}
                />
            )}
            footer={() => (
                <>
                    <Button variant="ghost" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={locked} />
                    <Button
                        variant="primary"
                        suffixIcon={ArrowRightIcon}
                        label={isCreating ? labels.creatingLabel : labels.createLabel}
                        onPress={onCreate}
                        isPending={isCreating}
                        isDisabled={locked || !canCreate}
                    />
                </>
            )}
        />
    )
}

export { CreateCourseModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CreateCourseModal" } as const
