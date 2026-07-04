# Job-readiness score — mô hình + quyết định (2026-07-04)

## Bối cảnh chiến lược (thầy chốt)
Không phải chỉ 1 công thức điểm — mà là **profile-as-recruitment-asset** trong model "bán khóa + AI chấm".

**Flywheel:** Mua khóa → làm bài (AI chấm) → tín hiệu ĐÃ-VERIFY trên profile → recruiter match (talent marketplace `openToWorkUsers`/headhunting đã có) → bằng chứng outcome → bán thêm khóa. Profile = **cầu nối 2 dòng tiền** (khóa học + headhunting).

**Moat:** mọi metric AI-verify trên bài nộp thật → khác LinkedIn (skill tự-khai).

## Nguyên tắc chốt (thầy duyệt qua 2 vòng hỏi)
1. **Global trên profile**, KHÔNG course-scoped (đã bỏ trang `/learn/job-readiness` + sidebar + route em dựng nhầm vòng đầu). Job-readiness là thuộc tính của CON NGƯỜI.
2. **Portfolio theo track, CỘNG DỒN — KHÔNG trung bình pha loãng:**
   - **1 khóa = 1 track verify** → profile hợp lệ ngay (chính đáng mua 1 khóa).
   - **+1 khóa = +1 track** (breadth) → không bao giờ làm tụt track cũ (chính đáng mua thêm).
3. **Có trọng số** (không trung bình đều).
4. **Public cho recruiter ngay** (`userJobReadiness(userId)`, tôn trọng `profileLocked`).

## Công thức (đã cài BE `JobReadinessService`)
| Chiều | Tín hiệu | Nguồn thật | Phạm vi |
|---|---|---|---|
| **Depth/track** | 60% capstone% + 40% phỏng vấn TB | `UserMilestoneTaskAttempt.passed` · `MockInterviewAttempt.overallScore` | theo khóa (PAID enrollment) |
| **Nền tảng** | CV score · challenge percentile | `cv_submission_attempts` · `getChallengeStrength` | global |

```
base       = MAX(depth mỗi track)                       ← track mạnh nhất dẫn → 1 khóa vẫn cao
breadthBonus = min(15, (qualifiedTracks − 1) × 5)       ← khóa 2,3 CỘNG điểm, không pha loãng
foundation = (cv?? 0 + challenge?? 0) / 2               ← thiếu = 0 (động lực hoàn thiện)
composite  = clamp( base×0.7 + foundation×0.3 + breadthBonus, 0..100 )
band       = ≥70 jobReady · ≥40 building · else needsWork
```
Trọng số/ngưỡng = constants (`constants/bands.ts`), chỉnh dễ. Track chỉ tính từ **PAID enrollment** (`is_enrolled=true`) — trial không tạo track hireable.

## Kiến trúc code
**BE** (`queries/users/job-readiness/`): 1 `JobReadinessService.compute({userId})` (global aggregate, ~5 grouped query) → 2 resolver: `myJobReadiness` (self, auth-only) + `userJobReadiness(userId)` (public, optional-auth + `GraphQLProfileVisibilityGuard`, mirror `userChallengeStrength`). Response = composite + band + cv + challenge + `tracks[]`.

**FE:** `OverviewJobReadiness` (self-fetch `useProfileUsername → userProfile → userId → useQueryUserJobReadinessSwr(userId)`) = section ĐẦU của `ProfileOverviewTab` (headline recruiter metric): composite hero + band chip + dòng "AI-verified" (SealCheck) + 2 nền tảng (CV·challenge meter) + track badges (mỗi khóa, link `course(displayId)`, depth chip). Dùng `userJobReadiness(userId)` cho CẢ self lẫn public (profile addressed by userId).

## Còn nợ / ý sau
- **Dashboard self-widget** (`myJobReadiness` — resolver đã có, chưa gắn UI). CTA "hoàn thiện trụ còn thiếu" hợp cho self-view (growth loop) — chưa làm (profile card giữ neutral "Chưa có" cho public).
- **Recruiter filter/rank** theo track + composite ở talent marketplace (data đã đủ, chưa build filter UI).
- **Chưa chạy dev server / test tay** (brief cấm dev server suốt phiên) — verify mới ở tsc/eslint/JSON. BE cần migration mock-interview + restart để `mock_interview_attempts` tồn tại runtime.
- Interview pillar hiện avg TẤT CẢ attempt/khóa (không cửa sổ recent) — cân nhắc recent-N nếu muốn phản ánh tiến bộ.

## Verify (2026-07-04)
BE `tsc` = baseline giữ nguyên (0 lỗi mới) · BE eslint module = 0 · FE `tsc` = 0 repo-wide · FE eslint mọi file = 0 · JSON vi/en OK. Git 2 repo chỉ đụng vùng job-readiness.
