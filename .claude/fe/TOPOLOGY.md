# StarCi FE component topology

Status: **approved local execution contract**
Authority: operational projection of the cross-repo FE canon
Applies to: `src/components/**`

This document freezes how the StarCi component layers are interpreted during
the current refactor. It does not create a second design system. When backend
canon changes deliberately, update this projection and its lint rules together.

## Dependency topology

```text
resources / modules / hooks
              |
              v
            leaves
              |
              v
           branches
              |
              v
         composites
              |
              v
            blocks
              |
              v
      pages / layouts / overlays
              |
              v
             app
```

The important dependency rule is directional:

- leaves import no higher visual tier;
- branches depend on low-level types/leaves only and never domain components;
- composites arrange independently meaningful leaves into one fixed reusable shape;
- shells isolate vendor mechanics whose interior shape they deliberately do not interpret;
- blocks compose leaves, branches and composites;
- pages/layouts/overlays compose blocks and lower vocabulary;
- app owns framework providers and route wiring.

No lower tier imports a higher tier.

## Non-UI

### Owns

- `resources/`: copy, configuration, route metadata and locale data;
- `modules/types/`: domain/data shapes;
- `modules/utils/`: pure functions;
- `hooks/`: fetching, state and orchestration;
- `app/`: framework/provider wiring.

### Must not

- return buildable JSX as data;
- contain visual chrome decisions;
- hide reusable helpers inside component folders.

## Leaf (`src/components/leaves/`)

A leaf owns one intrinsic visual value or one control behavior.

### Owns

- one vendor boundary;
- intrinsic size, radius, color, focus and disabled behavior;
- its own `isSkeleton` shape;
- finite appearance props such as `size`, `tone`, `variant`.

### Must not

- expose `className`, `classNames` or `style`;
- accept placement, gap, margin, width or flex-participation decisions;
- render a reusable arrangement of independently meaningful leaves;
- know domain entities;
- accept arbitrary ReactNode composition;
- export a house runtime namespace.

One leaf may render another leaf only when that child is an intrinsic part of the SAME value or
control: Button + its icon, Link + its caret, Text + its glyph. If the parts retain independent
meaning, loading, reading order or action, the owner is a composite.

`Fixed interior` and `always rendered together` do not make a leaf. The phrase `cluster leaf` is
not a valid tier and must never be used as an escape hatch. Icon + label + fact, label + input +
hint, seven day cells, or title + figure + progress bar are composites.

## Branch (`src/components/branches/`)

A branch owns contract-driven structural grammar: direction, seam, measure, responsive
visibility, landmark, pin/fill behavior or shell topology.

### Generic frame

Examples: Stack, Grid, Form.

A generic frame instance has one semantic structural owner:

```tsx
<StackV principle="block-boundary" items={[Header, Content]} />
```

When `principle` is present, it exclusively owns applicable gap/padding/
alignment behavior. The caller cannot also pass gap, padding, align, justify,
className or classNames.

### Named frame

Examples: ShowFrom, Measure, FooterFrame, ViewportShell.

Its finite component contract already names the structural decision. It does
not receive a fake public principle in addition to that contract.

Canonical rule:

```text
One structural node has exactly one structural decision owner.
```

The owner is either one principle on a generic frame or the named frame itself.

### Must not

- know domain data;
- fetch;
- choose product copy or icons;
- expose CSS-shaped APIs;
- inspect child identity to decide layout;
- accept unconstrained children.

## Composite (`src/components/composites/`)

A composite is a fixed reusable semantic arrangement of independently meaningful leaves.

### Owns

- reusable arrangements independent of domain;
- its own internal host and the stable seams among its leaves;
- `CompositeProps<Data, Actions>` and source marker `shape: "composite"`;
- contract identity through `defineCompositeComponent`, declared as `composite:` in the registry;
- finite semantic variants;
- which children rest and how many during skeleton state;
- typed buildable slots; arbitrary ReactNode holes remain forbidden;
- optional caller identity only when it is genuinely root-capable.

### Must not

- import HeroUI directly;
- expose public or per-part CSS doors;
- use domain-specific props;
- own page topology;
- accept built JSX for buildable slots;
- decide its placement in its parent.

## Block

A block is a domain sentence with an explicit connected/presentational seam.

Every block that reads anything outside props has exactly two halves:

```text
index.tsx       X   - connected: reads request, catalogue, store, session, router or context
component.tsx  _X  - presentational: receives resolved state, copy and actions; renders the tree
```

The connected half must import the exact `_${FolderName}` from `./component`, and every JSX
render path in that half must render that twin. Thin blocks are not exempt.

### Owns

