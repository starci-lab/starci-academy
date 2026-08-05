import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `TemplatePickerModal` — a P3 shell: pick one starter template (accent +
 * layout + section-defaults preset) to inject into the tenant's `--nivo-*`
 * tokens. `onApply` is a plain callback; the app phase wires the real preset-
 * injection mutation once it exists.
 */

/** The four starter presets in the current gallery. */
export type StarterTemplateId = "crimson" | "ocean" | "emerald" | "amber"

/** One selectable starter template — already resolved by the connected layer. */
export interface StarterTemplateOptionView {
    /** Stable id — also the value reported to {@link TemplatePickerModalProps.onSelectTemplate}. */
    id: StarterTemplateId
    /** Display name (e.g. "Ocean"). */
    name: string
    /** One-line description of the preset. */
    description: string
    /** `true` → carries a "Default" badge next to its name. */
    isDefault?: boolean
}

/** Props for {@link TemplatePickerModal}. */
export interface TemplatePickerModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The gallery, in display order. */
    templates: Array<StarterTemplateOptionView>
    /** Which template is currently highlighted. */
    selectedTemplateId: StarterTemplateId
    /** Fires with a template's id when its tile is tapped. */
    onSelectTemplate: (id: StarterTemplateId) => void
    /** Injects the selected preset into `--nivo-*` — the connected layer runs the (P3, not-yet-existing) apply mutation. */
    onApply: () => void
    /** `true` → the apply is in flight: the grid locks and Apply shows a spinner. */
    isApplying?: boolean
    /**
     * `true` → the modal's own first fetch (reading the gallery) is in flight:
     * the title/description and the whole grid draw their skeleton mirror,
     * threaded straight down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: TemplatePickerModalLabels
}

/** The already-resolved copy the modal renders. */
export interface TemplatePickerModalLabels {
    /** Modal title. */
    title: string
    /** Modal supporting line. */
    description: string
    /** Accessible name for the template grid. */
    groupAriaLabel: string
    /** Badge text on the default template's tile. */
    defaultBadgeLabel: string
    /** Cancel footer button label. */
    cancelLabel: string
    /** Apply footer button label at rest. */
    applyLabel: string
    /** Apply footer button label while applying. */
    applyingLabel: string
}

/** A small decorative gradient swatch standing in for each preset's real live preview. */
const SWATCH_CLASS: Record<StarterTemplateId, string> = {
    crimson: "bg-gradient-to-br from-danger to-foreground",
    ocean: "bg-gradient-to-br from-info to-foreground",
    emerald: "bg-gradient-to-br from-success to-foreground",
    amber: "bg-gradient-to-br from-warning to-foreground",
}

/** Placeholder gallery — sized like the real four presets so the shimmer mirrors the loaded shape. */
const SKELETON_TEMPLATES: Array<StarterTemplateOptionView> = (["crimson", "ocean", "emerald", "amber"] as const).map((id) => ({
    id,
    name: "Template name",
    description: "One-line description",
}))

/**
 * The starter-template gallery modal. See the file header for why it is a
 * separate P3 shell from `AcademySettingsForm`'s inline landing-template picker.
 *
 * @param props - {@link TemplatePickerModalProps}
 */
const TemplatePickerModal = ({
    isOpen,
    onOpenChange,
    templates,
    selectedTemplateId,
    onSelectTemplate,
    onApply,
    isApplying = false,
    isSkeleton = false,
    labels,
}: TemplatePickerModalProps) => {
    const rows = isSkeleton ? SKELETON_TEMPLATES : templates

    const Body = ({ isSkeleton: skeleton }: SkeletonProps) => {
        const items: Array<SurfaceCardPressableGroupItem> = rows.map((template) => ({
            key: template.id,
            selected: template.id === selectedTemplateId,
            onPress: skeleton || isApplying ? undefined : () => onSelectTemplate(template.id),
            label: template.name,
            content: () => (
                <StackV
                    gap={2}
                    items={[
                        () => <div aria-hidden className={`h-14 w-full rounded-lg ${SWATCH_CLASS[template.id]}`} />,
                        () => (
                            <Typography
                                size="sm"
                                weight="semibold"
                                text={template.isDefault ? `${template.name} · ${labels.defaultBadgeLabel}` : template.name}
                            />
                        ),
                        () => <Typography size="xs" color="muted" text={template.description} />,
                    ]}
                />
            ),
        }))
        return (
            <SurfaceCardPressableGroup
                items={items}
                ariaLabel={labels.groupAriaLabel}
                columns={{ base: 1, sm: 2 }}
                isSkeleton={skeleton}
            />
        )
    }

    const Footer = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <>
            <Button variant="outline" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isSkeleton={skeleton} />
            <Button
                variant="primary"
                label={isApplying ? labels.applyingLabel : labels.applyLabel}
                onPress={onApply}
                isPending={isApplying}
                isSkeleton={skeleton}
            />
        </>
    )

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={Body}
                footer={Footer}
            />
        </div>
    )
}

export { TemplatePickerModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "TemplatePickerModal" } as const
