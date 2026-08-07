"use client"

import React from "react"
import { Button, Input, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    FilePdfIcon,
    FileTextIcon,
} from "@phosphor-icons/react"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { StackH } from "@/components/frames/Stack"
import { CvExportFormat } from "@/modules/types/enums/cv-export-format"
import { useCvEditorToolbarStore } from "@/hooks/zustand/cvEditorToolbar/store"

/** Props for {@link CvEditorToolbarBar}. */
export type CvEditorToolbarBarProps = Record<string, never>
/**
 * The CV editor's toolbar, rendered as the global Navbar's BOTTOM LAYER (so it
 * reads as the navbar's second row — no divider between them; the Navbar owns
 * the single bottom border). Back link + editable CV name + Word/PDF export.
 *
 * Back link + editable CV name + a "Download .tex" download (client-side, the raw
 * LaTeX source) and the PDF export (compiled server-side via tectonic — Word
 * was dropped in the full-LaTeX pivot).
 *
 * A STABLE node (registered once via `useRegisterNavbarBottomLayer`): it reads
 * all live state + callbacks from {@link useCvEditorToolbarStore} — which
 * `CvEditorPage` keeps in sync — so re-renders never remount the name input (focus
 * is preserved as the user types). Carries no border / sticky / bg of its own.
 *
 * @param props - {@link CvEditorToolbarBarProps}
 */
export const CvEditorToolbarBar = () => {
    const t = useTranslations()
    const label = useCvEditorToolbarStore((state) => state.label)
    const canExport = useCvEditorToolbarStore((state) => state.canExport)
    const exportingFormat = useCvEditorToolbarStore((state) => state.exportingFormat)
    const onBack = useCvEditorToolbarStore((state) => state.onBack)
    const onLabelChange = useCvEditorToolbarStore((state) => state.onLabelChange)
    const onExport = useCvEditorToolbarStore((state) => state.onExport)
    const onDownloadTex = useCvEditorToolbarStore((state) => state.onDownloadTex)

    return (
        <div className={"flex w-full items-center justify-between gap-3 px-6 pb-3"}>
            <BackLink className="shrink-0" target={t("cv.builder.galleryTarget")} onPress={onBack} />
            <TextField
                aria-label={t("cv.builder.nameLabel")}
                className="min-w-0 w-full max-w-sm"
            >
                <Input
                    value={label}
                    placeholder={t("cv.builder.namePlaceholder")}
                    onChange={(event) => onLabelChange(event.target.value)}
                />
            </TextField>
            <StackH gap={4} principle="flex-action"
                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                classNames={["shrink-0"]} items={[
                    () => (
                        <Button
                            variant="secondary"
                            isDisabled={!canExport}
                            onPress={onDownloadTex}
                        >
                            <FileTextIcon aria-hidden className="size-5" />
                            {t("cv.builder.downloadTexCta")}
                        </Button>
                    ),
                    () => (
                        <Button
                            variant="primary"
                            isDisabled={!canExport || exportingFormat !== null}
                            onPress={() => onExport(CvExportFormat.Pdf)}
                        >
                            <FilePdfIcon aria-hidden className="size-5" />
                            {t("cv.builder.downloadCta")}
                        </Button>
                    ),
                ]} />
        </div>
    )
}
