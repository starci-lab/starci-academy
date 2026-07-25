import { StatusChip } from "../StatusChip/StatusChip"
import { DotChip } from "../DotChip/DotChip"
import { EnumChip } from "../EnumChip/EnumChip"
import { HighlightChip } from "../HighlightChip/HighlightChip"
import { HostPlatformChip } from "../HostPlatformChip/HostPlatformChip"
import { RemovableToken } from "../RemovableToken/RemovableToken"
import { TagChips } from "../TagChips/TagChips"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Chip.*` compound namespace.
 *
 * Gom các chip **PRIMITIVE cùng tier** (Primitives/Chips) vào MỘT root, giống
 * `Skeleton.*` — một import `Chip`, phát hiện dễ, đồng bộ. Consumer đổi
 * `<StatusChip/>` → `<Chip.Status/>`, `<EnumChip/>` → `<Chip.Enum/>`, …
 *
 * NAMING (thầy chốt 2026-07-24): base pill của HeroUI được **alias `HeroChip`**
 * ở nơi dùng — `Chip` là namespace CỦA MÌNH, KHÔNG mutate export HeroUI. Vì vậy
 * đây là plain object (không tự render), tránh đụng `@heroui/react`'s `Chip`.
 *
 * TIER (thầy chốt: chỉ gom cùng tier): CHỈ chip Primitives ở đây. Chip DESIGN
 * (`DifficultyChip` · `AiCategoryChip` · `LanguageChip` — enum mang ngữ nghĩa
 * nội dung) GIỮ RIÊNG, KHÔNG fold vào `Chip.*` (giữ kỷ luật tier §6c).
 *
 * Composition = component import component: bình thường ở repo này (EnumChip đã
 * import StatusChip; ListRow import TitledText…). Compound chỉ AGGREGATE, không
 * thêm hành vi.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Chip = {
    Status: StatusChip,
    Dot: DotChip,
    Enum: EnumChip,
    Highlight: HighlightChip,
    HostPlatform: HostPlatformChip,
    Removable: RemovableToken,
    Tags: TagChips,
} as const
