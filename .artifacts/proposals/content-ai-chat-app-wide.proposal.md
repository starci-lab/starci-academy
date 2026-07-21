# Proposal — Content-AI Chat: app-wide (trong khóa) + context pill, retrieval-only, no slash

> Status: ⏳ PENDING · brainstorm 2026-07-19, **xoay hướng 2026-07-20** sau phân tích business + 4 vòng chốt với thầy · `/starci-fe-layout` (không build)

## 0. Chốt định hướng (thầy đã quyết qua đối thoại)

1. **Scope = "trong 1 khóa"** (không platform-wide). Chat mở ở mọi tab của `learn/` shell; vẫn có `enrollmentId`.
2. **Skills = CHỈ retrieval RAG.** BỎ mọi hướng generative (KHÔNG `/quiz` tạo thẻ, KHÔNG digest "tóm tắt
   tiến độ", KHÔNG action-card sinh nội dung). Lý do business ở §1.
3. **BỎ SLASH `/` hoàn toàn.** Skills gọi bằng **chip theo ngữ cảnh + ngôn ngữ tự nhiên** (`detectContentIntent`
   đã có sẵn). Lý do ở §2.
4. **`/summarize`·`/explain`·`/example` KHÔNG phải skill** — chúng chỉ là câu-hỏi-mồi, lesson-context. Về làm
   **chip empty-state** (chỉ hiện khi context = bài đang đọc), không nằm trong grammar lệnh.
5. **THÊM context pill** ⭐ (thầy đề xuất): pill hiện rõ AI đang neo vào đâu, **mặc định = bài đang đọc** khi ở
   tab Đọc bài, đổi được sang cả khóa.

## 1. Phân tích business — vì sao retrieval-only (grounded, không nói mồm)

Đọc `AiEntitlementService` + `ask-content-ai.handler.ts`: có **2 loại skill kinh tế trái ngược**:

| | Chạy thật | Chi phí/lần | Dẫn đi đâu? |
|---|---|---|---|
| **Retrieval (`/find`)** | `searchCourseContent` → 1 embedding (local) + vector search Qdrant. **KHÔNG gọi LLM sinh chữ.** | ~$0, scale tốt | ✅ List bấm được → điều hướng surface thật |
| **Generative (quiz/summarize)** | LLM sinh chữ trên **1 con RTX 5060 duy nhất** (qwen.starci.org, 8GB, ~43 tok/s) | Tốn GPU-time, **KHÔNG scale trên 1 card** | ❌ Cục chữ = ngõ cụt |

- Chat chạy `floor=Free` → model free phục vụ thì `cost=0`, **không trừ credit pool**; handler **không pre-gate
  quota**. → Rủi ro thật của app-wide **KHÔNG phải tiền credit**, mà là **tải lên 1 GPU duy nhất**.
- Generative skill = ô tệ nhất (đắt GPU + ngõ cụt). Retrieval = ô tốt nhất (rẻ + dẫn vào phễu). Bỏ generative
  đúng trên CẢ 2 trục kinh tế + sản phẩm.
- **Đòn bẩy phễu**: retrieval có giá trị monetization trực tiếp với **HỌC THỬ (trial)** — content-AI có gate
  premium (`PremiumContentAiAccessDeniedException`), nhưng retrieval `/find` lục toàn khóa → kết quả premium
  hiện dạng **🔒 + CTA "Ghi danh để mở"** = goal-gradient chỉ thẳng vào giá trị đang khóa.

## 2. Vì sao bỏ slash (grounded)

- **Retrieval bằng NL đã chạy sẵn**: `detectContentIntent` (`ContentAiChat/index.tsx`) —
  `/(tìm|find|gợi ý|liệt kê|list|show|kiếm)/i` × kind(flashcard/challenge/milestone/lesson) → gõ "tìm thử thách
  về pipe" đã tự route sang `runContentIntent`, **không đụng `/`**. Slash hiện đã trùng một phần.
- **Khán giả**: người mới học backend, nhiều người mobile — không phải dev có phản xạ slash (Slack/Linear/Notion).
  Slash = affordance power-user; ép lên nhóm này = dạy thêm grammar verb-noun 2 cấp mà đa số không khám phá ra.
- Sau khi hạ summarize/explain/example về chip, slash **chỉ còn gánh `/find`** — mà chip + NL đã lo → slash mất
  lý do tồn tại.

## 3. Context pill — mô hình 3 lớp ngữ cảnh (mảnh ghép mới, thầy đề xuất)

Grounding có phân cấp hẹp→rộng; pill làm nó **minh bạch + điều khiển được**:

| Lớp | Khi nào | Nguồn grounding | UI |
|---|---|---|---|
| 🔖 **Đoạn bôi đen** (hẹp nhất) | bôi đen text trong bài rồi hỏi | passage + đoạn quanh (`<context>`) | ĐÃ CÓ (`ContentAiSelectionAsk` + quote block) |
| 📖 **Bài đang đọc** (mặc định) ⭐ | đang ở trang đọc 1 bài | body bài (hành vi hiện tại) | **MỚI: pill "📖 Đang hỏi về bài: <tên>"** + nút "⤢ Hỏi cả khóa" |
| ✦ **Cả khóa** | tab không có bài (flashcard/mindmap/xếp hạng), HOẶC user tự nới | RAG course-wide (`ContentRagRetrievalService`, đã có) | **MỚI: pill "✦ Cả khóa: <tên khóa>"** |

- **Mặc định thông minh**: đang đọc bài → pill tự = bài đó (không bắt user chọn). Rời sang tab không có bài →
  pill tự về "Cả khóa". Đây chính là ý thầy: "đang đọc bài thì mặc định context là bài đó".
- **Honest**: user luôn thấy AI đọc gì → không mơ hồ "nó trả lời về cái gì vậy".
- **Điều khiển**: 1 chạm nới bài→khóa hoặc thu lại; đoạn bôi đen là overlay hẹp chồng lên (bỏ ✕ về cả bài).

## 4. Flow + surface (overlay utility bám course-shell, KHÔNG phải trang — giữ job ở
`.claude/fe/features/content-ai-chat.md`)

