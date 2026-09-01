# B33c ESLint delta (normalized)

Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`
Before: checkpoint `139391b6` via temporary worktree
After: active worktree (post certification repairs)

## Totals

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Raw messages | 7146 | 6911 | -235 |
| Affected files | 1262 | 1237 | -25 |
| Errors | 0 | 0 | 0 |
| Warnings | 7146 | 6911 | -235 |
| StarCi | 7135 | 6900 | -235 |
| A11y (observed) | 11 | 11 | 0 |

## Hold classes

| Class | Before | After | Delta |
|---|---:|---:|---:|
| a11y-observed | 11 | 11 | 0 |
| actionable | 6423 | 6192 | -231 |
| locked | 712 | 708 | -4 |

## Baseline note

B33 status candidate claimed before **7136 / 1260**. Normalized checkpoint remeasure is **7146 / 1262**.
Use the normalized pair for all B33c claims.

## Certification repairs reflected in after

- SB CollapsibleSidebar: do not reintroduce `className` (src retains for mia-mia)
- Reverted ResponsiveBreadcrumb HeroUI→atom migration (introduced identity-root)
- Reverted Auth EmailField/PasswordField inlining (introduced identity-root on CredentialsState)
- Removed unused `oauth-button-item` module
