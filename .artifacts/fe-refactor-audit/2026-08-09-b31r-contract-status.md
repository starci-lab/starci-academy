# BATCH 31r-contract — Canonical IconTile composite

**Status:** blocked at Phase 1 inventory (no product edits)  
**Checkpoint:** `18f84f5b`

## Verdict

Atomic completion is impossible under the proposed size map + locked/page holds. No canonical composite was created; both duplicate `IconTile` paths remain.

## Inventory (80 open-tag consumers)

| Kind | Count |
|---|---|
| atom path | 44 |
| block path | 36 |
| `size="sm"` | 65 |
| `size="md"` | 5 |
| `size="lg"` | 10 |
| Nivo/Nivoexpert locked | 6 |
| page-folder-likely | 28 |
| LeaderboardListCard hold | 1 |
| size-map CONFLICT sites | 15 |
| block `sm` → must become canonical `md` | 30 |

## Proposed map vs live chrome

| size | proposed | atom today | block today |
|---|---|---|---|
| sm | 40 + round | 40 + round ✓ | **48 + rounded-xl** (→ remap to md) |
| md | 48 + rounded-xl | **64 + round** CONFLICT | **64 + rounded-2xl** CONFLICT |
| lg | 64 + rounded-2xl | **80 + round** CONFLICT | **80 + rounded-2xl** CONFLICT |

Storybook atom is the blueprint and currently matches the **atom** column (all round). The proposed md/lg map is **not** Storybook-faithful without an approved visual remap.

## Why no apply

1. Cannot edit Nivo/Nivoexpert → cannot delete atom path (no forwarder).
2. 15 CONFLICT consumers need separate size decisions (do not silently remap).
3. 28 page consumers fail zero-warn ratchet if touched.
4. LeaderboardListCard import held by batch forbid.

## Artifacts

- `2026-08-09-b31r-contract-inventory.json`
- `2026-08-09-b31r-contract-status.{json,md}`
- `2026-08-09-b31r-contract-worker-*.json`
