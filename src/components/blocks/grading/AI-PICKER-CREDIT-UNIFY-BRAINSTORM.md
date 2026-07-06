# AI model-picker + credit — thống nhất toàn app (brainstorm 2026-07-06)

> Thầy: *"cái credit AI để đâu là hợp lý nhất?"* → *"thống nhất chung cho toàn bộ, nút không full-width thì sao"* →
> *"scan source tất cả phần có AI rồi nghĩ cách thống nhất. thêm 1 options nữa có ok không."*
> Scan bằng 2 Explore agent (không đoán).

## 0. Inventory THẬT (mọi surface AI, 2 agent scan)
| # | Surface | AI action | Picker | Credit hiện có | Lane | Nên có credit? |
|---|---|---|---|---|---|---|
| 1 | Challenge grading (`ChallengeSubmissionPanel/SubmissionRow`) | chấm bài | `GradeModelDropdown` | ✅ button, **CÙNG HÀNG** picker (`resolveGradeCreditDisplay`) | Auto (tốn) | ✅ có |
| 2 | Mock interview (`MockInterviewSession`) | chấm phỏng vấn | `GradeModelDropdown` | ✅ text, **DƯỚI** nút (`t("mockInterview.autoCredit")`) | Auto (tốn) | ✅ có (khác kiểu) |
| 3 | Personal-project grading (`GithubGradingSettings`) | chấm task | `GradeModelDropdown` | ❌ | Auto (tốn) | ✅ **GAP** |
| 4 | CV "AI viết giúp" (rewrite) | viết lại block | picker cha (CvEditor) | ❌ | Auto (tốn) | ✅ **GAP** |
| 5 | CV "Chỉnh theo JD" (tailor) | sửa CV theo JD | picker cha | ❌ | Auto (tốn) | ✅ **GAP** |
| 6 | CV "Dán CV" (split-from-text) | parse text→blocks | ❌ (luôn Auto) | ❌ | Auto (tốn) | ✅ **GAP** (subtle) |
| 7 | AiLab playground (`PromptPlayground`) | chạy prompt | **`LaneModelPicker`** ⚠️ (picker RIÊNG) | ❌ (chỉ nudge hết quota) | Auto (tốn) | ✅ **GAP** |
| 8 | Content AI chat (`ContentAiChat`) | chatbot | `GradeModelDropdown` (toggle nâng gói) | ❌ | **Free** | ❌ (free, không có gì hiện) |
| 9 | Content selection-ask (`ContentAiSelectionAsk`) | hỏi 1 đoạn | ❌ | ❌ | **Free** | ❌ |

**3 điểm lệch cần trị:**
1. **Credit render 2 kiểu, KHÔNG share** (challenge = button same-row · interview = text below). Chỉ challenge dùng `resolveGradeCreditDisplay`.
2. **2 PICKER khác nhau**: `GradeModelDropdown` (đa số) vs `LaneModelPicker` (AiLab-only). Gom credit vô nghĩa nếu picker chưa gom.
3. **5 surface tốn-credit nhưng KHÔNG hiện credit** (personal-project · CV rewrite/tailor/split · AiLab).

## 1. Nguyên tắc gốc (đã có, củng cố)
- Credit chỉ đúng cho **lane Tự động** (`credit-unified-pool-ui`) → phải bám PICKER, gate `!selection.model`. Chọn model trả phí → ẩn.
- Model picker = **control phụ** (`split-config-card-by-meaning-not-per-control`) → dưới CTA / de-emphasize.
- Free-lane (chat, selection-ask) = KHÔNG có credit (không tốn pool).

## 2. Cơ chế thống nhất — 3 TẦNG
**Tầng 1 — 1 PICKER duy nhất.** Khai tử `LaneModelPicker`; AiLab dùng `GradeModelDropdown`. (Prerequisite: không gom picker thì không gom credit. AiLab có param riêng system/user/temperature — giữ, chỉ thay phần chọn-model.)

