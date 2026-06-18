# Draft: trường bí mật (API key/token) — paste-once, masked, encrypt BE

**File-§ đích:** `main.md` (mindset bảo mật/form) — chọn khi `/merge`.

**Bài học (2026-06-17):** BYOK API key. Thầy chốt: "khoá API để dạng mật khẩu — copy/paste 1 lần, lưu, hiện
truncate, KHÔNG bao giờ hiện lại được, encrypt dưới backend".

**Luật mới — mọi field bí mật (API key, token, secret):**
- **Encrypt at rest ở BE** (AES-256-GCM); **plaintext KHÔNG BAO GIỜ trả về GraphQL/REST**. (StarCi đã có
  `EncryptionService` + cột `*_encrypted`.)
- **FE: input write-only** — `type="password"`, **không bao giờ prefill** giá trị thật; chỉ để DÁN khoá mới (thay).
- **Hiển thị khi đã lưu = MASKED truncate**: `••••••••{last4}` + (provider/nhãn). BE lưu thêm **`*_last4`**
  (log-safe, qua `toKeySuffix`) và trả field đó; FE render mask. KHÔNG cần và KHÔNG được trả nhiều hơn 4 ký tự.
- Có khoá → nút **"Thay khoá"** (dán mới) + **"Xoá khoá"** (clear). Không có nút "xem khoá".

**Đã áp:** BE `AiSubscriptionEntity.byok_key_last4` (varchar4, synchronize) + `applyByokUpdate` set/clear qua
`toKeySuffix` + `MyAiSettingsResponseData.byokKeyLast4` + `AiSettings` type + resolver map. FE `myAiSettings`
query/type thêm `byokKeyLast4` + `ByokForm` hiện `••••••••{last4}` ở thẻ key-on-file, input chỉ để thay.
**PENDING: restart BE để synchronize cột `byok_key_last4`** (không thì query myAiSettings vỡ schema-validation).
