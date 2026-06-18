---
alwaysApply: true
---
# StarCi — Stats / metric / chart elements (render NTN)

Quy ước cho khối SỐ LIỆU & BIỂU ĐỒ: metric row, SegmentBar, Legend, LanguageDonut, MetricCard, thang màu
độ khó, so sánh cộng đồng. Blocks ở `components/blocks/stats/*`. (Mindset chung ở `main.md` §9/§14.)

## 1. Metric row (KPI đầu trang)
- Số liệu tóm tắt = **hàng `MetricCard`** `grid grid-cols-2 gap-3 sm:grid-cols-4` (value lớn + label muted).
  KHÔNG hero `StatPair` to chình ình cho KPI nhiều ô.
- **MetricCard đứng TOP-LEVEL**, KHÔNG lồng trong `LabeledCard` (card-in-card). Card phân bố/chi tiết ở DƯỚI.
- Ô optional (rank/percentile/xp) **tự ẩn khi null** (push vào mảng stats khi `!= null`).
- `MetricCard` có `hint` → dùng **ghi rõ thuật ngữ** khi label ngắn dễ mơ hồ.
- **`StatPair` prop `size`** (`md`=h4 mặc định, `lg`=h2) cho con số hero ở chỗ KHÁC — không phá chỗ cũ.
- **Gộp count + breakdown của CÙNG tập dữ liệu thành 1 card** ("N cái, chia theo X"), thay vì StatPair rời + card riêng.

## 2. SegmentBar / Legend
- **`SegmentBar`** = thanh tỉ lệ nhiều lát màu + legend (dot + label + count). Màu lát = **data-driven** (`color` =
  token `var(--…)`, KHÔNG hex). Skeleton = `Skeleton.SegmentBar legendItems={n}` (gồm CẢ legend, KHÔNG chỉ `ProgressBar`).
- **Thanh tiến độ theo TỔNG:** đặt `max={total}` → lát đã-làm tô màu, **phần còn lại = track `bg-default`** (vd
  Bài nộp per-course = passed/total). Summary ghi `{done}/{total}`.
- **Nhiều bar CÙNG THANG MÀU trong 1 card → 1 `Legend` dùng chung ở ĐÁY** (đặt `hideLegend` từng bar). Bar LẺ (1 cái)
  → để SegmentBar tự render legend.
- **Block `Legend`** (`blocks/stats/Legend`): props `items: Array<{key,label,color}>`, `flex-wrap` dot+label (khớp legend SegmentBar).

## 3. Categorical breakdown → `SegmentBar`, TRÁNH pie/donut (STRICT)
- **Part-to-whole / breakdown phân loại** (ngôn ngữ, độ khó, trạng thái…) → mặc định **`SegmentBar`** (thanh ngang
  100%, legend `label · count`), hoặc ranked bar-per-row khi cần xếp hạng độ lớn. **TRÁNH pie/donut.**
- Gốc: mắt so **chiều dài/vị trí > góc/diện tích** (Cleveland–McGill); donut tệ nhất khi N nhỏ / nhiều slice gần bằng
  nhau; CSS bar nhẹ + theo token + dark-mode chuẩn, không kéo lib chart. Số "tổng" donut hay khoe ở giữa → để
  headline/`MetricCard`.
- **Phân biệt theo SỐ HẠNG MỤC, KHÔNG phải part-to-whole:**
  - **Ít bucket CỐ ĐỊNH** (độ khó 4, ngôn ngữ vài) → `SegmentBar` (so tỉ lệ tốt).
  - **Tập MỞ-RỘNG/nhiều** (topic, tag, kỹ năng — 10–20+ giá trị) → **chip/tag-cloud kèm count** (LeetCode/GitHub
    style), scale tốt; **KHÔNG ép stacked-bar** dù part-to-whole hợp lệ (lát mỏng như confetti, legend dài, không đọc nổi).
- **Chip metadata (topic/tag/skill) = màu NEUTRAL/`--default`, KHÔNG accent** (accent dành cho hành động; bôi accent
  cho data làm nhiễu + chìm heatmap). Cường độ/heatmap tint bằng `var(--default)` theo count; **count in RÕ** để không
  dựa màu (a11y). (Mẫu: `blocks/stats/TopicMasteryGrid` tint `--default` 12–48%, label foreground + count muted.)
- **Donut chỉ khi** rất ít hạng mục + "1 con số tổng ở giữa" là điểm nhấn CHÍNH (hiếm).
- Block **`LanguageDonut`** (`blocks/stats/LanguageDonut`) GIỮ (còn `ProfileCoding`/legacy dùng) — nếu dùng: độ dày
  = px chính xác qua `thickness` (default **8** = h-2 bar), KHÔNG `innerRadius %`; `size` ~128. Nhưng KHÔNG là mặc định.

