# Audit cách viết source code — `.storybook/**` (bỏ `_legacy`)

Phạm vi `.storybook/**` (trừ `_legacy`) có **305 dòng/140 file** dính S1 (marker), **1897 dòng/124 file** dính S3 (comment tiếng Việt), **≥6 component/20 file** dính S2 (khuôn props sai), **2 chỗ** dính S4 (type object lồng inline) — script đo được **199 file** dính ít nhất 1 luật; batch 10 agent audit thủ công lấy mẫu 307 finding cụ thể (S1=96, S2=28, S3=182, S4=1) làm căn cứ sửa.

## 1. Theo luật

| Mã | Luật nói gì (1 câu) | Số chỗ (script / mẫu 307 finding) | Số file |
|---|---|---|---|
| S1 | Bỏ ký tự trang trí (⭐⚠️⛔✅❌🔴📛🚨⏳...) khỏi comment, giữ nguyên Ý bằng chữ | 305 dòng / 96 finding | 140 file (script) |
| S2 | Component phải `const X = ({...}: XProps) => {}`; cấm `Omit<>`/`Pick<>` thẳng ở chữ ký, phải bóc type có tên | 6 component (script, chỉ tính component thật) / 28 finding (tính cả helper cục bộ trong story) | 20 file (mẫu) |
| S3 | Toàn bộ comment phải tiếng Anh; khối "decision" (có §, ngày, bài học) dịch cẩn thận, khối "trivial" dịch máy móc hoặc xoá | 1897 dòng / 182 finding | 124 file (script) |
| S4 | Cấm object lồng inline trong props, phải bóc type có tên kiểu `XLike` | 2 chỗ (script) / 1 finding xác định được vị trí | 2 file (1 xác định, 1 chưa rõ) |

## 2. 🔴 Khối DECISION phải dịch tay (không giao máy dịch máy móc)

Đây là các khối JSDoc/comment ghi lại QUYẾT ĐỊNH (có neo §, có ngày, có "trước đây sai thế nào") — dịch rút gọn là **mất thông tin thật**, phải người đọc dịch cẩn thận.

### `.storybook/utils/BlockAnatomy/BlockAnatomy.tsx`
| Dòng | Ý chính đang ghi |
|---|---|
| 2 | eslint-disable: rail/pill của cây dùng nấc phụ (ml-[3px]·pb-2.5) có chủ ý — đây là đồ nghề, không phải UI app |
| 13 | Mô tả tool BlockAnatomy 2-tab (Deps/Code); lịch sử: từng có tab States nhưng bỏ 2026-07-26 vì trùng với render box; giới hạn: part trong portal không vào được cây |
| 80 | Luật DEPS: chỉ khai component CÓ storyId, thiếu storyId thì bỏ hẳn — không tính internal span (Label/Icon/Spinner) |
| 96 | `annotate` = allowlist quyết định phần nào vào cây DOM; entry thiếu storyId cũng không vào cây |
| 119 | Bảng màu tầng cho cây DOM là bảng PHÂN LOẠI (cố ý không dùng token semantic) — khác hẳn overlay tab States (đúng là semantic) |
| 152 | 2 tab cố định thứ tự (Deps→Code); cấm thêm lại thành viên `"states"` đã gỡ khỏi union 2026-07-26 |
| 306 | `annotate` là danh sách trắng, chỉ nhận part có storyId thật — tránh double-count nội tạng component con (vd Feedback.Callout lộ Icon/Content/Title...) |
| 361 | Quét NGAY + rAF chỉ là lượt bù; bug lịch sử: nếu chỉ quét trong rAF thì iframe preview bị throttle (tab ẩn/không paint) → Deps tab biến mất dù story khai đúng |

### Khác (theo file, sắp theo path)