- mapping domain data/state/actions into vocabulary;
- choosing which semantic components appear;
- domain-specific labels and finite branches;
- block root identity.

The connected `index.tsx` owns world reads and mapping them into resolved props. The pure
`component.tsx` owns every presentation decision and must render without request, catalogue,
store, session or router providers.

### Must not

- draw raw structural hosts;
- use `className`, `cn`, Tailwind or Box laundering;
- import HeroUI;
- invent spacing or principles;
- expose CSS doors;
- fetch, translate or read runtime state from `component.tsx`;
- render leaves, branches or alternate trees directly from a connected `index.tsx`;
- maintain a parallel skeleton tree.

Inline ESLint config is disabled in both block halves. There is no `eslint-disable`, allowlist,
warning-level rollout or pass-through exception for this seam.

A block answers "what does this domain say?", not "how many pixels separate it?"

## Page

A page is screen-level composition.

### Owns

- major block composition;
- screen-level state branches;
- page root identity;
- presentational `component.tsx` and connected `index.tsx`.

### Must not

- become a nested component ecosystem;
- contain reusable blocks/helpers/types/config;
- draw raw layout or import HeroUI;
- fetch inside its presentational half.

A page folder contains only `component.tsx` and `index.tsx`. Page-only
arrangement is inlined; reusable UI moves to blocks; helpers/types/resources
move to their non-UI homes.

## Layout

A layout owns route-stable app topology such as navbar/body/footer and
pin/fill relationships.

### Must

- expose explicit typed slots or explicit data props;
- use a named shell/frame as its root;
- keep connected wiring separate from presentation.

### Must not

- inherit Navbar/Footer/component prop types;
- use Omit/Pick/Exclude to hide CSS doors;
- broadly spread opaque props into child components;
- aggregate every child API into one layout API.

## Overlay

An overlay owns interaction topology: modal, drawer, popover or command
workflow.

### Must

- use typed overlay shells;
- expose finite size/viewport contracts;
- compose slots using ComponentType.

### Must not

- expose content/dialog/footer className doors;
- import raw HeroUI overlay primitives at domain tier;
- accept arbitrary dimensions or ReactNode bodies.

## Identity

- each exported visual component has one real root owner;
- caller identity is forwarded to that root;
- identity never justifies an extra wrapper;
- identity is not styling and is not a principle;
- one identity is not spread to multiple nodes.

### Avatar fallback

- the Avatar vocabulary leaf alone owns profile-image fallback;
- a non-empty real `src` wins; an absent or failed image falls back to DiceBear `lorelei`;
- the already-resolved person name is the stable DiceBear seed; an absent name uses the fixed
  `StarCi` seed, never randomness;
- generate the SVG data URI locally with `@dicebear/core` and `@dicebear/styles`; product render
  paths must not depend on the DiceBear HTTP API;
- callers pass only identity data (`name`, optional `src`, finite `size`), never initials, a seed,
  generated SVG, fallback URL, fallback component or fallback children;
- the loading pass remains the Avatar leaf's intrinsic shimmer and does not reveal either the real
  image or the generated fallback.

## Skeleton

- leaf owns its intrinsic shimmer;
- composite decides which children rest and how many;
- request state is pending while `data === undefined` and no terminal error exists, including when
  a viewer/session prerequisite temporarily disables the request key;
- `isLoading` is a transport observation, not the definition of unresolved domain data, and must
  never be the only condition that selects a pending shape;
- `null` means settled empty only when that request contract explicitly assigns it that meaning;
- each independently settling block keeps its own real tree in loading form until its own data
  settles; no settled zero/default/empty value may impersonate loading;
- block/page forwards resolved pending state as `isLoading` to the pure tree;
- a skeleton leaf reserves both width and line height even when resolved copy is absent; a width
  class on an empty zero-height node is not a visible skeleton;
- no `FooSkeleton` mirror tree;
- no inline branch between unrelated skeleton and real shapes;
- skeleton controls are zero-prop ComponentTypes.

## Classification test

1. Owns one intrinsic value/control (including an inseparable icon)? Leaf.
2. Owns variable contract-driven structural grammar? Branch.
3. Fixes a reusable arrangement of independently meaningful leaves? Composite.
4. Expresses domain data/actions? Block.
5. Owns screen composition? Page.
6. Owns route-stable shell topology? Layout.
7. Owns uninterpreted vendor mechanics for modal/drawer/dropdown? Shell.
8. Owns modal/drawer/popover product workflow? Overlay.

## Non-negotiable public contract

- no public CSS doors on house components;
- one structural decision owner per node;
- typed ComponentType composition;
- direct named exports only;
- `src` is the sole product implementation tree;
- no fake principle, wrapper, namespace or lint disable.
