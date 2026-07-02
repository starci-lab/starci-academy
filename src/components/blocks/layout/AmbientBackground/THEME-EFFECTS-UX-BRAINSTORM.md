# Theme picker + hiệu ứng Lửa / Sóng — UX Brainstorm (2026-07-02)

> `/starci-fe-ux-brainstorm` — thêm **option chọn theme** + theme hiệu ứng **Lửa cháy** + **Sóng nước**.
> KHÔNG code ở bước này. Grounded từ map hệ theme thật (Explore agent 2026-07-02).

## Mục tiêu
Cho học viên **chọn giao diện** vượt khỏi Sáng/Tối — thêm 2 theme "có không khí": **Lửa** (ấm, tàn lửa bay) và **Sóng** (mát, sóng nước trôi) — như 1 điểm cá nhân hoá/delight, **KHÔNG phá trải nghiệm đọc bài**.

## Hiện trạng (đã có gì — map thật)
| Mảnh | File | Ghi chú |
|---|---|---|
| next-themes | `src/app/InnerLayout.tsx` | `attribute="class"` · `defaultTheme="dark"` · `enableSystem` · `storageKey="starci-academy-theme"`. Chỉ đăng ký `light`/`dark` (KHÔNG có mảng `themes` tường minh). |
| Công tắc theme | `.../navbar/Navbar/AccountMenuDropdown/DarkLightModeSwitch` | HeroUI `Switch` sun/moon, `setTheme(value?"dark":"light")` — **2-way toggle**, chưa phải menu. |
| Token màu | `src/app/globals.css` L34–135 | Selector đã hỗ trợ **`[data-theme="…"]`** (`:root,.light,.default,[data-theme=light]` / `.dark,[data-theme=dark]`). Accent = **hồng hue 354**. ~50 token/theme. **Chưa có `[data-theme=fire/wave]`.** |
| ⭐ Hiệu ứng nền SẴN CÓ | `src/components/blocks/layout/AmbientBackground` | **Tàn lửa hồng bay lên** (`@keyframes emberRise` + `--drift`), seeded deterministic, **tự ẩn ở `/learn`**, **tôn trọng `prefers-reduced-motion`**. → hạ tầng "fire" đã có 70%. |
| Persistence | localStorage only | Không có cột `appearance` ở `UserEntity` (BE). Đăng xuất → reset về `defaultTheme`/system. |
| Settings | `src/app/[locale]/profile/settings/*` | Chưa có mục "Giao diện". |
| Reuse | framer-motion, `useReducedMotion()`, `@keyframes wireFlow`, `AppSplash` | xyflow/three.js CÓ trong deps nhưng **overkill** cho ambient — dùng CSS keyframe. |

**Điểm mấu chốt đã có sẵn:** `AmbientBackground` **tự ẩn ở `/learn`** + reduced-motion → nguyên tắc "effect không được phá đọc bài" ĐÃ được code hoá. Fire/Wave chỉ cần bám cơ chế này.

## Nguyên tắc STRICT (learning platform)
- **Effect = SAU chrome/nền, KHÔNG sau cột đọc.** Cột đọc lesson = "tờ giấy" surface đặc → chữ luôn đọc rõ; effect chỉ sống ở nền trang + rìa (như widget mockup: mini "lesson card" vẫn sạch trên nền lửa/sóng).
- **`prefers-reduced-motion` → tĩnh** (glow/gradient đứng yên, bỏ particle) — bắt buộc (chóng mặt/buồn nôn). [MDN prefers-reduced-motion]
- **Effect nhẹ, á»‰t điểm** — opacity thấp, `transform`/`opacity` (compositor thread), không layout reflow. Không "cháy rực" che nội dung.
- **Off-switch = chính cái picker** (chọn Sáng/Tối = không effect). Nếu để effect >5s liên tục nên có cách tắt → picker LÀ cách tắt.

## Tech chốt (từ research web)
- **Lửa** = **CSS keyframe ember** (radial-gradient amber + `mix-blend-mode`/box-shadow glow, particle bay `translateY`+fade) — **tái dùng `emberRise` sẵn có**, đổi hue hồng→cam. KHÔNG cần canvas/tsParticles (nặng, thừa cho ambient nhẹ). [thecodeplayer, css-tricks WAAPI]
- **Sóng** = **SVG layered waves + CSS keyframe** (2–3 lớp `<path>` trong suốt, `translateX` khác tốc độ → parallax; giữ DOM/a11y, không canvas/WebGL). [freefrontend CSS waves, medium CSS-only SVG wave]
- Cả 2 sống trong 1 layer `fixed inset-0 -z-10 pointer-events-none` (chính là `AmbientBackground` mở rộng).

## 3 HƯỚNG

