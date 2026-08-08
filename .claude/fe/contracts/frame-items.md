# Typed frame item contract

Status: approved

One `items` entry builds one semantic item.

Forbidden:

```tsx
<StackV items={[() => <><Title /><Body /></>]} />

const offer = <><Title /><Body /></>
<StackV items={[() => offer]} />
```

A fragment must not hide multiple siblings from a typed frame. Choose one:

```tsx
<StackV items={[() => <Title />, () => <Body />]} />
```

or, when the siblings form one nested relationship:

```tsx
<StackV
    items={[
        () => <StackH principle="icon-text" items={[() => <Icon />, () => <Text />]} />,
    ]}
/>
```

Do not replace the fragment with a raw div, Box escape hatch, or a component
whose only purpose is to hide the same siblings. The nested frame must name the
real relationship with one honest principle.

Conditional rendering does not waive the contract. Build the `items` array
conditionally or place the condition inside the one semantic item it controls.

Enforcement: `starci-fe/no-frame-fragment-item`.
