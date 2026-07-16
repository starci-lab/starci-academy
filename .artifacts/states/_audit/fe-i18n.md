# Audit code-style: i18n (FE) — đối chiếu `patterns/fe/i18n.md`

Nguồn: `D:\Repositories\starci-academy\src` (476 file `useTranslations`, 0 file `react-i18next`/`useTranslation` thật — khớp baseline rubric).

## Findings

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `src/app/[locale]/contact/page.tsx:22` | §3 cấm hardcode string user-facing (ternary locale inline) | `title: locale === "vi" ? "Liên hệ" : "Contact"` | đẩy vào `messages/{vi,en}.json` (vd `contact.metaTitle`), dùng `getTranslations` |
| `src/app/[locale]/status/page.tsx:22` | §3 cấm hardcode string user-facing (ternary locale inline) | `title: locale === "vi" ? "Trạng thái hệ thống" : "System status"` | đẩy vào `messages/{vi,en}.json` (vd `status.metaTitle`), dùng `getTranslations` |
| `src/app/[locale]/architecture/page.tsx:22` | §3 cấm hardcode string user-facing (ternary locale inline) | `title: locale === "vi" ? "Hệ thống StarCi, đang sống" : "StarCi's system, live"` | đẩy vào `messages/{vi,en}.json` (vd `architecture.metaTitle`), dùng `getTranslations` |

Không phải vi phạm (đối chiếu rồi loại): các `locale === "vi" ? "vi-VN" : "en-US"` trong `layout.tsx`, `InterviewSessionDetailDrawer`, `MockInterviewSession`, `LegalPage`, `modules/seo/buildMetadata.ts` — đây là format-locale/BCP-47 mapping cho phép ở §5 (`useLocale()` chọn định dạng/nhánh dữ liệu), không phải chuỗi UI hiển thị người dùng.

Không tìm thấy vi phạm mới ở: `react-i18next`/`i18next` import (0 file), destructure `{ t } = useTranslations()` sai cách (0 chỗ), nối chuỗi `t(...) + count` hoặc `count === 1 ? ... : ...` (0 chỗ), hardcode literal tiếng Việt có dấu ngoài `messages/` (0 file quét được).

`next/navigation` (`useRouter`/`usePathname`) vẫn mix rộng (178 file) và `@heroui/react` `Link` còn dùng ở 5 file thay vì `@/i18n/navigation` — nhưng rubric §5 chỉ ghi "ưu tiên", không STRICT/CẤM, và tự nhận repo hiện "MIX" — không tính là vi phạm mới, chỉ là nợ đã biết.

## Tổng

3 vi phạm — đúng bằng phần rubric đã cảnh báo trước ("~7 file route/config cũ" còn ternary locale hardcode; 3/7 file này (`contact`, `status`, `architecture`) là hardcode chuỗi UI thật, 4 file còn lại trong danh sách grep là format-locale hợp lệ). Mức nghiêm trọng: THẤP — phạm vi hẹp (3 route metadata title), không phải pattern lan rộng, có sẵn trong rubric là nợ đã biết chưa dọn.
