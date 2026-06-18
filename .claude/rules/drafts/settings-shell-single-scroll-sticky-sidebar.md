# Settings shell = MỘT scroll context + sidebar STICKY (KHÔNG locked-viewport 2-pane) (2026-06-18)

Thầy CHỐT/SỬA (override `SettingsLayout` trò dựng). File/§ đích: main.md §10 (bố cục) / starci navigation.

## Bài học (nguyên nhân gốc)
Trò từng làm settings shell = `h-[calc(100dvh-4rem)] overflow-hidden` + 2 pane `overflow-y-auto` riêng để có
"2 màn cuộn độc lập". Thầy chốt **SAI hướng**: khoá viewport + inner-overflow **đá nhau với body-scroll của
app-shell → janky**.

## Luật (STRICT)
- **1 trang = 1 scroll context = body/page.** ĐỪNG dựng vùng khoá-viewport (`h-[calc(100dvh-…)] overflow-hidden`)
  + pane `overflow-y-auto` lồng trong trang đã có app-shell body scroll. Chúng tranh nhau, cuộn giật.
- **Sidebar co/giãn-tại-chỗ thì STICKY, KHÔNG own-scroll riêng cả vùng:** `shrink-0 md:sticky md:top-16
  md:h-[calc(100dvh-4rem)]` (dính dưới navbar 4rem, cao bằng viewport) — content **trôi trong page scroll** bình
  thường (`flex-1`, KHÔNG overflow riêng). Sidebar tự cao, nội dung dài thì page cuộn; block bên trong (nav) vẫn
  có `ScrollShadow` của riêng nó cho phần nav dài.
- Áp cho settings shell + mọi shell "sidebar + content" tương tự. (Liên quan [[collapsible-panel-framer-not-drawer]]:
  panel animate tại chỗ bằng framer; KHÔNG Drawer, và giờ thêm: KHÔNG khoá-viewport-2-pane.)
