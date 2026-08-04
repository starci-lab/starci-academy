import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    TemplatePickerModal,
    type StarterTemplateId,
    type StarterTemplateOptionView,
    type TemplatePickerModalLabels,
} from "@sb-components/nivoexpert/overlays/modals/TemplatePickerModal/TemplatePickerModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `TemplatePickerModal` — a P3 shell: pick one starter template (accent +
 * layout + section-defaults preset) to inject into the tenant's `--nivo-*`
 * tokens. `onApply` is a plain callback; the app phase wires the real preset-
 * injection mutation once it exists.
 */
const meta: Meta<typeof TemplatePickerModal> = {
    title: "NivoExpert/Overlays/Modals/TemplatePickerModal/TemplatePickerModal",
    component: TemplatePickerModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TemplatePickerModal>

const NOOP = () => {}

const LABELS: TemplatePickerModalLabels = {
    title: "Choose a template",
    description: "Each template is a full preset — accent color, layout, and section defaults — applied to your academy's `--nivo-*` tokens.",
    groupAriaLabel: "Starter templates",
    defaultBadgeLabel: "Default",
    cancelLabel: "Cancel",
    applyLabel: "Apply template",
    applyingLabel: "Applying…",
}

const TEMPLATES: Array<StarterTemplateOptionView> = [
    { id: "crimson", name: "Crimson", description: "Bold, high-contrast — the default preset.", isDefault: true },
    { id: "ocean", name: "Ocean", description: "Cool blues, calmer contrast." },
    { id: "emerald", name: "Emerald", description: "Green accent, editorial layout." },
    { id: "amber", name: "Amber", description: "Warm accent, dense section defaults." },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    SurfaceCardPressableGroup: {
        tier: "composite",
        role: "the 4-tile gallery, used in its single-select mode",
        storyId: "composites-cards-surfacecard-surfacecardpressablegroup--default",
    },
}

/** Controlled wrapper — a trigger reopens the modal after it closes, so the story stays interactive. */
const ControlledTemplatePickerModal = ({ isApplying, isSkeleton }: { isApplying?: boolean; isSkeleton?: boolean }) => {
    const [isOpen, setIsOpen] = useState(true)
    const [selected, setSelected] = useState<StarterTemplateId>("crimson")
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Choose a template" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <TemplatePickerModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                templates={TEMPLATES}
                selectedTemplateId={selected}
                onSelectTemplate={setSelected}
                onApply={NOOP}
                isApplying={isApplying}
                isSkeleton={isSkeleton}
                labels={LABELS}
            />
        </div>
    )
}

/** STATE — the resolved gallery: four templates, Crimson (the default) highlighted. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="TemplatePickerModal"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="Presentational overlay modal over a fixed gallery, handed in as props. Reuses `SurfaceCardPressableGroup` in its documented single-select mode — the same composite `AcademySettingsForm`'s inline landing-template picker uses — rather than inventing a second grid shape for what is structurally the same 'choose one tile' gesture."
            states={[
                {
                    name: "four templates, Crimson selected",
                    why: "The full gallery: each tile shows its swatch, name, and one-line description; Crimson carries the 'Default' badge and the selected ring.",
                    code: "<TemplatePickerModal isOpen onOpenChange={close} templates={templates} selectedTemplateId=\"crimson\" onSelectTemplate={select} onApply={apply} labels={labels} />",
                    render: <ControlledTemplatePickerModal />,
                },
                {
                    name: "isApplying = true",
                    why: "Right after 'Apply template' is pressed: the grid locks (tiles stop responding to taps) and Apply shows its spinner + 'Applying…' until the mutation resolves.",
                    code: "<TemplatePickerModal … onApply={apply} isApplying labels={labels} />",
                    render: <ControlledTemplatePickerModal isApplying />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The modal's own first fetch (reading the gallery) is in flight: the title/description and all four tiles shimmer together, same grid shape as loaded.",
                    code: "<TemplatePickerModal … isSkeleton labels={labels} />",
                    render: <ControlledTemplatePickerModal isSkeleton />,
                },
            ]}
        />
    ),
}
