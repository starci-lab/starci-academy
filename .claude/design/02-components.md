# 02 — Components

HeroUI v3 (`@heroui/react`) first. Mỗi mục: component · file thật · khi dùng. Icon: Phosphor (`@phosphor-icons/react`) + simple-icons (brand).

## HeroUI v3 — dùng nhiều nhất
- **Card** — `Card` + `Card.Content` / `Card.Footer`. **Dùng MÀU CARD mặc định** (`card--default` = `bg-surface`), bo `rounded-3xl` (mặc định HeroUI). **KHÔNG shadow** (đã set global `globals.css .card { shadow-none }`) → không cần `shadow-none` từng nơi. ⚠️ **KHÔNG override nền bằng `bg-default/40`** — để màu surface của card; hover dùng `hover:bg-surface-secondary`. Variant đậm hơn: `card--secondary`/`card--tertiary`. Ref: `EnrollCard`, `Module/ContentCard`.
- **Chip** — `Chip` + `Chip.Label`, thường `size="sm" variant="soft" color="accent"` (hoặc `danger` cho disabled). Ref: pricing "Save %", PaymentModal.
- **Alert (callout)** — `Alert` + `Alert.Indicator/Content/Title/Description`, `status="warning"` cho "Yêu cầu đầu vào". Ref: `PrerequisitesAlert`.
- **Breadcrumbs** — `Breadcrumbs` + `Breadcrumbs.Item`. Ref: `CourseBreadcrumbs`, modules layout.
- **Accordion** — `Accordion` + `.Item/.Heading/.Trigger/.Indicator/.Panel/.Body`. `variant="surface"` (curriculum) / `"default"` (sidebar).
- **Modal** — `Modal` + `.Backdrop/.Container/.Dialog/.CloseTrigger/.Header/.Body`. `size="xs"` (chọn phương thức TT) … `size="full"` (ChallengeModal split). Ref: `modals/PaymentModal`, `modals/ChallengeModal`.
- **ListBox + ScrollShadow** — sidebar nav. **Separator**, **Spinner**, **Stepper**, **Button**.

## Reuseable inventory (build blocks)
| Component | File | Khi dùng |
|-----------|------|----------|
| **Count-chip** (icon + số) | `Modules/.../ModuleSummaryChips` + `Modules/map.ts` | Đếm nội dung: BookOpen=contents, Video=lectures, Sword=challenges (vd `12 / 8 / 3`) |
| **Meta-chip** | `ModuleSidebar/.../ModuleContentRow` | Hàng outline: Clock "15 phút đọc", Video "0 bài giảng", Sword "3 thử thách" |
| **Sidebar icon-nav** | `Sidebar` + `SidebarNavList/SidebarNavItemRow` | Nav dọc; row active = `text-accent bg-accent/10`. 8 icon Phosphor (MapPinLine, BracketsCurly, Stack, Handshake, ReadCvLogo, GraduationCap, Users, Sparkle) |
| **Pricing tier** | `Stepper` (PhaseTrack/PhaseLabels/PhasePrices) | Pioneer/Early Bird/Regular + "Save %" chip |
| **Value props checklist** | `EnrollCard` ValuePropositions | Dòng + `SealCheckIcon` accent |
| **Code block** | `CodeToHtml` (Shiki `material-theme-darker/lighter`) + `SnippetIcon` copy | Markdown code; wrapper `p-3 bg-default rounded-xl` + nút copy (Copy/Check + framer-motion). Map renderer: `MarkdownContent/map.tsx` |
| **MarkdownContent** | `reuseable/MarkdownContent` | Render nội dung md (heading/list/code…) |
| **Score / StarCiAIBadge / Spacer / ReferenceLinks** | barrel `reuseable/index.ts` | Điểm, badge AI, spacing, link tham chiếu |
| **Brand logo (payment)** | `public/icons/payment/*.svg` + `assetConfig().icon().payment()` | `<img class="h-8 w-auto object-contain">` (payos/sepay/stripe/paypal/crypto) |

## Quy ước nhỏ
- Glyph `{}` đầu mỗi mục tiêu/bullet = `BracketsCurlyIcon` (Phosphor).
- Chip nhấn luôn `color="accent" variant="soft"`. Disabled → `color="danger" variant="soft"` + label `common.disabled`.
- Icon list trong card: `weight="duotone"` size `size-10`/`size-5`, màu `text-foreground-600`.
- Group nhiều row: `flex flex-col overflow-hidden rounded-medium` + `<Separator />` giữa các row (xem PaymentModal).
