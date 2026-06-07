# 05 — Singleton Hooks (core + impls + Context)

`src/hooks/singleton/` — pattern QUAN TRỌNG NHẤT của FE. Lặp ở: `swr/`, `formik/`, `overlay-state/`, `socketio/`.

## 3 lớp
```
swr/
├─ core/                  # hook THẬT: gọi API + dispatch redux
│  └─ api/graphql/{queries,mutations}/useXxxSwrCore.ts
├─ SwrContext.tsx         # "use client" — chạy MỌI core hook 1 lần, gom vào context
├─ impls/                 # wrapper mỏng: use(SwrContext) trả đúng swr cần
│  └─ api/graphql/{queries,mutations}/useXxxSwr.ts
└─ index.ts               # export impls + SwrContext
```

### core — `useXxxSwrCore()`
Gọi `useSWR(key, fetcher)`; fetcher gọi `queryXxx` (modules/api) rồi `dispatch` kết quả vào redux slice.
```ts
export const useQueryCourseEnrollmentStatusSwrCore = () => {
    const dispatch = useAppDispatch()
    const course = useAppSelector((s) => s.course.entity)
    const authenticated = useAppSelector((s) => s.keycloak.authenticated)
    return useSWR(
        course?.id && authenticated ? ["QUERY_COURSE_ENROLLMENT_STATUS_SWR", course.id, authenticated] : null,
        async () => {
            const data = await queryCourseEnrollmentStatus({ request: { courseId: course!.id } })
            dispatch(setEnrollment(data!.data.courseEnrollmentStatus.data?.enrollment))
            return data!.data
        },
    )
}
```
- SWR key = mảng `[NAME, ...deps]`; trả `null` để **skip** khi chưa đủ điều kiện (chưa login / chưa có id).

## SWR fetch discipline (RULE — fetch ÍT NHẤT có thể)

Mục tiêu: mỗi key chỉ fetch **đúng 1 lần** cho 1 bộ điều kiện, **không** refetch thừa. 4 quy tắc bắt buộc:

### 1. Cache key — luôn `[NAME, ...primitiveDeps]`, KHÔNG bao giờ object/template
- Phần tử đầu = **hằng tên** viết HOA (`"QUERY_..._SWR"`) — định danh duy nhất toàn app.
- Các phần tử sau = **primitive ổn định** (string/number/boolean): id, locale, page, flag redux. SWR so key bằng so sánh nông từng phần tử.
- ❌ TUYỆT ĐỐI KHÔNG bỏ object/array/`{...}`/template literal `` `x-${id}` `` làm phần tử key → mỗi render là một reference/string mới → SWR coi là key khác → **refetch liên tục** (cache-miss storm). Tách thành các primitive: `[NAME, id, page]`, không phải `[NAME, { id, page }]`.
- Deps phải **minimal**: chỉ đưa vào key những biến **thực sự đổi response**. Thừa 1 dep đổi-mỗi-render = fetch storm; thiếu 1 dep response-changing = data cũ sai ngữ cảnh.

### 2. Key-gating — chỉ fetch khi đủ điều kiện (`cond ? [...] : null`)
Đây là cách "hạn chế fetch" mạnh nhất: **chưa đủ điều kiện thì key = `null` → SWR KHÔNG gọi API**. Gộp mọi tiền-đề bằng `&&`:
```ts
// chỉ fetch khi: đã login  VÀ  redux có courseId  VÀ  đang ở đúng trang
const authenticated = useAppSelector((s) => s.keycloak.authenticated)
const courseId      = useAppSelector((s) => s.course.entity?.id)
const pathname      = usePathname()
const onLearnPage   = pathname.includes("/learn")
return useSWR(
    authenticated && courseId && onLearnPage
        ? ["QUERY_X_SWR", courseId]          // key chỉ chứa dep đổi-response
        : null,                              // thiếu 1 điều kiện → skip hẳn
    async () => { ... },
)
```
- "API này phải vào web A mới fetch" → thêm `pathname.includes("/A")` (hoặc cờ redux của trang) vào điều kiện gate.
- "biến B trong redux phải có value mới fetch" → `b && [...]`. Dùng optional-chain (`s.x.entity?.id`) để gate luôn ra `undefined` khi chưa có.
- Điều kiện gate **không** cần nằm trong key nếu nó không đổi response (vd `authenticated`, `onLearnPage` chỉ để bật/tắt) — nhưng nếu giá trị nó đổi response thì PHẢI có trong key. Nguyên tắc: **gate = điều kiện bật fetch; key = thứ làm response khác đi.**

### 3. KHÔNG tự bật refetch — kế thừa default "fetch tối thiểu" từ provider
`SwrProvider` đã set global: `revalidateOnFocus:false`, `revalidateOnReconnect:false`, `dedupingInterval:60s`. Core hook **mặc định KHÔNG override** → data chỉ fetch **on-mount (1 lần)**, không fetch lại khi chuyển tab/đổi focus hay reconnect mạng.
- ❌ KHÔNG thêm `revalidateOnFocus:true` / `revalidateOnReconnect:true` / `refreshInterval` trừ khi data **thật sự realtime** (job polling, health check). Nếu bật, phải có lý do ghi trong JSDoc và **gate** interval theo điều kiện (vd chỉ poll khi status `PENDING`).
- Cần làm tươi sau hành động (submit form…) → gọi `mutate()` thủ công đúng key đó, KHÔNG bật auto-revalidate toàn cục.

