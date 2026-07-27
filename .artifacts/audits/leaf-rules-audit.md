# Audit BỘ LUẬT LEAF — Storybook (R0-R12)

**Ngày:** 2026-07-27
**Tổng:** 83 finding vi phạm, trải trên **51 component/story-file** khác nhau, do 12 agent chấm (dữ liệu thô không cho biết tổng số component ĐÃ chấm, chỉ có finding vi phạm — không suy ra được tỉ lệ sạch/bẩn).

---

## 1. Bảng tổng theo LUẬT

| Luật | Luật nói gì (rút gọn) | Số finding | Số component dính |
|---|---|---|---|
| R12 | Mọi leaf phải có prop `code` (tab Code không rỗng) | 20 | 19 |
| R2 | Tầng layout/design/block/screen tách leaf theo CẤU TRÚC, không theo từng prop | 19 | 17 |
| R1 | Tầng atom: 1 prop có hình = 1 leaf | 13 | 11 |
| R7 | State chỉ đổi dữ liệu không tách leaf | 11 | 10 |
| R0 | Chỉ tách leaf khi hình do CHÍNH component vẽ đổi | 7 | 6 |
| R3 | `isSkeleton` phải có leaf riêng ở MỌI tầng | 5 | 4 |
| R6 | Prop chỉ là chữ/số không có leaf riêng | 3 | 2 |
| R11 | Leaf skeleton phải rẽ theo trục hình thật của component | 2 | 2 |
| R8 | `items`/`options` sinh cấu trúc = chính leaf Default, không đẻ thêm leaf | 1 | 1 |
| R9 | Tên leaf phải đúng trục nó vẽ (skeleton ≠ "Default") | 1 | 1 |
| R10 | Leaf phải vẽ đủ union của trục | 1 | 1 |
| **Tổng** | | **83** | **51** |

---

## 2. Bảng theo TẦNG

| Tầng | Số finding | Ghi chú |
|---|---|---|
| **layout** | **59** | Tầng yếu nhất — chiếm 71% tổng vi phạm. Chủ yếu R12 (thiếu BlockAnatomy) và R2 (tách leaf theo prop thay vì cấu trúc). |
| atom | 17 | Chủ yếu R1 (prop có hình thiếu leaf). |
| design | 5 | R3 (skeleton) + R0/R7 (leaf trùng data). |
| block | 1 | R7. |
| screen | 1 | R9 (tên leaf skeleton = "Default"). |

---

## 3. 🔴 Phải sửa trước (severity high — 25 finding, gom theo luật)

### R12 — thiếu `BlockAnatomy`/`code` (17 finding)
| Component | File:line | Vi phạm | Sửa |
|---|---|---|---|
| CoverImage | `.storybook/stories/atoms/media/CoverImage/CoverImage.stories.tsx:21` | 2 leaf (WithImage/NoImage) không BlockAnatomy | Bọc BlockAnatomy + `code` |
| HighlightChip | `.storybook/stories/layouts/chips/HighlightChip/HighlightChip.stories.tsx:19` | 7 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| InlineIconLabel | `.storybook/stories/layouts/text/InlineIconLabel/InlineIconLabel.stories.tsx:24` | 7 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| QRCode | `.storybook/stories/atoms/media/QRCode/QRCode.stories.tsx:21` | 4 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| CourseProgressBar | `.storybook/stories/layouts/stats/CourseProgressBar/CourseProgressBar.stories.tsx:1` | 3 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| ButtonGroup (layout) | `.storybook/stories/layouts/buttons/ButtonGroup/ButtonGroup.stories.tsx:0` | 6 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| ProgressMeter | `.storybook/stories/layouts/stats/ProgressMeter/ProgressMeter.stories.tsx:1` | 15 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| DragScrollArea | `.storybook/stories/layouts/layout/DragScrollArea/DragScrollArea.Base.stories.tsx:1` | 4 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| InputButtonLike | `.storybook/stories/layouts/buttons/InputButtonLike/InputButtonLike.stories.tsx:1` | 6 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| PDFView | `.storybook/stories/layouts/rendering/PDFView/PDFView.stories.tsx:1` | 5 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| FloatingActionButton | `.storybook/stories/layouts/buttons/FloatingActionButton/FloatingActionButton.stories.tsx:1` | 2 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| ProgressRing | `.storybook/stories/layouts/stats/ProgressRing/ProgressRing.stories.tsx:1` | 12 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| Legend | `.storybook/stories/layouts/stats/Legend/Legend.stories.tsx:1` | 6 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| FlowDiagram | `.storybook/stories/layouts/rendering/FlowDiagram/FlowDiagram.stories.tsx:1` | 2 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| HighlightCard | `.storybook/stories/layouts/cards/HighlightCard/HighlightCard.stories.tsx:55` | 2 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| RichText | `.storybook/stories/layouts/rendering/RichText/RichText.stories.tsx:18` | 12 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |
| EnumChip | `.storybook/stories/layouts/chips/EnumChip/EnumChip.stories.tsx:1` | 7 leaf không BlockAnatomy | Bọc BlockAnatomy + `code` |

