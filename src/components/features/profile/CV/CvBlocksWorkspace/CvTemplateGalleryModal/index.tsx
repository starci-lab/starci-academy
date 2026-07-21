"use client"

import React from "react"
import {
    Chip,
    Modal,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import {
    CV_TWO_COLUMN_TEMPLATES,
    type CvDocument,
    type CvTemplate,
} from "../../types"
import { CvHtmlDocument } from "../CvHtmlDocument"

/** The templates the gallery offers, in display order. */
const TEMPLATE_ORDER: ReadonlyArray<CvTemplate> = ["classic", "modern", "sidebar", "minimal"]

/** Props for {@link CvTemplateGalleryModal}. */
export interface CvTemplateGalleryModalProps extends WithClassNames<undefined> {
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
 * "Thư viện mẫu" — a modal grid of LIVE template thumbnails (the user's own CV
 * rendered in each layout via {@link CvHtmlDocument}) + name + an ATS badge.
 * Single-column templates read "An toàn ATS"; the two-column one carries a
 * warning (ATS parsers + `.docx` export handle it worse — see
 * `CV-TEMPLATES-BRAINSTORM.md`). Picking a card applies the template and closes.
 *
 * @param props - {@link CvTemplateGalleryModalProps}
 */
export const CvTemplateGalleryModal = ({
    className,
    isOpen,
    onOpenChange,
    doc,
    onSelect,
}: CvTemplateGalleryModalProps) => {
    const t = useTranslations()
    const current = doc.style.template ?? "classic"

    const onPick = (template: CvTemplate) => {
        onSelect(template)
        onOpenChange(false)
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Typography type="body" weight="semibold" className="pr-8">
                                {t("cv.builder.template.galleryTitle")}
                            </Typography>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="grid grid-cols-1 gap-4 @app-sm:grid-cols-2">
                                {TEMPLATE_ORDER.map((template) => {
                                    const isTwoColumn = CV_TWO_COLUMN_TEMPLATES.has(template)
                                    const isSelected = current === template
                                    const name = t(`cv.builder.template.names.${template}`)
                                    return (
                                        <div
                                            key={template}
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={isSelected}
                                            aria-label={t("cv.builder.template.selectAria", { name })}
                                            onClick={() => onPick(template)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault()
                                                    onPick(template)
                                                }
                                            }}
                                            className={cn(
                                                "flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-surface text-left outline-none transition-colors",
                                                "focus-visible:ring-2 focus-visible:ring-accent",
                                                isSelected ? "border-accent" : "border-default hover:border-accent/60",
                                            )}
                                        >
                                            <div aria-hidden className="h-52 overflow-hidden border-b border-default bg-white">
                                                <div
                                                    className="pointer-events-none origin-top-left"
                                                    style={{ width: 820, transform: "scale(0.34)" }}
                                                >
                                                    <CvHtmlDocument doc={{ ...doc, style: { ...doc.style, template } }} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 px-3 py-2">
                                                <div className="flex min-w-0 flex-col">
                                                    <Typography type="body-sm" weight="semibold" className="truncate">
                                                        {name}
                                                    </Typography>
                                                    {isTwoColumn ? (
                                                        <Typography type="body-xs" color="muted">
                                                            {t("cv.builder.template.wordHint")}
                                                        </Typography>
                                                    ) : null}
                                                </div>
                                                <Chip
                                                    size="sm"
                                                    className={cn(
                                                        "shrink-0",
                                                        isTwoColumn ? "bg-warning-soft text-warning-soft-foreground" : "bg-success-soft text-success-soft-foreground",
                                                    )}
                                                >
                                                    <Chip.Label>
                                                        {isTwoColumn ? t("cv.builder.template.atsRisk") : t("cv.builder.template.atsSafe")}
                                                    </Chip.Label>
                                                </Chip>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