| Surface/state | Đổi gì |
|---|---|
| FAB mọi tab learn | Bỏ `if(!contentId) return null` (`ContentAiFab/index.tsx:116-119`) — hiện khi có `courseId` |
| Context pill trong composer | MỚI — mặc định bài đang đọc / cả khóa / đoạn bôi đen |
| Empty-state chip theo context | Bài: [Tóm tắt·Khó nhất·Ví dụ + Thử thách/Flashcard liên quan] · Đoạn: [Giải thích·Ví dụ·Đơn giản] · Khóa: [Tìm nội dung·Học gì tiếp] |
| Retrieval | Chip "liên quan" HOẶC NL "tìm X" → `runContentIntent` → `ChatToolResult` list bấm được |
| Slash palette | **XÓA hoàn toàn** (bỏ `VERBS`/`GENERATE_VERBS`/`FIND_OBJECTS`/keyboard-nav/2-level menu) |
| Nút công cụ ⌥ (composer) | OPTIONAL, phase-2 — khám phá retrieval GIỮA cuộc trò chuyện (khi thread hết rỗng); bấm không gõ `/`. CHỈ thêm nếu thầy thấy cần |
| Trial + retrieval result | Item premium hiện 🔒 + CTA ghi danh |
| Lịch sử hội thoại | Trộn session gắn-bài (📖) + course-general (✦); cùng enrollment, search xuyên suốt |

## 5. Conversion lens (đặt VÀO vùng)

- **CTA**: FAB = mở panel (mọi tab). Retrieval result = mỗi row 1 CTA điều hướng; row premium (trial) = CTA ghi
  danh. Context pill "⤢ Hỏi cả khóa" = 1 chạm mở rộng.
