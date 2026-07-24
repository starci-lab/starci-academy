# Decompose (audit): CourseContents — trang `/learn/content` — CÂY LÝ TƯỞNG (top-down)

> Step 1 = vẽ cây nên-có từ source + tư duy hoàn thiện. Không đánh dấu có/thiếu/drift — để step sau.
> Nguồn hiểu biz: `src/components/features/learn/CourseContents/index.tsx` (383) + `LearnNudges` + `TrialConversionStrip`. Pull FE @ `1783ee63`.

## Feature là gì (1 câu)
**Dashboard nhà của khoá** (`/learn/content`) — không vẽ lại cây module (cây ở content-map rail trái); chỉ hiện **"bạn đang ở đâu + bước tiếp theo"**: header khoá → tiếp tục + tiến độ → đường "keep going" của module hiện tại. Xen kẽ vài strip theo trạng thái viewer (trial, GitHub team, nudges).

## Cấu trúc trang
**1 LAYOUT, 1 LEAF** — trang KHÔNG switch view. `AsyncContent` bọc ngoài → states **loading(skeleton) · empty · error(retry) · content**. Nhiều block **tự ẩn** theo data (trial/paid, tiến độ) → cùng cấu trúc, khác nội dung = **STATE**, không phải leaf.

## CÂY
```
PAGE  CourseContents  (/learn/content)          async: loading · empty · error · content
│  (max-w-3xl, header gap-10 · cluster gap-6)
└─ LEAF · Content home (dashboard)              [1 leaf duy nhất — không view-switch]
   ├─ BLOCK PageHeader                          states: có-meta · không-meta
   │    ├─ DESIGN LearnBreadcrumb
   │    ├─ DESIGN HighlightChip ×3   (chương · ~giờ · học viên — learners tự ẩn nếu 0)
   │    └─ PRIMITIVE Typography (title · description)
   ├─ BLOCK GithubTeamGate                      states: ẩn · cảnh báo (paid chưa vào team)
   ├─ BLOCK TrialConversionStrip                states: ẩn(paid) · loading(giá) · hiện(trial)
   │    ├─ DESIGN IconTile · PriceTag · PhaseScarcityNote
   │    └─ PRIMITIVE Button(enroll → PaymentModal) · Skeleton
   ├─ BLOCK ContinuePanel                       states: có-resume · capstone-resume · hết-bài(no CTA)
   │    ├─ DESIGN ProgressMeter
   │    └─ PRIMITIVE Typography(eyebrow · title · stat) · Button(resume)
   ├─ BLOCK LearnNudges                         states: ẩn(all 0) · loading · có-nudge
   │    ├─ DESIGN NudgeRow  (thẻ đến hạn · phỏng vấn capstone · hạng)
   │    └─ PRIMITIVE SurfaceListCard · Skeleton
   └─ BLOCK KeepGoingPath                       states: có-module · ẩn(không module)
        └─ DESIGN LessonRow  (leading Play/Check/Circle · title · phút đọc · DifficultyChip · Lock)
           PRIMITIVE ListRow
```

## Ghi chú tư duy xây app (chỗ HOÀN THIỆN)
1. **Không bịa thêm leaf** — trang này THẬT SỰ 1 leaf (dashboard). Không phải trang nào cũng nhiều leaf; ép view-switch vào đây là sai. Đây là ca đối chứng với chat drawer (5 leaf).
2. **Empty state nên giàu hơn** — hiện `emptyContent={{title}}` chỉ 1 dòng khi khoá chưa có bài. Nên EmptyContent đủ (icon `Stack` + hint + CTA về catalog).
3. **Tách `NudgeRow` / `LessonRow` thành DESIGN riêng** — mỗi hàng có vai dữ liệu (icon-trạng-thái · label · href / difficulty · lock), không để block tự vẽ inline (§6c).
4. **State "hết bài" (all-done)** — ContinuePanel khi `!resumeHref`: đổi eyebrow, ẩn CTA, meter 100%. Vẽ đủ để step dựng không quên.

## Câu hỏi chờ thầy
- Đồng ý trang này **1 leaf** (dashboard), các strip tự-ẩn = state chứ không phải leaf riêng?
- Empty/error có muốn nâng thành block đầy đủ không, hay giữ AsyncContent mặc định?
