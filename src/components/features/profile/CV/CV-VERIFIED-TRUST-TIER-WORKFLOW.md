# WORKFLOW — CV "Trust-tier": phân tầng TÍN HIỆU TIN CẬY (verified vs tự-khai), KHÔNG chặn liên hệ

> Quyết định chốt (thầy, 2026-07-05): **Hướng A**. Nối tiếp chuỗi brainstorm CV (V1→V3 + phân tích tâm lý + monetization). Đây là SPEC để triển khai sau — chưa code.
> Repo: BE `D:\Repositories\starci-academy-backend` · FE `D:\Repositories\starci-academy` (branch `mtp`).

## 0. Vì sao hướng này (context để không phải nghĩ lại)
- **Vấn đề:** một free user giỏi (chưa học/chưa mua) có thể **upload CV ngoài → chấm ≥70 → mở liên hệ nhà tuyển dụng (NTD) → 0 đồng, 0 học**. Với StarCi, đây là cho không đúng thứ đáng bán, vì **KHÔNG có doanh thu phía employer** (chợ NTD hiện candidate-side, `HeadhuntingCompanyEntity` không có billing).
- **Vì sao KHÔNG hard-gate (bắt enroll/trả tiền mới được liên hệ):** research tâm lý — chặn "hồ sơ nghề nghiệp của chính bạn" = đánh trúng nỗi "mất kiểm soát" của người tìm việc → lo âu, phản brand "prove it"; và gate cứng TRƯỚC aha giết activation.
- **Cái đáng bán KHÔNG phải ACCESS mà là TRUST:** 91% NTD tìm "credential đã xác thực"; verified >> tự-khai ([virtualbadge](https://www.virtualbadge.io/blog-articles/credential-transparency-for-hr-verify-skills-fast) · [accredible](https://www.accredible.com/blog/find-verified-professionals-faster-the-new-way-to-source-and-trust-skills)). Toptal/Turing/Arc bán đúng con dấu vetting này.
- **→ Hướng A:** giữ liên hệ MỞ (ai ≥70 cũng liên hệ được), nhưng **phân tầng tín hiệu tin cậy** + **xếp hạng** chợ NTD. Free-giỏi vẫn liên hệ được nhưng hiện "chưa xác thực" + rank thấp → muốn được tin → tự nguyện học. Bán CREDIBILITY, không bán access.

## 1. Nguyên tắc (STRICT)
- **KHÔNG đụng `ConsultantContactGateService` (giữ gate liên hệ = `bestCvScore >= 70`).** Đây là điểm mạnh của hướng A: **không đảo quyết định score-only đã khóa test** → rủi ro thấp, chỉ THÊM lớp trust/ranking, không sửa gate.
- **"Verified" gắn vào ENGAGEMENT thật, KHÔNG gắn payment.** Một CV/ứng viên là "StarCi xác thực" khi có **hoạt động StarCi thật đứng sau** (capstone/challenge/coding), không phải vì đã trả tiền. Đúng brand + đúng fairness-axiom (tín hiệu theo việc-làm-thật, không theo count/tiền).
- **Free-giỏi KHÔNG bị chặn** — chỉ hiển thị "Tự khai" + xếp sau verified. Đây là SOFT (desire, không pressure). Nếu sau muốn HARD-plug luôn (upload không mở được contact) → đó là "Hướng B", ghi ở §6 như tùy chọn thêm.

## 2. Định nghĩa "Verified" — CẦN THẦY CHỐT NGƯỠNG
Một `cv_generations` row (hoặc ứng viên) đạt **verified** khi thỏa (đề xuất, thầy chỉnh số):
- `source = generated` (CV dựng từ hoạt động StarCi, không phải upload ngoài), **VÀ**
- có tối thiểu hoạt động thật đứng sau, ví dụ: **≥1 capstone/milestone task đã chấm đạt** HOẶC **≥N challenge submission đạt** (N do thầy chọn, gợi ý 3).
- CV `source = uploaded` → **luôn = "tự khai" (self-reported)**, dù điểm cao.
- Có thể làm **2 mức** thay vì nhị phân: `self_reported` (upload) · `activity_backed` (generated có hoạt động) · (tùy chọn mức 3) `capstone_verified` (có capstone đạt) — hiển thị huy hiệu khác nhau. Thầy chọn 2 hay 3 mức.

> ⚠️ Quyết định mở: "verified" tính per-CV hay per-user? Đề xuất **per-user** (ứng viên verified nếu CÓ ít nhất 1 CV activity-backed + hoạt động nền) vì chợ NTD list theo user, không theo từng CV.

## 3. BE — việc cần làm (repo `starci-academy-backend`)
| # | Việc | File/vùng (đã grounded) |
|---|---|---|
| B1 | **Tính `verificationLevel`** cho ứng viên: đọc `source` của CV + `milestoneTaskAttempts`/`challengeSubmissions` (đã có trong gather step của generate-cv) → suy `self_reported` / `activity_backed` / `capstone_verified`. Tách 1 service dùng chung (vd `CvVerificationService`) để cả chợ NTD lẫn CV page đọc 1 nguồn. | `src/modules/bussiness/headhuntings/` (cạnh `consultant-contact-gate.service.ts`) |
| B2 | **`talentCandidates` xếp hạng verified LÊN TRÊN**: sort key hiện theo track/job-readiness depth → thêm `verificationLevel` làm tie-break/booster (verified rank cao hơn self-reported cùng mức depth). KHÔNG loại self-reported khỏi list — chỉ xếp sau. | resolver/service của `talentCandidates` (recruiter marketplace, commit "recruiter marketplace filter+rank by track") |
| B3 | **Expose field** `verificationLevel` (enum) + `isVerified` (bool) trên: candidate list item của `talentCandidates`, và trên `CvGenerationPayload`/`CvGenerationListItem` (để CV page biết CV này verified chưa). | các GraphQL response types tương ứng |
| B4 | **KHÔNG đụng** `ConsultantContactGateService` / gate ≥70 / test của nó. | (giữ nguyên) |
| B5 | (nếu 2-3 mức) enum `CvVerificationLevel` + (tùy) cột denormalize nếu tính nặng; hoặc tính on-the-fly nếu rẻ. | `src/modules/databases/.../enums` |

## 4. FE — việc cần làm (repo `starci-academy`)
| # | Việc | File/vùng |
|---|---|---|
| F1 | **Chợ NTD / talent list:** mỗi ứng viên hiện huy hiệu `✓ StarCi xác thực` (verified) vs `Tự khai` (self-reported, muted); verified sort lên trên (BE đã trả đúng thứ tự, FE chỉ render badge + giữ order). Dùng HeroUI `Chip` (`bg-success/10 text-success` cho verified · muted cho tự-khai — [[elements/chip]]). | features chợ NTD / talent (owner của `talentCandidates` view) |
| F2 | **CV page — nudge trên CV "tự khai":** khi CV đang xem `source = uploaded` (hoặc chưa activity-backed), hiện 1 dải mềm (block `Callout`/`Alert` status accent, [[elements/alert]]) dưới score-hero: *"CV này chưa được StarCi xác thực. Làm capstone/challenge để được NTD tin tưởng + xếp hạng cao hơn."* + link tới học (xem F3). KHÔNG chặn gì, chỉ nudge. | `CvScorecard` (score-hero area) hoặc `CvWorkspace` |
| F3 | **Link "học để verify" đi đâu** (quyết định ở §5): chưa enroll → catalog `/courses`; đã enroll còn capstone dở → về khóa đó. | reuse `pathConfig` |
| F4 | **Trên chip chọn CV / CV detail:** hiện mức verified của từng CV (huy hiệu nhỏ) để user thấy CV nào "mạnh" với NTD. | `CvWorkspace` dial / `CvScorecard` |

## 5. Quyết định ĐÃ CHỐT (2026-07-05, để BE làm luôn — UX sau)
1. **Ngưỡng "verified" = theo ACTIVITY thật, per-user, KHÔNG gắn payment:**
   - `capstone_verified`: user có **≥1 milestone/capstone task attempt ĐẠT**.
   - `activity_backed`: user có **≥1 challenge submission ĐẠT** (nhưng chưa capstone).
   - `self_reported`: không có gì ở trên (vd chỉ upload CV ngoài).
2. **3 mức** (self_reported / activity_backed / capstone_verified).
3. **per-user** — verification là về việc user ĐÃ LÀM ở StarCi, không theo từng CV artifact. CV `source` chỉ dùng cho nudge FE (§4 F2).
4. **Link nudge F3** — UX/UI làm sau, BE không đụng.
5. **KHÔNG hard-plug (Hướng B)** — A thuần: giữ gate liên hệ `bestCvScore >= 70` MỞ, chỉ thêm lớp verified + ranking.

## 6. Tùy chọn thêm — Hướng B (hard-plug, nếu A thuần chưa đủ)
- Nếu sau này thấy free-giỏi vẫn "lách" nhiều: cho **liên hệ NTD chỉ mở từ CV activity-backed** (upload chấm + góp ý free nhưng không tự mở contact). Đây MỚI là chỗ đụng gate → cân nhắc kỹ (đảo quyết định score-only, cần sửa `ConsultantContactGateService` + test). **Chưa làm trong A**; ghi để dành.

## 6b. ĐÃ LÀM — BE (2026-07-05, branch mtp `starci-academy-backend`)
- **Enum** `CvVerificationLevel` (`self_reported`/`activity_backed`/`capstone_verified`) + GraphQL registration — `src/modules/databases/postgresql/primary/enums/cv-verification-level.ts` (export ở enums/index).
- **`CvVerificationService`** (`src/modules/bussiness/headhuntings/`) — `resolveLevels({userIds})` (batch, 2 probe: passed-capstone / graded-challenge) + `resolveLevel(userId)` + `rankOf(level)`. Signal CLEAN, per-user, KHÔNG payment: capstone = `user_milestone_task_attempts.passed=true`; activity = challenge attempt có `score IS NOT NULL` (challenge không có cột `passed`). Provider + export ở `headhuntings.module` (global qua bussiness.module → inject ở đâu cũng được).
- **`talentCandidates`** — gắn `verificationLevel` vào mỗi candidate + expose field GraphQL trên `TalentCandidateItem`; **secondary sort**: depth DESC (primary, giữ fairness), tie → verification rank DESC (capstone > activity > self). `TalentCandidatesService` inject `CvVerificationService`, thêm `resolveLevels` vào Promise.all batch.
- **Test:** `cv-verification.service.spec` 8/8 pass; `talent-candidates.service.spec` cập nhật (mock service mới) + thêm test tiebreak → 4/4 pass. tsc: 0 lỗi mới (baseline 236 giữ nguyên). Lint sạch mọi file đụng.
- **KHÔNG đụng** `ConsultantContactGateService`/gate ≥70/test của nó (đúng A thuần).

### ⚠️ Ghi chú quan trọng (đọc trước khi kỳ vọng): BE-A làm được gì / KHÔNG làm được gì
- **`talentCandidates` (chợ NTD list ứng viên) VỐN ĐÃ enrollment-gated** (`isEnrolled=true`) → free user KHÔNG nằm trong list này. Nên `verificationLevel` ở đây **thưởng độ sâu trong pool ĐÃ trả tiền** (capstone-verified nổi trên enrolled-nhưng-chưa-làm-gì), + đặt nền cho badge recruiter-facing. Đây là giá trị thật của A.
- **KHÔNG plug được kịch bản "free-giỏi cold-contact NTD"** (surface `ConsultantContactGateService`, gate score-only) — A thuần cố ý giữ gate MỞ. Muốn chặn đường đó = **Hướng B** (§6, chưa làm, cần thầy duyệt vì đảo test-locked). Nhưng lưu ý: free user chỉ **PUSH** được (chủ động liên hệ NTD), KHÔNG bị **PULL** (không xuất hiện trong pool NTD duyệt) → thiệt hại free-rider vốn đã hạn chế sẵn.
- FE (badge verified + nudge CV "tự khai") = §4, làm sau (UX/UI).

## 7. Cái ĐÃ đúng sẵn, đừng đụng
- Gate liên hệ `bestCvScore >= 70` (count-independent) — đúng fairness-axiom, giữ.
- CV tool free cho mọi user đăng nhập — đúng activation/brand, giữ.
- Ngưỡng 70 hiển thị "cần thêm N điểm" — earned-unlock tốt, giữ.

## Nguồn
- Tâm lý: [Endowed progress / earned unlock](https://learningloop.io/plays/psychology/unlock-features) · [Freemium gate — desire not pressure / activation-first](https://www.stackmatix.com/blog/freemium-to-paid-conversion) · [Job-search anxiety = mất kiểm soát](https://careerservices.upenn.edu/blog/2026/06/23/8-strategies-for-overcoming-job-search-anxiety/)
- Marketplace: [Toptal/Turing/Arc — employer pays, candidate free, vetting = value](https://arc.dev/employer-blog/toptal-turing-gigster-arc/)
- Verified credential: [91% NTD tìm verified](https://www.virtualbadge.io/blog-articles/credential-transparency-for-hr-verify-skills-fast) · [verified >> self-reported](https://www.accredible.com/blog/find-verified-professionals-faster-the-new-way-to-source-and-trust-skills)
- Nội bộ: `fair-monetization-axiom` (Entitlement layer) · `consultant-contact-gate.service.ts` (gate score-only, giữ) · brainstorm chuỗi `CV/UX-BRAINSTORM*.md`.
