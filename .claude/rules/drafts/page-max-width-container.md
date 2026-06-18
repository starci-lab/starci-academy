# Trang top-level: container max-width = 1280px (trừ page có sidebar)  (2026-06-18)

- File/§ đích khi `/merge`: `main.md` §10 (bố cục) / §3 (placement).
- Bài học: trang `/courses` card "to quá" — grid `lg:grid-cols-3` không có container max-width → kéo full 1920px →
  card khổng lồ.
- Luật (thầy chốt 2026-06-18):
  - **Trang top-level bọc nội dung trong `mx-auto w-full max-w-[1280px] px-6 py-6`** (1280px) — chuẩn chung cho
    mọi trang content full-width (grid/list/cards). ĐỪNG để full-bleed (card phình theo bề rộng màn).
  - **NGOẠI LỆ: trang CÓ SIDEBAR** (vd dashboard, public profile = 2-cột rail+content, settings = sidebar trái) →
    GIỮ layout/width riêng của nó (không ép `max-w-[1280px]` lên cả khung sidebar). Container content bên trong
    sidebar tự định theo layout đó.
  - Card course đồng bộ kích thước với cách render ở feature khác (cùng container + `gap-3`). Với 1280px, grid 3-col
    ra card ~400px / cover `aspect-video` ~225px — vừa mắt.
