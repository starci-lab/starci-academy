# Connected block always has a presentational twin

> **STRICT · machine-enforced:** `starci-fe/connected-block-has-presentational-twin` and
> `starci-fe/presentational-purity`.

## Law

A block that reads request/SWR, message catalogue, store, session, router or runtime context is
connected. Its folder must contain both halves:

```text
index.tsx       X   - reads the world and resolves data, copy, actions and situation
component.tsx  _X  - pure; receives resolved values and renders the complete tree
```

`index.tsx` imports the exact `_${FolderName}` from `./component`. Every JSX render path in the
connected half renders only `_X`. It must not render a leaf, branch, HeroUI primitive or alternate
tree directly.

`component.tsx` must not fetch, translate or read store/session/router/context. It is the only
place where business situations become presentation, including pending, empty and error states.

## No exceptions

None of these excuses removes the twin:

- it renders only one leaf;
- every situation currently has the same tree;
- it has no local domain state;
- `_X` only passes a few props through;
- two files feel verbose.

Inline ESLint config is disabled in `src/components/blocks/**/{index,component}.tsx`. Therefore
`eslint-disable` cannot silence this law. There is no allowlist, option, warning level or temporary
exception.

## Test contract

- `component.test.tsx` renders `_X` without request, locale or store providers.
- `index.test.tsx` tests world wiring with the real catalogue and boundary mocks.
- An unresolved request is `data === undefined` without a terminal error, including the interval
  where an SWR key is disabled while viewer/session prerequisites settle. `isLoading === true` is
  never the sole pending test.
- Every connected block test covers `{ data: undefined, error: undefined, isLoading: false }` and
  proves the presentational twin remains pending rather than exposing settled zero, empty or ready
  content.
- A page whose blocks settle independently keeps every block mounted in its loading shape; a fast
  request may not erase or stand in for a slower sibling.
- If `_X` needs a world provider, the split has failed.
- If connected `index.tsx` contains a JSX element other than `_X`, it owns presentation and
  violates the law.