### R3 — `isSkeleton` bị nhét lẫn, không có leaf riêng (5 finding)
| Component | File:line | Vi phạm | Sửa |
|---|---|---|---|
| VariantChip.Difficulty | `.../designs/chips/VariantChip/VariantChip.Difficulty.stories.tsx:25` | isSkeleton nhét vào leaf `Levels`, trích canon cũ §14d.2 để biện minh | Tách leaf `Skeleton` riêng, vẽ đủ union difficulty |
| Image | `.../atoms/media/Image/Image.stories.tsx:12` | isSkeleton nhét vào leaf `WithImage`, JSDoc trích §14d.2 | Tách leaf `Skeleton` riêng |
| SurfaceCard.Nested | `.../layouts/cards/SurfaceCard/SurfaceCard.Nested.stories.tsx:20` | Không leaf nào minh hoạ isSkeleton | Thêm leaf `Skeleton`/`Loading` |
| SurfaceCard.List | `.../layouts/cards/SurfaceCard/SurfaceCard.List.stories.tsx:423` | Leaf `Loading` tự chế skeleton bằng tay, không dùng `isSkeleton` thật; JSDoc sai (nói component "NO isSkeleton flag") | Sửa leaf gọi `isSkeleton` thật + sửa JSDoc |
| List.Row | `.../layouts/lists/List/List.Row.stories.tsx:92` | isSkeleton nhét vào leaf `LeadingSubtitle`, trích §14d.2 | Tách leaf `Skeleton` riêng |

### R1, R7, R11 (1 finding mỗi luật)
| Component | Luật | File:line | Vi phạm | Sửa |
|---|---|---|---|---|
| Typography | R1 | `.../atoms/text/Typography/_leaves.tsx:45` | Prop `size` (10 giá trị, 3 nhánh render heading/code/body) không leaf nào minh hoạ | Thêm leaf `Sizes` vẽ đủ union (tối thiểu 1 ví dụ mỗi nhánh) |
| ContinueCard.Hero.Progress | R7 | `.../designs/cards/ContinueCard/ContinueCard.Hero.Progress.stories.tsx:128` | Leaf `NotUrgent`/`Urgent` tách riêng dù comment tự nhận "SAME parts", chỉ khác tone | Gộp thành 1 leaf `Loaded` vẽ cả 2 tone |
| ChipButtonList | R11 | `.../layouts/buttons/ChipButtonList/ChipButtonList.stories.tsx:179` | Leaf `Loading` chỉ vẽ 1 hình skeleton (direction=wrap), impl còn rẽ nhánh skeleton cho direction=column | Thêm leaf skeleton thứ 2 cho `direction="column"` |

---

## 4. 🟠 Sửa sau (severity medium — 38 finding, gom gọn theo dạng)

**R2 — tách leaf theo GIÁ TRỊ prop thay vì gộp union / theo cấu trúc thật (13 finding):**
HighlightChip (`tone` → 5 leaf), InlineIconLabel (Tones/Sizes/Truncate), Container (Sizes/Padding), ProgressMeter (4 leaf Tone), Page.Header (SizePage/SizeCompact), DragScrollArea (NativeScrollbarShown/CustomFadeSize), InputButtonLike (Sizes).

**R12 — thiếu BlockAnatomy/code (medium, 3 finding):** SurfaceCard.Placeholder, ResizableRail (leaf `ShrinkingMaxWidth` lẻ loi thiếu code trong khi 2 leaf kia có).

**R7 — leaf trùng cấu trúc, chỉ khác dữ liệu (9 finding):** TrialConversionStrip (`PriceLoadedNoFreeLeft`), ProgressMeter (Empty/Half/Complete/LabelAndValue/CountUnit + TargetBelow/TargetReached), Page.Header (`DescriptionClamped` = Minimal với mô tả dài hơn), ChipButtonList (WithDisabledItem/SingleItem), ModalShell (`PlainFormClusters`), DragScrollArea (`ShortNoOverflow`), MetricCard (Default/WithHint/LongText trùng `FULL_PARTS`, cộng thêm Default vi phạm định nghĩa "tối giản" vì đã bật sẵn `hint`).