| File:Dòng | Ý chính đang ghi |
|---|---|
| `stories/atoms/feedback/Feedback/Feedback.Confirm.stories.tsx:8` | Phạm vi state của `Feedback.Confirm`: khung chặn hành động không lùi được; chỉ render state khung tự sinh, không lặp state của Button con |
| `stories/layouts/layout/Split/Split.Base.stories.tsx:9` | Phạm vi state `Split.Base`: khung trái↔phải; state = seam/align/stackOnMobile; KHÔNG có wrap/justify vì justify-between là định nghĩa của khung |
| `components/layouts/chips/Chip/Chip.tsx:6` | `Chip.*` namespace gom chip cùng tầng primitive; lịch sử: Dot/Status/Tags/HostPlatform lần lượt bị bỏ khỏi namespace này (đổi tầng hoặc xoá hẳn) |
| `components/layouts/chips/EnumChip/EnumChip.tsx:53` | Đổi 2026-07-26: gọi thẳng atom Chip.Base thay vì `StatusChip` đã xoá (StatusChip chỉ khoá cứng tone) |
| `components/layouts/chips/EnumChip/EnumChip.tsx:60` | Bỏ patch `h-6` tại call site vì atom đã tự sửa shimmer height lệch 4px |
| `components/atoms/display/PricePoint/PricePoint.tsx:22` | MỘT bảng size chung cho amount+original+period; trước đây original/period khoá cứng sm/xs bất kể size |
| `components/atoms/display/PricePoint/PricePoint.tsx:65` | `amount` bắt buộc khi có giá thật, không cần khi skeleton; union ép luật ở compile-time |
| `components/atoms/navigation/Pagination/Pagination.tsx:17` | Rule: namespace bắt buộc, không children, strict §4 (currentPage/totalPages bare), isSkeleton co-located |
| `components/atoms/forms/ImageDropzone/ImageDropzone.tsx:15` | Sửa 2026-07-26 nhóm A/B/F: bỏ classNames chết, icon đổi ReactNode→IconComponent, thêm `isDragActive` để ghim state kéo-thả |
| `components/atoms/forms/ImageDropzone/ImageDropzone.tsx:27` | Icon truyền dạng COMPONENT, type để MỞ (không khoá cứng type Phosphor) tránh khoá cả hệ vào 1 vendor |
| `components/atoms/chips/Chip/ChipBase.tsx:7` | 3 thay đổi lớn 2026-07-26: gộp `Chip.Dot` thành prop, xoá `StatusChip`, gộp bảng tone vào file; lý do dot KHÔNG dùng solid fill (đo token thật, chỉ khác opacity) |
| `components/atoms/chips/Chip/ChipBase.tsx:68` | Icon scale = font scale; sửa lỗi `size-3.5`→`size-3` (icon từng to hơn 1 nấc trên MỌI chip trong hệ) |
| `components/atoms/chips/Chip/ChipBase.tsx:109` | Glyph slot chỉ 1 chỗ ngồi → icon/dot loại trừ nhau compile-time; dot chỉ hiện khi có màu (không có `hasDot` boolean) |
| `components/atoms/chips/Chip/ChipBase.tsx:157` | Nhánh skeleton luôn xét trước; sửa bug 2026-07-27: từng vẽ pill `h-6` tự chế, lệch với `.chip` thật |
| `components/atoms/chips/Chip/ChipBase.tsx:177` | Đo thật: height skeleton = `leading-5` của `.chip`, không đoán chiều cao |
| `components/atoms/chips/Chip/ChipBase.tsx:213` | Không truyền `size` (no-op ẩn danh); cấm hạ size để fix riêng 1 chỗ (anchor: PriceTag) |
| `components/atoms/chips/Chip/ChipGroup.tsx:8` | `ChipGroup` là component DUY NHẤT trong họ Chip có deps thật (import ChipBase); thay `TagChips` cũ đã drift khỏi atom |
| `components/atoms/display/Avatar/AvatarGroup.tsx:8` | `Avatar.Group` cụm chồng mép, gộp năng lực từ `blocks/identity/AvatarGroup` (xoá 2026-07-25) |
| `main.ts:34` | Utils Storybook (BlockAnatomy...) không phải component hệ thống → nằm ngoài `components/` |
| `stories/atoms/forms/Select/Select.Combobox.stories.tsx:7` | Atom lá: trigger tóm tắt bằng text, xác nhận không compose Chip.Base → annotate rỗng |
| `stories/layouts/form/Form/Form.Actions.stories.tsx:7` | Khung hàng nút cuối form: items bắt buộc, children cấm, state chỉ align/sticky |
| `stories/atoms/forms/ImageDropzone/ImageDropzone.Base.stories.tsx:7` | 1 prop = 1 leaf; đổi icon→component, thêm leaf `DragActive` mới để ghim state kéo file |
| `stories/atoms/display/Spinner/Spinner.stories.tsx:6` | Atom lá, deps rỗng; part "Spinner" tự trỏ chính nó (không storyId) đã bị bỏ |
| `components/layouts/form/Form/Form.tsx:7` | `Form.*` chỉ còn LAYOUT (label/hint đã chuyển hẳn qua atom §12e); bảng 3 member + luật khung không mang behavior |
| `components/atoms/display/SnippetIcon/SnippetIcon.tsx:8` | Port từ blocks; sửa 2026-07-26: xoá backdoor `classNames.copyIcon/checkIcon`, thêm anatomy + `isCopied` để ghim state ✓ |
| `components/atoms/navigation/Tabs/Tabs.tsx:4` | Gộp `ExtendedTabs` vào `Tabs.Extended` 2026-07-26; nợ §12b (API items/children chưa hợp nhất) |
| `preview.tsx:8` | Canvas sạch; JSDoc thành mô tả trong Docs tab nhưng KHÔNG vẽ banner "Usage" trên canvas (chốt của thầy) |
| `stories/atoms/display/Progress/Progress.Meter.stories.tsx:5` | Không leaf Indeterminate (Meter luôn determinate); deps rỗng; sửa 2026-07-26: leaf `Bands`→`Colors` vì cũ chỉ render 3/5 giá trị |
| `stories/atoms/feedback/Feedback/Feedback.Empty.stories.tsx:9` | Khung layout tier, gộp 3 frame cũ (ErrorState/ErrorPageState/SimpleEmptyState); không leaf loading; leaf=structure đúng cho khung (khác atom) |
| `stories/atoms/forms/Select/Select.Single.stories.tsx:6` | Atom lá; trigger tóm tắt bằng text, KHÔNG compose Chip.Base → annotate bỏ hẳn |
| `stories/atoms/forms/Select/Select.Single.stories.tsx:115` | Đổi tên leaf `Labeled`→tách theo prop `value`; label đã có leaf riêng (§12g: 1 prop 1 leaf) |
| `stories/atoms/forms/Select/Select.Multi.stories.tsx:6` | Atom lá đa chọn; đã ĐỌC source xác nhận không compose Chip.Base cho giá trị đã chọn |
| `stories/atoms/forms/Select/Select.Multi.stories.tsx:116` | Đổi tên leaf tương tự Select.Single, cùng lý do §12g |
| `stories/layouts/chips/Chip/Chip.stories.tsx:6` | 2026-07-26: hàng Status/Tags rời index này, chuyển hẳn lên tầng atom (Chip.Base tone / Chip.Group) |
| `stories/atoms/display/StepBadge/StepBadge.Base.stories.tsx:5` | Vớt state từ 2 story CŨ (pre-canon) — đối chiếu từng story cũ để chứng minh KHÔNG mất state nào |
| `stories/atoms/navigation/Tabs/Tabs.Base.stories.tsx:6` | Leaf Skeleton đổi tên từ Loading 2026-07-27; bug thật đã sửa: trước đó bỏ qua `variant` trong nhánh isSkeleton, luôn ra cùng 1 pill |
| `components/atoms/overlay/Popover/Popover.tsx:4` | Namespace bắt buộc + không children (atom tự dựng trigger) + strict §4; 3 quyết định có ngày trong 1 khối |
| `components/atoms/overlay/Toast/Toast.tsx:4` | Compose từ Alert.Base (toast=callout cùng 1 hạt alert); trước đây tự import Alert từ heroui/react riêng → drift |
| `stories/atoms/forms/Input/Input.Number.stories.tsx:10` | Không annotate (atom bọc thẳng HeroUI, deps không có thì thôi — lần 2) |
| `stories/atoms/overlay/Tooltip/Tooltip.Base.stories.tsx:5` | Giữ children là ĐÚNG (§12b): atom-wrapper buộc bọc phần tử để react-aria gắn hover/focus |
| `components/atoms/overlay/Popover/Popover.Base.stories.tsx:6` | Không dùng annotate/parts (bỏ 2026-07-26) — 2 lý do: portal ra ngoài render-box + Trigger không có storyId thật |
| `stories/atoms/overlay/Menu/Menu.Base.stories.tsx:6` | Cùng lý do Popover: không annotate/parts vì portal + trigger không storyId |
| `components/atoms/overlay/Tooltip/Tooltip.tsx:4` | Bọc HeroUI Tooltip tối đa; namespace bắt buộc; children GIỮ vì atom-wrapper buộc bọc phần tử khác (ngoại lệ có tên, chỉ Tooltip+Badge) |
| `components/atoms/navigation/Link/LinkSeeMore.tsx:6` | Port từ SeeMoreLink; 2026-07-26 gộp vào namespace Link.* cùng LinkBack (§12a) |
| `components/atoms/navigation/Link/LinkSeeMore.tsx:54` | `gap-1`→`gap-2` để khớp LinkBack khi gộp namespace — phát hiện drift chính lúc gộp |
| `components/atoms/navigation/Link/LinkSeeMore.tsx:74` | Anchor lỗi cũ: mũi tên khoá cứng size-3.5 cho CẢ HAI size text — leaf Size render 2 cỡ chữ mà mũi tên y hệt nhau, dấu hiệu bug atom theo §12g |
| `components/atoms/navigation/Link/LinkSeeMore.tsx:90` | Thay `opacity-60` cũ bằng underline (2026-07-26): 1 hành vi "go there" mà 2 tín hiệu khác nhau giữa 2 member gây hiểu nhầm |
| `components/atoms/display/Badge/Badge.stories.tsx:6` | Atom lá bọc HeroUI Badge; annotate bỏ hẳn (§12g lần 2); children giữ hợp lệ vì Anchor cần bọc phần tử |
| `components/layouts/_spacing.ts:40` | `baseline` thêm 2026-07-27: hàng chữ nhiều cỡ (giá h4 cạnh giá gạch sm cạnh chip xs) phải canh chân chữ, không phải center |
| `components/layouts/_spacing.ts:76` | 2026-07-26: SSOT padding chuyển về đây từ Container.tsx, gộp với SurfaceCard để tránh 2 nguồn sự thật |
| `utils/AnatomyOverlay/AnatomyOverlay.tsx:6` | Rút gọn 2026-07-26: overlay không còn vẽ gì lên UI (bỏ border/label/badge/click), chỉ phát marker `data-anat-part`; lý do label cũ che mất chip 60px |
| `stories/atoms/forms/Input/Input.Otp.stories.tsx:10` | Không annotate (atom bọc thẳng HeroUI InputOTP + FieldFrame nội bộ) |
| `stories/atoms/forms/Input/Input.Text.stories.tsx:10` | Atom lá, mọi part là internal slot → không deps → annotate bỏ hẳn |
| `components/atoms/buttons/Button/ButtonBase.tsx:16` | 2 thay đổi lớn 2026-07-26: gộp `Button.Icon` thành prop `isIconOnly`, đổi tên `icon`→`prefixIcon` để đối xứng với `suffixIcon` |
| `components/atoms/navigation/Tabs/TabsExtended.tsx:5` | Đảo ngược 1 kết luận cũ: ghi chú TRƯỚC nói `children` là "vi phạm §12b thật", ghi chú SAU (đọc kỹ Toolbar - consumer thật) kết luận đó SAI, `children` là ngoại lệ hợp lệ |
| `components/atoms/forms/Input/Input.tsx:25` | Field-frame props mọi atom form nhận để tự mang nhãn/mô tả/lỗi/bắt buộc (thầy chốt 2026-07-25, không tách Field riêng) |
| `components/atoms/forms/Input/Input.tsx:42` | `Input.*` namespace theo TYPE input; wrap HeroUI tối đa, strict §4, isSkeleton co-located |
| `stories/layouts/data/Table/Table.Base.stories.tsx:7` | Phạm vi state Table.Base: khung sở hữu cấu hình cột + 3 state list (empty/loading/clickable rows); không lo format nội dung |
| `stories/layouts/data/Table/Table.Base.stories.tsx:42` | Anatomy per-leaf: cây thật Header⊃N Column, Body⊃N Row; cell không badge riêng |
| `stories/atoms/form/Form/Form.Base.stories.tsx:7` | Khung `<form>` thật + content column + actions slot; state chỉ isDisabled + layout body/actions |
| `components/atoms/display/UserCell/UserCell.tsx:6` | Port từ blocks/identity; compose Avatar.Base (không dùng UserAvatar đã xoá — DiceBear đã gộp vào Avatar.Base) |
| `components/atoms/display/UserCell/UserCell.tsx:29` | `true` khi hàng là của viewer hiện tại → đổi tone tên sang accent, prop semantic (atom tự chọn class) |
| `components/atoms/display/UserCell/UserCell.tsx:38` | Atom là BẢN GỐC DUY NHẤT của hình (§12c); skeleton avatar delegate thẳng Avatar.Base isSkeleton theo đúng size |
| `stories/atoms/forms/Input/Input.Date.stories.tsx:11` | Không deps (2026-07-26): DOM chỉ phát nội tạng FieldFrame + HeroUI DatePicker bọc thẳng |
| `stories/atoms/forms/Input/Input.Search.stories.tsx:16` | 2026-07-26 (§12g): leaf `Invalid` tách khỏi `Error` vì khác pixel (chỉ viền vs viền+chữ đỏ) |
| `stories/atoms/forms/Input/Input.Search.stories.tsx:44` | Leaf `placeholder`: trước 2026-07-26 bị nhét vào leaf Default, sai vì prop có shape riêng nhưng không leaf sở hữu |
| `stories/layouts/cards/ResizableRail/ResizableRail.tsx:12` (namespace decl) | Frame namespace drag-to-resize side-rail, port authored trong Storybook, không import @/components |
| `stories/layouts/layout/Disclosure/Disclosure.Base.stories.tsx:7` | Ground truth từ MockInterviewSession thật (nút caret xoay 180°); khác accordion nhiều panel (SurfaceCard.Accordion) |
| `components/atoms/buttons/Button/button-tokens.ts:3` | Token dùng chung họ Button — KHÔNG phải component, tách để ButtonIcon không phải import từ ButtonBase (2 component ngang hàng) |
| `components/atoms/buttons/Button/button-tokens.ts:16` | HeroUI không có `danger-soft`, phải mượn variant neutral rồi lớp thêm token; dùng cho hành động phá huỷ trong ngữ cảnh NHẸ |
| `components/atoms/buttons/Button/button-tokens.ts:42` | Nét icon Phosphor khai TẠI CHỖ, không import type `Icon` của thư viện — tránh khoá cả cây vào 1 vendor |
| `components/atoms/buttons/Button/button-tokens.ts:48` | Icon truyền dạng COMPONENT, atom tự render ở scale nút; `weight` optional vì atom tự cấp |
| `components/atoms/buttons/Button/button-tokens.ts:55` | ICON SCALE = FONT SCALE (chốt 2026-07-25); `!important` bắt buộc vì HeroUI có rule specificity cao hơn |
| `components/atoms/buttons/Button/button-tokens.ts:72` | WEIGHT theo size (§5.0a, chốt 2026-07-26): nét Phosphor co theo cỡ, dưới size-5 phải bold để đọc dày ngang size-5 regular |
| `components/atoms/buttons/Button/button-tokens.ts:92` | Bề ngang skeleton phải theo size; sửa bug: trước đây hard-code `w-24` cho cả 3 tier, 3 skeleton nhìn giống hệt nhau |
| `components/atoms/media/Image/Image.tsx:5` | Atom Image.Base tự dựng (HeroUI v3 không có Image), 3 state load tự quản lý (loading/loaded/error), isSkeleton là cờ ép từ ngoài |
| `components/atoms/display/Spinner/Spinner.tsx:3` | Atom bọc HeroUI Spinner, phân biệt bằng PROP (size/tone); KHÔNG có isSkeleton vì spinner tự nó đã là chỉ báo loading |
| `components/atoms/display/Logo/Logo.tsx:9` | Sửa 2026-07-26 (canon §4): `LogoProps = WithClassNames<undefined>` khiến `classNames` không thể gán được gì — API chết, đã bỏ |
| `components/atoms/navigation/Link/LinkBack.tsx:5` | Port từ BackLink; 2026-07-26 gộp vào namespace Link.* cùng LinkSeeMore |
| `components/atoms/navigation/Link/LinkBack.tsx:52` | Glyph size-3.5 khớp text-sm, bold bù nét; `translate` là property riêng trong Tailwind v4 nên transition phải là `[translate]` |
| `components/layouts/layout/ModalShell/ModalShell.tsx:6` | Frame namespace dialog-scaffold; footer là slot THẬT (trước đây mọi caller tự vẽ CTA row trong body — sai luật 1 slot 1 việc) |
| `stories/atoms/display/Logo/Logo.Base.stories.tsx:5` | Chỉ 1 leaf Default (className không sinh leaf); các cell cạnh nhau minh hoạ cùng shape khác size, vớt từ file cũ trước canon §12g |
| `stories/layouts/layout/Section/Section.Base.stories.tsx:11` | `Section.Base` = khung xếp header↔body↔footer, KHÔNG chrome; phân biệt rõ với SectionCard (có chrome+accent+withVerdict) |
| `stories/atoms/form/Form/Form.Section.stories.tsx:7` | Khung nhóm field có tiêu đề; chỉ 2 shape (có/không description); label/hint/error vẫn là của atom, không của khung |
| `stories/atoms/forms/Input/Input.Password.stories.tsx:10` | Atom lá, nút show/hide là nội bộ (không Button.Base) → không deps; leaf Invalid tách khỏi Error cùng lý do Input.Search |
| `components/layouts/navigation/Tabs/TabsBase.tsx` (16,40,161) | Namespace bắt buộc + không children; icon size-3.5+bold sửa từ size-4 trần cũ; badge tradeoff pr-4 (đã cân nhắc đặt số cạnh nhãn rồi bỏ) |
| `components/atoms/display/Avatar/AvatarBase.tsx` (7,147,168) | Gộp UserAvatar vào Avatar.Base (DiceBear là mặt mặc định); fallback chain theo LOAD ERROR chứ không chỉ thiếu URL; skeleton vẫn vẽ status dot tone neutral |
| `components/atoms/display/StepBadge/StepBadge.tsx:72` | size→weight đặt cạnh bảng size; anchor: trước đó hard-code bold cho CẢ HAI size khiến md đậm hơn mọi glyph size-5 khác trong hệ |
| `stories/layouts/navigation/Toolbar/Toolbar.Base.stories.tsx:11` | Đổi tên từ `TabsCard` (2026-07-25, tên sai vì không có card); phạm vi state: tab group đi bằng data, panel bên dưới không phải state của khung |
| `components/atoms/buttons/Button/ButtonGroup.tsx:6`, `atoms/buttons/Button/ButtonGroup.tsx:6` | 2 ButtonGroup khác nhau: 1 là container generic không áp role semantic; 1 là component DUY NHẤT có deps thật trong họ Button |
| `components/layouts/buttons/ChipButtonList/ChipButtonList.tsx:8` | Port từ 4 call-site gần giống hệt trong ContentAiChat, gộp thành 1 primitive dùng chung (§4 ownership) |
| `stories/atoms/display/SnippetIcon/SnippetIcon.Base.stories.tsx:6` | 1 prop 1 leaf; leaf `Copied` mới nhờ prop `isCopied` ghim state ✓ từ ngoài (trước đây phải fake bằng play() click) |
| `stories/atoms/forms/Input/Input.Tags.stories.tsx:10` | Dep thật duy nhất: mỗi token là Chip.Base removable thật, có storyId trỏ tới |
| `stories/atoms/display/Progress/Progress.Circle.stories.tsx:16` | Không annotate: atom lá bọc thẳng react-aria ProgressBar dạng circle |
| `stories/atoms/forms/Input/Input.Currency.stories.tsx:10` | Không annotate (lần 2); a11y: control ghép (stepper+input) không link được htmlFor nên atom tự đổ vào aria-label |
| `components/layouts/layout/Split/Split.tsx:5` | Layout frame trái↔phải; lý do là frame riêng (không phải Stack.H+justify-between): 2 phía có chiến lược width khác nhau (start truncate, end shrink-0) |
| `components/layouts/layout/Split/Split.tsx:67` | Anatomy tag cho chính khung này để cha badge được như 1 node (§11a.1) |
| `components/layouts/layout/Disclosure/Disclosure.tsx:7` | Frame namespace collapsible; ground truth MockInterviewSession thật, không dựa HeroUI Disclosure compound (layout khác) |
| `components/layouts/layout/Disclosure/Disclosure.tsx:58` | Skeleton mirror giữ nguyên box thật (caret thật, chỉ title thành shimmer) — §12c chủ hình là chủ skeleton |
| `components/atoms/forms/SearchAutocomplete/SearchAutocomplete.stories.tsx:8` (đúng: `SearchAutocomplete.tsx:69`) | Label atom tự mang (§12e); để trống → render "bare" như cũ |
| `stories/atoms/chips/Chip/Chip.Group.stories.tsx:5` | Phạm vi state cluster: chỉ items/maxVisible/tone/isSkeleton của HÀNG; state từng chip thuộc Chip.Base |
| `stories/blocks/learn/ContinueLearning/ContinueLearning.stories.tsx:5` | Block ra đời 2026-07-27 (thầy: "design chỉ là tầng UI/UX"); domain wording chuyển từ design lên block |
| `stories/atoms/overlay/Popover/Popover.Base.stories.tsx:6` | Không annotate/parts (bỏ 2026-07-26) — portal + trigger không storyId thật; leaf Placement/ShowArrow cần defaultOpen |
| `components/atoms/navigation/Tabs/TabsExtended.tsx:45` | Named exception §12b nhắc lại lý do (chi tiết ở TabsBase §4 header) |
| `components/layouts/layout/ResizableRail/ResizableRail.tsx:12` | (đã liệt ở trên) |

