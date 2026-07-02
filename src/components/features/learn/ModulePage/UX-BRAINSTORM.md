# Trang Module (module overview) · UX-BRAINSTORM (2026-07-02)

> Brainstorm (KHÔNG code). Thầy: *"module bỏ [khỏi] search rồi, thêm trang module"*. Đọc code
> (2 explore agent BE+FE) → intent khớp hoàn hảo với 1 lỗ hổng có thật.

## Gốc rễ (đã verify, không đoán)
- **Module deep-link `/courses/<slug>/learn/content/modules/<moduleId>` ĐÃ tồn tại ở BE**
  (`buildEntityRoute` ModuleEntity) NHƯNG route FE chỉ có `[moduleId]/layout.tsx` passthrough +
  `[moduleId]/contents/[contentId]/page.tsx` — **KHÔNG có `[moduleId]/page.tsx`**. → module search
  hit (và mọi link tới module) dẫn tới **trang trống/404**. Đây LÀ lý do "bỏ module khỏi search".
- **Module hôm nay = accordion container trong `ContentMap` rail** (title + meter "n/m bài"), CHƯA
  BAO GIỜ là đích điều hướng riêng. Không có feature folder Module nào (greenfield).
- **`module(id|displayId)` GraphQL query ĐÃ CÓ** (trả module + `contents` nested, không challenge/
  video) + `modules(courseId)` list. → trang module fetch được ngay, KHÔNG cần BE query mới.

## Mục tiêu trang (≤30s)
User bấm 1 module (ở ContentMap / MindMap / CourseCurriculum) → landing = "module này có gì · tôi
tới đâu · học tiếp cái gì". 1 primary action = tiếp tục bài dở kế của module.

## Dữ liệu khả dụng (grounded)
| Phần | Nguồn (đã có) |
|---|---|
| Tiêu đề · mô tả · tier (Foundation/Intermediate/Advanced) · isPremium · numContents | `module(displayId)` — ModuleEntity |
| Danh sách bài: title · minutesRead · difficulty · isPremium · isSandbox · numChallenges | `module.contents[]` (ContentEntity) |
| Challenge của module: title · score · difficulty | content.challenges (qua outline) |
| **Tiến độ module** (n/m bài đọc, k/j challenge, %) | **suy client-side từ `myCourseOutline` tree** — per-lesson `isRead` + per-challenge `status/completed` LỌC theo module. KHÔNG có entity module-progress riêng. |
| previewContents (bullet "học được gì") | `module.previewContents[]` — dùng cho state premium-locked |

## 3 hướng (đã vẽ widget A vs B)
| | Hướng | Chủ đạo | Trade-off |
|---|---|---|---|
| **A ✅** | **Module home (continue-first)** | "tôi ở đâu · học tiếp gì" | Mirror course-home chrome đã có (breadcrumb → header[title+tier chip+desc+chips N bài·~time·N challenge] → khối continue PHẲNG[bài kế + ProgressMeter + dòng n/m] → list bài[status icon done/current/todo/lock] → list challenge). Tái dùng PageHeader/ProgressMeter/ListRow/LabeledList. Rẻ, on-brand, đồng bộ content-home + personal-project-home ([[learn-home-surfaces-share-flat-chrome]]). |
| B | **Syllabus (scan-first)** | "quét trọn module" | Mỗi bài 1 hàng GIÀU (phút · độ khó · sandbox tag · số challenge), challenge inline; KHÔNG khối resume (bài đang học tự nổi). Denser (Coursera module/Udemy section). Hợp module LỚN; nhưng lệch chrome course-home + mất "1 primary action resume". |
| C | Hybrid | — | A + hàng giàu của B. Gộp được nhưng nặng hơn; để dành nếu A thấy thiếu meta. |

