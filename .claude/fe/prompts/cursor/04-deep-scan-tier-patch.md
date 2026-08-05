# FE tier patch: atoms, composites, and frames

You are working in `D:\Repositories\starci-academy`.

**Landed 2026-08-06 (call sites + tooling sync).** The live frame seam contract is singular:
`principle?: PrincipleToken`, helper `principleAttr`, DOM `data-principle="token"`, exactly one
token per frame instance. The module filename `_principles.ts` may stay plural as the token
registry. Do not reintroduce `principles`, `principlesAttr`, `data-principles`, or token arrays.

This is a bounded architecture patch after the deep audit of the three sentence tiers. Do not
mass-edit unrelated blocks, pages, or the full lint debt. Work Storybook first, then mirror the
same semantic change to `src`.

## Read first

- `.storybook/FE-REFACTOR-CONTRACT.md`
- `.claude/fe/proposals/FE-ARCHITECTURE-REFACTOR-2026-08-05.md`
- `.claude/fe/README.md`
- `D:\Repositories\starci-academy-backend\.claude\canon\fe\enforce\tiers\atom.md`
- `D:\Repositories\starci-academy-backend\.claude\canon\fe\enforce\tiers\composite.md`
- `D:\Repositories\starci-academy-backend\.claude\canon\fe\enforce\tiers\frame.md`
- `D:\Repositories\starci-academy-backend\.claude\scripts\audit\audit-atoms.mjs`
- `D:\Repositories\starci-academy-backend\.claude\scripts\audit\audit-composites.mjs`
- `D:\Repositories\starci-academy-backend\.claude\scripts\audit\audit-frames.mjs`
- `D:\Repositories\starci-academy-backend\.claude\scripts\gates\check-no-namespace.mjs`

## Non-negotiable contract

1. Top-down ownership is strict: atoms own one vendor value/control; frames own layout and the
   parent seam; composites assemble atoms and frames; blocks own product/domain meaning.
2. `Dropzone`, `ImageDropzone`, and `FieldFrame` are not frames. They own behavior, field
   semantics, or multiple rendered regions, so they belong in `composites/form`. Do not create a
   `DropzoneFrame` or any other frame merely to hold a dashed border or a gap.
3. Atom public props must not expose `className` or `classNames`. Remove them from atom prop
   interfaces, destructuring, stories, and call sites. Internal vendor-constraining class strings
   are allowed. Placement belongs to the parent frame's singular `principle` token.
4. A public frame instance has exactly one `principle?: PrincipleToken`, never an array. Emit it
   with `principleAttr` as `data-principle`. Convert historical `principles={["x"]}` only when
   migrating leftover trees: the live form is `principle="x"`. When code has multiple tokens on
   one node, do not join them: identify the actual seam owner and split the node or retain only
   the one correct token.
5. Buildable composition is mandatory for named regions: use
   `ComponentTypeWithSkeleton<P>` and pass an uncalled component reference. Do not introduce new
   `ReactNode`/`children` doors for a component region. Text props may remain strings or
   `ReactNode` where the host owns the text semantics.
6. No runtime namespaces. No `Choice.Checkbox`, `Input.Text`, `Select.Single`, `Progress.Bar`,
   `Skeleton.Typography`, `Stack.V`, or equivalent exported object/member API. Use direct named
   exports and filesystem barrels only. Do not confuse Storybook story names such as `Skeleton`
   with runtime component namespaces.
7. Keep comments and JSDoc in English ASCII. No Vietnamese, emoji, typographic AI punctuation,
   or migration-history comments. Every exported interface, type, function, component, and enum
   member needs the repository's JSDoc contract.
8. Do not silence a violation with an eslint disable. Component patches do not edit ESLint plugins
   or audit scripts; tooling sync is a separate batch. If an audit rule is wrong, record it in the
   decision ledger instead of changing the rule inside a component patch.

## Audit evidence to resolve

### Atoms

- Storybook atom audit: 51 folders, 69 exports; 9 missing `isSkeleton`/`@noSkeleton` claims; 2
  stories still pass placement classes to `Spinner` and `Tooltip`; parity drift exists in the
  forms and display atom twins.
- Source atom audit: 49 folders, 68 exports; source skeleton coverage is currently clean, but the
  Storybook blueprint must be corrected first and mirrored.
- Human judgement candidates that can remain atoms only when documented: `Badge`, `Tabs`, and
  `Tooltip` accept vendor-owned trigger/content children and do not arrange house components.

### Composites

- Both trees have the same 6 existing-atom bypasses: `ButtonRadioGroup`, `InputButtonLike`,
  `AvatarGroup`, `Toolbar`, `CodePreviewTabs`, and Markdown `map` import HeroUI
  `Button`/`Avatar`/`Tabs`/`Accordion` directly. Replace those imports with house atom named
  exports.
- Both trees have the same missing vendor-boundary atoms: `ButtonGroup`, `Card`, `CardContent`,
  `Radio`, `RadioGroup`, `Table`, `AlertDialog`, `Drawer`, `Modal`, `AvatarFallback`,
  `Label`, `Switch`, `ListBox`, `Select`, `ProgressBar`, `ProgressCircle`, and the
  relevant skeleton atom needed by `InlineIconLabel`. Add only reusable direct vendor adapters;
  do not create an atom to hide a domain composite.
- `MarkdownContent/map` still declares `className`; remove the free string and put placement on
  its owning frame.
- `InlineIconLabel` hand-draws a HeroUI skeleton. Keep one real render tree and forward
  `isSkeleton` into real atom/component slots. The composite chooses the number of regions; each
  atom chooses its own skeleton shape.

### Frames

