# StarCi Chip Convention

Cách dựng **Chip / Badge nhãn** (rank, status, difficulty, tag…). Đi kèm `starci-ui.rules` §2 (màu).
STRICT.

## Nguyên tắc: chip = MỘT KHỐI MÀU MỀM, KHÔNG viền
Chip là một **vùng nền tint nhạt** của 1 màu, chữ + dot/icon **cùng màu đậm hơn**. KHÔNG dùng `border`
để vẽ chip — viền làm nó thành "outline", rối mắt và lệch ngôn ngữ thị giác (xem mẫu sai: rank pill cũ
viền cam). Phân tách bằng **nền tint + màu chữ**, không bằng đường kẻ.

```
nền   = màu @ 10%      (bg tint)
chữ   = màu @ 100%
dot   = màu @ 100%
viền  = KHÔNG
```

## Màu TOKEN (success/danger/warning/accent/default) → HeroUI `Chip variant="soft"`
Dùng block có sẵn, KHÔNG hand-roll:
- `StatusChip tone="success|danger|warning|accent|neutral"` — bọc `Chip color={token} variant="soft"` +
  `Chip.Label`. `variant="soft"` = nền tint mềm + chữ cùng màu, **tự không viền**.
- `DifficultyChip` — beginner/intermediate/advanced/**insane**. (insane → `accent` vì Chip `color` là enum;
  THANH độ khó data-driven dùng tông tím `--difficulty-insane` — xem `starci-stats.md` §4. Lệch chấp nhận.)
- Cần chip token mới → thêm tone vào các block này, KHÔNG tự `<span className="border ...">` ở feature.

## Ngôn ngữ lập trình → `LanguageChip` (GitHub-style, KHÁC chip soft)
- **KHÔNG dùng `StatusChip`/pill cho ngôn ngữ.** Dùng block **`LanguageChip`** (`blocks/chips/LanguageChip`): **dot
  màu brand + tên**, KHÔNG nền/box (giống tag repo GitHub). Màu/tên từ `src/modules/utils/language.ts`
  (`getLanguageColor`/`getLanguageLabel`; `csharp→C#`, `cpp→C++`). Chi tiết → `starci-stats.md` §5.

## Màu HEX RUNTIME (rank tier, màu động ngoài token) → tint thủ công
Khi màu là hex tính lúc chạy (vd rank xám/đồng/bạc/vàng) → KHÔNG ép được vào `Chip color`. Tự dựng span
trong **reuseable** (mẫu `RankBadge`), bắt chước `variant="soft"`:
```tsx
<span
  className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
  style={{
    backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,  // = bg-[color]/10, format-agnostic
    color,                                                              // chữ + (dot kế thừa hoặc set bg=color)
  }}
>
  <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
  {label}
</span>
```
- `color-mix(in srgb, X 10%, transparent)` = tương đương `bg-[X]/10` nhưng chạy với **mọi** chuỗi màu
  (hex 3/6/8 ký tự, rgb…) — `bg-[..]/10` của Tailwind chỉ build được với literal, KHÔNG với hex runtime.
- KHÔNG `borderColor`. KHÔNG viền.

## Tham chiếu
- Token: `blocks/chips/StatusChip`, `blocks/chips/DifficultyChip` (`Chip variant="soft"`).
- Hex runtime: `reuseable/RankBadge` (color-mix 10%, no border).
- Liên quan: `starci-ui.rules` §2 (luật màu), `starci-ui-mindset.md` ("hạn chế border").