**R1 — prop có hình thiếu leaf (atom, 7 finding):** Input.Tags (thiếu leaf `Placeholder`, Default lại bật sẵn placeholder), Choice.Checkbox/Switch/RadioGroup (thiếu leaf `Invalid` độc lập với `errorMessage`), QRCode (`size` tách 3 leaf theo giá trị thay vì gộp), SearchAutocomplete (label/hint/errorMessage/isRequired không leaf nào dùng), Menu (`placement` không leaf), Tabs.Base (Default không tối giản + `variant` thiếu leaf riêng), Accordion.Base (`allowsMultiple` tách 2 leaf thay vì gộp 1).

**R0 — leaf trùng, hình không đổi do chính component vẽ (5 finding):** AsyncContent (`ContentSlot` trùng `Content`), PriceTag (`CurrencyUsd` trùng `WithDiscount`), InputButtonLike (`TruncatedPlaceholder` trùng Default — class `truncate` vốn không điều kiện).

**R11/R10 (còn lại, 2 finding):** PriceTag (leaf Skeleton chỉ vẽ 1 hình, thiếu cả Inline+Prominent), ProgressRing (size/tone rải thành 7 leaf lẻ thay vì gộp 2 leaf union).

**R9 (1 finding, 3 file):** CourseContents Desktop/Mobile/Tablet Skeleton — leaf isSkeleton đặt tên `"Default"`.

**R8 (1 finding):** FlowDiagram — `Architecture`/`LinearSequence` tách leaf chỉ vì dữ liệu đồ thị khác, cùng node-type (xem mục 5, có tranh cãi).

---

## 5. 🟡 Vặt (severity low — 20 finding, chỉ đếm)

R2 (leaf trùng do đổi class/state không đổi cấu trúc): Toolbar, AsyncContent (x2 — CustomIcon Empty/Error), Disclosure (x2 — Controlled/Disabled), InputButtonLike (Sizes), StatRibbon.
R1 (prop nhỏ thiếu leaf ở atom): Input.Otp (`length`), Badge (`showZero`), Toast (`icon` custom).
R7 (leaf state trùng cấu trúc, atom con): ButtonGroup (x2 — Pending, SingleAction).
R6 (leaf chỉ đổi chữ): AsyncContent (x2 — WithDescription Empty/Error), ProgressRing (CustomLabel).
R0 (leaf không đổi hình do chính component vẽ): Form.Base (Submitting/Disabled), PriceTag (DiscountWithoutBreakdown), ResizableRail (OverflowScrollsInRail), StatPair (Single/Row/Grid).
R12 (thiếu story hoàn toàn): ButtonGroup atom (không có file story nào).

Tổng 20 finding trên 14 component (một số component xuất hiện nhiều lần khác luật).

---

## 6. ⚠️ Mâu thuẫn cần thầy chốt

1. **R8 vs R2 — `nodes`/`edges` của FlowDiagram**: finding gán R8 (prop sinh cấu trúc = Default, không đẻ thêm leaf) cho việc gộp `Architecture`+`LinearSequence`. Nhưng 2 leaf đó vẽ ra TOPOLOGY khác nhau thật (đồ thị phân nhánh 6 node vs chuỗi thẳng 4 node) — nếu coi "hình đồ thị" là hình do component vẽ thì đó là CẤU TRÚC khác (R2 cho phép tách ở tầng layout), không chỉ là "dữ liệu". Bộ luật hiện chưa phân biệt rõ "dữ liệu sinh cấu trúc thật khác" với "dữ liệu chỉ đổi nội dung". Cần thầy chốt: FlowDiagram nên gộp 1 leaf hay giữ 2 leaf minh hoạ 2 kiểu topology?

2. **Canon cũ §14d.2 vẫn còn trong story và tự justify sai**: VariantChip.Difficulty, Image, và List.Row đều có comment/JSDoc trích dẫn nguyên văn "§14d.2: skeleton không tách leaf" để biện minh việc KHÔNG tách — đúng cái bẫy R3 cảnh báo. Đây không phải 2 agent chấm ngược nhau, mà là 3 nơi trong code đang neo vào luật đã bị thay thế. Cần thầy xác nhận: có cần quét toàn repo tìm hết chỗ trích §14d.2 để dọn luôn thay vì sửa lẻ từng file?