- `Box`, `DrawerRoot`, and `ModalRoot` still use raw `className` and `children`. Convert
  ordinary regions to named buildable slots and closed `classNames?: Array<AllowedClassName>`
  only where a positioning token is genuinely required.
- `Box` is the single documented escape hatch for a foreign mount point. Preserve it only when a
  caller truly needs raw vendor skin/style; mark that exception clearly and do not copy the
  exception into any other frame.
- `anatPart` is retired (`decision-ledger.json` → `anat-part-contract-conflict` applied). FRAME-11
  forbids `anatPart` / `showAnatomy` / `data-anat-part` on both trees. Identity is `data-tier` +
  `data-component`.
- Confirm every frame prop is arrangement, seam, alignment, frame-owned chrome, or a named slot.
  Review `identity`, `explain`, `isSkeleton`, `nested`, `inline`, `at`, `side`, and shell-specific
  props instead of deleting them mechanically.
- `Flex` is the implementation owner for layout classes. A frame may keep frame-owned chrome such
  as the nested guide; it must not accept arbitrary appearance classes.

## Subagent partition

Run these as disjoint work areas. Each subagent must list files before editing and must not touch a
file outside its assigned area.

### Wave A: Storybook atom/form re-tier

Assigned paths:

- `.storybook/components/atoms/forms/Dropzone/**`
- `.storybook/components/atoms/forms/ImageDropzone/**`
- `.storybook/components/atoms/forms/_field/**`
- corresponding Storybook stories and the minimum form barrel edits

Tasks:

- Move `Dropzone` and `ImageDropzone` to `.storybook/components/composites/form/` with direct
  named exports and updated story imports.
- Move the shared `FieldFrame` scaffold to the composite form helper area. Replace its component
  `children`/`skeletonControl` door with a typed buildable control slot where feasible; preserve
  accessibility and controlled form behavior.
- Remove public atom class props. Do not replace them with a second free-form style prop.
- Keep `useDropzone`, `File`, MIME/size validation, drag state, hint/error, and multi-region
  rendering in the composite. Do not extract a fake frame.
- Update tier metadata, barrels, story IDs, dependency annotations, and imports.

### Wave B: Storybook composite vendor boundary

Assigned paths:

- `.storybook/components/composites/buttons/**`
- `.storybook/components/composites/cards/**`
- `.storybook/components/composites/data/**`
- `.storybook/components/composites/feedback/**`
- `.storybook/components/composites/form/**`
- `.storybook/components/composites/layout/**`
- `.storybook/components/composites/lists/**`
- `.storybook/components/composites/navigation/**`
- `.storybook/components/composites/stats/**`
- `.storybook/components/composites/text/InlineIconLabel/**`
- `.storybook/components/composites/viewers/MarkdownContent/**`

Tasks:

- Replace direct HeroUI imports with existing house atoms.
- For missing vendor boundaries, create the smallest direct wrapper in the matching atom family;
  give it a real public named export, JSDoc, skeleton behavior or an explicit no-skeleton claim,
  and no public class props.
- Fix `InlineIconLabel` to render the real icon/text structure in both states and forward
  `isSkeleton` instead of drawing a parallel HeroUI skeleton tree.
- Remove `className` from Markdown map and route placement through its parent frame.
- Do not solve a missing atom by moving a domain composite downward.

### Wave C: Storybook frames

Assigned paths:

- `.storybook/components/frames/**`
- `.storybook/stories/frames/**`
- frame barrel files and frame-only test fixtures

Tasks:

- Convert the principle API to one token per frame instance and update all frame callers in this
  area.
- Do not add `anatPart`. The overlay is retired on both trees.
- Change `Box`, `DrawerRoot`, and `ModalRoot` away from raw `className`/`children` except for the
  explicit `Box` escape-hatch case. Prefer named `body`/`items` buildable slots.
- Remove stale runtime namespace exports such as `Stack`; expose direct named members only.
- Keep the frame API about direction, seam, alignment, structural chrome, and buildable slots.

### Wave D: mirror to source

Assigned paths:

- matching `src/components/atoms/**`
- matching `src/components/composites/**`
- matching `src/components/frames/**`
- matching source barrels and affected source tests only

Tasks:

- Mirror the accepted Storybook decisions without copying anatomy props or Storybook-only
  imports.
- Resolve source parity drift reported by ATOM-11 and FRAME-12. Do not use source as a reason to
  skip the Storybook-first order.
- Finish direct named-export migration for `Progress`, `Stack`, and `Skeleton` in the touched
  areas, updating consumers and barrels without compatibility namespace objects.

### Wave E: coordinator and verification

Do not edit component implementation files. Review the subagent diffs for ownership and overlap.
Run:

```text
npm run lint -- --max-warnings=0 <changed files>
npx tsc --noEmit
npm run audit:fe
node D:\Repositories\starci-academy-backend\.claude\scripts\gates\check-no-namespace.mjs .storybook
node D:\Repositories\starci-academy-backend\.claude\scripts\gates\check-no-namespace.mjs src
```

Also run the focused atom/composite/frame audits with the backend scripts against both trees.
Check that no changed atom has a public `className`/`classNames`, no changed frame has an array of
principle tokens, and no changed component receives an already-built component node where a buildable
`ComponentTypeWithSkeleton` slot is required.

Stop and report a decision instead of guessing when a change would alter a public controlled-form
API, a Storybook story ID, or a domain component's tier. Record every such decision in
`.claude/fe/decision-ledger.json` or the current ledger path.

Final report must include:

- files changed per wave;
- every re-tier decision and its reason;
- every new vendor atom and its public named export;
- namespace imports removed;
- audit results with remaining pre-existing debt separated from regressions;
- `tsc` and focused lint status.
