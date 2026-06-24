# SubmissionResult — UX Brainstorm (2026-06-25)

Trang kết quả 1 requirement của challenge: `.../challenges/<id>/result?submission=<reqId>&attempt=<attemptId>`.

## REFINE cột PHẢI (brainstorm 2026-06-25, vòng 2) — header ấn tượng + findings TÁCH thẻ
Sau khi bỏ outer card, thầy: *"1 header ấn tượng hơn; các card tách nhau ra chứ không phải dính"*. → 2 việc:
1. **Verdict header ẤN TƯỢNG** (thay chip nhỏ + muted trơ): verdict là thông tin số-1 (đạt/chưa) → cho nó 1 khối nổi.
   - **Hướng A (đề xuất) — Verdict banner tint theo kết quả:** 1 banner `bg-{success|danger}` (đỏ=chưa đạt, xanh=đạt) + icon lớn (`CheckCircleIcon`/`XCircleIcon` ~32px) + status (h4) + điểm + "cần N để qua" + "Xem bài nộp"↗. Summary 1 dòng dưới banner. Ref: GitHub Actions check summary · Sentry issue header. Tint = đọc verdict trong 0.5s.
   - **Hướng B — Score hero:** điểm cỡ lớn (`0/100`, 36px) dẫn dắt + chip verdict + ngưỡng qua. Ref: LeetCode/exam result. (Hợp khi điểm là trục chính; nhưng ở đây verdict pass/fail quan trọng hơn số → A thắng.)
2. **Findings TÁCH thẻ (KHÔNG dính):** mỗi finding = **`FeedbackCard` BORDERED riêng** (KHÔNG frameless), cách nhau `gap-3` (KHÔNG còn inset list dính separator). Gom theo severity (eyebrow câm). → đảo lại quyết định "frameless inset" trước đó: thầy muốn các thẻ tách bạch (mỗi finding 1 bounded object), dễ quét + thoáng. `FeedbackCard` dùng lại variant **bordered mặc định** (bỏ frameless ở result page); modal vẫn bordered.
   - Hệ quả: gỡ inset list `rounded-2xl border` bao quanh; thay bằng `flex flex-col gap-3` chứa FeedbackCard bordered.

→ Cần thầy chốt **header A hay B**. Findings tách thẻ (gap-3) áp cho cả hai.

## Mục tiêu trang
Người học xem **bài nộp của mình đạt/chưa**, **vì sao** (findings theo ưu tiên), so sánh **các lần thử**, mở lại bài nộp. ≤30s: "lần này đạt chưa, sai gì, lần trước khác gì".

## Inventory (data THẬT, đọc từ component + hook)
| Khối | Field BE | Ghi chú |
|---|---|---|
| Lần thử (list) | `SubmissionAttemptEntity`: `attemptNumber · score · processedAt · submissionUrl · shortFeedback · id` | newest-first |
| Verdict | `score` vs `passThreshold * maxScore` (config + `requirement.score`) | đạt/chưa |
| Summary | `attempt.shortFeedback` | 1 dòng |
| Findings | `SubmissionFeedbackEntity`: `severity` (High/Med/Low) + FeedbackCard (src/location + suggestion) | gom theo severity |
| Identity | `requirement.title` (cần confirm field) | tên requirement đang chấm |

## Pain hiện tại (legacy = inventory)
- KHÔNG có identity: chỉ back-link trơ; không biết đang xem requirement nào.
- Label `uppercase` ("CÁC LẦN THỬ", "ƯU TIÊN CAO") → **vi phạm [[no-uppercase-text]]**.
- Lần thử = `<button>` ad-hoc (bordered card rời), KHÔNG ListBox.
- Detail bên phải **phẳng** (verdict/summary/findings float trên nền), không Card surface.