- **Link onward**: mọi retrieval row đáp xuống surface thật (challenge/lesson/milestone) — không ngõ cụt. "Xem
  tất cả" mở full search.
- **Psychology**: chip course-general "Tôi nên học gì tiếp?" nối `myCourseOutline` (nguồn thật) = goal-gradient
  thật, không câu mở mông lung. **HONEST**: KHÔNG dựng digest "tiến độ" bịa số khi content-AI chưa có access
  progress data.

## 6. Block briefs (element-aware)

| Việc | Component | Trạng thái |
|---|---|---|
| Bỏ gate `!contentId` | `ContentAiFab` | SỬA nhỏ |
| Xóa slash palette + verb machinery | `ContentAiChat` | XÓA code (đơn giản hóa) |
| Context pill (3 lớp) | **`ChatContextPill`** (mới, feature-local) — hoặc dựng inline; anatomy chốt ở `starci-fe-block` | MỚI |
| Nhánh course-general (chip set, label) | `ContentAiChat` | SỬA |
| Header fallback "tên khóa" | `ContentAiChatRail` (`:27,44`), `ContentAiChatDrawer` | SỬA nhỏ (field đã có) |
| Retrieval result | `ChatToolResult` | GIỮ nguyên (đã tốt) |
| Nút công cụ ⌥ (opt phase-2) | inline trong composer | OPTIONAL |
| Session không gắn content | `content_ai_sessions.origin_content_id` → nullable + migration | SCHEMA |
| BE grounding course-general | `ContentAiService.prepareMessages` + `ask-content-ai.handler` + `content-ai.gateway` — nhánh khi `contentId` rỗng: RAG course-wide | SỬA BE |
| Trial premium-lock trong result | `ChatToolResult` row + `EntityResultRow` | SỬA (thêm lock/CTA state) |

## 7. Ma trận build

- 🟢 **render-là-xong**: bỏ gate FAB · **XÓA slash** (giảm code) · hạ summarize/explain/example về chip
  lesson-context · context pill lesson↔course (client state) · chip retrieval (dùng `runContentIntent` sẵn có).
- 🟠 **aggregate-BE (vừa)**: nhánh course-general RAG (tái dùng `ContentRagRetrievalService`, đổi entrypoint) ·
  session `origin_content_id` nullable (1 migration) · nối `myCourseOutline` cho chip "học gì tiếp" ·
  trial premium-lock trong retrieval result.
- 🔴 **HOÃN/BỎ**: digest "tóm tắt tiến độ" (cần BE progress-grounding — BỎ theo chốt) · nút công cụ ⌥ (phase-2,
  chỉ khi cần).

## 8. Files to touch

**FE** (`starci-academy`, mtp): `ContentAiFab/index.tsx` (bỏ gate) · `ContentAiChat/index.tsx` (xóa slash, nhánh
course-general, context pill, chip theo context) · `ContentAiChatRail/index.tsx` (+ Drawer, kiểm path) (header
fallback) · MỚI `blocks/learn/ChatContextPill/` (hoặc inline) · `ChatToolResult`/`EntityResultRow` (trial lock) ·
i18n `contentAi.context.*`, `contentAi.courseSuggestions.*`.

**BE** (`starci-academy-backend`, mtp): `content-ai-session.entity.ts` + migration (`origin_content_id` nullable) ·
`content-ai.service.ts` (nhánh grounding khi `contentId` rỗng) · `ask-content-ai/*` + `content-ai.gateway.ts`
(`contentId` optional).

## 9. Verify plan

- tsc + eslint sạch FE+BE.
- BE: `askContentAi` KHÔNG kèm `contentId` (course-general) trên course đã enroll → không throw
  `ContentNotFoundException`; KÈM `contentId` → hành vi CŨ không đổi (regression).
