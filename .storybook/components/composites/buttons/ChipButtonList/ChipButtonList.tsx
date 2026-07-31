import React from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { Button as ButtonAtom } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a NEW composite (no `src` yet; synced later).
 *
 * Ported from 4 near-identical call-sites in `ContentAiChat`
 * (`src/components/features/learn/ContentAiChat/index.tsx:1329-1449`) that each
 * hand-roll a list of `secondary`/`ghost` Buttons with the SAME shape — leading bare
 * icon (optional) + label, `justify-start text-start` — for: empty-state suggestion
 * chips, retrieval-skill chips, selected-passage quick-asks, and the skill menu.
 * Gom thành MỘT composite dùng chung (§4 ownership): mọi nơi cần "dãy nút chip gợi
 * ý" hay "hàng menu kỹ năng" compose composite NÀY — KHÔNG hand-roll lại danh sách
 * Button.
 *
 * COMPOSE base {@link Button} cho MỌI item (KHÔNG import HeroUI trực tiếp) — press/
 * pending/disabled sống ở base Button (§4); composite NÀY chỉ sở hữu LAYOUT (cụm vs
 * cột) + icon-size (§5: leading icon luôn ép `size-4 shrink-0 text-muted`, KHÔNG
 * dùng slot `icon` trailing-trượt của Button — chip icon đứng yên, dẫn trước nhãn).
 *
 * `direction`:
 * - `"wrap"` — cụm chip gợi ý: variant mặc định `secondary`, `flex-wrap gap-2`, mỗi
 *   chip auto-width, nhãn là children TRẦN của Button (không qua Typography — giống
 *   hệt cách base Button tự hiển thị nhãn của nó).
 * - `"column"` — danh sách dọc kiểu menu kỹ năng: variant mặc định `ghost`, mỗi hàng
 *   full-width `px-3 py-2`, nhãn qua {@link Typography} (`weight="medium"`, `truncate`)
 *   thay vì className `text-sm font-medium text-foreground` tay (canon §1: màu/đậm
 *   qua PROP, không class `text-*`/`font-*` trên Typography).
 */

/** One chip/row item. */
export interface ChipButtonItem {
    /** Stable key; falls back to array index. */
    id?: string
    label: ReactNode
    /** Leading icon — TRẦN (bare Phosphor `*Icon`), composite ép size §5. */
    icon?: ReactNode
    onPress?: () => void
    isDisabled?: boolean
}

export type ChipButtonListVariant = "secondary" | "ghost"
export type ChipButtonListDirection = "wrap" | "column"

/** Props for the {@link ChipButtonList} composite. */
export interface ChipButtonListProps {
    items: Array<ChipButtonItem>
    /** Button variant applied to every item. Defaults follow `direction` (wrap→secondary · column→ghost) when omitted. */
    variant?: ChipButtonListVariant
    /** `"wrap"` = cụm chip flex-wrap · `"column"` = danh sách dọc full-width (menu). Defaults `"wrap"`. */
    direction?: ChipButtonListDirection
    /** `true` → render skeleton mirror (Button pill ×N cho wrap, hàng icon+label ×N cho column). */
    isSkeleton?: boolean
    /** Số item skeleton khi `isSkeleton` (chưa biết `items` thật). Mặc định 3. */
    skeletonCount?: number
    anatPart?: string
    /** `true` → emit `data-anat-part` trên từng part (Button/icon/Typography) cho {@link BlockAnatomy}. */
    showAnatomy?: boolean
    className?: string
}

const DEFAULT_VARIANT: Record<ChipButtonListDirection, ChipButtonListVariant> = {
    wrap: "secondary",
    column: "ghost",
}

const CONTAINER_CLS: Record<ChipButtonListDirection, string> = {
    wrap: "flex flex-wrap gap-2",
    column: "flex flex-col gap-1",
}

const ITEM_CLS: Record<ChipButtonListDirection, string> = {
    wrap: "justify-start text-start",
    column: "h-auto w-full justify-start gap-3 px-3 py-2 text-start",
}

/**
 * ChipButtonList — a row of secondary "suggestion" chips OR a vertical ghost "menu"
 * list, both composing the base {@link Button}. See the file header for the two
 * `direction` shapes.
 *
 * @param props - {@link ChipButtonListProps}
 */
export const ChipButtonList = ({
    items,
    variant,
    direction = "wrap",
    isSkeleton = false,
    skeletonCount = 3,
    anatPart,
    showAnatomy = false,
    className,
}: ChipButtonListProps) => {
    const resolvedVariant = variant ?? DEFAULT_VARIANT[direction]

    if (isSkeleton) {
        return (
            <div className={cn(CONTAINER_CLS[direction], className)} data-anat-part={anatPart}>
                {direction === "column"
                    ? Array.from({ length: skeletonCount }).map((_, index) => (
                        <StackH key={index} gap="grouped" className="px-3 py-2">
                            <HeroSkeleton className="size-4 shrink-0 rounded" />
                            {/* §12c: chủ của hình là chủ của skeleton — Typography tự vẽ gạch của nó */}
                            <Typography
                                size="sm"
                                isSkeleton
                                showAnatomy={showAnatomy}
                                classNames={[index % 2 === 0 ? "w-2/3" : "w-1/2"]}
                            />
                        </StackH>
                    ))
                    : Array.from({ length: skeletonCount }).map((_, index) => (
                        <ButtonAtom
                            key={index}
                            isSkeleton
                            showAnatomy={showAnatomy}
                            label=""
                            classNames={[index % 2 === 0 ? "w-1/2" : "w-1/3"]}
                        />
                    ))}
            </div>
        )
    }

    return (
        <div className={cn(CONTAINER_CLS[direction], className)} data-anat-part={anatPart}>
            {items.map((item, index) => (
                <Button
                    key={item.id ?? index}
                    variant={resolvedVariant}
                    size={direction === "wrap" ? "sm" : "md"}
                    className={ITEM_CLS[direction]}
                    onPress={item.onPress}
                    isDisabled={item.isDisabled}
                    anatPart={showAnatomy ? "Button" : undefined}
                >
                    {item.icon ? (
                        <span className="[&_svg]:size-4 shrink-0 text-muted">
                            {item.icon}
                        </span>
                    ) : null}
                    {direction === "column" ? (
                        <Typography size="sm"
                            weight="medium"
                            truncate
                            classNames={["min-w-0", "flex-1"]}
                            anatPart={showAnatomy ? "Typography" : undefined}
                            showAnatomy={showAnatomy}
                            text={item.label}
                        />
                    ) : (
                        item.label
                    )}
                </Button>
            ))}
        </div>
    )
}