*(Đã liệt kê đủ ~140 khối decision trong mẫu 307; các file lặp cùng chủ đề chỉ ghi 1 lần đại diện — vd `AvatarBase.tsx`/`TabsBase.tsx`/`button-tokens.ts` có nhiều dòng cùng 1 mạch lý luận đã gộp vào 1 hàng.)*

## 3. 🟠 Sửa máy móc được

| Dạng | Số lượng (mẫu) | Sửa bằng gì |
|---|---|---|
| Marker đơn lẻ, câu ĐÃ tiếng Anh | ~40 finding (CourseContents.tsx, KeepGoingPath.tsx, SurfaceCard.tsx §S1, Container.tsx, PriceTag.tsx, PhaseScarcityNote.tsx, TrialConversionStrip.stories.tsx, Chip.Base.stories.tsx, Divider.stories.tsx...) | **Script thuần** — regex xoá `⭐⚠️⛔✅❌🔴📛🚨⏳` + emoji lẻ (🗑📐🕰️🧭✍️🎨), giữ nguyên câu chữ. Không cần người đọc lại nội dung, chỉ cần diff-review "chỉ mất ký tự unicode". |
| Marker gắn trong câu CÒN tiếng Việt | phần còn lại của 96 S1 | **Không thuần script** — phải dịch trước (đưa qua batch S3) rồi mới xoá marker, vì marker và câu Việt dính liền nhau. |
| Comment trivial (S3 kind=trivial) | 182 finding tổng, trong đó phần lớn (~90 finding rõ toạ độ + hàng trăm dòng trong các placeholder "còn N khối chưa liệt kê") | **Dịch máy có người kiểm** — dịch theo lô bằng LLM, người review chỉ cần bắt sai thuật ngữ kỹ thuật (tên prop, đơn vị, §). Không cần hiểu bối cảnh quyết định. |
| Chữ ký props sai khuôn (S2 kind=signature) | 28 finding / 20 file | **Codemod bán tự động** (ts-morph/AST): tách `Omit<>/Pick<>`/object literal trong destructure ra `type XProps = ...`, đổi chữ ký thành `(props: XProps)`. Người chỉ cần đặt/duyệt TÊN type, sau đó `tsc` xác nhận không lỗi. |
| Type object inline (S4) | 1 finding rõ vị trí (`KeepGoingPath.tsx:108`) | **Làm tay** — chỉ 1-2 chỗ, không đáng viết codemod riêng. |

