# `--field-border: transparent` → control nhỏ HeroUI vô hình; override BEM trong globals  (2026-06-17)

- File/§ đích: `main.md` §2/§3 (globals override) hoặc `starci-*.md`.
- Bài học: HeroUI `Checkbox` render đúng anatomy (`Checkbox.Content > Control > Indicator`) nhưng "không thấy gì".
  Gốc: `.checkbox__control` lấy viền từ `--field-border`, mà globals UI-2.0 set **`--field-border: transparent`**
  (cho Input/TextArea/Select liền mạch, dựa nền-contrast). Ô checkbox size-4, bg ≈ card, viền trong suốt → vô hình.
- Luật mới:
  - **Control nhỏ (checkbox…) cần OUTLINE rõ → override `.checkbox__control { border-color: var(--border) !important }`
    trong globals.css** (đúng tầng — override BEM HeroUI, như `.switch__control`). KHÔNG sửa markup (markup đúng docs).
  - Khi 1 HeroUI control "không thấy/nhạt" mà markup đúng → NGHI token (đặc biệt `--field-border: transparent`,
    `--field-background` ≈ surface) → fix ở globals BEM, không ở feature.
  - `--border` (light ~90% / dark ~28%) = token viền nhìn thấy; `--separator` mảnh hơn cho divider.