## 4. Thang màu ĐỘ KHÓ (difficulty) — 4 tông data-driven
- **easy → `var(--success)`** · **medium → `var(--warning)`** · **hard → `var(--danger)`** · **insane/expert →
  `var(--difficulty-insane)`** (tím, token ở `globals.css` light+dark). Dùng cho SegmentBar/bar độ khó (qua `color`).
  Mẫu: `ProfileChallengesTab/.../difficultyMeta.ts`.
- ⚠️ **DifficultyChip** (HeroUI Chip `color` enum) đang map insane→`accent` (hồng) — Chip color không nhận token tuỳ ý
  nên CHƯA khớp tím của bar. Chấp nhận lệch: **bar = thang 4-tông tím; chip = semantic enum**. Nếu cần khớp tuyệt đối
  → dựng soft-chip custom đọc `--difficulty-insane` (code follow-up, chưa làm).
- **Điểm số đổi màu theo band** (chỗ hiện điểm chấm): `≥90 → text-success` · `≥70 → text-warning` · `<70 → text-danger`.

## 5. Ngôn ngữ (language) — kiểu GitHub
- **Chip ngôn ngữ = block `LanguageChip`** (`blocks/chips/LanguageChip`): **dot màu brand + tên**, KHÔNG pill/box
  (giống tag repo GitHub). KHÔNG dùng `StatusChip`/pill cho ngôn ngữ.
- **Nguồn màu/tên DUY NHẤT = `src/modules/utils/language.ts`** (`getLanguageColor`/`getLanguageLabel`): màu theo
  **GitHub linguist**; tên `csharp→C#`, `cpp→C++`, `c→C`, `php→PHP`, còn lại title-case. KHÔNG hardcode rải rác.
- **Màu brand ngôn ngữ = ngoại lệ "no hex" hợp lệ** (brand identity ngoài, như logo GitHub/LinkedIn) — để ở
  `language.ts`, KHÔNG token globals.
- **Breakdown "theo ngôn ngữ" = `SegmentBar`** (color/label qua `getLanguageColor`/`getLanguageLabel`), KHÔNG donut (§3).

## 9. Snapshot/teaser ĐỒNG BỘ với tab đầy đủ
- **CÙNG 1 metric → CÙNG chart + CÙNG legend (label + màu) ở MỌI nơi** (kể cả card tóm tắt/teaser ở Overview).
  Snapshot KẾ THỪA viz của tab đầy đủ (chỉ gọn hơn), KHÔNG tự chọn chart/label/màu khác. Nhãn+màu từ **1 nguồn dùng
  chung** (vd `getLanguageLabel`/`getLanguageColor`, difficulty meta).
- Sửa 1 metric viz → **grep MỌI nơi render nó** (snapshot + tab + overview) và đồng bộ; đừng chỉ đổi tab sâu rồi bỏ teaser.

## 6. So sánh cộng đồng (percentile + rank + XP)
- Tab có thành tích nên có **so sánh**: percentile ("trình độ hơn X% học viên") + **rank #N** (mẫu `userCodingRank`/
  `userChallengeStrength`). Hiển thị thành ô metric (label "Top đầu" cho percentile; "Hạng" cho rank).
- **BE = metric DẪN XUẤT (đường A):** thêm điểm vào projection + query trả `{percentile, rank, xp}`, **KHÔNG đụng**
  points/XP/league. `rank=1+count(cao hơn)`, `percentile=round(beaten/pool×100)`, null khi chưa có pass.
- **XP ≠ tổng raw `score`.** XP thật = ledger `xp_histories.amount` (BE trả về), KHÔNG cộng `score` ở FE. (Points global
  = flat 20/challenge; per-course XP = `xp_histories.amount` weighted.) Card "XP đã nhận" PHẢI lấy nguồn XP thật.

## 7. Badge / achievement (wall + meta)
- **Meta badge = 1 DÒNG `{rank} · {secondary}`** ngăn `·`:
  - **earned** → `{rank}` tô **màu RING data-driven** (`getRank().ring` qua `style={{color: ring}}`, KHÔNG token lệch
    nghĩa) **·** `{rarityPercent}%` muted. **locked** → `currentValue/threshold` muted.
  - Áp cho CẢ meta dưới badge LẪN tooltip (tooltip: name đậm + description muted + dòng `{rank} · {rarity}%`). BỎ kiểu
    3 dòng / rank xanh / Top% vàng.
- **Wall density:** mascot **size ~48** (không 64); grid `gap-4`, cell ~`minmax(72px,1fr)` (không gap-6/92px loãng).

## 8. Đồng nhất (STRICT)
- **3 chỗ dot+label phải CÙNG size**: difficulty legend + donut legend + `LanguageChip` → **dot `size-3`** + **label
  `body-xs` muted**. Đừng để `size-2`/`body-sm` lệch.
- **1 màu nổi / cụm**, còn lại muted (main.md §14). Skeleton mirror đúng (main.md §7).