### ⭐ A — Named themes trong theme-MENU navbar (ĐỀ XUẤT)
Đổi `Switch` sáng/tối → **theme menu**: `Sáng · Tối · Lửa cháy · Sóng nước` (+ "Theo hệ thống"). Mỗi theme = **1 palette đầy đủ** (token hue-shift) + **ambient chữ ký** (Lửa=embers ấm · Sóng=waves mát · Sáng/Tối=không effect).
- **Reuse tối đa:** `setTheme("fire"|"wave")` chạy ngay (next-themes) → thêm `themes` array + `.fire`/`.wave` token block ở globals.css + `AmbientBackground` render biến thể theo `theme`.
- **Scope:** `AmbientBackground` giữ ẩn `/learn` + reduced-motion. Palette (màu) VẪN áp ở `/learn` (chỉ màu, không particle).
- Picker = menu có swatch + **mini live-preview** (như widget), selected = ring accent.
- ✅ Khớp đúng "chọn theme" + hạ tầng có sẵn (ít việc mới nhất). ⚠️ Lửa/Sóng **đổi accent brand** (hồng→cam/teal) = "vibe theme" (chấp nhận vì opt-in).

### B — 2 trục: mode (Sáng/Tối) × hiệu ứng nền (Tắt/Lửa/Sóng)
Giữ Sáng/Tối làm **màu**; tách riêng "Hiệu ứng nền": Tắt · Lửa · Sóng = overlay trang trí độc lập palette (embers trên nền sáng HOẶC tối).
- Sống ở **Settings → "Giao diện"** (2 control + preview).
- ✅ Linh hoạt (lửa trên theme yêu thích) + **giữ accent hồng brand**. ⚠️ 2 control = phức tạp hơn; effect+palette không co-design (embers ấm trên accent hồng có thể chỏi).

### C — Effect như "ambient" opt-in, scoped, KHÔNG phải theme
1 toggle "Hiệu ứng nền" (Lửa/Sóng) chỉ áp **chrome/marketing** (dashboard/landing/profile hero), KHÔNG bao giờ reading. Palette giữ Sáng/Tối.
- ✅ An toàn nhất cho tool học. ⚠️ Không thực sự giao "theme picker có Lửa/Sóng" — chỉ là delight toggle.

**Đề xuất: A** (khớp yêu cầu + reuse `AmbientBackground`/next-themes; nguyên tắc reading-sạch đã được `AmbientBackground` lo). Nếu thầy muốn **giữ brand hồng** → **B**.

## Wiring nếu chọn A (grounded, chưa code)
1. `InnerLayout.tsx`: `NextThemesProvider` thêm `themes={["light","dark","fire","wave","system"]}`.
2. `globals.css`: thêm `.fire {…}` + `.wave {…}` (mirror khối dark, hue-shift: **fire accent ~hue 40 cam** · **wave accent ~hue 210 teal**; bg ấm/mát; heat ramp theo tông). ~50 token/block.
3. Navbar: `DarkLightModeSwitch` → **`ThemeMenu`** (HeroUI `Dropdown`/`Menu`) — mỗi item swatch + mini-preview + tên. (Hoặc giữ switch sáng/tối + thêm nút palette riêng.)
4. `AmbientBackground`: đọc `useTheme().theme` → render `ember`(fire, warm) / `wave`(wave, SVG layered) / `ember`(default brand hồng) / none (light/dark thường). Giữ `/learn` hide + reduced-motion guard.
5. **Wave block mới**: SVG 2 lớp `fixed inset-x-0 bottom-0 -z-10 pointer-events-none`, `translateX` loop, opacity thấp.
6. Persistence: localStorage (ngay). **Phase 2 (defer):** `UserEntity.appearance` cột + mutation `updateAppearance` + hydrate lúc login (đồng bộ đa thiết bị).

## Empty / loading / error / a11y
- Không async → không empty/error. Đổi theme **tức thì** (client). SSR: next-themes lo hydration (`suppressHydrationWarning`).
- Menu item = swatch + tên (đọc được screen-reader), `aria-pressed`/selected. Preview swatch tĩnh.
- **reduced-motion → glow tĩnh** (không particle/drift). Contrast: chữ trên palette Lửa/Sóng phải đạt AA (verify khi /ui-apply — token foreground theo bg mới).

## ✅ CHỐT (thầy, 2026-07-02) — Hướng B, mở rộng: 10 preset + custom color picker + lưu server

> Không đụng Sáng/Tối (giữ nguyên `DarkLightModeSwitch` navbar). Trang mới **Settings → "Giao diện"** (`/profile/settings/appearance`) với 2 control độc lập, cả hai **lưu vào `UserEntity`** (đồng bộ đa thiết bị, không phải localStorage).