**CHỐT 2026-07-02 = Hướng C (Hybrid)** — trang module = **course-home thu nhỏ cho 1 module** (khối
continue + progress + landing dashboard) **NHƯNG list bài dùng hàng GIÀU của B** (mỗi row: status
icon + title + meta `phút · độ khó · sandbox tag · N challenge`). Vừa "resume-first" (1 primary
action) vừa "quét trọn module" trong 1 surface. Đúng họ [[learn-home-surfaces-share-flat-chrome]] +
[[three-tier-page-layout]] + [[course-home-no-duplicate-surfaces]] (KHÔNG vẽ lại cả cây — cây ở rail
ContentMap). IA: breadcrumb → header (title + chip tier + desc + chips N bài·~time·N challenge) →
khối continue PHẲNG (bài kế + ProgressMeter + dòng n/m) → list bài GIÀU (rich row) → list challenge.

## Vị trí / route / shell
- **Route MỚI: `content/modules/[moduleId]/page.tsx`** (đang thiếu) — render trong `LearnShell`
  (left rail = ContentMap sẵn có → trang module là RIGHT pane, `p-6` + `max-w-3xl mx-auto` theo
  [[three-tier-page-layout]] + [[learn-content-padding-shell-p6]]). Breadcrumb: Home › Courses ›
  `<course>` › `<module>` (`LearnBreadcrumb` + prop current).
- **Landing dashboard, KHÔNG auto-forward vào bài** ([[surface-lands-on-dashboard-no-auto-forward]]) —
  land ở trang module, user tự bấm "Tiếp tục".

## Quyết định coupled (thầy đã CHỐT 2026-07-02)
1. **ContentMap: module header = title → trang module · caret riêng → gập/mở** (CHỐT). Hôm nay
   header chỉ là accordion toggle → tách 2 affordance: bấm TITLE điều hướng tới trang module; bấm
   CARET (icon riêng) mới gập/mở accordion. Module thành đích điều hướng thật.
2. **GIỮ module trong global search, trỏ tới trang MỚI** (CHỐT — lật lại "bỏ khỏi search" ban đầu).
   Lý do bỏ trước đây = deep-link 404; giờ trang module tồn tại → module hit hết 404, **giữ lại**.
   `buildEntityRoute` ModuleEntity ĐÃ trỏ đúng `/…/content/modules/<id>` → chỉ cần tạo `page.tsx`,
   KHÔNG gỡ gì khỏi search. (Bucket module + icon `StackIcon` giữ nguyên.) Cân nhắc thêm chip
   trạng thái/tier cho module row trong search về sau (không bắt buộc đợt này).
3. **State premium-locked:** module `isPremium` + chưa enroll → header + `previewContents` (bullet)
   + list bài KHÓA (title + lock, [[status-icon-overrides-base]]) + CTA enroll/"Học thử". Bài free
   (`isPremium=false`) trong module premium vẫn vào được (trial — [[trial-preview-enrollment-optional]]).
4. **Empty/loading/error:** module chưa có bài → EmptyContent (không tự ẩn — [[labeled-section-render-empty-not-self-hide]]); skeleton mirror 3 tầng; error retry.

## Cắt / Thêm
- **Thêm:** route `content/modules/[moduleId]/page.tsx` + feature `ModulePage` (Hybrid C) · tiến độ
  module suy từ outline · module-header nav (title→trang, caret→toggle) ở ContentMap.
- **KHÔNG đụng search** (giữ module bucket — trang mới làm hết 404).
- **KHÔNG lặp:** không vẽ lại cây course (rail ContentMap lo) — trang module chỉ "module này +
  đang ở đâu" ([[course-home-no-duplicate-surfaces]]).

## Refs
- [[learn-home-surfaces-share-flat-chrome]] (content-home + personal-project-home = chuẩn chrome) ·
  [[three-tier-page-layout]] · [[course-home-no-duplicate-surfaces]] · [[one-progress-bar-at-a-time]] ·
  [[surface-lands-on-dashboard-no-auto-forward]] · [[status-icon-overrides-base]] ·
  [[trial-preview-enrollment-optional]]. Ngoài: Coursera module / Udemy section / Duolingo unit
  (module overview = progress + lesson list + resume).

## Bước sau
Thầy đã chốt: **Hybrid C · module header title→trang/caret→toggle · GIỮ module trong search**. →
`/starci-fe-ux-apply` để dựng. BE không cần query mới (dùng `module` + `myCourseOutline` sẵn có);
không migration; không đụng global search.
