# CourseContents — STEP 2: DIFF reuse-first (bản rebuild)

> 2026-07-25 · vào từ `CourseContents.rebuild.md` (thầy duyệt) · **read-only**
> Đối chiếu 8 node của cây với cây SỐNG (`atoms` · `layouts`) và cây LEGACY
> (`components/_legacy/**`).

---

## 0. Phát hiện chính — KHÔNG có gì phải viết từ số 0

**7/8 node đã có bản legacy chạy được.** "Dựng lại" thực chất là **PORT + SỬA**,
không phải rewrite. Viết lại từ đầu sẽ **đánh mất các ruling đã nướng vào code**
(vd `ContinueCard` hero cố ý KHÔNG có `eyebrow`; `CourseBrief` meta là chữ muted
chứ không phải chip) — chính những thứ thầy đã soi mắt chốt.

## 0b. Atom + layout: phủ ĐỦ, không thiếu gì

```
atom    ✅ Typography · Button · Breadcrumbs · Progress · PricePoint · IconTile · Chip
layout  ✅ Page · SurfaceCard · List · Feedback · AsyncContent
```
→ **0 atom mới · 0 layout mới.**

---

## 1. Bảng diff — 8 node

| # | Node | Tầng | Nguồn legacy | Action | Việc phải làm |
|---|---|---|---|---|---|
| 1 | `CourseBrief` | block | `blocks/learn/CourseBrief` (96) | **PORT** | Meta **đã đúng** dạng `Typography.Base size="xs" color="muted"` — không phải chip. Bê thẳng. |
| 2 | `CourseTeamGate` | block | — | **NEW** (mỏng) | Node DUY NHẤT chưa có. Bọc `Feedback.Callout` + điều kiện **paid & chưa vào team**. step3 lần trước đã chứng minh Callout reuse 100%, không cần sửa layout. |
| 3 | `TrialConversionStrip` | block | `blocks/commerce/TrialConversionStrip` (150) | **PORT** | Bản presentational props-only đã tách sẵn từ step 3 — không phải tách lại. |
| 4 | `ContinuePanel` | block | `designs/cards/ContinueCard` (327) | **PORT + NÂNG TẦNG + THU GỌN** | design→block. Legacy mang **3 variant** (`item·hero·plain`); screen chỉ dùng **`hero`**. Xem §2. |
| 5 | `LearnNudges` | block | `blocks/learn/LearnNudges` (90) | **PORT + ADD-STATE** | Thêm `pending`. |
| 6 | `KeepGoingPath` | block | `blocks/learn/KeepGoingPath` (115) | **PORT** | Bê thẳng. |
| 7 | `PhaseScarcityNote` | design | `designs/commerce/PhaseScarcityNote` (89) | **PORT** | Bê thẳng. |
| 8 | `DifficultyChip` | design | `designs/chips/DifficultyChip` (72) | **PORT** | ⚠️ Naming: step3-lessons ghi `DifficultyChip` từng nằm sai ở `Design/Chip/*` trong khi mọi chip-wrapper anh em ở `Primitives/Chip/*`. Vốn từ nay đổi → đặt lại cho khớp tầng **design** (nó mang vai "độ khó", đúng design §14d). |

**Tổng: 1 NEW · 7 PORT**, trong đó 3 node kèm sửa (`ContinuePanel`, `LearnNudges`, `DifficultyChip`).

---

## 2. ⚠️ Quyết định cần thầy chốt — `ContinuePanel` giữ mấy variant?

Legacy `ContinueCard` = **327 dòng / 3 variant** (`item` · `hero` · `plain`), trong đó
`plain` là do step 3 lần trước thêm vào cho trang thật.

Screen mồi hiện **chỉ dùng `hero`**.

| Chọn | Được | Mất |
|---|---|---|
| **A. Chỉ `hero`** (trò nghiêng) | Block gọn còn ~1/3; đúng tinh thần "screen dẫn ra cái nó cần" — không nuôi variant không ai gọi | Màn khác sau này cần `item`/`plain` thì port lại từ legacy |
| B. Bê cả 3 | Không phải đụng lại | Kéo về 2 variant **chưa screen nào dùng** — đúng thứ vừa dọn đi |

Trò đề xuất **A**: legacy vẫn nằm đó, lúc nào screen khác gọi thì lôi variant ra sau.

---

## 3. Thứ tự dựng (gốc → ngọn)

```
VÒNG 1 — design (không phụ thuộc block)
   ① PhaseScarcityNote        ② DifficultyChip

VÒNG 2 — block độc lập (song song được)
   ③ CourseBrief   ④ CourseTeamGate★NEW   ⑤ KeepGoingPath   ⑥ LearnNudges(+pending)

VÒNG 3 — block ăn design vòng 1
   ⑦ TrialConversionStrip (cần ①)        ⑧ ContinuePanel (nâng tầng, thu gọn)

VÒNG 4 — screen
   ⑨ CourseContents: sửa 🔴 gate paid/trial · thêm state `error` · trỏ lại block mới
```

Vòng 2 gồm 4 node file rời → chạy song song được. Vòng 3–4 phải tuần tự.

---

## 4. Rủi ro đã biết

1. 🔴 **Gate `paid` vs `trial`** — thầy đã duyệt sửa theo src ở step 1. Node ⑨ phải đổi,
   nếu quên thì screen mới bê nguyên lỗi cũ sang.
2. **Đừng import từ `_legacy/`** — port nghĩa là **chép sang cây sống rồi sửa**, không
   phải trỏ đường dẫn vào legacy. Sau vòng 4, screen phải sạch bóng `_legacy`.
3. **4 layout còn ăn `_legacy/designs/buttons/Button`** (`AsyncContent` · `ButtonGroup` ·
   `ChipButtonList` · `FloatingActionButton`). `AsyncContent` nằm trong cây của screen này
   → cạnh live→legacy đó sẽ **dính vào đường dựng**. Nợ có sẵn, nêu để thầy quyết dọn
   cùng vòng 4 hay để riêng.
4. **`tsc` có 2 lỗi nền tiền tồn** (`.next/**/validator.ts`, module `rag-playground/page.js`)
   — mọi agent verify phải so đúng 2 dòng này, đừng tưởng lỗi của mình.

---

## 5. Chờ thầy

1. `ContinuePanel` — **A (chỉ `hero`)** hay B (cả 3 variant)?
2. Nợ #3 (4 layout ăn legacy Button) — dọn cùng vòng 4 hay tách phiên riêng?

**STOP — chưa dựng. Duyệt xong thì sang step 3 (workflow Sonnet dựng).**