## 4. S2 · Component sai khuôn (đại diện, script đo được 6 "component thật")

Script mechanical chỉ đếm **6 component thật** (không tính helper cục bộ không export trong file story); batch audit thủ công bắt thêm 22 helper cục bộ cùng lỗi dạng (Frame/Demo/Row/TabPanel/Controlled/CellBox/TriggerBox/Prose/Branch/BlockPreview/RowSkeleton/FieldSkeleton/AlignSample/ControlledModal/AccordionFrame*/CrossListRow/CardBody/leafCode — liệt đủ trong bảng "sửa máy móc"). 6 component thật:

| # | File:Dòng | Tên type đề xuất |
|---|---|---|
| 1 | `.storybook/components/designs/commerce/PriceTag/PriceTag.tsx:127` | `PriceTagBaseProps` (= `PriceTagProps & { role: PriceRole }`) |
| 2 | `.storybook/components/atoms/forms/Select/Select.tsx:106` | `SelectSingleProps` |
| 3 | `.storybook/components/atoms/forms/Select/Select.tsx:184` | `SelectMultiProps` |
| 4 | `.storybook/components/atoms/forms/Select/Select.tsx:264` | `SelectComboboxProps` |
| 5 | `.storybook/components/layouts/cards/SurfaceCard/SurfaceCard.tsx:392` | `SurfaceCardNestedSectionRowProps` (= `Omit<SurfaceCardNestedSection, "key"> & { isSkeleton? }`) |
| 6 | `.storybook/components/atoms/forms/Input/Input.tsx:176` (+ 6 member anh em cùng file: Textarea:129, Date:241, Currency:413, Time:481, Otp:536, Tags:604) | `InputNumberProps` và tương ứng `InputTextareaProps`/`InputDateProps`/`InputCurrencyProps`/`InputTimeProps`/`InputOtpProps`/`InputTagsProps` — **sửa 1 phải sửa cả 7, cùng pattern lặp lại trong 1 file** |

