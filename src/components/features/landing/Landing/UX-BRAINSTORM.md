# Landing Page — UX Brainstorm (2026-06-18)

> Output của `/ux-brainstorm`. KHÔNG code. Thầy duyệt hướng → `/ux-apply`.
> Trang: `src/components/layouts/marketing/LandingPage/` (route `/` và `/home`).

---

## 1. Mục tiêu trang (≤30s)

Khách lạ vào → trong 30s phải hiểu **StarCi khác bootcamp ở đâu** và **làm gì tiếp theo**.
Hiện tại trang TRẢ LỜI bằng *lời* (9 section manifesto) chứ không bằng *bằng chứng*. Mục tiêu mới:
**show, don't tell** — mỗi tuyên bố phải dựa trên DATA THẬT đã có trong BE, và chỉ có **1 primary action**.

Hai đối tượng (giữ, nhưng phân tầng rõ):
- **B2C — dev muốn lên trình & được headhunt** (primary, ~90% traffic).
- **B2B — recruiter muốn tuyển dev đã vetted** (secondary, 1 lối rẽ rõ ràng, KHÔNG chiếm nửa trang).

---

## 2. Audit trang hiện tại (chỉ để biết CÓ GÌ + điểm đau)

**Đang có (11 section):** Hero · ProofStrip · Trap · RealityCheck · Manifesto · Contrast · Methodology · Ambition · Outcome · CourseCatalog · Faq.

**Điểm đau (UX):**
1. **Wall of manifesto, 0 bằng chứng.** 10/11 section hardcoded; chỉ `CourseCatalog` có data thật. Trap/RealityCheck/Contrast/Manifesto/Ambition đều là *lời khẳng định* không có proof.
2. **Claim không chứng minh được.** "AI chấm 24/7" → demo là **skeleton giả** ("Analyzing Architecture..."). "Headhunt thẳng" → 0 con số, 0 logo, 0 talent. "Leaderboard khốc liệt" → không link, không sample.
3. **Asset vỡ.** RealityCheck có `imagePrompt` nhưng **không render ảnh** (chỉ icon placeholder). Manifesto **thiếu ảnh founder** (`/founder.jpg` TODO) → mất đòn "founder-led".
4. **Không có 1 primary CTA.** 6+ CTA rải rác; Hero "Xem lộ trình" vs Closing "Xem khóa học" trùng đích nhưng khác chữ; **không có nút Sign Up** ở đâu cả → khách mới không có cửa vào tài khoản.
5. **Vanity > proof.** ContrastSection đánh "nơi khác" ẩn danh = strawman, toothless. Ambition toàn pillar mô tả tính năng, không link tới feature thật.
6. **Bỏ phí data mạnh nhất** (xem §5): `pricingPhases.soldCount/capacity` (khan hiếm THẬT), `openToWorkUsers` (proof recruiter THẬT), `blogPosts` (founder viết thật), `enrollmentCount` aggregate.

---

## 3. Information Architecture MỚI (chốt)

Cắt 11 → **8 beat**, mỗi beat 1 nhiệm vụ, mỗi claim 1 proof:

| # | Section | Job | Primary? |
|---|---------|-----|----------|
| 1 | **Hero** | Value prop sắc + **1 primary CTA** ("Xem lộ trình") + 1 secondary ("Đăng nhập"/recruiter). Bỏ diagram giả → live stat strip. | ⭐ CTA chính |
| 2 | **Live proof strip** | Số THẬT: N learner · N bài học · N khóa · N huy hiệu. Thay ProofStrip hand-wavy. | |
| 3 | **The wedge — "Học thật" = Challenge + AI chấm** | Gộp Trap+RealityCheck+Methodology thành 1 beat. Show **challenge thật + feedback AI thật** (KHÔNG skeleton giả). Đây là điểm khác biệt. | |
| 4 | **Lộ trình 4 tuyến** | Ladder Fullstack→DevOps→Security→SA, mỗi tuyến map khóa thật. | |
| 5 | **Founder beat (nén)** | 1 block manifesto + **ảnh founder thật** + link GitHub + link `/blog` (build-in-public = proof founder ship thật). Thay Manifesto+Ambition. | |
| 6 | **Course catalog** | Section live (giữ). Thêm **khan hiếm thật** (Pioneer còn N slot từ soldCount/capacity) + enrollmentCount. Bề mặt convert chính. | ⭐ Convert |
| 7 | **Two-sided outcome** | Dev được headhunt / Company tuyển. Side recruiter backed bằng **`openToWorkUsers` thật** ("N dev đang open-to-work" + avatar) → link talent directory. | Lối rẽ B2B |
| 8 | **FAQ (tỉa) + Final CTA** | Objection-handling gọn + CTA mạnh neo giá/khan hiếm. | ⭐ CTA chính (lặp) |

