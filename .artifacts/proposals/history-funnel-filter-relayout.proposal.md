# Proposal — Lịch sử (quiz + mock) theo layout review + filter phễu

> Nguồn: feedback thầy 2026-07-17 (route /courses/*/learn/flashcards/quiz?tab=history + /learn/mock-interview?tab=history).
> Chuẩn tham chiếu = **FlashcardReviewHistory** ("lịch sử ở đây ok nhất"). Filter = **phễu popover** như `ProfileChallengeManage`.
> Kèm: BUG mất-lịch-sử mock-interview đã FIX riêng (didMountRef guard) — nằm ngoài proposal này.

## Bối cảnh (3 màn hiện tại)

| Màn | Toolbar/filter | Nhóm | Row | Load-more |
|---|---|---|---|---|
| **review** (CHUẨN) | `SearchInput` (theo deck) + toggle nhóm deck/time (icon TabsCard) + count | deck→Accordion · time→LabeledCard frameless→SurfaceListCard | date/deck + ProgressMeter + XP chip | Button secondary self-center |
| **quiz** | 2 hàng `FlexWrapButtonRadio` chip INLINE (mode · level) | time bucket (đã giống review) | date + mode·count + level/coverage/XP chip + caret, expand weak-tags | Button secondary |
| **mock** | `TabsCard secondary` (all/qna/design), server-side | PHẲNG (không nhóm) | title + date + score chip + caret → result | `LabeledCard onSeeMore` |

## Đích redesign

Đồng nhất 2 màn quiz + mock về **cùng dáng review**, filter dời vào **1 phễu**:

### Toolbar chung (pattern `ProfileChallengeManage`)
`<div flex justbetween>`:
- trái: `SearchInput` (flex-1) + `Popover(Button isIconOnly ghost FunnelIcon, Badge đếm facet active)` chứa các nhóm `FlexWrapButtonRadio` (label `body-xs muted`) + nút `danger-soft` "Xóa lọc" khi có facet.
- phải: `Typography body-sm muted` count ("Tìm thấy N" / "N lượt").

### Quiz history
- **Bỏ 2 hàng chip inline** → chuyển `mode` + `level` vào **phễu** (2 nhóm FlexWrapButtonRadio: Chế độ [Tất cả/Nhanh/Sâu] · Cấp [Tất cả/Junior/…]). Chỉ render nhóm khi `presentModes/presentLevels > 1` (giữ logic no-dead-filter).
- **Search**: quiz run không có title/deck → **KHÔNG search** (chỉ phễu + count). *(Thầy chốt 2026-07-17: không search.)*
- Giữ nguyên: time-bucket grouping, row expand weak-tags, load-more button.

### Mock history
- **Bỏ `TabsCard secondary`** → `mode` (all/qna/design) vào **phễu** (1 nhóm FlexWrapButtonRadio). Vẫn server-side (SWR key giữ `modeFilter`).
- **Thêm search** theo `promptTitle` (client-side over loaded items, như review search theo deck).
- **Thêm time-bucket grouping** (LabeledCard frameless subtleLabel → SurfaceListCard) để khớp review — thay list phẳng. Dùng `groupByTimeBucket` (đã có, `../../historyBuckets`) trên `createdAt`.
- **Load-more**: đổi từ `LabeledCard onSeeMore` sang **Button secondary self-center** (khớp review).
- Giữ: row title + date-trong-subtitle + score chip + caret → result.

## Cơ hội (đề xuất, chờ thầy quyết)
3 màn giờ lặp y hệt: `offset+items+totalCount accumulate` · `previousCourseIdRef` guard · time-bucket group · load-more · toolbar. **Nên trích 1 block chung** (vd `HistoryListLayout` + `HistoryToolbar` với slot funnel-facets + render-row) để 3 màn chỉ feed data + row. Giảm 3 bản logic dễ lệch (đúng tinh thần `single-source-render`). NHƯNG là refactor rộng hơn — có thể làm **phase 2** sau khi chốt hình hài ở phase 1.

## Files chạm (phase 1, không trích block chung)
- `FlashcardQuizHistory/index.tsx` — toolbar phễu, bỏ chip inline.
- `MockInterviewHistory/index.tsx` — toolbar phễu + search + time-group + load-more button.
- i18n vi/en: key filter heading ("Chế độ"/"Cấp"/"Loại"), "Xóa lọc", search placeholder mock, count.
- (không đụng review — nó là chuẩn.)

## Verify
tsc + eslint sạch · đi ma trận state (rỗng/1 lượt/N/filtered-rỗng/load-more/error) trên cả 2 màn · phễu: badge đếm đúng, clear reset đúng, no-dead-filter giữ nguyên.

## Reconcile
Toolbar phễu + time-group là feature-composition từ block canonical đã có (SearchInput, Popover, FunnelIcon, FlexWrapButtonRadio, LabeledCard, SurfaceListCard) — không block mới. Không cần story mới trừ khi trích block chung (phase 2).