3. **Định nghĩa "Default tối giản" ở tầng layout khi prop tuỳ chọn là một phần thiết kế thường trực**: MetricCard's `Default` bật sẵn `hint` (tuỳ chọn) trùng cấu trúc với `WithHint`; StatPair thì ngược lại — 2 leaf `Row`/`Grid` bị đề xuất xoá vì "hình do CALLER vẽ, không phải StatPair" (R0), nhưng không rõ nên xoá hẳn hay CHUYỂN sang story của component cha (Card/Grid). R0-R12 chưa có luật nói rõ trường hợp "leaf minh hoạ cách compose với cha" có hợp lệ không. Cần thầy chốt hướng xử lý.

4. **Form.Actions leaf `Pending` — mâu thuẫn nội bộ giữa §12f và bộ luật leaf mới**: chính comment trong file (dòng 88-92) tự đặt câu hỏi "nếu áp §12f nghiêm thì XOÁ story này" nhưng vẫn giữ lại leaf. Cần thầy xác nhận §12f (state của atom con không thuộc leaf khung cha) có được coi là tương đương/bổ sung cho R2 hay không, để xử lý dứt điểm case này và các case tương tự (ButtonGroup `Pending`).

---

## 7. Cách sửa hàng loạt (batch, rẻ nhất trước)

| # | Batch | Luật | Số finding | Máy kiểm được? | Cách làm |
|---|---|---|---|---|---|
| 1 | Đổi tên leaf `"Default"` → `"Skeleton"` cho state isSkeleton | R9 | 1 (3 file) | ✅ hoàn toàn — grep `isSkeleton: true` + `leaf: "Default"` trong cùng object | Sửa string literal, không đổi logic |
| 2 | Bọc `BlockAnatomy` + `code` cho leaf đang render trần | R12 | 20 | ✅ phát hiện — script grep file trong `stories/**` không có `import.*BlockAnatomy`; ❌ tự sửa (mỗi leaf cần code-snippet đúng ngữ cảnh) | Viết scanner liệt kê hết file thiếu import BlockAnatomy → người sửa từng file theo mẫu leaf cạnh (VD Toolbar.Base, PriceTag đã đúng) |
| 3 | Thêm leaf `Skeleton` riêng cho component có `isSkeleton` nhưng story nhét chung | R3 | 5 | ✅ phát hiện — script: với mỗi component có `isSkeleton?:` trong file impl, kiểm story có export tên chứa Skeleton/Loading hay không | Người thiết kế state skeleton (đặc biệt SurfaceCard.List cần dùng cơ chế mirror thật, ChipButtonList/PriceTag cần rẽ 2 nhánh theo R11) |
| 4 | Gộp các leaf dùng chung 1 biến `parts=`/cùng cấu trúc, chỉ khác giá trị prop hoặc dữ liệu | R2 + R7 | 13 + 9 = 22 | 🟡 bán tự động — script tìm export cùng file dùng chung hằng `parts={X}` hoặc cùng biến PARTS → liệt kê cặp nghi trùng; người quyết cách gộp (giữ tên nào, thêm state gì trong leaf) | Áp cho: HighlightChip, InlineIconLabel, Container, ProgressMeter, Page.Header, DragScrollArea, InputButtonLike, TrialConversionStrip, ChipButtonList, ModalShell, MetricCard |
| 5 | Xoá leaf trùng/không đổi hình do chính component vẽ | R0 + R6 | 5 + 3 = 8 | 🟡 bán tự động — cùng cách dò `parts=` trùng + note tự nhận "SAME composition/parts" (nhiều file đã tự viết comment thú nhận) | AsyncContent, PriceTag, InputButtonLike, Form.Base, ResizableRail, StatPair |
| 6 | Thêm leaf còn thiếu cho prop có hình chưa từng minh hoạ | R1 | 13 | ❌ cần người — mỗi prop cần hiểu impl để biết hình đổi thế nào (Typography size 3 nhánh, Choice isInvalid độc lập errorMessage, Menu placement 4 hướng...) | Việc thiết kế state mới — không script được, ưu tiên Typography (R1 high) trước |
| 7 | Rẽ đủ nhánh hình cho leaf skeleton theo trục variant | R11 | 2 | ❌ cần người | ChipButtonList (direction), PriceTag (Inline/Prominent) |
| 8 | Gộp leaf lẻ theo giá trị thành 1 leaf union | R10 | 1 | 🟡 bán tự động (pattern giống batch 4) | ProgressRing size/tone |
| 9 | Tạo story còn thiếu hoàn toàn | R12 | 1 | ✅ phát hiện — glob không ra file story | ButtonGroup atom (`Atoms/Buttons/Button/Button.Group`) |

**Thứ tự làm:** 1 → 2 → 3 → 9 (đều máy dò ra hết, chỉ cần người tay chân bọc code) → 5 → 4 → 8 → 6 → 7 (càng về sau càng cần hiểu biz/impl sâu, không script được).