### 1. Màu nhấn (accent) — 10 preset ĐẶT TÊN + "Tùy chỉnh" (HeroUI `ColorPicker`)
- **10 swatch preset** (mỗi cái override đúng 1 token `--accent`, KHÔNG đổi cả bộ token còn lại — xem §3): Hồng StarCi (mặc định, hue 354) · Tím · Lam · Ngọc · Lục bích · Chanh · Cam hổ phách · Đỏ · Hồng tím · Xám xanh. Render bằng block **`ColorSwatchPicker`** (đã có sẵn trong HeroUI, xem anatomy dưới) — KHÔNG tự vẽ 10 `<button>` tay.
- **"Tùy chỉnh"** = component **HeroUI `ColorPicker`** thật (xác nhận qua `heroui-react` skill, `get_component_docs ColorPicker`):
  ```tsx
  import { ColorPicker, ColorArea, ColorSlider, ColorSwatch, parseColor } from "@heroui/react"
  <ColorPicker value={color} onChange={setColor}>
    <ColorPicker.Trigger><ColorSwatch size="lg" /><Label>Tùy chỉnh</Label></ColorPicker.Trigger>
    <ColorPicker.Popover>
      <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness"><ColorArea.Thumb/></ColorArea>
      <ColorSlider channel="hue" colorSpace="hsb"><ColorSlider.Track><ColorSlider.Thumb/></ColorSlider.Track></ColorSlider>
    </ColorPicker.Popover>
  </ColorPicker>
  ```
  Hue tự do (360°) — người dùng chọn ĐÚNG ý muốn, không giới hạn 10 preset. **KHÔNG tự dựng color-area/hue-slider tay** (widget mockup trước đó tự vẽ canvas — chỉ để DEMO Ý TƯỞNG; code thật PHẢI dùng component HeroUI).
- **Ràng buộc an toàn màu:** clamp giá trị người dùng chọn về **L/C hợp lý trong oklch** (giữ lightness/chroma cùng dải với `--accent` gốc, chỉ đổi HUE) → mọi hue đều **đủ tương phản làm nút solid + `--accent-foreground` trắng vẫn đọc được** (không cho chọn màu quá sáng/quá nhạt làm vỡ contrast nút CTA). Convert hex ColorPicker → oklch, giữ L≈70%, C≈0.20 (khớp preset gốc), chỉ thay H.

### 2. Hiệu ứng nền — Tắt / Lửa cháy / Sóng nước, NHUỘM MÀU theo accent đã chọn
- 3 lựa chọn (radio-card hoặc `SelectableCardGroup`), mini-preview animate ngay trong lựa chọn.
- **Lửa và Sóng dùng CHUNG 1 màu = accent đã chọn** (không phải màu cố định cam/teal riêng) — ember + wave tô bằng `color-mix(in oklch, var(--accent) x%, transparent)`. 1 hệ màu duy nhất: đổi accent → cả nút CTA lẫn hiệu ứng nền đổi theo, luôn hài hòa (đây là đổi hướng so với bản nháp §Tech cũ vốn định fire=cam cố định/wave=teal cố định).
- Vẫn giữ NGUYÊN nguyên tắc STRICT ở trên: sau chrome/nền (không đè cột đọc) · ẩn ở `/learn` (tái dùng `AmbientBackground`) · `prefers-reduced-motion` → tĩnh · nhẹ/mờ.

### 3. KHÔNG đụng Sáng/Tối — 2 hệ độc lập
- Sáng/Tối (`next-themes`, `.light`/`.dark`) tiếp tục quyết định TOÀN BỘ token nền/surface/foreground như cũ.
- Accent tùy chỉnh + hiệu ứng là **override THÊM** trên nền đó: `--accent`/`--accent-foreground` (+ derived: hover/ring/heat-ramp nếu cần) được ghi đè bằng **inline CSS custom property ở `<html>` hoặc style tag nhỏ**, không đổi `data-theme`. Vd `document.documentElement.style.setProperty("--accent", userAccentOklch)`.
- → Người dùng có thể ở Tối + Hồng, hoặc Sáng + Lam, hoàn toàn độc lập.

### 4. Lưu server — `UserEntity` (BE)
- Thêm cột: `accentColor` (`varchar`, hex hoặc oklch string, nullable — null = mặc định hồng StarCi) + `backgroundEffect` (`enum: none | fire | wave`, default `none`).
- Migration TypeORM mirror pattern các cột optional khác của `UserEntity`.
- GraphQL: field trên `me`/`myProfile` query (đọc) + mutation mới `updateAppearance(accentColor?, backgroundEffect?)`.
- FE: SWR mutation + hydrate `--accent`/effect state ngay sau khi `myProfile` load (trước cả paint nếu được, giảm flash) — tương tự cách `next-themes` chống flash cho dark/light (`suppressHydrationWarning` + inline script sớm). Cân nhắc: set 1 inline `<script>` nhỏ ở `<head>` đọc cookie/localStorage cache của accent (mirror giá trị server) để KHÔNG flash về hồng mặc định rồi mới đổi màu sau khi SWR load xong.

## Refs
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) · [Smashing — respecting motion preferences](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/)
- [Fossheim — accessible theme picker](https://fossheim.io/writing/posts/accessible-theme-picker-html-css-js/) · [shadcn theme selector](https://www.shadcn.io/examples/dropdown-menu-theme-selector)
- [thecodeplayer — canvas fire particles](https://thecodeplayer.com/walkthrough/html5-canvas-experiment-a-cool-flame-fire-effect-using-particles) · [freefrontend — CSS fire](https://freefrontend.com/css-fire-animations/)
- [freefrontend — CSS water/waves](https://freefrontend.com/css-water-effects/) · [medium — CSS-only SVG wave](https://medium.com/@r_tripti/css-only-svg-wave-animation-291c1cadd15f)
