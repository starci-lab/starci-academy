# Brand lockup = block `BrandLogo`; wordmark tagline được dùng px nhỏ + uppercase (2026-06-18)

- File/§ đích khi `/merge`: `main.md` §5 (Text & Icons — ngoại lệ wordmark) + §13 index (thêm BrandLogo) hoặc starci-card/identity.
- Bài học: logo navbar = ngọn lửa PNG + chữ "StarCi" / "academy". Thầy muốn "academy" **viết hoa, size 10**.
  Typography KHÔNG có type < `body-xs` (12px) → 10px không map được type.

## Luật
- **Brand lockup (logo + wordmark) = 1 BLOCK** (`blocks/identity/BrandLogo`), sở hữu toàn bộ look. Feature
  (vd navbar `Logo`) chỉ **bọc Link + onPress** (wiring điều hướng), KHÔNG style.
- **Ngoại lệ "no text-[Npx]"**: TAGLINE wordmark (vd "ACADEMY" dưới brand) được dùng **px chính xác < 12**
  (`text-[10px]`) + `uppercase` + `tracking-widest` **CHỈ trong block thương hiệu** — vì đây là chi tiết
  typographic của logo, không có Typography type tương ứng. KHÔNG mở ngoại lệ này cho UI thường (vẫn dùng Typography).
- Logo phải là **link rõ ràng**: wrap trong HeroUI `Link` + `cursor-pointer` (onPress-only Link không tự ra con trỏ).
- In-app logo = **PNG** (`/logo-icon.png`), KHÔNG SVG component (`LogoMark` cũ chỉ còn ở navbar legacy `layouts/shell`).