## 5. S4 · Type object lồng inline

| # | File:Dòng | Hiện tại | Tên type đề xuất |
|---|---|---|---|
| 1 | `.storybook/components/blocks/learn/KeepGoingPath/KeepGoingPath.tsx:108` | `module: { index: number; name: string }` | `interface ModuleLike { index: number; name: string }` → `module: ModuleLike` |
| 2 | *(chưa xác định vị trí)* | Script đếm 2 chỗ toàn repo nhưng batch audit chỉ khoanh được vị trí #1 | Cần rescan trước khi giao việc — xem mục Câu hỏi cho thầy |

## 6. ⚠️ Chỗ mất thông tin nếu sửa vội

| File:Dòng | Vì sao rủi ro |
|---|---|
| `Select.tsx:106` (và 6 member Input.tsx) | Phải giữ JSDoc từng field khi gộp vào type mới; sửa 1 trong 7 member Input mà quên 6 cái còn lại thì để sót vi phạm |
| `ButtonRadioGroup.tsx:54`/`Button.RadioGroup.stories.tsx:9` | Icon 🗑 trong ví dụ minh hoạ mô tả nút thật trên UI — phải đổi hẳn sang chữ ("delete"), không phải chỉ xoá dấu; giữ nguyên `⋮`/`\|` (ký hiệu bố cục, không phải emoji trang trí) |
| `Tabs.Extended.stories.tsx:9`, `TabsExtended.tsx:5` | Khối ghi lại một QUYẾT ĐỊNH BỊ ĐẢO NGƯỢC (ghi chú trước nói "vi phạm §12b thật", ghi chú sau sửa lại là SAI vì bỏ sót phân tích consumer) — dịch cẩu thả dễ làm mất chuỗi lập luận, người đọc sau không hiểu vì sao kết luận đảo chiều |
| `Feedback.Empty.stories.tsx:9` | Trích §12f/§14d.2 + link chéo sang cảnh báo trong `Alert.Base.stories.tsx` — mất 1 trong 3 neo là mất lý do phân biệt leaf-vs-state |
| `StepBadge.Base.stories.tsx:5` | Đây là bằng chứng "không mất state nào" khi vớt từ 2 story cũ — rút gọn là phá mất mục đích tồn tại của đoạn |
| `Tabs.Base.stories.tsx:6` | Ghi lại 1 bug THẬT đã sửa (before/after cụ thể) — rút gọn mất chi tiết tái hiện bug |
| `Popover.tsx:4` | 3 quyết định có ngày trong 1 khối (namespace/no-children/§4) — dịch nửa vời dễ rớt mất 1 trong 3 |
| `Toast.tsx:4` | Ghi lại quyết định dọn drift (từng tự import Alert riêng) — mất câu "trước đây..." là mất lý do tồn tại của cấu trúc hiện tại |
| `ButtonBase.tsx:16` | 2 lý do KHÁC NHAU trong 1 khối (gộp Button.Icon vì sao, đổi tên icon→prefixIcon vì sao) — gộp thành 1 câu chung chung là làm mất 1 lý do |
| `UserCell.tsx:6` | Câu tiếng Việt CUỐI đoạn là kết luận quan trọng nhất (hành động đúng cần làm) — dịch nửa đầu bỏ nửa sau là mất luôn kết luận |
| `Input.Search.stories.tsx:16` | Bỏ ngày + neo §12g/§12g.1 thì mất căn cứ để tra lại vì sao leaf `Invalid` tách khỏi `Error` |
| `CourseTeamGate.Base.stories.tsx:6` | "Từng có gate NGƯỢC" là bài học sự cố thật (bug hướng audience bị đảo ngược) — 2 leaf phía dưới tồn tại chính vì bài học này |
| `ContinueCard.Hero.Progress.stories.tsx:49` | Bài học DRIFT thật (cây từng mô tả cấu trúc đã chết, không khớp DOM) — câu "NEVER matched what was actually rendering" phải giữ nguyên lực cảnh báo |
| `_shared.tsx:79` | Ghi lại bug đo được thật (DOM có node mà cây tuyên bố không có) — rút gọn mất bằng chứng có thể kiểm chứng lại |
| `ContinueLearning.stories.tsx:5` | Chuỗi ví dụ tiếng Việt "Đã đọc 8/23 bài" là NỘI DUNG DOMAIN thật, không phải comment — giữ nguyên văn, không dịch |
| `LinkBack.tsx:52` | Khối comment JSX bị SÓT khỏi script quét dòng tiếng Việt (không nằm trong danh sách viLines) — cần đọc file trực tiếp để tìm, không dựa máy quét |
| `_spacing.ts:40` | Bài học cụ thể (PriceTag từng phải gõ tay `items-baseline`) là lý do tồn tại của giá trị `baseline` — bỏ sót thì người sau không hiểu vì sao thêm giá trị này vào union |

