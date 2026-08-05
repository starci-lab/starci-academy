import React from "react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { SelectableCardGroup, type SelectableCardItem } from "@/components/blocks/navigation/SelectableCardGroup"

/**
 * `_CvReviewLevelDetailsModal` — presentational: typed props, already resolved;
 * no fetch/store/i18n (that's the connected half, `./index.tsx`). Composes
 * `ModalShell` (dialog scaffold, owns the title/description header) +
 * `SelectableCardGroup` (single-column, the reused "choose one of N cards"
 * block) so the learner can pick a CV rubric template from its title and
 * description. `scroll="inside"` lets `ModalShell` handle a long template
 * list itself instead of a hand-rolled max-height wrapper.
 *
 * No owned request reaches this component (the rows it renders come from a
 * redux cache another surface populates), so there is no first-load signal
 * to compute an `isSkeleton` from — see `tiers/split.md`.
 */

/** One selectable CV rubric template row in the modal, already resolved. */
export interface CvReviewLevelOption {
    /** `template_cvs.id`. */
    id: string
    /** Template title shown to the learner. */
    title: string
    /** Template description shown under the title; already falls back to the empty-state copy. */
    description: string
}

/** All display text, already localized by the connected `CvReviewLevelDetailsModal`; a story passes i18n keys. */
export interface CvReviewLevelDetailsModalLabels {
    /** Modal header title; doubles as the card group's accessible name. */
    selectionTitle: string
    /** Modal header subtitle. */
    subtitle: string
}

/** Props for {@link _CvReviewLevelDetailsModal}. */
export interface CvReviewLevelDetailsModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. */
    onOpenChange: (open: boolean) => void
    /** Currently selected rubric template id. */
    selectedTemplateId: string
    /** Selectable rubric templates, in display order. */
    options: Array<CvReviewLevelOption>
    /** Fired with the chosen template id; the caller also closes the modal. */
    onSelect: (templateId: string) => void
    labels: CvReviewLevelDetailsModalLabels
}

/**
 * Lets the learner choose a CV review level from template title and
 * description. See the file header for the full contract.
 *
 * @param props - {@link CvReviewLevelDetailsModalProps}
 */
export const _CvReviewLevelDetailsModal = ({
    isOpen,
    onOpenChange,
    selectedTemplateId,
    options,
    onSelect,
    labels,
}: CvReviewLevelDetailsModalProps) => {
    const cardItems: Array<SelectableCardItem<string>> = options.map((option) => ({
        value: option.id,
        label: option.title,
        description: option.description,
    }))

    return (
        <ModalShell
            identity={{ tier: "overlay", component: "CvReviewLevelDetailsModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.selectionTitle}
            description={labels.subtitle}
            size="md"
            scroll="inside"
            body={() => (
                <SelectableCardGroup
                    items={cardItems}
                    value={selectedTemplateId}
                    onChange={onSelect}
                    ariaLabel={labels.selectionTitle}
                    columns={1}
                />
            )}
        />
    )
}
