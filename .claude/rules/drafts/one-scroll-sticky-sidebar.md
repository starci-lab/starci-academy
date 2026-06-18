# Trang trong app-shell: 1 scroll (body) + sidebar STICKY — đừng khóa viewport nested-scroll  (2026-06-17)

- File/§ đích: `main.md` §10 (bố cục) / §14 (heuristics).
- Bài học: SettingsLayout "giật giật" khi cuộn. Gốc: app-shell (`InnerLayout`) đã cho **body tự scroll**, mà
  SettingsLayout lại tự khóa `h-[calc(100dvh-4rem)] overflow-hidden` + pane phải `overflow-y-auto` → **2 scroll
  container lồng nhau** → overscroll chain / jitter (đặc biệt trackpad). Body cũng dư chiều cao → có thêm scrollbar.
- Luật mới:
  - **Trang nằm trong app-shell body-scroll → CHỈ 1 scroll context (body).** ĐỪNG dựng locked-viewport
    (`h-100dvh overflow-hidden`) + inner `overflow-y-auto` cho cột nội dung — nó đánh nhau với body scroll.
  - **Sidebar = `position: sticky`** (vd `md:sticky md:top-16 md:h-[calc(100dvh-4rem)]`) → "trái dính, phải cuộn"
    mà MƯỢT (phải = cuộn cùng body). Sidebar dài hơn viewport thì cho cuộn NỘI BỘ sidebar (ScrollShadow), KHÔNG
    khóa cả trang. (GitHub/Linear settings pattern.)
  - Nguyên tắc gốc (đã có ý ở mindset "tránh nested scroll"): chỉ tạo scroll container riêng khi THỰC SỰ cần
    pane độc lập; mặc định để body cuộn + sticky cái cần ghim.