## 7. Thứ tự BATCH đề nghị (rẻ & an toàn trước)

| Batch | Sửa gì | Bao nhiêu file | Máy kiểm được không |
|---|---|---|---|
| 1 | Xoá marker THUẦN (câu đã tiếng Anh, chỉ có ký tự trang trí) — quét regex 1 lượt | ~50-60 file (phần S1 đã tiếng Anh) | **Có, 100%** — diff chỉ mất ký tự unicode, không đổi text nào khác; chạy prettier/eslint sau để chắc không vỡ format |
| 2 | Bóc chữ ký props S2 (Omit/Pick/object-inline → type có tên) | 20 file, 28 chỗ (bao gồm cả 6 component "thật" + helper cục bộ) | **Có, bán tự động** — codemod AST + `tsc --noEmit` xác nhận không lỗi type; người chỉ duyệt TÊN type |
| 3 | Bóc type inline S4 | 1-2 file (1 đã biết, 1 cần rescan trước khi giao) | Có, làm tay 1-2 chỗ, tsc kiểm luôn |
| 4 | Dịch comment TRIVIAL còn lại (S3 kind=trivial, phần lớn 1897 dòng) | 124 file | Dịch máy theo lô + người kiểm thuật ngữ nhanh (không cần hiểu bối cảnh quyết định) |
| 5 | Dịch khối DECISION (mục 2) + xoá marker dính trong câu Việt (S1 còn lại) | ~60 file, ~140 khối | **KHÔNG giao máy** — người đọc dịch từng khối, giữ đủ §/ngày/before-after; làm SAU CÙNG vì tốn thời gian nhất và rủi ro mất thông tin cao nhất nếu vội |

