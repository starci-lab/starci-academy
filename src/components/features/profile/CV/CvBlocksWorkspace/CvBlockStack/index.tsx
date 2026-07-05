"use client"

import React from "react"
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownTrigger,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    ArrowDownIcon,
    ArrowUpIcon,
    PlusIcon,
    TrashIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import type { CvBlockType } from "@/modules/types/enums/cv-block-type"
import { CV_BLOCK_TYPE_REGISTRY } from "../../BlockRegistry"
import type { CvBlock, CvBlockItemFields } from "../../types"
import { CV_BLOCK_EDITOR_REGISTRY } from "./blockEditorRegistry"

/** Props for {@link CvBlockStack}. */
export interface CvBlockStackProps extends WithClassNames<undefined> {
    /** The active document's ordered blocks. */
    blocks: Array<CvBlock>
    /** Emit the whole replacement array after any per-block edit/reorder/removal. */
    onChange: (blocks: Array<CvBlock>) => void
    /** Block types not yet present (singleton types already used are excluded). */
    addableTypes: Array<CvBlockType>
    /** Append a new block of this type. */
    onAddBlock: (type: CvBlockType) => void
    /**
     * "✨ AI viết giúp" for ONE block/item — omit to render every block WITHOUT
     * the AI affordance (e.g. while the mutation isn't wired yet). Resolves to
     * the rewritten item's `fields` (or the block's own single fields set for
     * `summary`, `itemId` undefined).
     */
    onAiRewrite?: (block: CvBlock, itemId: string | undefined) => Promise<CvBlockItemFields>
}

/**
 * The left-column form — a vertical stack of blocks, each rendered by its own
 * per-block editor (`CV_BLOCK_EDITOR_REGISTRY`, keyed by `block.type`), plus a
 * "+ Thêm block" picker at the bottom for the block types not yet in the
 * document. Every block gets a shared title/remove header row; the editor
 * itself only renders the block's fields.
 *
 * @param props - {@link CvBlockStackProps}
 */
export const CvBlockStack = ({
    className,
    blocks,
    onChange,
    addableTypes,
    onAddBlock,
    onAiRewrite,
}: CvBlockStackProps) => {
    const t = useTranslations()

    const onBlockChange = (index: number, next: CvBlock) => {
        onChange(blocks.map((block, i) => (i === index ? next : block)))
    }

    const onBlockRemove = (index: number) => {
        onChange(blocks.filter((_, i) => i !== index).map((block, i) => ({ ...block, order: i })))
    }

    /** Swap a block with its neighbour and re-sync every block's `order`. */
    const onBlockMove = (index: number, direction: -1 | 1) => {
        const target = index + direction
        if (target < 0 || target >= blocks.length) {
            return
        }
        const next = [...blocks]
        const [moved] = next.splice(index, 1)
        next.splice(target, 0, moved)
        onChange(next.map((block, i) => ({ ...block, order: i })))
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {blocks.map((block, index) => {
                const meta = CV_BLOCK_TYPE_REGISTRY[block.type]
                const Editor = CV_BLOCK_EDITOR_REGISTRY[block.type]
                return (
                    <LabeledCard
                        key={block.id}
                        label={block.title || t(meta.titleKey)}
                        action={(
                            <div className="flex items-center gap-2">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="tertiary"
                                    isDisabled={index === 0}
                                    aria-label={t("cv.builder.moveBlockUp")}
                                    onPress={() => onBlockMove(index, -1)}
                                >
                                    <ArrowUpIcon aria-hidden className="size-4" />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="tertiary"
                                    isDisabled={index === blocks.length - 1}
                                    aria-label={t("cv.builder.moveBlockDown")}
                                    onPress={() => onBlockMove(index, 1)}
                                >
                                    <ArrowDownIcon aria-hidden className="size-4" />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="danger-soft"
                                    aria-label={t("cv.builder.removeBlock")}
                                    onPress={() => onBlockRemove(index)}
                                >
                                    <TrashIcon aria-hidden className="size-4" />
                                </Button>
                            </div>
                        )}
                    >
                        <Editor
                            block={block}
                            onChange={(next) => onBlockChange(index, next)}
                            onRemove={() => onBlockRemove(index)}
                            onAiRewrite={
                                meta.aiAssisted && onAiRewrite
                                    ? (itemId) => onAiRewrite(block, itemId)
                                    : undefined
                            }
                        />
                    </LabeledCard>
                )
            })}

            {addableTypes.length > 0 ? (
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="secondary" className="w-fit self-start">
                            <PlusIcon aria-hidden className="size-4" />
                            {t("cv.builder.addBlock")}
                        </Button>
                    </DropdownTrigger>
                    <DropdownPopover>
                        <DropdownMenu
                            aria-label={t("cv.builder.addBlock")}
                            onAction={(key) => onAddBlock(key as CvBlockType)}
                        >
                            {addableTypes.map((type) => (
                                <DropdownItem key={type} id={type}>
                                    {t(CV_BLOCK_TYPE_REGISTRY[type].titleKey)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </DropdownPopover>
                </Dropdown>
            ) : null}
        </div>
    )
}
