# Upload ảnh/avatar = block dropzone (react-dropzone), không button+input ẩn  (2026-06-17)

- File/§ đích: `main.md` §6/§12 (hoặc `starci-*.md` form).
- Bài học: thầy muốn đổi "Đổi ảnh đại diện" (button + `<input hidden>`) → **react-dropzone** kéo-thả.
- Luật mới (chốt sau 3 vòng feedback):
  - **Block `ImageDropzone`** (`blocks/identity`, `react-dropzone@15` — đổi tên từ `AvatarDropzone`, generic, KHÔNG
    gắn avatar): vùng **viền dash full-width**, **cột căn giữa = icon file (`ImageIcon`) + label + hint** (KHÔNG
    hiện avatar/logo). `accept` ảnh + `maxSize` 5MB + `multiple:false`, `onDrop`→`onFile`. **Drag-over** → viền
    **solid accent** + `bg-accent/10` + icon/label nhấn accent (file-hover rõ). Props `{ onFile, label, hint?, icon? }`. Block sở hữu look.
  - **UI avatar = ảnh + nút "Đổi ảnh" (UI gốc); bấm nút → MỞ MODAL chứa `AvatarDropzone`** (KHÔNG dropzone trải
    thẳng trong trang). Modal mở qua **zustand overlay** (`useAvatarUploadOverlayState`, key `avatarUpload`) — KHÔNG
    local-open-state. Vì modal cần `onFile` của form hook → **mount modal TRONG feature** (không ModalContainer
    global), nhận `avatar`/`onFile` props; chọn xong → `onFile` + `close()`.
  - **Hook RHF expose setter nhận `File` thẳng** (`onAvatarFile(file)`); `onAvatarChange` (input) refactor gọi chung.
  - `useDropzone` là hook hành vi (KHÔNG store/SWR) → dùng trong block OK.
- Phụ:
  - **`PageHeader` title = `Typography.Heading level={3} weight="bold"`** (nhỏ-gọn + đậm) — thay level2/medium.
  - **Checkbox = HeroUI `Checkbox` compound** (`Checkbox.Content > Checkbox.Control > Checkbox.Indicator`,
    `isSelected`/`onChange(selected)`, `aria-label` nếu không có Label con) — KHÔNG `<input type="checkbox">` trần.
  - **Nút hành động form (Lưu) trong cột flex KHÔNG `fullWidth`** → `className="self-end"` (ngắn, dồn phải);
    flex-col mặc định stretch nên phải `self-end`/`self-start` để nút co theo nội dung.
