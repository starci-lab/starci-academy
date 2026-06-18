# HeroUI TextField: con phải có `slot` hợp lệ (counter/hint = `slot="description"`)  (2026-06-17)

- File/§ đích: `main.md` §6 (HeroUI) hoặc `starci-*.md` field nếu tách.
- Bài học: runtime crash "A slot prop is required. Valid slot names are 'description' and 'errorMessage'."
  ở EditProfile — đặt `<Typography>` (đếm ký tự `bio.length/BIO_MAX`) TRẦN làm con `<TextField>`.
- Luật mới: **con trực tiếp của HeroUI `TextField` PHẢI là slot hợp lệ** — `Label`, `Input`/`TextArea`, và
  text phụ (mô tả/đếm ký tự/hint) phải gắn **`slot="description"`** (hoặc `slot="errorMessage"` cho lỗi).
  Counter/hint → `<Typography slot="description" …>`; KHÔNG để Typography/div trần trong `TextField`.
- Nguyên nhân gốc: TextField (React Aria) phân phối con theo slot; con không-slot → throw. Mọi field khác
  (Input/TextArea/Select) kiểm tương tự khi gắn mô tả.
