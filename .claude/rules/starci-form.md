# StarCi Form & Field Rules (controls · selector · secret · upload)

Cách dựng input/field/control trong form & settings. Đi kèm `main.md` (§6 HeroUI) + `starci-button.md`. STRICT.

## 1. HeroUI `TextField` — con phải có `slot` hợp lệ
- **Con trực tiếp của `TextField` PHẢI là slot hợp lệ:** `Label`, `Input`/`TextArea`, và text phụ
  (mô tả/đếm ký tự/hint) gắn **`slot="description"`** (lỗi → `slot="errorMessage"`).
- CẤM `<Typography>`/`<div>` TRẦN làm con `TextField` → React Aria throw runtime "A slot prop is required.
  Valid slot names are 'description' and 'errorMessage'." (dính ở EditProfile counter `bio.length/BIO_MAX`).
- Counter/hint → `<Typography slot="description" …>`. Mọi field khác (Input/TextArea/Select) kiểm tương tự.

## 2. Control nhỏ "vô hình" → nghi token, fix ở globals BEM
- Globals UI-2.0 set **`--field-border: transparent`** (Input/TextArea/Select liền mạch dựa nền-contrast) → control
  nhỏ (checkbox size-4, bg ≈ card) lấy viền từ token đó hoá **vô hình** dù markup đúng anatomy.
- **Fix: override `.checkbox__control { border-color: var(--border) !important }` trong `globals.css`** (đúng tầng —
  override BEM HeroUI như `.switch__control`). KHÔNG sửa markup. `--border` (light ~90%/dark ~28%) = viền nhìn thấy;
  `--separator` mảnh hơn cho divider. (Đã có trong globals.)
- Quy tắc gốc: HeroUI control "không thấy/nhạt" mà markup đúng → NGHI token (`--field-border: transparent`,
  `--field-background` ≈ surface) → fix globals, KHÔNG ở feature.

## 3. Checkbox = HeroUI `Checkbox` compound
- `Checkbox.Content > Checkbox.Control > Checkbox.Indicator`, `isSelected`/`onChange(selected)`, `aria-label` nếu
  không có `Label` con. KHÔNG `<input type="checkbox">` trần.

## 4. Bộ chọn 1-trong-ít (provider/mode/segmented) = `Select` dropdown
- Selector ngắn trong FORM/input → **`Select` dropdown** (thầy chốt 2026-06-17), `Select.Trigger className="w-fit min-w-48"`
  (**w-fit, KHÔNG full-width**; full-width chỉ cho input nhập text dài). `Tabs variant="primary"` (segmented) là phương án thay thế hợp lệ.
- **CẤM dãy pill `Button` làm selector** (sai semantics, nhìn như nhiều CTA). ⚠️ **`ExtendedTabs` (secondary/underline)
  CHỈ cho TAB LỚN cấp-trang** (page-level nav), KHÔNG cho selector nhỏ trong form.

## 5. Trường BÍ MẬT (API key / token / secret) — paste-once, masked
- **Encrypt at rest ở BE** (AES-256-GCM, `EncryptionService` + cột `*_encrypted`); **plaintext KHÔNG BAO GIỜ trả về
  GraphQL/REST.**
- **FE input write-only:** `type="password"`, **không bao giờ prefill** giá trị thật; chỉ để DÁN khoá mới (thay).
- **Đã lưu → hiển thị MASKED truncate:** `••••••••{last4}` (+provider/nhãn). BE lưu thêm cột **`*_last4`** (varchar4,
  log-safe qua `toKeySuffix`) và trả field đó; FE render mask. KHÔNG trả >4 ký tự, KHÔNG nút "xem khoá".
- Có khoá → nút **"Thay khoá"** (dán mới) + **"Xoá khoá"** (clear). (Đã áp: `AiSubscriptionEntity.byok_key_last4` +
  `MyAiSettingsResponseData.byokKeyLast4` + `ByokForm` mask.)

## 6. Section form đơn = phẳng, KHÔNG bọc `Card` thừa
- Section form 1 cụm (provider + input) = heading (`Label`/`Typography body-sm semibold`) + fields, **phẳng**.
  Bọc `Card`/`LabeledCard` chỉ khi cần TÁCH surface (nhiều khối, nền nổi). (tinh thần "panel co/giãn tại chỗ ≠ card".)
- **Text điều hướng/upsell ("Xem Gói AI") = `Link`** (không Button). Read-only status thừa không giúp quyết định → cắt.

## 7. Nút submit/save trong form settings = NGẮN
- Save trong form settings rộng = **`className="self-start"`** (width co theo chữ), **KHÔNG `fullWidth`** (fullWidth chỉ
  cho CTA chính trong cột hẹp/modal/card). Trong flex-col (mặc định stretch) PHẢI `self-start`/`self-end` để nút co. (xem `starci-button.md`.)

## 8. Upload ảnh/avatar = block `ImageDropzone` (react-dropzone), KHÔNG button+input ẩn
- **Block `ImageDropzone`** (`blocks/identity`, `react-dropzone@15`, generic — KHÔNG gắn avatar): vùng **viền dash
  full-width**, cột căn giữa = icon file (`ImageIcon`) + label + hint (KHÔNG hiện avatar/logo). `accept` ảnh +
  `maxSize` 5MB + `multiple:false`, `onDrop→onFile`. **Drag-over** → viền solid accent + `bg-accent/10` + icon/label
  nhấn accent. Props `{ onFile, label, hint?, icon? }`. Block sở hữu look.
- **UI avatar = ảnh + nút "Đổi ảnh" → MỞ MODAL chứa `ImageDropzone`** (KHÔNG trải dropzone thẳng trong trang). Modal
  qua **zustand overlay** (`useAvatarUploadOverlayState`, key `avatarUpload`) — KHÔNG local-open-state. Modal cần
  `onFile` của form hook → **mount modal TRONG feature** (không ModalContainer global), nhận `avatar`/`onFile`; chọn
  xong → `onFile` + `close()`.
- **Hook RHF expose setter nhận `File` thẳng** (`onAvatarFile(file)`); `onAvatarChange` (input) gọi chung.
- `useDropzone` = hook hành vi (KHÔNG store/SWR) → dùng trong block OK.

## Tham chiếu
- Blocks: `blocks/identity/ImageDropzone`. Selector/secret: `features/profile/AiSettings/ByokForm`.
