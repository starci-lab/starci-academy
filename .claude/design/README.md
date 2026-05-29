# StarCi Academy — Design System

Chuẩn hoá UI/UX để build page mới **khớp giao diện hiện tại** (vibe-code nhất quán). Bổ sung cho `.claude/pattern/` (pattern *code/cấu trúc*) — file này nói về *visual/UX*.

> Nguồn: grounded từ code thật (`src/app/globals.css`, `src/components/...`). Token/màu/component nêu ở đây là giá trị thật trong repo, không bịa.

## North-star
- **Content-first, sạch, nhiều khoảng trắng.** Card bo góc lớn, nền `default/40` mềm, chữ phụ `text-muted`.
- **Accent teal-green** (logo StarCi `#00a898` ≈ token `--accent`) cho mọi điểm nhấn: link active, chip, nút chính, "Save %".
- **Light + Dark** (next-themes, default **dark** + enableSystem). Mọi component phải đẹp ở cả 2 theme → dùng token semantic (`bg-default`, `text-foreground`...) chứ KHÔNG hardcode màu.
- **HeroUI v3 first** (`@heroui/react` + `@heroui/styles`). Icon: `@phosphor-icons/react` (weight `duotone`/`regular`) + `@icons-pack/react-simple-icons` (brand).
- Font thực tế **Open Sans** (`next/font`) — ⚠️ token `--font-sans` đang trỏ `--font-inter` (chưa định nghĩa), cần fix; xem [05-typography.md](05-typography.md). Bo góc `--radius: 0.5rem`, field `0.75rem`; card `rounded-large`/`rounded-xl`.

## Mục lục
| File | Nội dung |
|------|----------|
| [01-tokens.md](01-tokens.md) | Màu (oklch thật), typography, spacing, radius, light/dark, difficulty palette |
| [02-components.md](02-components.md) | HeroUI v3 + inventory reuseable (card/chip/count-chip/alert/breadcrumb/sidebar/accordion/pricing/code-block/modal) + file refs |
| [03-layout-archetypes.md](03-layout-archetypes.md) | 3 archetype: Course detail · Course learn · Challenge split |
| [04-page-recipe.md](04-page-recipe.md) | Checklist build page mới khớp StarCi (cho Quizlet/LeetCode…) |
| [05-typography.md](05-typography.md) | Font (Open Sans), type-scale canonical, per-role class, drift cần sửa |
| [06-skeleton.md](06-skeleton.md) | Loading skeleton: HeroUI `Skeleton`, mirror layout, canonical + gaps |
| [07-modals.md](07-modals.md) | Rules theo loại modal: small (form/picker) vs full-size (split view) |

## Điều hướng nhanh
- Cần màu/khoảng cách/bo góc → [01](01-tokens.md).
- Cần component nào, dùng sao → [02](02-components.md).
- Dựng page mới → bám [03](03-layout-archetypes.md) (chọn archetype gần nhất) + [04](04-page-recipe.md).
