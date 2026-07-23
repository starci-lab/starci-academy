# Primitives Canon Audit — Form family (2026-07-23)

**Lane:** `/starci-fe-primitives-audit` — **REPORT-ONLY**. Không sửa code.
**Scope:** `Primitives/Form/*` (port `.storybook/stories/blocks/form/**`).
**Directive từ thầy (args, giọng mệnh lệnh → ghi thành ruling, chờ duyệt):**
1. "form ghi đủ loại input đi" → coverage: family phải phủ MỌI loại input.
2. "dropdown dùng react dropdown và dùng icon file và file open" → thêm Dropdown/Select primitive.
3. "và có skeleton" → mọi input phải có `isSkeleton`.

---

## 0. Inventory hiện tại (6 primitive)

| Primitive | Loại | isSkeleton | size | variant | Ghi chú |
|---|---|:--:|:--:|:--:|---|
| Dropzone | file (drag-drop) | ❌ | ❌ | ❌ | dùng `react-dropzone` (dep thật) |
| OtpInput | otp | ❌ | ❌ | ❌ | |
| SchedulePicker | date/time compose | ❌ | ❌ | ❌ | |
| SearchAutocomplete | search + suggest | ❌ | ❌ | ❌ | |
| SearchBar | search | ❌ | ❌ | ❌ | |
| SearchInput | search (base) | ❌ | ❌ | ✅ `variant` | |

**Toàn family = input NICHE.** Không có 1 input CƠ BẢN nào.

---

## 1. GAP A — thiếu sạch input cơ bản (§ coverage · **high** · directive 1)

Family "Form" của một design system PHẢI document mọi loại field. Hiện **thiếu**:

| Cần thêm | Vai | Nguồn khả dĩ |
|---|---|---|
| **TextField / Input** | text 1 dòng (label + hint + error + prefix/suffix) | HeroUI `TextField` |
| **Textarea** | text nhiều dòng | HeroUI `TextArea` |
| **NumberField** | số (stepper) | HeroUI `NumberField` |
| **Select / Dropdown** | chọn 1 (xem GAP B) | `react-dropdown` (directive 2) |
| **MultiSelect / Combobox** | chọn nhiều / lọc | HeroUI `ComboBox` |
| **Checkbox + CheckboxGroup** | boolean / chọn nhiều | HeroUI `Checkbox` |
| **Radio + RadioGroup** | chọn 1 trong nhóm | HeroUI `RadioGroup` |
| **Switch / Toggle** | bật/tắt | HeroUI `Switch` |
| **DatePicker / DateField** | ngày | HeroUI `DatePicker` |

> ĐÃ CÓ (giữ nguyên): OtpInput, Dropzone (file), SearchInput/Bar/Autocomplete, SchedulePicker.

**Ruling đề xuất:** mỗi input = 1 primitive mỏng StarCi-flavored, TỰ SỞ HỮU (§4) khung `label + hint + error + isSkeleton`, consumer truyền value/handler trần. Field-shell chung (`FieldShell`: label/hint/error/skeleton) để mọi input dùng lại → tránh 9× lặp.
**⚠️ Decision D1 (cần thầy chốt):** wrapper mỏng-own-shell (khuyến nghị) **hay** re-export HeroUI thô? và chốt danh sách set trên.

---

## 2. GAP B — Dropzone tinh chỉnh (directive 2 · **CHỐT 2026-07-23**)

> ⚠️ Đọc lại: directive (2) KHÔNG phải "dropdown/react-dropdown" — thầy nói **react-dropzone** (typo), tức nói về **Dropzone SẴN CÓ**. Không thêm Select/dropdown mới.

`Dropzone` (`form/Dropzone/Dropzone.tsx`) đã dùng `react-dropzone` (dep thật). Cần chỉnh:
- **Icon file/file-open**: hiện dùng `UploadSimpleIcon` (alias CloudArrowUp). Đổi sang phosphor **`FileIcon` (idle) ↔ `FolderOpenIcon` (khi `isDragActive`)** — icon swap theo trạng thái kéo-thả.
- **Border đổi accent khi drop**: hiện đã có `isDragActive ? "border-accent bg-accent-soft"`. Xác nhận rõ trạng thái accent (border-accent + tint) đúng ý; dọn className gộp lặp (`rounded-large … rounded-3xl`, `border …  border-2`) khi sửa.
- **+ isSkeleton** (GAP C): mirror ô dashed.

---

## 3. GAP C — thiếu `isSkeleton` toàn family (§8 MUST · **high** · directive 3)

**0/6 primitive** có `isSkeleton`. §8 canon: mọi primitive hiển-thị PHẢI tự render skeleton mirror.

**Ruling:** thêm `isSkeleton` cho cả 6 hiện có + mọi input mới. Mirror đúng hình field (label bar + control bar cùng cao/rộng; Dropzone mirror ô dashed; OtpInput mirror N ô vuông; Select mirror trigger).

---

## 4. Các chiều khác (spot-check nhanh, không blocking)

- **Dropzone**: className gộp lặp class (`rounded-large … rounded-3xl`, `border …  border-2`) → dọn (low). Icon `size-6` ok.
- **Spacing**: các file dùng `gap-2` — hợp thang `0·2·3·6·8`. OK.
- **§4 Ownership**: các search-* tự ép style — OK (chưa soi sâu từng dòng, để lane fix soi).

---

## 5. Batch đề xuất (cho lane fix, SAU khi duyệt plan)

- **Batch F1 — FieldShell** (label + hint + error + isSkeleton chung) — nền cho mọi input.
- **Batch F2 — text input** trên FieldShell: TextField, Textarea, NumberField.
- **Batch F3 — chọn 1** trên FieldShell: Select (HeroUI, đồng bộ stack), Radio(+Group).
- **Batch F4 — chọn nhiều / boolean**: Checkbox(+Group), Switch, ComboBox/MultiSelect.
- **Batch F5 — Date**: DatePicker/DateField (đối chiếu SchedulePicker sẵn có).
- **Batch F6 — Dropzone tweak**: icon File↔FolderOpen theo drag, border accent, dọn className. (directive 2)
- **Batch F7 — retrofit isSkeleton** cho 6 primitive cũ (directive 3).

---

## 6. Quyết định đã chốt (2026-07-23)
- **D1 ✅** — input = **wrapper mỏng + FieldShell chung** (own label/hint/error/skeleton), bọc control HeroUI.
- **D2 ✅** — directive (2) = **Dropzone** (react-dropzone), KHÔNG phải Select. Icon File↔FolderOpen theo drag + border accent khi drop.
- **D3 ✅** — skeleton: thêm hết, không cần hỏi.

> Còn lại: chờ thầy duyệt **plan build** (§5) trước khi mở lane fix — theo kỷ luật analyze-and-approve-before-editing.
