import { PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText, InputTextarea } from "@sb-components/atoms/forms"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PostComposer` -- the title + body + submit card a member meets above the
 * community feed. ONE composition: two fields and a submit action; there are
 * no separate pictures here, only the `isSubmitting` in-flight state. Grounded
 * in the real `PostForm.tsx` (`title`, `body`, the `createPost` mutation, and a
 * `busy` flag that locks the button while the request is in flight).
 */

/** Props for {@link PostComposer}. */
export interface PostComposerProps {
    /** Current title text (controlled). */
    title: string
    /** Fires as the title field changes. */
    onTitleChange: (value: string) => void
    /** Current body text (controlled). */
    body: string
    /** Fires as the body field changes. */
    onBodyChange: (value: string) => void
    /** Submit the post -- the connected layer runs `createPost({ title, body })`. */
    onSubmit: () => void
    /** `true` -> the mutation is in flight: the submit button shows a spinner and both fields lock. */
    isSubmitting?: boolean
    /** Already-localized copy. */
    labels: PostComposerLabels
}

/** The already-resolved copy the card renders. */
export interface PostComposerLabels {
    /** Placeholder for the title field. */
    titlePlaceholder: string
    /** Placeholder for the body field. */
    bodyPlaceholder: string
    /** Accessible name for the title field. */
    titleAriaLabel: string
    /** Accessible name for the body field. */
    bodyAriaLabel: string
    /** Submit button label at rest. */
    submitLabel: string
    /** Submit button label while the mutation is in flight. */
    submittingLabel: string
}

/**
 * The community post composer. See the file header for the full contract.
 *
 * @param props - {@link PostComposerProps}
 */
const PostComposer = ({
    title,
    onTitleChange,
    body,
    onBodyChange,
    onSubmit,
    isSubmitting = false,
    labels,
}: PostComposerProps) => {
    // Presentation logic the block derives, not a request it makes -- mirrors the
    // real `submit`'s implicit guard (`!title.trim() || !body.trim() || busy`).
    const canSubmit = title.trim().length > 0 && body.trim().length > 0

    return (
        <div data-tier="block" data-component="PostComposer">
            <SurfaceCard
                padding={3}
                body={() => (
                    <StackV
                        gap={3}
                        items={[
                            () => (
                                <InputText
                                    variant="secondary"
                                    placeholder={labels.titlePlaceholder}
                                    ariaLabel={labels.titleAriaLabel}
                                    value={title}
                                    onValueChange={onTitleChange}
                                    isDisabled={isSubmitting}
                                />
                            ),
                            () => (
                                <InputTextarea
                                    variant="secondary"
                                    placeholder={labels.bodyPlaceholder}
                                    ariaLabel={labels.bodyAriaLabel}
                                    value={body}
                                    onValueChange={onBodyChange}
                                    rows={3}
                                    isDisabled={isSubmitting}
                                />
                            ),
                            () => (
                                <StackH
                                    gap={3}
                                    justify="end"
                                    items={[
                                        () => (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                prefixIcon={PaperPlaneTiltIcon}
                                                label={isSubmitting ? labels.submittingLabel : labels.submitLabel}
                                                onPress={onSubmit}
                                                isDisabled={!canSubmit || isSubmitting}
                                                isPending={isSubmitting}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { PostComposer }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PostComposer" } as const
