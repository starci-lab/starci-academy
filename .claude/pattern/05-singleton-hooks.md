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