**CẮT:** ContrastSection (strawman ẩn danh) · AI skeleton giả · RealityCheck illustrations vỡ · Ambition pillar vanity (fold cái thật — leaderboard, AI mentor — vào beat #3).

---

## 4. Ba hướng đã cân + hướng chốt

### Hướng A — "Show the machine" (proof-first, learner-first)
Dẫn bằng **sản phẩm thật**: catalog + engine challenge/AI show live + số enrollment thật + giá khan hiếm thật. Manifesto nén còn 1 strip. 1 primary CTA = vào lộ trình/khóa.
- ✅ Sửa đúng bệnh gốc (claim → proof), convert rõ, dùng đúng data đang bỏ phí.
- ⚠️ Hạ "chất văn" founder — vốn là 1 tài sản brand.

### Hướng B — "Manifesto founder-led" (editorial, story-first)
Giữ mạch kể chuyện founder làm xương sống, nhưng **mỗi đoạn ghép 1 bằng chứng thật** + ảnh founder + blog.
- ✅ Giữ giọng brand máu lửa, khác biệt cảm xúc.
- ⚠️ Convert vẫn mềm; rủi ro lặp lại bệnh "dài & ít proof" nếu không kỷ luật.

### Hướng C — "Two-sided marketplace" (dev + recruiter ngang hàng)
Tách đôi rõ: dev học & được tuyển / company tuyển talent đã vetted. Wedge = headhunt + `openToWorkUsers`.
- ✅ Khai thác đòn độc nhất (talent directory thật).
- ⚠️ B2B traffic còn nhỏ; chia đôi trang làm loãng message cho 90% là dev.

### ✅ CHỐT: **A có ghép 1 nhịp B** — "Show the machine, keep the voice"
Lý do: bệnh gốc của trang là **claim không proof + CTA mù** → A chữa đúng. Nhưng giọng founder là tài sản thật và `/blog` chứng minh được → giữ **đúng 1 beat** founder (nén, có ảnh + link blog) thay vì 4 section. C (recruiter) **không lên ngang hàng** — chỉ là **1 lối rẽ** ở beat #7 (backed bằng `openToWorkUsers` thật) để không loãng message dev.

---

## 5. Bảng Section → Dữ liệu BE/DB

| Section | Query / Field THẬT | Auth | Ghi chú |
|---------|--------------------|------|---------|
| Hero stat strip | **MỚI** `platformStats` (count users / enrollments / contents / user_achievements) | public | Cần thêm 1 query aggregate public (xem §6). Hoặc tạm derive. |
| Live proof strip | như trên + `blogPosts` count | public | |
| Wedge (Challenge+AI) | `publicContent` (lesson free thật) · sample challenge · `systemConfig.challenge.passThreshold` | public | Show feedback AI THẬT, bỏ skeleton giả. Có thể seed 1 sample tĩnh từ data thật. |
| Lộ trình 4 tuyến | `courses` (title, coverImageUrl, slug, description) | public | Group theo track. |
| Founder beat | i18n `contact.founder.*` · `FOUNDER_GITHUB` · `blogPosts` (build-in-public) | public | **Cần ảnh founder thật** (asset, không phải BE). |
| Course catalog | `courses` → `enrollmentCount`, `originalPrice/Usd`, **`pricingPhases{tier,price,capacity,soldCount,discount}`**, `valuePropositions` | public | **soldCount/capacity = khan hiếm THẬT** (đang bỏ phí). |
| Two-sided / recruiter | **`openToWorkUsers`** (username, avatar, displayName, roleTitle, bio) | optional | "N dev đang open-to-work" + avatar grid → link talent dir. **Đang bỏ phí.** |
| FAQ | `course.qnas` (nếu muốn động) hoặc giữ i18n | public | |

**Field CÓ nhưng CHƯA dùng (cơ hội):** `pricingPhases.soldCount/capacity` (urgency), `openToWorkUsers` (recruiter proof), `blogPosts` (founder credibility), `enrollmentCount` aggregate, `achievement.rarityPercent`.

**KHÔNG có (đừng vẽ UI cho nó):** bảng review/rating/testimonial → **không bịa "★4.9 từ 2000 học viên"**. Social proof phải lấy từ con số thật (enrollment, badge, open-to-work) chứ không phải testimonial giả.

---

## 6. BE cần thêm (flag cho `/ux-apply` → có thể cần BE)
1. `platformStats` — 1 public query trả count: learners (enrollments distinct user), lessons (contents), courses, badges earned. (Dễ; có sẵn projection.)
2. (Optional) `openToWorkUsers` đã public → chỉ cần FE gọi + 1 count.
3. (Optional) 1 sample challenge + AI feedback thật để show ở beat #3 (hoặc seed tĩnh từ data thật, không hardcode bịa).

---

## 7. Empty / Loading / Error / A11y (tính từ đầu)
- **Stat strip:** loading = skeleton số; nếu query fail → **ẩn cả strip** (đừng show "0 learners" — phản tác dụng). Không bao giờ hiện số 0 như proof.
- **Course catalog:** đã có skeleton/error/empty (giữ). Empty-search giữ.
- **openToWork grid:** nếu < ngưỡng (vd <6 dev) → ẩn count, chỉ show CTA "Trở thành đối tác".
- **Hero diagram:** nếu giữ visual → thêm `alt`/aria-label mô tả; jargon eyebrow cần text thật, không chỉ trang trí.
- **CTA:** 1 primary nổi bật (filled), secondary outline; focus ring rõ; thứ tự tab hợp lý.

---

## 8. Tóm tắt điều CẮT / THÊM
- **Cắt:** ContrastSection · AI skeleton giả · RealityCheck illustration vỡ · Ambition vanity pillars · gộp Trap+RealityCheck+Methodology → 1.
- **Thêm:** live stat strip (số thật) · challenge+AI demo THẬT · khan hiếm Pioneer (soldCount/capacity) · recruiter proof (openToWorkUsers) · founder photo + link blog · 1 primary CTA + Sign Up rõ ràng.
