# 04 — Page Recipe (build page mới khớp StarCi)

Checklist dựng page/feature mới (vd Quizlet, LeetCode) trông "native" với StarCi.

## Quy trình
1. **Chọn archetype gần nhất** ([03](03-layout-archetypes.md)): list/detail có sidebar → kiểu *Course learn*; trang giới thiệu + rail mua → *Course detail*; làm bài/split + code → *Challenge*.
2. **Tái dùng khung**: container `max-w-[1280px]`, `grid md:grid-cols-5` (3/2) hoặc `grid-cols-4` (sidebar). Breadcrumbs trên cùng. Title `text-2xl`/`4xl font-bold` + description `text-muted`.
3. **Dựng bằng HeroUI v3** ([02](02-components.md)) — KHÔNG tự viết primitive nếu HeroUI có: Card, Chip, Accordion, Modal, Alert, Breadcrumbs, ListBox, Stepper, Button, Separator, Spinner.
4. **Token semantic, không hardcode màu** ([01](01-tokens.md)): nền `bg-default/40`, chữ phụ `text-muted`, nhấn `color="accent"`. Đẹp cả light + dark.
5. **Bo góc + spacing**: card `rounded-large`/`rounded-xl`, gap `gap-4` (section) / `gap-2` (trong card). Group row → `overflow-hidden rounded-medium` + `Separator`.
6. **Icon**: Phosphor `weight="duotone"`; brand → simple-icons. Glyph mục tiêu = `BracketsCurlyIcon`.
7. **i18n**: mọi text qua `messages/{en,vi}.json` (next-intl) — không hardcode chữ.
8. **Data**: GraphQL op `query-*.ts`/`mutation-*.ts` (`cache:false`) + singleton SWR hook (xem `.claude/pattern/03,05`). Enum/field khớp BE.
9. **Realtime** (nếu cần, vd chấm LeetCode): Socket.IO singleton hook (`.claude/pattern/12`).

## Pattern hay dùng lại
- **Card grid nội dung**: `grid` Card `bg-default/40 rounded-large`, mỗi card title + mô tả `text-muted` + count-chip.
- **Count/meta-chip**: `Chip size="sm" variant="soft" color="accent"` + Phosphor icon + số (BookOpen/Video/Sword/Clock).
- **Outline rail**: list row click → `text-accent bg-accent/10` khi active (như Sidebar/ModuleSidebar).
- **Mua/checkout**: mở `modals/PaymentModal` qua `usePaymentOverlayState().open(context)` (PaymentContext discriminated union: course-enroll | ai-subscription).
- **Hiển thị giá**: VND chính + USD phụ `text-muted` (chỉ hiện khi có `priceUsd`).
- **Code/markdown**: `MarkdownContent` + `CodeToHtml` (Shiki) + nút copy.

## Đừng
- ❌ Hardcode hex màu / tự định nghĩa palette → dùng token.
- ❌ Tự viết button/modal/accordion thuần → dùng HeroUI v3.
- ❌ Chữ tiếng Việt/Anh hardcode → i18n key.
- ❌ Layout cứng px → grid + breakpoint + token spacing.
- ❌ Quên trạng thái dark (test cả 2 theme).