## 8. Câu hỏi cho thầy

1. **S2 có tính helper cục bộ không export không?** Mẫu 28 finding phần lớn (22/28) là hàm render helper CHỈ sống trong 1 file `.stories.tsx` (`Frame`, `Demo`, `Row`, `TabPanel`, `Controlled`, `CellBox`, `TriggerBox`...), không export ra ngoài. Luật S2 nói "MỌI component" — có bắt các helper này phải đặt `XProps` riêng, hay chỉ áp cho component export thật (khi đó chỉ còn 6 chỗ khớp với số script đếm)?
2. **S4 mới xác định được 1/2 vị trí.** Script đếm 2 type object lồng inline toàn `.storybook/**`, batch audit chỉ khoanh được `KeepGoingPath.tsx:108`. Cần chạy lại script định vị dòng cho vị trí thứ 2 trước khi giao batch — có cần ưu tiên việc này ngay, hay gộp vào lần audit sau?
3. **Các placeholder "còn N khối trivial chưa liệt kê"** (rải trong ~15 vị trí, cộng lại ước ~250-300 dòng) chưa có toạ độ file:line cụ thể. Cho phép dịch nguyên khối theo TỪNG FILE (không cần audit lại từng dòng), hay bắt buộc phải re-scan ra toạ độ chính xác trước khi đụng vào?
4. **JSDoc "REMOVED X (lý do)"** kiểu lịch sử (StatusChip/TagChips/Chip.Dot đã xoá, giải thích tại sao) đang được giữ nguyên trong nhiều file như tư liệu tránh tái phạm. Giữ mãi mãi hay có hạn dùng (vd xoá sau N tháng khi không còn ai nhớ nhầm) để JSDoc không phình to dần theo thời gian?
