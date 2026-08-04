import { RocketLaunchIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import {
    ExpertSiteEditor,
    type ExpertSiteEditorProps,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor"

/**
 * `ExpertSiteManager` — the owner's control surface at `/expert-site`. It owns
 * one domain decision: does this user have a site yet? That branch is the two
 * STATES of the single shape — `no-site` shows the claim-a-slug prompt,
 * `has-site` shows the `ExpertSiteEditor`. Grounded in the real
 * `ExpertSiteManager`, which keeps both on one route.
 */

/** The create-prompt half — claiming a slug for a brand-new site. */
export interface ExpertSiteCreateFields {
    /** The slug the user is typing (`ExpertSiteEntity.slug`). */
    slug: string
    /** Fires as the slug changes. */
    onSlugChange: (value: string) => void
    /** Create the site with the current slug. */
    onCreate: () => void
    /** `true` → creation is in flight. */
    isCreating?: boolean
    /** Validation message to show under the field, or null when the slug is fine. */
    slugError?: string | null
    /** Already-localized copy for the create prompt. */
    labels: ExpertSiteCreateLabels
}

/** The already-resolved copy the create prompt renders. */
export interface ExpertSiteCreateLabels {
    /** Prompt title. */
    title: string
    /** Prompt supporting line. */
    description: string
    /** Slug field label. */
    slugLabel: string
    /** Slug field hint (e.g. the resulting host preview). */
    slugHint: string
    /** Create button label. */
    createLabel: string
}

/**
 * Props for {@link ExpertSiteManager} — a discriminated union on the branch it
 * owns. `create` renders the prompt; `edit` renders the editor for the resolved
 * site. Before that branch is known (the "do you have a site?" fetch still in
 * flight) `isSkeleton` (§12b) renders a representative create-prompt shape,
 * shimmering — so no `mode`/data is required in that arm.
 */
export type ExpertSiteManagerProps =
    | { isSkeleton: true }
    | ({ isSkeleton?: false } & (
        | ({ mode: "create" } & ExpertSiteCreateFields)
        | { mode: "edit"; editor: ExpertSiteEditorProps }
    ))

/**
 * The expert-site control surface. See the file header for why no-site vs
 * has-site are states of one shape rather than separate leaves.
 *
 * @param props - {@link ExpertSiteManagerProps}
 */
const ExpertSiteManager = (props: ExpertSiteManagerProps) => {
    // ── LOADING (§12b): the "do you have a site?" branch isn't known yet, so the
    // manager shows a representative create-prompt shape with every node shimmering.
    if (props.isSkeleton) {
        return (
            <div data-tier="block" data-component="ExpertSiteManager">
                <SurfaceCard
                    padding={3}
                    isSkeleton
                    body={() => (
                        <StackV
                            gap={3}
                            isSkeleton
                            items={[
                                () => <Typography size="base" weight="semibold" isSkeleton text="Claim your site" />,
                                () => <Typography size="sm" color="muted" isSkeleton text="Pick a slug to publish your expert site." />,
                                () => (
                                    <InputText
                                        variant="secondary"
                                        label="Site address"
                                        value=""
                                        onValueChange={() => {}}
                                        isSkeleton
                                    />
                                ),
                                () => (
                                    <StackH
                                        gap={3}
                                        justify="end"
                                        isSkeleton
                                        items={[
                                            () => (
                                                <Button
                                                    variant="primary"
                                                    prefixIcon={RocketLaunchIcon}
                                                    label="Create site"
                                                    isSkeleton
                                                    onPress={() => {}}
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

    if (props.mode === "edit") {
        return (
            <div data-tier="block" data-component="ExpertSiteManager">
                <ExpertSiteEditor {...props.editor} />
            </div>
        )
    }

    const { slug, onSlugChange, onCreate, isCreating = false, slugError, labels } = props

    return (
        <div data-tier="block" data-component="ExpertSiteManager">
            <SurfaceCard
                padding={3}
                body={() => (
                    <StackV
                        gap={3}
                        items={[
                            () => <Typography size="base" weight="semibold" text={labels.title} />,
                            () => <Typography size="sm" color="muted" text={labels.description} />,
                            () => (
                                <InputText
                                    variant="secondary"
                                    label={labels.slugLabel}
                                    hint={labels.slugHint}
                                    value={slug}
                                    onValueChange={onSlugChange}
                                    errorMessage={slugError ?? undefined}
                                    isDisabled={isCreating}
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
                                                prefixIcon={RocketLaunchIcon}
                                                label={labels.createLabel}
                                                onPress={onCreate}
                                                isPending={isCreating}
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

export { ExpertSiteManager }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteManager" } as const
