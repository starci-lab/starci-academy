import { EyeIcon, FloppyDiskIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputNumber, InputTextarea, SelectSingle, type SelectOption } from "@sb-components/atoms/forms"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ThemeEditorDrawer` -- a P3 shell: advanced per-tenant theming (corner
 * radius, font, raw global-CSS override) beyond `AcademySettingsForm`'s
 * single accent-hue field. `onPreview`/`onSaveAndApply` are plain callbacks --
 * the app phase wires live-preview and persistence once that endpoint exists.
 */

/** The font choices this P3 shell offers. */
export type ThemeFontChoice = "inter" | "manrope" | "system"

/** The drawer's editable fields (controlled). */
export interface ThemeEditorDrawerValues {
    /** 0-359 -- every accent color on the tenant's site derives from this. */
    accentHue: number
    /** Corner radius, in pixels, applied to cards/buttons/fields. */
    cornerRadius: number
    /** Which font family the tenant's site renders in. */
    font: ThemeFontChoice
    /** Raw CSS injected as a `<style>` override, scoped to the tenant. */
    customCss: string
}

/** Props for {@link ThemeEditorDrawer}. */
export interface ThemeEditorDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The form's current field values (controlled). */
    values: ThemeEditorDrawerValues
    onAccentHueChange: (value: number) => void
    onCornerRadiusChange: (value: number) => void
    onFontChange: (value: ThemeFontChoice) => void
    onCustomCssChange: (value: string) => void
    /** Renders the current values against the live site without saving them. */
    onPreview: () => void
    /** Persists the values -- the connected layer runs the (P3, not-yet-existing) theme-update mutation. */
    onSaveAndApply: () => void
    /** `true` -> the save is in flight: the whole form locks and Save shows a spinner. */
    isSaving?: boolean
    /**
     * `true` -> the drawer's own first fetch is in flight: every field renders
     * its field-box shimmer, threaded straight down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ThemeEditorDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface ThemeEditorDrawerLabels {
    /** Drawer title. */
    title: string
    /** Drawer supporting line. */
    description: string
    accentHueLabel: string
    accentHueHint: string
    cornerRadiusLabel: string
    cornerRadiusHint: string
    fontLabel: string
    /** The three font choices, keyed by choice. */
    fontOptions: Record<ThemeFontChoice, string>
    customCssLabel: string
    customCssHint: string
    customCssPlaceholder: string
    previewLabel: string
    saveAndApplyLabel: string
    savingLabel: string
}

/** Fixed font order -- a 3-way choice, not a caller-supplied list. */
const FONT_ORDER: ReadonlyArray<ThemeFontChoice> = ["inter", "manrope", "system"]

/**
 * The advanced theme-editor drawer. See the file header for why it is a
 * separate P3 shell from `AcademySettingsForm`'s single accent-hue field.
 *
 * @param props - {@link ThemeEditorDrawerProps}
 */
const ThemeEditorDrawer = ({
    isOpen,
    onOpenChange,
    values,
    onAccentHueChange,
    onCornerRadiusChange,
    onFontChange,
    onCustomCssChange,
    onPreview,
    onSaveAndApply,
    isSaving = false,
    isSkeleton = false,
    labels,
}: ThemeEditorDrawerProps) => {
    const fontOptions: Array<SelectOption> = FONT_ORDER.map((font) => ({ value: font, label: labels.fontOptions[font] }))

    const Body = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <StackV
            principle="label-field" gap={4}
            isSkeleton={skeleton}
            items={[
                () => (
                    <Grid
                        principle="content-row" columns={{ base: 1, sm: 2 }}
                        isSkeleton={skeleton}
                        items={[
                            {
                                key: "accentHue",
                                content: () => (
                                    <InputNumber
                                        label={labels.accentHueLabel}
                                        hint={labels.accentHueHint}
                                        value={values.accentHue}
                                        onValueChange={onAccentHueChange}
                                        minValue={0}
                                        maxValue={359}
                                        isDisabled={isSaving}
                                        isSkeleton={skeleton}
                                    />
                                ),
                            },
                            {
                                key: "cornerRadius",
                                content: () => (
                                    <InputNumber
                                        label={labels.cornerRadiusLabel}
                                        hint={labels.cornerRadiusHint}
                                        value={values.cornerRadius}
                                        onValueChange={onCornerRadiusChange}
                                        minValue={0}
                                        maxValue={32}
                                        isDisabled={isSaving}
                                        isSkeleton={skeleton}
                                    />
                                ),
                            },
                        ]}
                    />
                ),
                () =>
                    skeleton ? (
                        <SelectSingle
                            label={labels.fontLabel}
                            options={fontOptions}
                            value={null}
                            onValueChange={() => {}}
                            isSkeleton
                        />
                    ) : (
                        <SelectSingle
                            label={labels.fontLabel}
                            options={fontOptions}
                            value={values.font}
                            onValueChange={(value) => onFontChange(value as ThemeFontChoice)}
                            isDisabled={isSaving}
                        />
                    ),
                () => (
                    <InputTextarea
                        label={labels.customCssLabel}
                        hint={labels.customCssHint}
                        placeholder={labels.customCssPlaceholder}
                        value={values.customCss}
                        onValueChange={onCustomCssChange}
                        rows={6}
                        isDisabled={isSaving}
                        isSkeleton={skeleton}
                    />
                ),
            ]}
        />
    )

    const Footer = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <>
            <Button
                variant="outline"
                prefixIcon={EyeIcon}
                label={labels.previewLabel}
                onPress={onPreview}
                isDisabled={isSaving}
                isSkeleton={skeleton}
            />
            <Button
                variant="primary"
                prefixIcon={FloppyDiskIcon}
                label={isSaving ? labels.savingLabel : labels.saveAndApplyLabel}
                onPress={onSaveAndApply}
                isPending={isSaving}
                isSkeleton={skeleton}
            />
        </>
    )

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="right"
                title={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={Body}
                footer={Footer}
            />
        </div>
    )
}

export { ThemeEditorDrawer }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "ThemeEditorDrawer" } as const
