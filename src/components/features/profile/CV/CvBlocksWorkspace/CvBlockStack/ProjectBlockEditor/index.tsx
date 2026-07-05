"use client"

import React from "react"
import {
    Button,
    Chip,
    Input,
    Label,
    TextArea,
    TextField,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { PlusIcon, SealCheckIcon, UserIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CvBlockItemSource } from "@/modules/types/enums/cv-block-item-source"
import type { CvBlock, CvBlockEditorProps, CvBlockItem } from "../../../types"
import { AiRewriteButton } from "../shared/AiRewriteButton"
import { RepeatableItemCard } from "../shared/RepeatableItemCard"
import { PickFromStarciSelect } from "./PickFromStarciSelect"

/** A brand-new, self-reported project entry ("+ Thêm dự án ngoài"). */
const emptySelfItem = (): CvBlockItem => ({
    id: crypto.randomUUID(),
    source: CvBlockItemSource.Self,
    fields: {},
})

/** Props for {@link ProjectBlockEditor}. */
export interface ProjectBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Project block editor — the ONLY block whose items carry `source` /
 * `sourceRef`: picked from a passed StarCi capstone (tagged "Đã xác thực",
 * success) via {@link PickFromStarciSelect}, or typed manually via "+ Thêm dự
 * án ngoài" (tagged "Tự khai", muted). Every item — verified or self — shares
 * the same editable fields (title/description/bullets) plus its own "✨ AI
 * viết giúp"; verified items pass `capstoneAttemptId` (their `sourceRef`) so
 * the rewrite is grounded (RAG) on the real capstone data.
 *
 * @param props - {@link ProjectBlockEditorProps}
 */
export const ProjectBlockEditor = ({ className, block, onChange, onAiRewrite }: ProjectBlockEditorProps) => {
    const t = useTranslations()

    const setItems = (items: Array<CvBlockItem>) => onChange({ ...block, items } satisfies CvBlock)

    const onFieldChange = (itemId: string, key: string, value: string) => {
        setItems(block.items.map((item) => (
            item.id === itemId ? { ...item, fields: { ...item.fields, [key]: value } } : item
        )))
    }

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

    const onAddSelfItem = () => setItems([...block.items, emptySelfItem()])

    const onPickFromStarci = (attempt: { id: string, taskTitle: string, milestoneTitle: string, courseTitle: string }) => {
        const verifiedItem: CvBlockItem = {
            id: crypto.randomUUID(),
            source: CvBlockItemSource.Verified,
            sourceRef: attempt.id,
            fields: {
                title: attempt.taskTitle,
                description: `${attempt.milestoneTitle} — ${attempt.courseTitle}`,
            },
        }
        setItems([...block.items, verifiedItem])
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
        setItems(block.items.map((candidate) => (
            candidate.id === itemId
                ? { ...candidate, fields: { ...candidate.fields, ...rewritten } }
                : candidate
        )))
    }

    const usedVerifiedRefs = block.items
        .filter((item) => item.source === CvBlockItemSource.Verified && item.sourceRef)
        .map((item) => item.sourceRef as string)

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {block.items.map((item, index) => {
                const isVerified = item.source === CvBlockItemSource.Verified
                return (
                    <RepeatableItemCard
                        key={item.id}
                        onRemove={() => onRemoveItem(item.id)}
                        onMoveUp={index > 0 ? () => onMove(index, -1) : undefined}
                        onMoveDown={index < block.items.length - 1 ? () => onMove(index, 1) : undefined}
                        headerEnd={(
                            <Chip
                                size="sm"
                                className={isVerified ? "bg-success/10 text-success" : "bg-default text-muted"}
                            >
                                {isVerified ? (
                                    <SealCheckIcon aria-hidden className="size-3" />
                                ) : (
                                    <UserIcon aria-hidden className="size-3" />
                                )}
                                <Chip.Label>
                                    {isVerified ? t("cv.blocks.project.sourceVerified") : t("cv.blocks.project.sourceSelf")}
                                </Chip.Label>
                            </Chip>
                        )}
                    >
                        <TextField variant="secondary">
                            <Label htmlFor={`cv-project-title-${item.id}`}>
                                {t("cv.blocks.project.fields.title")}
                            </Label>
                            <Input
                                id={`cv-project-title-${item.id}`}
                                placeholder={t("cv.blocks.project.placeholders.title")}
                                value={typeof item.fields.title === "string" ? item.fields.title : ""}
                                onChange={(event) => onFieldChange(item.id, "title", event.target.value)}
                            />
                        </TextField>

                        <TextField variant="secondary">
                            <Label htmlFor={`cv-project-description-${item.id}`}>
                                {t("cv.blocks.project.fields.description")}
                            </Label>
                            <TextArea
                                id={`cv-project-description-${item.id}`}
                                rows={3}
                                className="resize-none"
                                placeholder={t("cv.blocks.project.placeholders.description")}
                                value={typeof item.fields.description === "string" ? item.fields.description : ""}
                                onChange={(event) => onFieldChange(item.id, "description", event.target.value)}
                            />
                        </TextField>

                        {/* AI viết giúp ONLY for StarCi-verified items — their `sourceRef`
                            grounds the rewrite (RAG) on the real capstone. Self-reported
                            items have nothing real to ground on, so no AI assist. */}
                        {onAiRewrite && isVerified ? (
                            <AiRewriteButton className="w-fit self-start" onRewrite={() => onRewriteItem(item.id)} />
                        ) : null}
                    </RepeatableItemCard>
                )
            })}

            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-default px-4 py-3">
                <PickFromStarciSelect onPick={onPickFromStarci} excludeIds={usedVerifiedRefs} />

                <Button variant="tertiary" size="sm" className="w-fit self-start" onPress={onAddSelfItem}>
                    <PlusIcon aria-hidden className="size-4" />
                    {t("cv.blocks.project.addExternal")}
                </Button>
            </div>
        </div>
    )
}
