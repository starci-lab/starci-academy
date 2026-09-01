# Runtime component namespaces — inventory — 2026-08-08

## Contract

`starci-fe/no-runtime-namespace` is active. Folders group direct named exports; no
`export const Modal = { … }` compatibility objects.

## Namespace exports (remove)

| Component | SB | src | Named exports already present |
|---|---|---|---|
| ButtonGroup | yes | yes | Root, Separator |
| Modal | yes | yes | Root…CloseTrigger |
| Drawer | yes | yes | Root…CloseTrigger |
| Select | yes | yes | Root, Trigger, Value, Indicator, Popover |
| ListBox | yes | yes | Root, Item |
| AlertDialog | yes | yes | Root…Footer (+ Heading) |
| Table | yes | yes | Root…Cell |
| Page | yes | yes | PageHeader, PageBottomBar (re-exports) |

**Total exports: 16** (8 × SB+src).

## House consumers of the namespace object

**None found.** ModalShell, DrawerShell, ConfirmDialog, Toolbar, MarkdownTableParts,
ButtonRadioGroup, MermaidDiagram, Table composite, stories — all already import
direct named exports (`ModalRoot`, `SelectRoot`, …).

## `Component.Member` JSX usages

Almost all are **HeroUI vendor** imports (`import { Modal } from "@heroui/react"`),
allowed by the rule’s vendor allowlist. Includes Auth modal, LearnMobileBar,
Navbar, ContactForm, TabsCard, PracticeFilters, CvEditor, Skeleton Table, etc.

Story anatomy metadata strings (`"Modal.CloseTrigger": { tier: "heroui", … }`) —
**prose/metadata**, leave alone.

ResizableRail story ListBox — HeroUI fixture; leave.

FlexWrapButtonRadio `ButtonGroup.Separator` — HeroUI; leave (comments mention house name as prose).

## export-matches-folder

Currently requires an export whose name equals the folder (`ButtonGroup`). After
removing the object, folders only export `ButtonGroupRoot` etc. → **update rule**
to accept a direct named-export family (`name === folder` OR `name.startsWith(folder)`
with a PascalCase continuation).

## Migration plan

1. Strip namespace objects from all 16 definition files (SB first, mirror src).
2. Update `export-matches-folder`.
3. Tighten `no-runtime-namespace` usage to any member on listed component names
   (vendor still exempt).
4. No consumer JSX/import rewrites required for house trees.
5. Revert ledger intent that mirrored ButtonGroup namespace for ATOM-11 — twins stay
   equal by **both lacking** the object.

## Counts

| Metric | Before |
|---|---|
| Runtime namespace exports | 16 |
| House consumer files needing import rewrite | 0 |
| Vendor `Modal.*` / `Select.*` call sites | leave (allowed) |
