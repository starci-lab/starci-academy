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

/** A brand-new, empty language entry. */
const emptyItem = (): CvBlockItem => ({ id: crypto.randomUUID(), fields: {} })

/** Props for {@link LanguageBlockEditor}. */
export interface LanguageBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Language block editor — repeatable entries (language name / proficiency
 * level), entirely self-reported free text. No AI affordance (per
 * `CV_BLOCK_TYPE_REGISTRY[Language]`).
 *
 * @param props - {@link LanguageBlockEditorProps}
 */
export const LanguageBlockEditor = ({ className, block, onChange }: LanguageBlockEditorProps) => {
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
                            <Label htmlFor={`cv-language-name-${item.id}`}>
                                {t("cv.blocks.language.fields.name")}
                            </Label>
                            <Input
                                id={`cv-language-name-${item.id}`}
                                placeholder={t("cv.blocks.language.placeholders.name")}
                                value={typeof item.fields.name === "string" ? item.fields.name : ""}
                                onChange={(event) => onFieldChange(item.id, "name", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-language-level-${item.id}`}>
                                {t("cv.blocks.language.fields.level")}
                            </Label>
                            <Input
                                id={`cv-language-level-${item.id}`}
                                placeholder={t("cv.blocks.language.placeholders.level")}
                                value={typeof item.fields.level === "string" ? item.fields.level : ""}
                                onChange={(event) => onFieldChange(item.id, "level", event.target.value)}
                            />
                        </TextField>
                    </div>
                </RepeatableItemCard>
            ))}

            <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddItem}>
                <PlusIcon aria-hidden className="size-4" />
                {t("cv.blocks.language.addItem")}
            </Button>
        </div>
    )
}
