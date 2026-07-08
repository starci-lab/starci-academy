"use client"

import React from "react"
import {
    Button,
    Input,
    TextField,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    FileDocIcon,
    FilePdfIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { CvExportFormat } from "@/modules/types/enums/cv-export-format"
import { useCvEditorToolbarStore } from "@/hooks/zustand/cvEditorToolbar/store"

/** Props for {@link CvEditorToolbarBar}. */
export type CvEditorToolbarBarProps = WithClassNames<undefined>

/**
 * The CV editor's toolbar, rendered as the global Navbar's BOTTOM LAYER (so it
 * reads as the navbar's second row — no divider between them; the Navbar owns
 * the single bottom border). Back link + editable CV name + Word/PDF export.
 *
 * A STABLE node (registered once via `useRegisterNavbarBottomLayer`): it reads
 * all live state + callbacks from {@link useCvEditorToolbarStore} — which
 * `CvEditor` keeps in sync — so re-renders never remount the name input (focus
 * is preserved as the user types). Carries no border / sticky / bg of its own.
 *
 * @param props - {@link CvEditorToolbarBarProps}
 */
export const CvEditorToolbarBar = ({ className }: CvEditorToolbarBarProps) => {
    const t = useTranslations()
    const label = useCvEditorToolbarStore((state) => state.label)
    const canExport = useCvEditorToolbarStore((state) => state.canExport)
    const exportingFormat = useCvEditorToolbarStore((state) => state.exportingFormat)
    const onBack = useCvEditorToolbarStore((state) => state.onBack)
    const onLabelChange = useCvEditorToolbarStore((state) => state.onLabelChange)
    const onExport = useCvEditorToolbarStore((state) => state.onExport)

    return (
        <div className={cn("flex w-full items-center justify-between gap-3 px-6 pb-3", className)}>
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
            <div className="flex shrink-0 items-center gap-3">
                <Button
                    variant="secondary"
                    isDisabled={!canExport || exportingFormat !== null}
                    onPress={() => onExport(CvExportFormat.Docx)}
                >
                    <FileDocIcon aria-hidden className="size-5" />
                    {t("cv.builder.downloadWordCta")}
                </Button>
                <Button
                    variant="primary"
                    isDisabled={!canExport || exportingFormat !== null}
                    onPress={() => onExport(CvExportFormat.Pdf)}
                >
                    <FilePdfIcon aria-hidden className="size-5" />
                    {t("cv.builder.downloadCta")}
                </Button>
            </div>
        </div>
    )
}
