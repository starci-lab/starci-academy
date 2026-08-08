"use client"

import React from "react"
import { Button, Input, Label, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { PlusIcon } from "@phosphor-icons/react"
import type { CvBlock, CvBlockEditorProps, CvBlockItem } from "@/modules/types/entities/cv"
import { StackV } from "@/components/frames/Stack"
import { RepeatableItemCard } from "../shared/RepeatableItemCard"

/** A brand-new, empty achievement entry. */
const emptyItem = (): CvBlockItem => ({ id: crypto.randomUUID(), fields: {} })

/** Props for {@link AchievementBlockEditor}. */
export type AchievementBlockEditorProps = CvBlockEditorProps 

/**
 * Freeform achievements block editor (outside awards, certifications) —
 * repeatable, self-reported, never scored. No AI affordance (per
 * `CV_BLOCK_TYPE_REGISTRY[Achievement]`).
 *
 * Shell is StackV with identity. HeroUI TextField/Input/Button remain —
 * house form migration is contract `CvBlockEditorFormSurface` (vendor boundary).
 *
 * @param props - {@link AchievementBlockEditorProps}
 */
export const AchievementBlockEditor = ({ block, onChange }: AchievementBlockEditorProps) => {
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

    const itemCount = block.items.length

    return (
        <StackV
            identity={{ tier: "block", component: "AchievementBlockEditor" }}
            principle="sibling-stack"
            explain="Same-kind peer stack of repeatable achievement cards — not group-boundary, because each card is a repeating peer rather than a section group."
            items={[
                ...block.items.map((item, index) => () => (
                    <RepeatableItemCard
                        onRemove={() => onRemoveItem(item.id)}
                        onMoveUp={index > 0 ? () => onMove(index, -1) : undefined}
                        onMoveDown={index < itemCount - 1 ? () => onMove(index, 1) : undefined}
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
                )),
                () => (
                    <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddItem}>
                        <PlusIcon aria-hidden className="size-4" />
                        {t("cv.blocks.achievement.addItem")}
                    </Button>
                ),
            ]}
        />
    )
}
