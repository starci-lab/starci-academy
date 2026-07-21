"use client"

import React, { useState } from "react"
import {
    Button,
    FieldError,
    Input,
    Label,
    TextField,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { PlusIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlock, CvBlockEditorProps, CvBlockItem } from "../../../types"
import { RepeatableItemCard } from "../shared/RepeatableItemCard"
import { isValidOptionalUrl } from "../../../urlValidation"

/** A brand-new, empty certification entry. */
const emptyItem = (): CvBlockItem => ({ id: crypto.randomUUID(), fields: {} })

/** Props for {@link CertificationBlockEditor}. */
export interface CertificationBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Certification block editor — repeatable entries (name / issuer / date),
 * entirely self-reported free text (StarCi holds no certification data). No
 * AI affordance (per `CV_BLOCK_TYPE_REGISTRY[Certification]`).
 *
 * @param props - {@link CertificationBlockEditorProps}
 */
export const CertificationBlockEditor = ({ className, block, onChange }: CertificationBlockEditorProps) => {
    const t = useTranslations()
    const [touchedUrlItemIds, setTouchedUrlItemIds] = useState<ReadonlySet<string>>(new Set())

    const setItems = (items: Array<CvBlockItem>) => onChange({ ...block, items } satisfies CvBlock)

    const onBlurCredentialUrl = (itemId: string) => {
        setTouchedUrlItemIds((prev) => new Set(prev).add(itemId))
    }

    const onFieldChange = (itemId: string, key: string, value: string) => {
        setItems(block.items.map((item) => (
            item.id === itemId ? { ...item, fields: { ...item.fields, [key]: value } } : item
        )))
    }

    const onAddItem = () => setItems([...block.items, emptyItem()])
    const onRemoveItem = (itemId: string) => setItems(block.items.filter((item) => item.id !== itemId))
    const onMove = (index: number, direction: -1 | 1) => {
        const next = [...block.items]
        const target = index + direction
        if (target < 0 || target >= next.length) {
            return
        }
        [next[index], next[target]] = [next[target], next[index]]
        setItems(next)
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {block.items.map((item, index) => (
                <RepeatableItemCard
                    key={item.id}
                    onRemove={() => onRemoveItem(item.id)}
                    onMoveUp={index > 0 ? () => onMove(index, -1) : undefined}
                    onMoveDown={index < block.items.length - 1 ? () => onMove(index, 1) : undefined}
                >
                    <div className="grid grid-cols-1 gap-3 @app-sm:grid-cols-2">
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-certification-name-${item.id}`}>
                                {t("cv.blocks.certification.fields.name")}
                            </Label>
                            <Input
                                id={`cv-certification-name-${item.id}`}
                                placeholder={t("cv.blocks.certification.placeholders.name")}
                                value={typeof item.fields.name === "string" ? item.fields.name : ""}
                                onChange={(event) => onFieldChange(item.id, "name", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-certification-issuer-${item.id}`}>
                                {t("cv.blocks.certification.fields.issuer")}
                            </Label>
                            <Input
                                id={`cv-certification-issuer-${item.id}`}
                                placeholder={t("cv.blocks.certification.placeholders.issuer")}
                                value={typeof item.fields.issuer === "string" ? item.fields.issuer : ""}
                                onChange={(event) => onFieldChange(item.id, "issuer", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-certification-date-${item.id}`}>
                                {t("cv.blocks.certification.fields.date")}
                            </Label>
                            <Input
                                id={`cv-certification-date-${item.id}`}
                                placeholder={t("cv.blocks.certification.placeholders.date")}
                                value={typeof item.fields.date === "string" ? item.fields.date : ""}
                                onChange={(event) => onFieldChange(item.id, "date", event.target.value)}
                            />
                        </TextField>
                        {(() => {
                            const credentialUrl = typeof item.fields.credentialUrl === "string" ? item.fields.credentialUrl : ""
                            const isInvalid = touchedUrlItemIds.has(item.id) && !isValidOptionalUrl(credentialUrl)
                            return (
                                <TextField variant="secondary" isInvalid={isInvalid}>
                                    <Label htmlFor={`cv-certification-credentialUrl-${item.id}`}>
                                        {t("cv.blocks.certification.fields.credentialUrl")}
                                    </Label>
                                    <Input
                                        id={`cv-certification-credentialUrl-${item.id}`}
                                        placeholder={t("cv.blocks.certification.placeholders.credentialUrl")}
                                        value={credentialUrl}
                                        onChange={(event) => onFieldChange(item.id, "credentialUrl", event.target.value)}
                                        onBlur={() => onBlurCredentialUrl(item.id)}
                                    />
                                    <FieldError>{t("cv.blocks.common.invalidUrl")}</FieldError>
                                </TextField>
                            )
                        })()}
                    </div>
                </RepeatableItemCard>
            ))}

            <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddItem}>
                <PlusIcon aria-hidden className="size-4" />
                {t("cv.blocks.certification.addItem")}
            </Button>
        </div>
    )
}