## CHỐT 2026-06-25 (thầy duyệt)
1. **PageHeader** (back-link "Quay lại thử thách" vào slot `breadcrumb` như ChallengeView) — title = `requirement.title`, meta tuỳ chọn.
2. **Bên trái = LIST PHẲNG, KHÔNG card** (thầy: *"list no card"*) — list các lần thử: row có selected-state (bg accent, rounded) nhưng **KHÔNG viền bao ngoài, KHÔNG surface card** quanh nhóm. Mỗi row clickable (selectionMode single → push `?attempt=`). KHÔNG button bordered ad-hoc, KHÔNG bọc ListBox trong bordered container.
3. **Bên phải = HƯỚNG A** — **1 Card surface gói trọn**, findings = **hàng inset** (severity pill + text + src + suggestion), separator inset giữa rows, KHÔNG card-in-card.

## IA mới (chốt)
```
PageHeader (gap-10 ↓)            breadcrumb=back-link · title=requirement.title · (meta?)
└─ content (2-col, gap-6)
   ├─ LEFT  list phẳng "Các lần thử"  (w~64, KHÔNG card/viền; rows: Lần thử N · score · verdict · time-ago; selected = bg accent rounded)
   └─ RIGHT Card surface (A)          verdict chip + score + time + "Xem bài nộp"↗ · shortFeedback · findings (hàng inset theo severity)
```

## 2 hướng cho BÊN PHẢI (findings) — điểm cần thầy chọn (xem widget)
- **A (đề xuất) — 1 Card surface gói trọn, finding = hàng inset.** Verdict header + summary + findings là **hàng có separator inset** trong 1 surface (severity pill + text + src + suggestion). KHÔNG card-in-card → 1 surface sạch. Ref: GitHub Actions run detail · code-review panel. *Trade-off:* phải tách FeedbackCard thành "row" (frameless) — đụng FeedbackCard dùng chung ở modal (cần variant frameless).
- **B — Card verdict + finding-cards rời (2 tầng).** Verdict/summary trong 1 surface card; findings giữ nguyên FeedbackCard (bordered) gom theo nhãn severity quiet bên dưới. *Trade-off:* "card trong vùng" nhiều khối hơn, nhưng KHÔNG đụng FeedbackCard (an toàn, ít blast radius). Ref: LeetCode submission detail.

→ **Đề xuất A** (đúng tinh thần thầy "bên phải là 1 Card surface"); nhưng nếu muốn giữ FeedbackCard nguyên (đỡ đụng modal) thì **B**. Cần thầy chốt A/B.

## Sửa kèm (mọi hướng)
- Bỏ `uppercase` ở label "Các lần thử" + severity → sentence-case + `text-xs text-muted` ([[no-uppercase-text]] + eyebrow câm).
- Severity nhãn dùng màu token (danger/warning/muted), không uppercase.
- ListBox: HeroUI `ListBox` (`@heroui/react`) — selectionMode single, selectedKeys = attempt hiện tại, onSelectionChange → router push `?attempt=`.
- Card surface bên phải: `<Card><CardContent>` (1 nấc surface). Findings (hướng A) = hàng inset (như CheckListCard nhưng giàu hơn: severity + src + suggestion).
- Empty/loading/error: giữ AsyncContent (attempts rỗng → empty "chưa có lần nộp"; findings rỗng → "không có góp ý" = đạt sạch); skeleton mirror ListBox rows + Card.
- a11y: ListBox có `aria-label`; verdict chip có nhãn đạt/chưa.

## States
- **Loading**: ListBox skeleton rows + Card skeleton (verdict line + 3 finding rows).
- **Empty attempts**: ListBox empty "Chưa có lần nộp nào".
- **Empty findings (đạt sạch)**: Card hiện verdict đạt + "Không có góp ý nào — bài nộp đạt yêu cầu".
- **Error**: retry per query (attempts / feedbacks).

## Cần confirm
- `requirement.title` có field không (để làm PageHeader title)? Nếu không → fallback "Kết quả nộp bài" + challenge title.
- Chọn **A hay B** cho findings (A đụng FeedbackCard → thêm variant frameless; B giữ nguyên).
