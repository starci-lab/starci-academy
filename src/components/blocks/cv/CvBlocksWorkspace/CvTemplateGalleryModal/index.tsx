"use client"

import React from "react"
import { useTranslations } from "next-intl"
import {
    CV_TWO_COLUMN_TEMPLATES,
    type CvDocument,
    type CvTemplate,
} from "@/modules/types/entities/cv"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"
import { CvHtmlDocument } from "../CvHtmlDocument"

/** The templates the gallery offers, in display order. */
const TEMPLATE_ORDER: ReadonlyArray<CvTemplate> = ["classic", "modern", "sidebar", "minimal"]

/** Props for {@link CvTemplateGalleryModal}. */
export interface CvTemplateGalleryModalProps {
    /** Whether the modal is open. */
    isOpen: boolean
    /** Fired when the modal should open/close. */
    onOpenChange: (isOpen: boolean) => void
    /** The active document — its data feeds every live thumbnail. */
    doc: CvDocument
    /** Fired with the picked template; the caller applies it to `style` + closes. */
    onSelect: (template: CvTemplate) => void
}

/**
 * "Template Gallery" — a modal grid of LIVE template thumbnails (the user's own CvGalleryPage
 * rendered in each layout via {@link CvHtmlDocument}) + name + an ATS badge.
 * Single-column templates read "ATS-safe"; the two-column one carries a
 * warning (ATS parsers + `.docx` export handle it worse — see
 * `CvGalleryPage-TEMPLATES-BRAINSTORM.md`). Picking a card applies the template and closes.
 *
 * Thumbnail mount (`width: 820` + `scale(0.34)` + fixed `h-52` crop) has no finite
 * vocabulary owner — held as contract proposal `CvTemplateThumbMount`, not rewritten.
 *
 * @param props - {@link CvTemplateGalleryModalProps}
 */
export const CvTemplateGalleryModal = ({
    isOpen,
    onOpenChange,
    doc,
    onSelect}: CvTemplateGalleryModalProps) => {
    const t = useTranslations()
    const current = doc.style.template ?? "classic"

    const onPick = (template: CvTemplate) => {
        onSelect(template)
        onOpenChange(false)
    }

    const items: Array<GridItem> = TEMPLATE_ORDER.map((template) => {
        const isTwoColumn = CV_TWO_COLUMN_TEMPLATES.has(template)
        const isSelected = current === template
        const name = t(`cv.builder.template.names.${template}`)
        return {
            key: template,
            content: () => (
                <SurfaceCard
                    isSelected={isSelected}
                    onPress={() => onPick(template)}
                    ariaLabel={t("cv.builder.template.selectAria", { name })}
                    body={() => (
                        <StackV
                            principle="card-caption"
                            explain="Thumbnail crop over template caption row — not sibling-stack, because the caption belongs to the media above it."
                            items={[
                                () => (
                                    // HOLD: CvTemplateThumbMount — live HTML CV scaled into a
                                    // fixed crop. No Measure/PDFView enum owns scale(0.34)×820px.
                                    <div aria-hidden className="h-52 overflow-hidden border-b border-default bg-white">
                                        <div
                                            className="pointer-events-none origin-top-left"
                                            style={{ width: 820, transform: "scale(0.34)" }}
                                        >
                                            <CvHtmlDocument doc={{ ...doc, style: { ...doc.style, template } }} />
                                        </div>
                                    </div>
                                ),
                                () => (
                                    <StackH
                                        principle="content-row"
                                        explain="Keeps template name and ATS chip on one baseline so the chip does not drop under the title."
                                        items={[
                                            () => (
                                                <StackV
                                                    principle="title-subtitle"
                                                    explain="Template name over optional Word hint — not label-field, because neither line is a form control."
                                                    items={[
                                                        () => (
                                                            <Typography
                                                                size="sm"
                                                                weight="semibold"
                                                                truncate
                                                                text={name}
                                                            />
                                                        ),
                                                        ...(isTwoColumn
                                                            ? [
                                                                () => (
                                                                    <Typography
                                                                        size="xs"
                                                                        color="muted"
                                                                        text={t("cv.builder.template.wordHint")}
                                                                    />
                                                                ),
                                                            ]
                                                            : []),
                                                    ]}
                                                />
                                            ),
                                            () => (
                                                <Chip
                                                    tone={isTwoColumn ? "warning" : "success"}
                                                    text={isTwoColumn ? t("cv.builder.template.atsRisk") : t("cv.builder.template.atsSafe")}
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
        }
    })

    return (
        <ModalShell
            identity={{ tier: "block", component: "CvTemplateGalleryModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("cv.builder.template.galleryTitle")}
            size="lg"
            body={() => (
                <Grid
                    columns={{ base: 1, sm: 2 }}
                    principle="sibling-stack"
                    explain="Same-kind peer template tiles — not group-boundary, because each card is a repeating peer rather than a section group."
                    items={items}
                />
            )}
        />
    )
}