**Tầng 2 — ★ Option D (cơ chế CHÍNH): credit = PROP của `GradeModelDropdown`.**
- Feature **query** `myAiQuota` → **truyền prop** `credit`/`quota` vào dropdown. Block **KHÔNG tự query** (giữ `credit-unified-pool-ui`: tránh bloat mọi caller — nhiều caller không cần credit vd chat free).
- Block **render** credit ở 1 chỗ chuẩn: **caption `body-xs muted` ngay DƯỚI trigger** (không nhét vào trong trigger — trigger giữ sạch). Gate Auto-lane + tông `text-warning` + link nâng gói khi thấp — **block lo hết** (nó đã biết `selection.model`).
- → **mọi surface có picker tự có credit GIỐNG HỆT, bất kể bề rộng nút.** Việc "đặt credit ở đâu" biến mất khỏi feature.

**Tầng 3 — Fallback `GradeCreditCaption` (block mới).** Chỗ Auto **không có picker** (CV split-from-text) → 1 caption dùng chung (cùng da tầng-2), đặt dưới CTA. Trích từ `resolveGradeCreditDisplay` (seed sẵn).

## 3. "Nút không full-width" — được giải triệt để
Vì credit là 1 phần của **cụm picker** (caption dưới trigger), KHÔNG dính nút → **nút rộng/hẹp/inline vô can** *by construction*. 3 layout context:
- **Setup card / CTA lớn** (interview, personal-project): picker(+credit dưới trigger) nằm **dưới CTA**.
- **Toolbar chật per-row** (challenge): picker(+credit) ở **hàng picker, trên nút** — vẫn là 1 khối.
- **Không picker** (CV split): `GradeCreditCaption` dưới CTA.

## 4. "Thêm 1 option" = D → RẤT NÊN
A/B/C (dưới nút / cạnh nút / cùng hàng) là "feature tự đặt" → mỗi chỗ 1 kiểu (đang bị). **D = credit trong picker** → 1 nguồn, 0 quyết-định-per-feature. A/B/C chỉ còn cho fallback không-picker. D là mức thống nhất cao nhất.

## 5. Chốt (chờ thầy) — 2 quyết định
1. **Policy hiện credit:** chỉ **Auto-lane tốn-credit** (challenge · interview · personal-project · CV rewrite/tailor/split · AiLab); **Free-lane KHÔNG** (chat · selection-ask). ✅?
2. **Khai tử `LaneModelPicker`** (gom AiLab về `GradeModelDropdown`, giữ param riêng) — làm cùng đợt hay tách?

## 6. Kế apply (khi thầy chốt)
1. `GradeModelDropdown`: thêm prop `credit?` (kiểu từ `resolveGradeCreditDisplay`) → render caption dưới trigger, gate Auto + warning.
2. Trích block `GradeCreditCaption` (fallback không-picker) từ `resolveGradeCreditDisplay`.
3. Fill 5 gap (truyền `credit` prop): personal-project · CV rewrite/tailor · AiLab; CV split dùng `GradeCreditCaption`.
4. Gom AiLab `LaneModelPicker` → `GradeModelDropdown`.
5. Bỏ credit hand-roll ở challenge (button same-row) + interview (text below) → dùng cơ chế chung.
6. Promote rule canonical (`concepts/` — từ `credit-unified-pool-ui`): "credit = prop của picker, block render, feature feed; free-lane không credit; nút-width vô can".
7. Verify tsc/eslint + JSON parity.

## Refs
- Point-of-action: [Magnific](https://www.magnific.com/ai/docs/ai-credits-and-limits) · persistent balance: [Figma AI credits](https://help.figma.com/hc/en-us/articles/33459875669015-How-AI-credits-work) · track-before-consume: [JetBrains](https://youtrack.jetbrains.com/projects/LLM/issues/LLM-16701).
