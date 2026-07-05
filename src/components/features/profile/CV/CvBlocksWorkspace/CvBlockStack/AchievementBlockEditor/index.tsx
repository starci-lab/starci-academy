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

/** A brand-new, empty achievement entry. */
const emptyItem = (): CvBlockItem => ({ id: crypto.randomUUID(), fields: {} })

/** Props for {@link AchievementBlockEditor}. */
export interface AchievementBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Freeform achievements block editor (outside awards, certifications) —
 * repeatable, self-reported, never scored. No AI affordance (per
 * `CV_BLOCK_TYPE_REGISTRY[Achievement]`).
 *
 * @param props - {@link AchievementBlockEditorProps}
 */
export const AchievementBlockEditor = ({ className, block, onChange }: AchievementBlockEditorProps) => {
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
                    <TextField variant="secondary">
                        <Label htmlFor={`cv-achievement-title-${item.id}`}>
                            {t("cv.blocks.achievement.fields.title")}
                        </Label>
                        <Input
                            id={`cv-achievement-title-${item.id}`}
                            placeholder={t("cv.blocks.achievement.placeholders.title")}
                            value={typeof item.fields.title === "string" ? item.fields.title : ""}
                            onChange={(event) => onFieldChange(item.id, "title", event.target.value)}
                        />
                    </TextField>
                    <TextField variant="secondary">
                        <Label htmlFor={`cv-achievement-description-${item.id}`}>
                            {t("cv.blocks.achievement.fields.description")}
                        </Label>
                        <Input
                            id={`cv-achievement-description-${item.id}`}
                            placeholder={t("cv.blocks.achievement.placeholders.description")}
                            value={typeof item.fields.description === "string" ? item.fields.description : ""}
                            onChange={(event) => onFieldChange(item.id, "description", event.target.value)}
                        />
                    </TextField>
                </RepeatableItemCard>
            ))}

            <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddItem}>
                <PlusIcon aria-hidden className="size-4" />
                {t("cv.blocks.achievement.addItem")}
            </Button>
        </div>
    )
}
