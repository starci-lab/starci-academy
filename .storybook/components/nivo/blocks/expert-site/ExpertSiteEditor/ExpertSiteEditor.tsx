import { ArrowSquareOutIcon, EyeIcon, EyeSlashIcon, FloppyDiskIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { InputText, InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard, SurfaceCardSelectableGroup } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { ExpertSiteTemplateKey } from "@sb-components/nivo/blocks/expert-site/ExpertSiteGenerate/ExpertSiteGenerate"

/**
 * `ExpertSiteEditor` — the owner-side content form for one site. One composition
 * of three cards: the address bar (slug + status + publish toggle), the template
 * picker, and the content fields above Save. The publication `status` is DATA, so
 * `draft` and `published` are STATES of the single shape. Grounded in the real
 * `ExpertSiteEditor`; maps onto `ExpertSiteConfig` + `ExpertSiteEntity`.
 */

/** Publication state — mirrors `ExpertSiteStatus`. */
export type ExpertSiteStatusKey = "draft" | "live" | "suspended"

/** Props for {@link ExpertSiteEditor}. */
export interface ExpertSiteEditorProps {
    /** The subdomain label the site is served at (`ExpertSiteEntity.slug`). */
    slug: string
    /** Publication state (`ExpertSiteEntity.status`). */
    status: ExpertSiteStatusKey
    /** Display name field value (`ExpertSiteConfig.displayName`). */
    displayName: string
    /** Fires as the display name changes. */
    onDisplayNameChange: (value: string) => void
    /** Headline field value (`ExpertSiteConfig.headline`). */
    headline: string
    /** Fires as the headline changes. */
    onHeadlineChange: (value: string) => void
    /** Bio field value (`ExpertSiteConfig.bio`). */
    bio: string
    /** Fires as the bio changes. */
    onBioChange: (value: string) => void
    /** Selected template (`ExpertSiteConfig.templateKey`). */
    templateKey: ExpertSiteTemplateKey
    /** Fires when a template is chosen. */
    onTemplateKeyChange: (value: ExpertSiteTemplateKey) => void
    /** Save the content fields. */
    onSave: () => void
    /** `true` → a save is in flight. */
    isSaving?: boolean
    /** Publish a draft, or take a live site offline. */
    onTogglePublish: () => void
    /** `true` → a publish/unpublish is in flight. */
    isPublishing?: boolean
    /** Open the live site in a new tab (only meaningful once live). */
    onVisit: () => void
    /** Already-localized copy. */
    labels: ExpertSiteEditorLabels
}

/** The already-resolved copy the block renders. */
export interface ExpertSiteEditorLabels {
    /** Label above the site address. */
    addressLabel: string
    /** Status chip copy, keyed by status. */
    statusLabels: Record<ExpertSiteStatusKey, string>
    /** Visit-site button label (live only). */
    visitLabel: string
    /** Publish button label (draft state). */
    publishLabel: string
    /** Unpublish button label (live state). */
    unpublishLabel: string
    /** Template-picker section title. */
    templateTitle: string
    /** Accessible name for the template group. */
    templateGroupLabel: string
    /** Template option copy, keyed by template. */
    templates: Record<ExpertSiteTemplateKey, { name: string; description: string }>
    /** Content-fields section title. */
    contentTitle: string
    /** Display name field label. */
    displayNameLabel: string
    /** Headline field label. */
    headlineLabel: string
    /** Bio field label. */
    bioLabel: string
    /** Save button label. */
    saveLabel: string
}

/** The three templates in display order. */
const TEMPLATE_ORDER: Array<ExpertSiteTemplateKey> = ["minimal", "creator", "consultant"]

/** Status → chip tone: live is success, suspended warns, draft is neutral. */
const STATUS_TONE: Record<ExpertSiteStatusKey, ChipTone> = {
    draft: "default",
    live: "success",
    suspended: "warning",
}

/**
 * The site content editor. See the file header for why draft vs published are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link ExpertSiteEditorProps}
 */
const ExpertSiteEditor = ({
    slug,
    status,
    displayName,
    onDisplayNameChange,
    headline,
    onHeadlineChange,
    bio,
    onBioChange,
    templateKey,
    onTemplateKeyChange,
    onSave,
    isSaving = false,
    onTogglePublish,
    isPublishing = false,
    onVisit,
    labels,
}: ExpertSiteEditorProps) => {
    const isLive = status === "live"
    const isSuspended = status === "suspended"

    const templateItems = TEMPLATE_ORDER.map((key) => ({
        value: key,
        label: labels.templates[key].name,
        description: labels.templates[key].description,
    }))

    /** The address bar + publish controls — the one card that reads the status. */
    const AddressCard = () => (
        <SurfaceCard
            padding={3}
            body={() => (
                <StackH
                    gap={3}
                    justify="between"
                    at="sm"
                    items={[
                        () => (
                            <StackV
                                gap={2}
                                classNames={["min-w-0"]}
                                items={[
                                    () => <Typography size="xs" color="muted" text={labels.addressLabel} />,
                                    () => (
                                        <StackH
                                            gap={3}
                                            items={[
                                                () => (
                                                    <Typography
                                                        size="sm"
                                                        weight="medium"
                                                        truncate
                                                        text={`${slug}.nivo.vn`}
                                                    />
                                                ),
                                                () => (
                                                    <Chip
                                                        tone={STATUS_TONE[status]}
                                                        text={labels.statusLabels[status]}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <StackH
                                gap={3}
                                classNames={["shrink-0"]}
                                items={[
                                    ...(isLive
                                        ? [
                                            () => (
                                                <Button
                                                    variant="secondary"
                                                    prefixIcon={ArrowSquareOutIcon}
                                                    label={labels.visitLabel}
                                                    onPress={onVisit}
                                                />
                                            ),
                                        ]
                                        : []),
                                    () => (
                                        <Button
                                            variant={isLive ? "secondary" : "primary"}
                                            prefixIcon={isLive ? EyeSlashIcon : EyeIcon}
                                            label={isLive ? labels.unpublishLabel : labels.publishLabel}
                                            onPress={onTogglePublish}
                                            isPending={isPublishing}
                                            isDisabled={isSuspended}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )

    return (
        <div data-tier="block" data-component="ExpertSiteEditor">
            <StackV
                gap={3}
                items={[
                    () => <AddressCard />,
                    () => (
                        <SurfaceCard
                            padding={3}
                            label={labels.templateTitle}
                            body={() => (
                                <SurfaceCardSelectableGroup
                                    ariaLabel={labels.templateGroupLabel}
                                    columns={3}
                                    value={templateKey}
                                    onChange={onTemplateKeyChange}
                                    items={templateItems}
                                />
                            )}
                        />
                    ),
                    () => (
                        <SurfaceCard
                            padding={3}
                            label={labels.contentTitle}
                            body={() => (
                                <StackV
                                    gap={3}
                                    items={[
                                        () => (
                                            <InputText
                                                variant="secondary"
                                                label={labels.displayNameLabel}
                                                value={displayName}
                                                onValueChange={onDisplayNameChange}
                                            />
                                        ),
                                        () => (
                                            <InputText
                                                variant="secondary"
                                                label={labels.headlineLabel}
                                                value={headline}
                                                onValueChange={onHeadlineChange}
                                            />
                                        ),
                                        () => (
                                            <InputTextarea
                                                variant="secondary"
                                                label={labels.bioLabel}
                                                rows={4}
                                                value={bio}
                                                onValueChange={onBioChange}
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
                                                            prefixIcon={FloppyDiskIcon}
                                                            label={labels.saveLabel}
                                                            onPress={onSave}
                                                            isPending={isSaving}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        ),
                                    ]}
                                />
                            )}
                        />
                    ),
                ]}
            />
        </div>
    )
}

export { ExpertSiteEditor }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteEditor" } as const
