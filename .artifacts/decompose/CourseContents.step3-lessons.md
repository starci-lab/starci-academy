# CourseContents — STEP 3 (lessons) — kinh nghiệm build

Ngày: 2026-07-24 · Node cha: CourseContents · Nhánh: mtp

## 1. Bảng node

| Node | Kết quả | Action | File tạo/sửa | Note ngắn |
|---|---|---|---|---|
| ContinueCard | PASS | modified | `ContinueCard.tsx`, `ContinueCard.Plain.stories.tsx` | Thêm variant `plain` (item·hero·plain) + prop `eyebrow`. Biến-thể-chrome = thêm prop, không đẻ component mới. |
| ADD-STORY HighlightChip | PASS | built | `HighlightChip.tsx`, `HighlightChip.stories.tsx` | Port mới theo convention sibling StatusChip, title `Primitives/Chip/HighlightChip`. |
| ListRow REUSE-proof (LessonRow + NudgeRow) | PASS | modified (chỉ story, không sửa .tsx) | `ListRow.stories.tsx` | 2 story mới (AsLessonRow, AsNudgeRow) dựng thuần từ prop có sẵn của ListRow — không cần port LessonRow/NudgeRow riêng. |
| GithubTeamGateWarning (Callout reuse) | PASS | modified | `Callout.stories.tsx` | 1 story mới REUSE 100% Callout, đổi icon hand-roll → Phosphor `GithubLogoIcon` theo §5. |
| TrialConversionStrip | PASS | built | `TrialConversionStrip.tsx`, `TrialConversionStrip.stories.tsx` | Store-coupled (SWR + payment overlay state) → tách bản presentational props-only, compose từ IconTile/PriceTag/PhaseScarcityNote/Skeleton/Button có sẵn. |
| LearnBreadcrumb | PASS | reuse (không dựng gì mới) | `ResponsiveBreadcrumb.stories.tsx` (đã có sẵn) | Store-coupled feature đã có bản presentational port sẵn (ResponsiveBreadcrumb) — dùng lại, không port thêm. |

Tất cả 6 node đều **PASS** verify (`npx tsc --noEmit`), không có FAIL/BLOCKED. 2 lỗi lặp lại ở mọi lần verify (`.next/dev/types/validator.ts`, `.next/types/validator.ts` — thiếu module `rag-playground/page.js`) là lỗi build-artifact **tiền tồn**, không liên quan file các node tạo/sửa — đã ghi rõ theo từng node, không đánh false-PASS.

## 2. PATTERN tái dùng phát hiện — đề xuất bổ sung CANON (thầy chốt, chưa tự sửa `principles.md`)

1. **"Mọi row-list = ListRow + prop, không đẻ *Row riêng."** LessonRow và NudgeRow đều dựng xong 100% chỉ bằng prop có sẵn (`leading/title/subtitle/meta/trailing/onPress/href/divider`) của ListRow — không cần component mới. Đề xuất: bake thành ví dụ cụ thể trong §6b (biến-thể-chrome = prop) — hiện §6b nói nguyên tắc chung, chưa có case-study "list row family" để agent sau tra cứu nhanh thay vì tự suy luận lại.
2. **"Feature block store-coupled → LUÔN có (hoặc cần tạo) bản presentational song song trước khi vào Storybook."** Gặp 2 lần trong node này: TrialConversionStrip (chưa có bản presentational → phải tách mới) và LearnBreadcrumb (đã có sẵn ResponsiveBreadcrumb → chỉ reuse). Đề xuất: thêm mục checklist "trước khi build story cho 1 feature block, grep xem đã có bản presentational-twin chưa (tên khác nhưng cùng shape) trước khi tách mới" — tránh port trùng nếu lần sau có người khác không biết ResponsiveBreadcrumb đã tồn tại.
3. **"Icon hand-roll (`src/components/svg/*`) bị phát hiện khi port sang Callout — đổi sang Phosphor ngay tại chỗ."** GithubTeamGateWarning đổi `GithubIcon` hand-roll → `GithubLogoIcon` Phosphor. Đây là bằng chứng §5 (Phosphor-only) đang bị vi phạm rải rác trong `src/components/features/**` — đề xuất: cân nhắc audit riêng "hand-roll SVG icon còn sót trong src" (không thuộc phạm vi node này, chỉ nêu để thầy quyết có mở audit không).
4. **Biến-thể-chrome = thêm prop đã áp dụng nhất quán 2 lần trong step này** (ContinueCard `variant: item|hero|plain`, và ngầm định trong ListRow qua prop có sẵn) — không phát sinh case nào phải đẻ component song song. Củng cố thêm cho §6b, không cần sửa gì.

