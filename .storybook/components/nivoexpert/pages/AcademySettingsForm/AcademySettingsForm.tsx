import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { InputNumber, InputText, ChoiceSwitch } from "@sb-components/atoms/forms"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { Form, FormActions } from "@sb-components/composites/form/Form/Form"
import { SurfaceCard, SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { Box } from "@sb-components/frames/Box/Box"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AcademySettingsForm` -- the PAGE an expert edits their academy's brand and
 * landing template from: two stacked cards (brand identity fields, a 3-card
 * template picker) under one form shell + save/discard row. A page's story is
 * one complete STATE per story -- not a leaf-per-prop map. Grounded in the real
 * `Brand` shape (`lib/session.ts`) and the three real `landings/` presets.
 *
 * Settings are never genuinely EMPTY (a tenant's brand always exists from
 * `EXPERT_CONFIG` the moment it does) -- this page's "empty" state is
 * therefore the first-fetch skeleton, not a zero-data branch; see `Empty`
 * below. The other three named states -- `editing` (dirty) and `saving` are
 * this page's own interaction states, and `Failed` renders the save-error
 * banner the proposal calls out as new backend scope (contradiction #4:
 * there is no brand/theme update mutation yet).
 */

/** Which real `landings/` preset the tenant's public site renders. */
export type AcademyLandingTemplate = "classic" | "bold" | "minimal"

/** The editable subset of the real `Brand` shape (`lib/session.ts`). */
export interface AcademySettingsFormValues {
    /** `Brand.displayName`. */
    displayName: string
    /** `Brand.slug` -- the tenant's routing identity, set at signup. Shown, never edited here. */
    slug: string
    /** `Brand.tagline`. */
    tagline: string
    /** `Brand.avatarUrl` -- the academy's logo image URL. */
    avatarUrl: string
    /** `Brand.accentHue` -- 0-359, every accent token on the tenant's site derives from this. */
    accentHue: number
    /** `Brand.communityEnabled`. */
    communityEnabled: boolean
    /** `Brand.communityGroup.url` -- the external Discord/Zalo/Telegram "join" link. */
    communityGroupUrl: string
    /** `Theme.template`. */
    template: AcademyLandingTemplate
}

/** Props for {@link AcademySettingsForm}. */
export interface AcademySettingsFormProps {
    /** The form's current field values (controlled). */
    values: AcademySettingsFormValues
    onDisplayNameChange: (value: string) => void
    onTaglineChange: (value: string) => void
    onAvatarUrlChange: (value: string) => void
    onAccentHueChange: (value: number) => void
    onCommunityEnabledChange: (value: boolean) => void
    onCommunityGroupUrlChange: (value: string) => void
    onTemplateChange: (value: AcademyLandingTemplate) => void
    /** `true` -> at least one field diverges from the last-loaded values; enables Save/Discard. */
    isDirty?: boolean
    /** Revert every field back to the last-loaded values. */
    onDiscard: () => void
    /** Persist the current values -- the connected layer runs the (not-yet-existing) brand/theme update mutation. */
    onSave: () => void
    /** `true` -> the save is in flight: the whole form locks (native `<fieldset disabled>`) and the Save button spins. */
    isSaving?: boolean
    /** Set -> the last save attempt failed; renders the failed-save banner. `null`/unset -> no banner. */
    saveError?: string | null
    /**
     * `true` -> the page's own first fetch (`getBrand()` / `api.theme()`) is in
     * flight: every field renders its field-box shimmer and the template picker
     * renders its placeholder tiles. There is no separate "empty" branch for
     * this page -- see the file header.
     */
    isSkeleton?: boolean
    /** Already-localized copy for the page's own chrome. */
    labels: AcademySettingsFormLabels
}

/** The already-resolved copy this page renders directly. */
export interface AcademySettingsFormLabels {
    /** Page title (e.g. "Settings"). */
    title: string
    /** Page subtitle under the title. */
    subtitle: string
    /** Chip shown beside the title while `isDirty` and not saving/failed. */
    unsavedBadge: string
    /** Brand card section title. */
    brandSectionTitle: string
    /** Brand card section description. */
    brandSectionDescription: string
    displayNameLabel: string
    slugLabel: string
    slugHint: string
    taglineLabel: string
    taglinePlaceholder: string
    logoLabel: string
    logoHint: string
    accentHueLabel: string
    accentHueHint: string
    communityEnabledLabel: string
    communityGroupLabel: string
    communityGroupPlaceholder: string
    communityGroupHint: string
    /** Template card section title. */
    templateSectionTitle: string
    /** Template card section description. */
    templateSectionDescription: string
    /** Accessible name for the template picker group. */
    templateGroupAriaLabel: string
    /** The three template names, keyed by template. */
    templateLabels: Record<AcademyLandingTemplate, string>
    /** The three template one-line descriptions, keyed by template. */
    templateDescriptions: Record<AcademyLandingTemplate, string>
    discardLabel: string
    saveLabel: string
    savingLabel: string
    /** Failed-save banner title. */
    saveErrorTitle: string
}

/** Templates, in display order -- also the picker's column order. */
const TEMPLATE_ORDER: ReadonlyArray<AcademyLandingTemplate> = ["classic", "bold", "minimal"]

/** A small decorative color swatch standing in for each template's real preview screenshot -- abstract, not a literal render of `landings/*.tsx`. */
const TEMPLATE_SWATCH_CLASS: Record<AcademyLandingTemplate, string> = {
    classic: "bg-gradient-to-br from-accent to-accent-soft",
    bold: "bg-gradient-to-br from-danger to-foreground",
    minimal: "bg-gradient-to-br from-default to-background",
}

/**
 * The academy settings/theming form. See the file header for why `onSave`
 * exists as a plain callback despite the BE having nothing to call yet, and
 * why the "empty" state maps to the first-fetch skeleton rather than a
 * zero-data branch.
 *
 * @param props - {@link AcademySettingsFormProps}
 */
const AcademySettingsForm = ({
    values,
    onDisplayNameChange,
    onTaglineChange,
    onAvatarUrlChange,
    onAccentHueChange,
    onCommunityEnabledChange,
    onCommunityGroupUrlChange,
    onTemplateChange,
    isDirty = false,
    onDiscard,
    onSave,
    isSaving = false,
    saveError,
    isSkeleton = false,
    labels,
}: AcademySettingsFormProps) => {
    /**
     * The brand-identity fields -- the card's `body` slot, a component reference so `isSkeleton` reaches every field.
     *
     * principle="label-field": outer column of labeled controls at step 4 (12px). Inner
     * labeled inputs already own FieldFrame label-to-control. Teacher hold
     * academy-settings-brandfields-label-field — keep until a field-column token exists;
     * do not rename mechanically to sibling-stack / group-boundary (would change density).
     */
    const BrandFields = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <StackV
            principle="label-field"
            isSkeleton={skeleton}
            items={[
                () => (
                    <Grid
                        columns={{ base: 1, sm: 2 }}
                        principle="content-row"
                        items={[
                            {
                                key: "displayName",
                                content: () => (
                                    <InputText
                                        label={labels.displayNameLabel}
                                        value={values.displayName}
                                        onValueChange={onDisplayNameChange}
                                        isRequired
                                        isSkeleton={skeleton}
                                    />
                                ),
                            },
                            {
                                key: "slug",
                                content: () => (
                                    <InputText
                                        label={labels.slugLabel}
                                        hint={labels.slugHint}
                                        value={values.slug}
                                        onValueChange={() => {}}
                                        isDisabled
                                        isSkeleton={skeleton}
                                    />
                                ),
                            },
                        ]}
                    />
                ),
                () => (
                    <InputText
                        label={labels.taglineLabel}
                        placeholder={labels.taglinePlaceholder}
                        value={values.tagline}
                        onValueChange={onTaglineChange}
                        isSkeleton={skeleton}
                    />
                ),
                () => (
                    <StackH
                        principle="identity-end"
                        isSkeleton={skeleton}
                        items={[
                            () => <Avatar src={values.avatarUrl || undefined} name={values.displayName} fallback="initials" size="lg" isSkeleton={skeleton} />,
                            () => (
                                <Box className="min-w-0 flex-1">
                                    <InputText
                                        label={labels.logoLabel}
                                        hint={labels.logoHint}
                                        value={values.avatarUrl}
                                        onValueChange={onAvatarUrlChange}
                                        isSkeleton={skeleton}
                                    />
                                </Box>
                            ),
                        ]}
                    />
                ),
                () => (
                    <InputNumber
                        label={labels.accentHueLabel}
                        hint={labels.accentHueHint}
                        value={values.accentHue}
                        onValueChange={onAccentHueChange}
                        minValue={0}
                        maxValue={359}
                        isSkeleton={skeleton}
                    />
                ),
                () => (
                    <ChoiceSwitch
                        label={labels.communityEnabledLabel}
                        isSelected={values.communityEnabled}
                        onValueChange={onCommunityEnabledChange}
                        isSkeleton={skeleton}
                    />
                ),
                () => (
                    <InputText
                        label={labels.communityGroupLabel}
                        placeholder={labels.communityGroupPlaceholder}
                        hint={labels.communityGroupHint}
                        value={values.communityGroupUrl}
                        onValueChange={onCommunityGroupUrlChange}
                        isDisabled={!values.communityEnabled}
                        isSkeleton={skeleton}
                    />
                ),
            ]}
        />
    )

    /**
     * The template picker -- `SurfaceCardPressableGroup` used as a single-select
     * chooser (its own documented `selected` mode), NOT `SurfaceCardSelectableGroup`
     * (the more semantically exact single-select control, built on a real HeroUI
     * `RadioGroup`) -- that member has no `isSkeleton` prop at all, and this picker
     * must shimmer during the page's first fetch same as every other field. Filed
     * as a proposed gap (add `isSkeleton` to `SurfaceCardSelectableGroup`) rather
     * than hand-rolled around here.
     */
    const TemplatePicker = ({ isSkeleton: skeleton }: SkeletonProps) => {
        const items: Array<SurfaceCardPressableGroupItem> = TEMPLATE_ORDER.map((template) => ({
            key: template,
            selected: values.template === template,
            onPress: () => onTemplateChange(template),
            label: labels.templateLabels[template],
            content: () => (
                <StackV
                    principle="title-subtitle"
                    items={[
                        () => <Box aria-hidden className={`h-12 w-full rounded-lg ${TEMPLATE_SWATCH_CLASS[template]}`} />,
                        () => <Typography size="sm" weight="semibold" text={labels.templateLabels[template]} />,
                        () => <Typography size="xs" color="muted" text={labels.templateDescriptions[template]} />,
                    ]}
                />
            ),
        }))
        return (
            <SurfaceCardPressableGroup items={items} ariaLabel={labels.templateGroupAriaLabel} columns={{ base: 1, sm: 3 }} isSkeleton={skeleton} principle="content-row" />
        )
    }

    return (
        // Page shell: center-measure (mx-auto + w-full) and page-pad (p-6) are nested
        // one-token frames. max-w-2xl is a foreign measure width on Box (escape hatch).
        <StackV
            principle="center-measure"
            identity={{ tier: "page", component: "AcademySettingsForm" }}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Box className="w-full max-w-2xl">
                        <StackV
                            principle="page-pad"
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <StackV
                                        principle="block-boundary"
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <StackH
                                                    principle="flex-action-center"
                                                    isSkeleton={isSkeleton}
                                                    items={[
                                                        () => (
                                                            <StackV
                                                                principle="title-subtitle"
                                                                isSkeleton={isSkeleton}
                                                                items={[
                                                                    () => <Typography size="h3" weight="semibold" text={labels.title} isSkeleton={isSkeleton} />,
                                                                    () => <Typography size="sm" color="muted" text={labels.subtitle} isSkeleton={isSkeleton} />,
                                                                ]}
                                                            />
                                                        ),
                                                        ...(!isSkeleton && isDirty && !isSaving ? [() => <Chip tone="warning" text={labels.unsavedBadge} />] : []),
                                                    ]}
                                                />
                                            ),
                                            ...(!isSkeleton && saveError
                                                ? [() => <Callout status="danger" title={labels.saveErrorTitle} description={saveError} />]
                                                : []),
                                            () => (
                                                <Form
                                                    onSubmit={onSave}
                                                    isDisabled={isSaving}
                                                    isSkeleton={isSkeleton}
                                                    principle="block-boundary"
                                                    body={({ isSkeleton: skeleton }: SkeletonProps) => (
                                                        <StackV
                                                            principle="block-boundary"
                                                            isSkeleton={skeleton}
                                                            items={[
                                                                () => (
                                                                    <SurfaceCard
                                                                        label={labels.brandSectionTitle}
                                                                        description={labels.brandSectionDescription}
                                                                        isSkeleton={skeleton}
                                                                        body={({ isSkeleton: cardSkeleton }: SkeletonProps) => <BrandFields isSkeleton={cardSkeleton} />}
                                                                    />
                                                                ),
                                                                () => (
                                                                    <SurfaceCard
                                                                        label={labels.templateSectionTitle}
                                                                        description={labels.templateSectionDescription}
                                                                        isSkeleton={skeleton}
                                                                        body={({ isSkeleton: cardSkeleton }: SkeletonProps) => <TemplatePicker isSkeleton={cardSkeleton} />}
                                                                    />
                                                                ),
                                                            ]}
                                                        />
                                                    )}
                                                    actions={
                                                        isSkeleton
                                                            ? undefined
                                                            : () => (
                                                                <FormActions
                                                                    principle="flex-action-between"
                                                                    items={[
                                                                        { key: "discard", label: labels.discardLabel, variant: "outline", onPress: onDiscard, isDisabled: !isDirty },
                                                                        {
                                                                            key: "save",
                                                                            label: isSaving ? labels.savingLabel : labels.saveLabel,
                                                                            variant: "primary",
                                                                            onPress: onSave,
                                                                            isPending: isSaving,
                                                                            isDisabled: !isDirty && !isSaving,
                                                                        },
                                                                    ]}
                                                                />
                                                            )
                                                    }
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    </Box>
                ),
            ]}
        />
    )
}

export { AcademySettingsForm }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "AcademySettingsForm" } as const
