import { EnumChip } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { RemovableToken } from "@sb-components/composites/chips/RemovableToken/RemovableToken"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Chip.*` compound namespace.
 *
 * Gom các chip **PRIMITIVE cùng tier** (Primitives/Chips) vào MỘT root, giống
 * `Skeleton.*` — một import `Chip`, phát hiện dễ, đồng bộ. Consumer đổi
 * `<EnumChip/>` → `<Chip.Enum/>`, `<HighlightChip/>` → `<Chip.Highlight/>`, …
 *
 * NAMING (thầy chốt 2026-07-24): base pill của HeroUI được **alias `HeroChip`**
 * ở nơi dùng — `Chip` là namespace CỦA MÌNH, KHÔNG mutate export HeroUI. Vì vậy
 * đây là plain object (không tự render), tránh đụng `@heroui/react`'s `Chip`.
 *
 * ⚠️ `Dot` KHÔNG còn ở đây (thầy chốt 2026-07-25): chip chấm đã lên ATOM — và từ
 * 2026-07-26 nó cũng không còn là member riêng bên đó nữa, chấm là PROP của
 * `Chip.Base`. Block `DotChip` đã XOÁ; mọi chip domain gọi thẳng atom.
 *
 * ⚠️ `Status` và `Tags` đã BỎ khỏi namespace này (2026-07-26) — cùng lý do TIER ở
 * dưới, chỉ là lần này atom bên kia đổi nên lộ ra: `StatusChip` bị xoá (nó chỉ là
 * `Chip.Base` khoá cứng `tone`) và `TagChips` thành `Chip.Group` của tầng ATOM.
 * Gọi thẳng `Chip.Base` / `Chip.Group` từ `atoms/chips/Chip/Chip`. Namespace này
 * chỉ còn chip đúng tier của nó.
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
 * Composition = component import component: bình thường ở repo này (EnumChip
 * import `Chip.Base` của atom; ListRow import TitledText…). Compound chỉ
 * AGGREGATE, không thêm hành vi.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Chip = {
    Enum: EnumChip,
    Highlight: HighlightChip,
    Removable: RemovableToken,
} as const
