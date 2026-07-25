/**
 * Shared semantic tone for chip ATOMS → HeroUI soft chip color.
 *
 * ATOM LAYER (thầy chốt 2026-07-25): atoms = HeroUI component bọc lại, constrain
 * API + baked-in `isSkeleton` (atom tự sở hữu LEAF skeleton — hybrid C). Nằm DƯỚI
 * primitive; StatusChip/EnumChip compose atom thay vì HeroUI Chip trực tiếp.
 */
export type ChipTone = "neutral" | "success" | "warning" | "danger" | "accent"

export const CHIP_TONE_TO_COLOR: Record<ChipTone, "default" | "success" | "warning" | "danger" | "accent"> = {
    neutral: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
    accent: "accent",
}