## 3. Gotcha convention (để lần sau nhanh)

- **JSX attribute string lồng dấu ngoặc kép**: JSX attribute dạng `attr="...\"..."` KHÔNG xử lý backslash-escape như JS string thường — phải bọc bằng expression container `{"...\"...\"..."}` khi cần dấu `"` lồng bên trong (gặp ở `ContinueCard.Plain.stories.tsx`, field `reason`/`note`).
- **Naming convention title Storybook không đồng nhất 100%**: đa số thin-wrapper quanh HeroUI Chip nằm ở `Primitives/Chip/*` (StatusChip, TagChips, HighlightChip), nhưng `DifficultyChip` lại là ngoại lệ nằm ở `Design/Chip/*` dù cùng shape wrapper — khi thêm chip mới, so khớp với **sibling wrapper trực tiếp** (không so với DifficultyChip) để chọn đúng tier title.
- **Store-coupled component KHÔNG render standalone trong Storybook**: đọc trực tiếp Redux (`LearnBreadcrumb`) hoặc SWR/Zustand overlay state (`TrialConversionStrip`) đều phải kiểm tra xem đã có/tự tách bản props-only trước khi viết story — grep trong `.storybook/stories/blocks/**` xem có twin cùng shape chưa (tiết kiệm công port lại).
- **Copy vi trong story phải khớp app thật**: lấy nguyên văn từ `src/messages/vi.json` (không tự viết lại câu) khi mô phỏng 1 feature block có sẵn trong app — tránh story "trông giống nhưng sai chữ".
- **Verify `tsc --noEmit` luôn có 2 lỗi nền tiền tồn cố định** (`.next/dev/types/validator.ts` + `.next/types/validator.ts`, module `rag-playground/page.js` không tìm thấy) — không phải do bất kỳ story nào trong repo `.storybook`, mọi agent verify xong nên so khớp đúng 2 dòng này để khỏi tưởng nhầm là lỗi của mình.

## 4. Việc còn lại (nêu, chưa làm)

- **Assembly story cho trang CourseContents thật** (ghép ContinueCard(plain) + HighlightChip + ListRow(as LessonRow/NudgeRow) + Callout(GithubTeamGateWarning) + TrialConversionStrip + ResponsiveBreadcrumb thành 1 layout hoàn chỉnh) cần **mock store** (redux course state, SWR price preview, payment overlay state, github team gate state) — ngoài phạm vi step 3, cần 1 node riêng kiểu "CourseContents.assembly" có decorator mock cho từng store trước khi ghép.
- **Chưa đụng trang thật** `/learn/content` (ContinuePanel hand-roll) — việc thay ContinuePanel bằng `ContinueCard variant="plain"` là bước sau, ngoài phạm vi các node trên (đã ghi rõ trong note ContinueCard).
- **Audit hand-roll SVG icon còn sót trong `src/components/features/**`** (phát hiện phụ khi làm GithubTeamGateWarning) — nêu để thầy quyết có mở audit riêng không, không tự mở trong step này.
- Không có node nào BLOCKED ở step 3 — không có việc "chờ port thiếu" tồn đọng.

Không git commit/push theo yêu cầu.
