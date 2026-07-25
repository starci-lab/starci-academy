# CourseContents — CÂY REBUILD (step 1, bản revision)

> 2026-07-25 · lane `/starci-fe-story-audit CourseContents`
> **KHÔNG thay** `CourseContents.md` (cây thầy đã duyệt 24/07 @ `1783ee63`) — bản này
> chỉ ghi phần **ĐỔI** sau hai sự kiện, để dựng lại tầng block/design vừa bị dọn.
> Nguồn: `src/components/features/learn/CourseContents/**` · `features/auth/GithubTeamGate`
> · screen mồi `.storybook/components/screens/CourseContents/CourseContents.tsx`
> · kinh nghiệm `CourseContents.step3-lessons.md`.

---

## 0. Vì sao phải revision

| Sự kiện | Ảnh hưởng |
|---|---|
| **Canon đổi sang NĂM TẦNG** (`atom · layout · design · block · screen`) | Cây cũ ghi `PRIMITIVE` — vốn từ đã nghỉ. `Typography`/`Button`/`Chip` giờ là **atom**; `ListRow`/`SurfaceCard`/`Callout` là **layout**. |
| **Block + design dọn hết sang `_legacy`** (25/07) | 6 block + design mà step 3 từng dựng nay **không còn trong cây sống**. Phải mọc lại từ screen. |

Cây LOGIC giữ nguyên: **1 leaf · 6 block**. Thầy duyệt rồi, trò không mở lại.

---

## 1. 🔴 LỖI BIZ — screen mồi đi ngược cây đã duyệt

Cây duyệt 24/07 ghi: `BLOCK GithubTeamGate — states: ẩn · cảnh báo (**paid** chưa vào team)`.

Src xác nhận: *"A **PAID-enrolled** learner (the backend scopes teams to `is_enrolled = true`)"*.

Nhưng screen mồi dựng sau đó lại là:
```tsx
{viewer === "trial" ? <Feedback.Callout … title="Bạn chưa vào GitHub team của khoá" /> : null}
```

→ **Hiện gate cho TRIAL, ẩn với PAID — ngược hoàn toàn.** Người chưa mua thì làm gì có
team để vào; người đã mua mới cần nhắc. Đây là regression lọt vào lúc dựng screen,
không phải quyết định mới. **Đề xuất sửa theo src + theo cây đã duyệt.**

---

## 2. Cây rebuild — vốn từ 5 tầng

```
SCREEN  CourseContents                    states: content · loading · empty · error
└─ LEAF "Content home"                    (1 leaf — trang không switch view)
   │
   ├─ BLOCK CourseBrief                   states: content · skeleton
   │    └─ layout Page.Header · atom Breadcrumbs · atom Typography
   │       ⚠ meta = DẢI CHỮ muted ngăn "·", KHÔNG HighlightChip (thầy chốt ở screen mồi)
   │
   ├─ BLOCK CourseTeamGate                states: hidden · warning
   │    └─ layout Feedback.Callout · atom Button
   │       🔴 điều kiện = PAID chưa vào team (xem §1)
   │
   ├─ BLOCK TrialConversionStrip          states: hidden · loading(giá) · content
   │    └─ design PhaseScarcityNote · atom PricePoint · atom Button · atom Typography
   │
   ├─ BLOCK ContinuePanel                 states: resume · capstone · allDone · skeleton
   │    └─ layout SurfaceCard(hero) · atom Typography · atom Button · atom Progress.Meter
   │
   ├─ BLOCK LearnNudges                   states: hidden · pending · content(1–3)
   │    └─ layout List.Row · atom IconTile · atom Typography
   │       kind ENUM → block tự quyết icon (§14b)
   │
   └─ BLOCK KeepGoingPath                 states: content · hidden
        └─ layout List.Row · design DifficultyChip · atom Typography
           leading icon do BLOCK sở hữu: play(active) · check(read) · circle(unread) · lock(premium)
```

### Phải dựng

| Tầng | Số | Tên |
|---|---|---|
| **BLOCK** | 6 | CourseBrief · CourseTeamGate · TrialConversionStrip · ContinuePanel · LearnNudges · KeepGoingPath |
| **DESIGN** | 2 | PhaseScarcityNote · DifficultyChip |
| atom / layout | **0** | phủ đủ bằng 42 atom + 44 layout sẵn có |

---

## 3. Bốn STATE screen mồi còn thiếu

Cây 24/07 đã nêu #1 và #2; #3–#4 là bổ sung của lượt này.

| # | State | Ở đâu | Bằng chứng trong src |
|---|---|---|---|
| 1 | **`allDone`** | ContinuePanel | `!resumeHref` → nhãn *"Đã học xong"*, **ẩn CTA**. Đích của cả trang mà thiếu. |
| 2 | **`capstone`** | ContinuePanel | `isCapstoneResume` → đổi cả eyebrow lẫn nhãn CTA (`resumeCapstone`). |
| 3 | **`error`** ★ | SCREEN | `outlineSwr.error` + `onRetry` + `retryLabel`. Screen mồi chỉ khai `content\|loading\|empty` — **rụng mất state lỗi**. |
| 4 | **`pending`** ★ | LearnNudges | `nudgesPending`. Ghi chú src 2026-07-12: `dueSwr`/`leaderboardSwr` về SAU `outline` nên dải từng **nhấp nháy**. Không dựng state này = dựng lại đúng con bug đó. |

---

## 4. Ràng buộc mang sang từ step3-lessons (đừng học lại)

1. **Mọi row-list = `List.Row` + prop — KHÔNG đẻ `*Row` riêng.** Lần trước `LessonRow`
   và `NudgeRow` đều dựng xong 100% bằng prop có sẵn. Áp thẳng cho `KeepGoingPath`
   và `LearnNudges`.
2. **Biến-thể-chrome = thêm PROP, không đẻ component.** `ContinueCard` từng đi
   `item · hero · plain` bằng một prop `variant`.
3. **Store-coupled → tách bản presentational props-only** trước khi vào Storybook
   (`TrialConversionStrip` đọc SWR + payment overlay; `LearnBreadcrumb` đọc redux —
   bản presentational của nó tên **`ResponsiveBreadcrumb`**, grep trước khi port lại).
4. **Icon: Phosphor, không hand-roll SVG** (§5).
5. **Copy tiếng Việt lấy NGUYÊN VĂN `src/messages/vi.json`**, không tự viết lại.

---

## 5. Chờ thầy duyệt

1. 🔴 **`CourseTeamGate` = PAID chưa vào team** (sửa ngược lại screen mồi) — xác nhận?
2. Bốn state ở §3 — dựng hết chứ?
3. `ContinuePanel` là **BLOCK** (không phải design `ContinueCard` như bản legacy) —
   vì nó ôm biz thật: chọn con trỏ resume, đổi nhãn theo capstone, gộp tiến độ. Đồng ý?
4. `CourseTeamGate` là **block riêng** thay vì screen gọi thẳng `Feedback.Callout`
   (layout) — screen chỉ được liệt kê block (§14a). Đồng ý?

**STOP — chưa dựng gì. Chờ duyệt rồi sang step 2 (diff vs Storybook).**
