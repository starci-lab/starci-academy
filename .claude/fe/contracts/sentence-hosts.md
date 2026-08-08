# Sentence-tier host ownership

Status: approved

Blocks, pages, layouts, and overlays compose vocabulary. They do not render
structural host elements directly:

```text
div footer aside section main header nav
```

The vocabulary owner renders the host and owns its landmark, layout, or chrome.
For example, `FooterFrame` owns `<footer>`, its border/background, and canonical
content measure. The Footer block owns only footer content.

Removing a public className while retaining the same raw host/CSS is a false
closure.

Enforcement: `starci-fe/no-host-element-at-sentence-tier`.
