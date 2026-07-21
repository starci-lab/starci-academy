"use client"

import React from "react"
import {
    Button,
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

/** A brand-new, empty education entry. */
const emptyItem = (): CvBlockItem => ({ id: crypto.randomUUID(), fields: {} })

/** Props for {@link EducationBlockEditor}. */
export interface EducationBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Education block editor — repeatable entries (school / degree / dates),
 * entirely self-reported free text (StarCi holds no education data). No AI
 * affordance (per `CV_BLOCK_TYPE_REGISTRY[Education]`).
 *
 * @param props - {@link EducationBlockEditorProps}
 */
export const EducationBlockEditor = ({ className, block, onChange }: EducationBlockEditorProps) => {
    const t = useTranslations()

    const setItems = (items: Array<CvBlockItem>) => onChange({ ...block, items } satisfies CvBlock)

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
                            <Label htmlFor={`cv-education-school-${item.id}`}>
                                {t("cv.blocks.education.fields.school")}
                            </Label>
                            <Input
                                id={`cv-education-school-${item.id}`}
                                placeholder={t("cv.blocks.education.placeholders.school")}
                                value={typeof item.fields.school === "string" ? item.fields.school : ""}
                                onChange={(event) => onFieldChange(item.id, "school", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-education-degree-${item.id}`}>
                                {t("cv.blocks.education.fields.degree")}
                            </Label>
                            <Input
                                id={`cv-education-degree-${item.id}`}
                                placeholder={t("cv.blocks.education.placeholders.degree")}
                                value={typeof item.fields.degree === "string" ? item.fields.degree : ""}
                                onChange={(event) => onFieldChange(item.id, "degree", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-education-startDate-${item.id}`}>
                                {t("cv.blocks.education.fields.startDate")}
                            </Label>
                            <Input
                                id={`cv-education-startDate-${item.id}`}
                                placeholder={t("cv.blocks.education.placeholders.startDate")}
                                value={typeof item.fields.startDate === "string" ? item.fields.startDate : ""}
                                onChange={(event) => onFieldChange(item.id, "startDate", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-education-endDate-${item.id}`}>
                                {t("cv.blocks.education.fields.endDate")}
                            </Label>
                            <Input
                                id={`cv-education-endDate-${item.id}`}
                                placeholder={t("cv.blocks.education.placeholders.endDate")}
                                value={typeof item.fields.endDate === "string" ? item.fields.endDate : ""}
                                onChange={(event) => onFieldChange(item.id, "endDate", event.target.value)}
                            />
                        </TextField>
                    </div>
                </RepeatableItemCard>
            ))}

            <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddItem}>
                <PlusIcon aria-hidden className="size-4" />
                {t("cv.blocks.education.addItem")}
            </Button>
        </div>
    )
}
