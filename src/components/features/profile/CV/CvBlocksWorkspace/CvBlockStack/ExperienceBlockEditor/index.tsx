"use client"

import React from "react"
import {
    Button,
    Input,
    Label,
    TextArea,
    TextField,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { PlusIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlock, CvBlockEditorProps, CvBlockItem } from "../../../types"
import { AiRewriteButton } from "../shared/AiRewriteButton"
import { RepeatableItemCard } from "../shared/RepeatableItemCard"

/** A brand-new, empty experience entry. */
const emptyItem = (): CvBlockItem => ({ id: crypto.randomUUID(), fields: {} })

/** Props for {@link ExperienceBlockEditor}. */
export interface ExperienceBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Work-experience block editor — repeatable entries (company / role / dates /
 * bullets), each with its OWN "✨ AI viết giúp" (rewrites that one item's
 * `bullets` text) and reorder/remove.
 *
 * @param props - {@link ExperienceBlockEditorProps}
 */
export const ExperienceBlockEditor = ({ className, block, onChange, onAiRewrite }: ExperienceBlockEditorProps) => {
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

    const onRewriteItem = async (itemId: string) => {
        if (!onAiRewrite) {
            return
        }
        const item = block.items.find((candidate) => candidate.id === itemId)
        if (!item) {
            return
        }
        const rewritten = await onAiRewrite(itemId)
        const bullets = typeof rewritten.bullets === "string" ? rewritten.bullets : item.fields.bullets
        onFieldChange(itemId, "bullets", typeof bullets === "string" ? bullets : "")
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
                            <Label htmlFor={`cv-experience-company-${item.id}`}>
                                {t("cv.blocks.experience.fields.company")}
                            </Label>
                            <Input
                                id={`cv-experience-company-${item.id}`}
                                placeholder={t("cv.blocks.experience.placeholders.company")}
                                value={typeof item.fields.company === "string" ? item.fields.company : ""}
                                onChange={(event) => onFieldChange(item.id, "company", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-experience-role-${item.id}`}>
                                {t("cv.blocks.experience.fields.role")}
                            </Label>
                            <Input
                                id={`cv-experience-role-${item.id}`}
                                placeholder={t("cv.blocks.experience.placeholders.role")}
                                value={typeof item.fields.role === "string" ? item.fields.role : ""}
                                onChange={(event) => onFieldChange(item.id, "role", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-experience-startDate-${item.id}`}>
                                {t("cv.blocks.experience.fields.startDate")}
                            </Label>
                            <Input
                                id={`cv-experience-startDate-${item.id}`}
                                placeholder={t("cv.blocks.experience.placeholders.startDate")}
                                value={typeof item.fields.startDate === "string" ? item.fields.startDate : ""}
                                onChange={(event) => onFieldChange(item.id, "startDate", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-experience-endDate-${item.id}`}>
                                {t("cv.blocks.experience.fields.endDate")}
                            </Label>
                            <Input
                                id={`cv-experience-endDate-${item.id}`}
                                placeholder={t("cv.blocks.experience.placeholders.endDate")}
                                value={typeof item.fields.endDate === "string" ? item.fields.endDate : ""}
                                onChange={(event) => onFieldChange(item.id, "endDate", event.target.value)}
                            />
                        </TextField>
                    </div>

                    <TextField variant="secondary">
                        <Label htmlFor={`cv-experience-bullets-${item.id}`}>
                            {t("cv.blocks.experience.fields.bullets")}
                        </Label>
                        <TextArea
                            id={`cv-experience-bullets-${item.id}`}
                            rows={3}
                            className="resize-none"
                            placeholder={t("cv.blocks.experience.placeholders.bullets")}
                            value={typeof item.fields.bullets === "string" ? item.fields.bullets : ""}
                            onChange={(event) => onFieldChange(item.id, "bullets", event.target.value)}
                        />
                    </TextField>

                    {onAiRewrite ? (
                        <AiRewriteButton className="w-fit self-start" onRewrite={() => onRewriteItem(item.id)} />
                    ) : null}
                </RepeatableItemCard>
            ))}

            <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddItem}>
                <PlusIcon aria-hidden className="size-4" />
                {t("cv.blocks.experience.addItem")}
            </Button>
        </div>
    )
}
