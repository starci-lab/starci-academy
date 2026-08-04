import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    ThemeEditorDrawer,
    type ThemeEditorDrawerLabels,
    type ThemeEditorDrawerValues,
} from "@sb-components/nivoexpert/overlays/drawers/ThemeEditorDrawer/ThemeEditorDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ThemeEditorDrawer` — a P3 shell: advanced per-tenant theming (corner
 * radius, font, raw global-CSS override) beyond `AcademySettingsForm`'s
 * single accent-hue field. `onPreview`/`onSaveAndApply` are plain callbacks —
 * the app phase wires live-preview and persistence once that endpoint exists.
 */
const meta: Meta<typeof ThemeEditorDrawer> = {
    title: "NivoExpert/Overlays/Drawers/ThemeEditorDrawer/ThemeEditorDrawer",
    component: ThemeEditorDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ThemeEditorDrawer>

const NOOP = () => {}

const LABELS: ThemeEditorDrawerLabels = {
    title: "Theme / CSS",
    description: "Fine-tune your academy's look beyond the accent color — corner radius, font, and a raw CSS override.",
    accentHueLabel: "Accent hue",
    accentHueHint: "0–359 — mirrors the Settings page's own accent field.",
    cornerRadiusLabel: "Corner radius",
    cornerRadiusHint: "Applied to cards, buttons, and fields, in pixels.",
    fontLabel: "Font",
    fontOptions: { inter: "Inter", manrope: "Manrope", system: "System default" },
    customCssLabel: "Global CSS (advanced)",
    customCssHint: "Injected as a scoped override on top of every other theme value.",
    customCssPlaceholder: "/* .tls-hero { ... } */",
    previewLabel: "Preview",
    saveAndApplyLabel: "Save & apply",
    savingLabel: "Saving…",
}

const VALUES: ThemeEditorDrawerValues = {
    accentHue: 344,
    cornerRadius: 12,
    font: "inter",
    customCss: "",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    InputNumber: { tier: "atom", role: "the accent-hue and corner-radius fields" },
    SelectSingle: { tier: "atom", role: "the font choice" },
    InputTextarea: { tier: "atom", role: "the raw global-CSS override" },
}

/** Controlled wrapper — a trigger reopens the drawer after it closes, so the story stays interactive. */
const ControlledThemeEditorDrawer = ({ isSaving, isSkeleton }: { isSaving?: boolean; isSkeleton?: boolean }) => {
    const [isOpen, setIsOpen] = useState(true)
    const [values, setValues] = useState(VALUES)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Edit theme" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <ThemeEditorDrawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                values={values}
                onAccentHueChange={(value) => setValues((prev) => ({ ...prev, accentHue: value }))}
                onCornerRadiusChange={(value) => setValues((prev) => ({ ...prev, cornerRadius: value }))}
                onFontChange={(value) => setValues((prev) => ({ ...prev, font: value }))}
                onCustomCssChange={(value) => setValues((prev) => ({ ...prev, customCss: value }))}
                onPreview={NOOP}
                onSaveAndApply={NOOP}
                isSaving={isSaving}
                isSkeleton={isSkeleton}
                labels={LABELS}
            />
        </div>
    )
}

/** STATE — the resolved form: today's accent hue, a 12px radius, Inter, no CSS override yet. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="ThemeEditorDrawer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="Presentational overlay drawer over four controlled fields, handed in as `values` (the connected layer holds the actual `--nivo-*` read/write). A P3 shell: `onPreview`/`onSaveAndApply` are plain callbacks with no mutation behind them yet — building the shell now means the drawer's shape is already right when that endpoint ships."
            states={[
                {
                    name: "loaded values",
                    why: "The tenant's current theme: accent hue matching Settings, a 12px radius, Inter, and an empty CSS override — Preview and Save & apply are both available.",
                    code: "<ThemeEditorDrawer isOpen onOpenChange={close} values={values} onAccentHueChange={setHue} … onSaveAndApply={save} labels={labels} />",
                    render: <ControlledThemeEditorDrawer />,
                },
                {
                    name: "isSaving = true",
                    why: "Right after 'Save & apply' is pressed: every field disables and Save shows its spinner + 'Saving…' until the mutation resolves.",
                    code: "<ThemeEditorDrawer … onSaveAndApply={save} isSaving labels={labels} />",
                    render: <ControlledThemeEditorDrawer isSaving />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The drawer's own first fetch is in flight: every field — including the font select — renders its field-box shimmer.",
                    code: "<ThemeEditorDrawer … isSkeleton labels={labels} />",
                    render: <ControlledThemeEditorDrawer isSkeleton />,
                },
            ]}
        />
    ),
}
