/** Sample markdown: heading · paragraph · list · inline code · quote · table — to inspect the typography scale. */
export const sample = `## Asynchronous functions

An \`async\` function always returns a **Promise**. Use \`await\` to wait for the value to resolve.

- Sequential: \`await a()\` then \`await b()\`
- Parallel: \`Promise.all([a(), b()])\`

> Don't \`await\` inside a loop when the iterations are independent — gather them into \`Promise.all\`.

| Approach | When to use |
|---|---|
| sequential | the next iteration needs the previous result |
| parallel | the iterations are independent |
`

/** One-line markdown: inline bold + inline `code` + inline `:muted[…]` — no line breaks, no heading/list/table. */
export const inlineSample = "The response returns **200 OK** with `Content-Type: application/json`, while the :muted[Authorization header] is optional."
