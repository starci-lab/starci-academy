# 09 — Providers

`src/components/providers/` + provider khác ráp trong `app/layout.tsx` / `app/InnerLayout.tsx`.

## Provider
- `HeroUIProvider.tsx` — HeroUI v3 context (theme tokens, overlay…).
- `NextThemesProvider.tsx` — `next-themes` (light/dark/system).
- `SwrProvider.tsx` — `<SWRConfig value={{ provider: () => new Map() }}>` (cache store in-memory Map).
- `ReduxProvider` (ở `src/redux/`) — Redux store.
- `SwrContext` provider (ở `hooks/singleton/swr/`) — chạy mọi core SWR hook 1 lần (xem 05).

## Thứ tự ráp (ngoài → trong, điển hình)
```
ReduxProvider
  └ NextThemesProvider
     └ HeroUIProvider
        └ SwrProvider (SWRConfig)
           └ SwrContext.Provider   ← singleton SWR
              └ {children} (page)
```
- i18n context (`next-intl`) set ở `app/[locale]/layout.tsx`.
- Thêm provider global mới → thêm vào `providers/` + ráp trong InnerLayout đúng thứ tự (provider phụ thuộc redux/theme phải nằm trong).
