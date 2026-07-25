import { StatusChip } from "@sb-components/atoms/chips/StatusChip/StatusChip"
import { EnumChip } from "@sb-components/layouts/chips/EnumChip/EnumChip"
import { HighlightChip } from "@sb-components/layouts/chips/HighlightChip/HighlightChip"
import { RemovableToken } from "@sb-components/layouts/chips/RemovableToken/RemovableToken"
import { TagChips } from "@sb-components/atoms/chips/TagChips/TagChips"

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
 * ⚠️ `Dot` KHÔNG còn ở đây (thầy chốt 2026-07-25): chip chấm đã lên ATOM
 * `Chip.Dot` (variant `pill`/`bare`) — khác tier nên không gom vào namespace này.
 * Block `DotChip` đã XOÁ; mọi chip domain gọi thẳng atom.
 *
 * TIER (thầy chốt: chỉ gom cùng tier): CHỈ chip Primitives ở đây. Chip DESIGN
 * (`DifficultyChip` · `AiCategoryChip` · `LanguageChip` — enum mang ngữ nghĩa
 * nội dung) GIỮ RIÊNG, KHÔNG fold vào `Chip.*` (giữ kỷ luật tier §6c).
 *
 * ⚠️ `HostPlatform` đã BỎ khỏi namespace này (2026-07-25): `HostPlatformChip`
 * sống ở `_designs/chips` (tier DESIGN, semantic theo nền tảng video), nên vi
 * phạm đúng kỷ luật TIER ở trên nếu gom vào đây. Story riêng của nó ở
 * `Design/Chips/HostPlatformChip`, KHÔNG còn xuất hiện trong `Chip.*` gallery.
 *
 * Composition = component import component: bình thường ở repo này (EnumChip đã
 * import StatusChip; ListRow import TitledText…). Compound chỉ AGGREGATE, không
 * thêm hành vi.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Chip = {
    Status: StatusChip.Base,
    Enum: EnumChip,
    Highlight: HighlightChip,
    Removable: RemovableToken,
    Tags: TagChips.Base,
} as const