- FE runtime: FAB ở tab flashcards/mindmap/league → panel mở, pill = "Cả khóa"; tab đọc bài → pill tự = bài;
  bấm "⤢ Hỏi cả khóa" → đổi grounding; NL "tìm thử thách" → ra list; slash `/` KHÔNG còn menu.
- Session cũ (origin_content_id có giá trị) vẫn load bình thường sau migration.

## 10. Prototype

`.artifacts/prototypes/content-ai-chat-app-wide/index.html` — host **http://localhost:8097** (verified `<title>`).
Điều khiển: **Tab** (Đọc bài/Ôn flashcard/Xếp hạng → FAB mọi nơi + context tự default) · **Ngữ cảnh**
(Bài/Đoạn bôi đen/Cả khóa → thấy pill đổi, 2 nút đầu khóa khi rời tab đọc bài) · **State** (Rỗng-chip /
Kết quả retrieval / Trả lời chat / Nút công cụ / **Lịch sử mixed 📖✦** / **Xem tất cả**) · **Present** (Rail/Drawer).
KHÔNG còn state slash. 2 view in-panel (Lịch sử + Xem tất cả) ẩn composer, có back về Trò chuyện — phủ đủ mọi
surface của luồng.

## 11. Quyết định ĐÃ CHỐT (thầy 2026-07-20)

1. ✅ **Trial ĐƯỢC chat course-general + retrieval** — result premium hiện 🔒 + CTA ghi danh (máy chuyển đổi
   trial→paid). → kéo theo ràng buộc bảo mật §12.
2. ✅ **Thêm rate-limit nhẹ lane chatbot** trước khi mở rộng (bảo vệ 1 con GPU RTX 5060). Dùng
   `@UseThrottler(ThrottlerConfig.Soft)` (đã có infra, `searchCourseContent` đang dùng) áp cho mutation/gateway
   content-AI; ngưỡng cụ thể chốt lúc build.
3. ✅ **Nút công cụ ⌥ làm LUÔN đợt 1** (không để phase-2). Composer có nút ⌥ mở menu retrieval để khám phá giữa
   cuộc trò chuyện, song song chip empty-state + NL.
4. ✅ **Migration `origin_content_id` nullable**: OK, làm tay cẩn thận — prod `synchronize=true`, theo
   [[prod-synchronize-drop-type-crashloop]] đổi nullable trên cột NOT NULL không phó mặc synchronize.

## 12. ⚠️ Ràng buộc bảo mật do câu #1 (trial + retrieval) — PHẢI xử lý khi build

Grounded từ `search-course-content.resolver.ts` (*"no extra enrollment check here"*) +
`search-course-content.service.ts:249` (`snippet: hit.snippet.slice(0, 280)` = cắt từ body chunk). `searchCourseContent`
**KHÔNG lọc premium/enrollment**, và snippet lộ 280 ký tự body:

- **A) Thêm field `isPremium`** vào `SearchCourseContentItem` (join `content.isPremium` — và với challenge/
  milestone: premium của bài/khóa chứa nó). FE chưa có tín hiệu premium để vẽ 🔒 → BE phải trả.
- **B) Che snippet cho item premium khi non-enrolled** — không trả 280 ký tự body premium cho trial (trả title +
  breadcrumb + lock, snippet rỗng/ẩn).
- **C) Nhánh course-general GROUNDING phải LỌC chunk premium cho non-enrolled** (nặng nhất) — nếu không, trial
  hỏi course-general sẽ nhận câu trả lời tổng hợp TỪ body premium = rò nguyên nội dung. Enrolled → ground đủ;
  non-enrolled → chỉ ground trên content non-premium (mirror logic gate `PremiumContentAiAccessDeniedException`
  hiện có ở `prepareMessages`, nhưng mở rộng cho nhiều content).

→ 3 mục A/B/C thêm vào ma trận build 🟠 (BE). KHÔNG optional — là điều kiện đúng-đắn của "trial được retrieval".
