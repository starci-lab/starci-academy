# Storybook retirement

Storybook is retired from StarCi Academy. It is not a product source tree,
blueprint, parity target, or required verification environment.

The authoritative FE implementation tree is `src/`. Future work must not:

- create Storybook twins;
- require Storybook-first ordering;
- add Storybook parity gates;
- scan `.storybook` in lint or architecture audits;
- preserve Nivo, Nivoexpert, mia-mia, or legacy Storybook-only code.

The old Storybook prompts remain historical records only. They are not active
instructions and must not be used as a migration target.

Required validation now targets `src`, plugins, backend canon gates, TypeScript,
and focused changed-file ESLint.