### 4. `keepPreviousData` — default `false`, opt-in cho phân trang
Global default = **`keepPreviousData:false`** (khớp loading-gate rule: key đổi → `data` undefined → skeleton, KHÔNG hiện data bài cũ khi đổi id ngữ cảnh). Chỉ hook **phân trang THUẦN** (cùng ngữ cảnh, đổi theo `page`) mới **opt-in `keepPreviousData:true`** ở core hook để mượt khi lật trang. KHÔNG bật `true` cho query đổi theo id ngữ cảnh (content/challenge/module/course).

### SwrContext.tsx
`"use client"` provider gọi TẤT CẢ `useXxxSwrCore()` một lần, gom thành object, đưa qua `createContext`. → mỗi SWR key chỉ có **1 instance** toàn app (singleton, tránh refetch trùng).

### impls — `useXxxSwr()`
Wrapper mỏng, component dùng cái này:
```ts
export const useQueryCourseEnrollmentStatusSwr = () => {
    const { queryCourseEnrollmentStatusSwr } = use(SwrContext)!
    return queryCourseEnrollmentStatusSwr
}
```

## Quy tắc
- **Component LUÔN import từ `impls`, KHÔNG import `core` trực tiếp.**
- Thêm operation mới: tạo `core/.../useXxxSwrCore.ts` → đăng ký trong `SwrContext.tsx` (import + gọi + thêm vào object) → tạo `impls/.../useXxxSwr.ts`.
- Cùng pattern cho `formik/` (form state), `overlay-state/` (modal/drawer open state), `socketio/` (realtime).

## No prop-drilling (RULE — con đọc singleton, KHÔNG nhận props)
Vì state dùng chung (SWR data, form state, overlay state) đều là **singleton**, component con **đọc trực tiếp** qua impls hook, **KHÔNG** nhận qua props. Container chỉ orchestrate; nó **không** chuyền data/handler xuống con.
- **NGOẠI LỆ DUY NHẤT = dạng list**: list container + list item nhận **per-item data** qua props (vd `LaneCard` nhận `mode`, `TierCard` nhận `tier`) — vì mỗi item khác nhau, không thể đọc từ singleton. Selection/disabled per-item cũng truyền như list props.
- Con KHÔNG-phải-list (header, form panel, status line, effective-state…) → **propless**, tự gọi `useQueryXSwr()` / `useXFormik()` / `useXOverlayState()`.
- Form: tạo formik singleton (vd `useAiSettingsFormik`) giữ values + `onSubmit` (gọi mutation) + `status` (qua `formik.status`); con đọc `formik.values`/`setFieldValue`/`status` trực tiếp. Action phụ (vd remove key) đọc mutation singleton + `formik.setStatus` ngay trong con.
- ⇒ Nếu thấy 1 component (không phải list) nhận > ~1-2 props data/handler → sai pattern, chuyển sang đọc singleton.

## Loading gate (RULE — skeleton phụ thuộc SWR)
Component render skeleton **khi và chỉ khi** SWR ở 1 trong **3** trạng thái: đang tải, chưa có data, hoặc lỗi. Default gate cho mọi data-dependent content = `isLoading || !data || error` → skeleton. Tức **chỉ render nội dung thật khi `!isLoading && !!data && !error`**.
```ts
const { data, isLoading, error } = useQueryXSwr()
const ready = !isLoading && !!data && !error
if (!ready) return <XSkeleton />   // skeleton content-shaped — hình hài xem .claude/design/06-skeleton.md
return <X data={data} />
```
- **KHÔNG** đưa `isValidating` vào gate — revalidate nền (đã có data cũ) KHÔNG hiện skeleton, để tránh nhấp nháy khi SWR refetch. Chỉ 3 điều kiện: `isLoading`, `!data`, `error`.
- `error` vẫn skeleton (có thể kèm toast — KHÔNG để layout trống/nhảy).
- KHÔNG dùng `Spinner` cho tải nội dung trang/list (chỉ cho action ngắn). *Hình* skeleton (metric, mirror layout, `SkeletonText`) là phần UI → `.claude/design/06-skeleton.md`.

### Static chrome KHÔNG nằm trong gate (breadcrumb + header)
Chrome tĩnh — **breadcrumbs** và **page header** (`SubPageHeader`/tiêu đề trang) — chỉ phụ thuộc i18n/locale/router, **KHÔNG** phụ thuộc SWR data → render THẬT **ngoài** gate, hiện ngay từ lần đầu. Chỉ gate phần content phụ thuộc data.
```ts
return (
    <div className="…">
        <Breadcrumbs>…</Breadcrumbs>        {/* thật, ngoài gate */}
        <SubPageHeader … />                  {/* thật, ngoài gate */}
        {ready ? <X data={data} /> : <XSkeleton />}   {/* chỉ content bị gate; ready = !isLoading && !!data && !error */}
    </div>
)
```
- ⇒ **KHÔNG skeleton-hoá breadcrumb/header**. `XSkeleton` chỉ mirror phần content (vd grid/list), KHÔNG chứa breadcrumb skeleton hay header skeleton.
- Lý do: chrome tĩnh không cần chờ data; vẽ skeleton cho nó chỉ gây nhấp nháy + lệch layout vô ích.
