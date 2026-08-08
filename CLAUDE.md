# StarCi front end - backend canon, local execution topology

The backend repository remains the cross-repo source of truth:

```text
D:\Repositories\starci-academy-backend\.claude\
```

This repository also carries an approved local execution projection for the
active FE architecture and lint campaign. It must agree with backend canon; a
deliberate architecture change updates both sides together.

## Read-first routing

Any request that reads, writes, reviews or plans code in this repository starts
by reading the governing documents.

| Work | Read first |
|---|---|
| any front-end work | `<backend>/.claude/canon/fe/README.md` |
| canonical tier law | `<backend>/.claude/canon/fe/enforce/tiers/architecture.md` and the per-tier document |
| approved local layer topology | `.claude/fe/TOPOLOGY.md` |
| changing, interpreting or burning FE ESLint rules | `.claude/fe/ESLINT-RULESET.md` |
| physical file placement | `<backend>/.claude/canon/fe/sourcetree.md` |
| choosing a component for a data shape | `<backend>/.claude/canon/fe/explore/component/` |
| skill ownership | `<backend>/.claude/skills/` |

Reading carefully means opening the governing document, not inferring it from a
filename or an existing implementation.

## Repository-owned execution material

- `src/`: application implementation.
- Storybook has been retired; `src/` is the sole product implementation tree.
- `.claude/fe/TOPOLOGY.md`: mandatory local layer/dependency contract.
- `.claude/fe/ESLINT-RULESET.md`: mandatory lint audit and frozen migration metrics.
- `.claude/fe/contracts/`: bounded implementation contracts.
- `.claude/fe/decision-ledger.json`: explicit holds and applied decisions.
- `.claude/fe/prompts/`: work handoffs; never canon by themselves.
- `.artifacts/`: generated evidence; regenerable and never authoritative.
- `plugins/eslint/`: machine enforcement layer.

## Standing constraints

- Branch: all work lands on `mtp`.
- `src` owns the product implementation; no Storybook parity is required.
- Colours change through `globals.css` variables, not atom drift.
- Production build uses `next build --webpack`.
- For non-trivial changes, analyze ownership before editing.
- Classify the layer with `.claude/fe/TOPOLOGY.md` before fixing a lint finding.
- Never invent a wrapper, principle, variant, CSS door or exception merely to lower a count.
- A lint message is telemetry, not a workload unit. Dedupe overlapping findings by AST node and semantic owner.
- Track actionable clusters, held clusters and unclassified findings separately.
- A11y remains observed but outside the architectural burn unless explicitly requested.
- Do not add new architectural rules after the ruleset freeze until actionable debt reaches zero.

## Gates

Backend gates are the machine half of cross-repo canon and receive this
repository path, for example:

```bash
node ../starci-academy-backend/.claude/scripts/gates/check-story-anatomy.mjs .
```

The local aggregate gate is:

```bash
npm run audit:fe
```

Before calling work complete, run the gates governing the touched contract,
read their diagnostics, run TypeScript, focused ESLint and `git diff --check`.
