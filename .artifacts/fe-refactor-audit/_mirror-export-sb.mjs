/**
 * Mirror export-matches compound namespaces into Storybook twins (ATOM-11 sync).
 * Src already has them; SB uses Name/Name.tsx not index.tsx so the eslint rule is silent there.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()

const mirrors = [
    {
        sb: ".storybook/components/atoms/display/Progress/Progress.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Progress = {\n    Bar: ProgressBar,\n    Circle: ProgressCircle,\n    Gauge: Meter,\n} as const\n",
        marker: "export const Progress =",
    },
    {
        sb: ".storybook/components/atoms/navigation/Link/Link.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Link = {\n    Back: LinkBack,\n    SeeMore: LinkSeeMore,\n} as const\n",
        marker: "export const Link =",
    },
    {
        sb: ".storybook/components/atoms/forms/ListBox/ListBox.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const ListBox = {\n    Root: ListBoxRoot,\n    Item: ListBoxItem,\n} as const\n",
        marker: "export const ListBox =",
    },
    {
        sb: ".storybook/components/atoms/forms/Select/Select.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Select = {\n    Root: SelectRoot,\n    Trigger: SelectTrigger,\n    Value: SelectValue,\n    Indicator: SelectIndicator,\n    Popover: SelectPopover,\n} as const\n",
        marker: "export const Select =",
    },
    {
        sb: ".storybook/components/atoms/overlay/Modal/Modal.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Modal = {\n    Root: ModalRoot,\n    Backdrop: ModalBackdrop,\n    Container: ModalContainer,\n    Dialog: ModalDialog,\n    Header: ModalHeader,\n    Body: ModalBody,\n    Footer: ModalFooter,\n    CloseTrigger: ModalCloseTrigger,\n} as const\n",
        marker: "export const Modal =",
    },
    {
        sb: ".storybook/components/atoms/overlay/Drawer/Drawer.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Drawer = {\n    Root: DrawerRoot,\n    Backdrop: DrawerBackdrop,\n    Content: DrawerContent,\n    Dialog: DrawerDialog,\n    Header: DrawerHeader,\n    Body: DrawerBody,\n    Footer: DrawerFooter,\n    CloseTrigger: DrawerCloseTrigger,\n} as const\n",
        marker: "export const Drawer =",
    },
    {
        sb: ".storybook/components/atoms/feedback/AlertDialog/AlertDialog.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const AlertDialog = {\n    Root: AlertDialogRoot,\n    Backdrop: AlertDialogBackdrop,\n    Container: AlertDialogContainer,\n    Dialog: AlertDialogDialog,\n    Header: AlertDialogHeader,\n    Heading: AlertDialogHeading,\n    Body: AlertDialogBody,\n    Footer: AlertDialogFooter,\n} as const\n",
        marker: "export const AlertDialog =",
    },
    {
        sb: ".storybook/components/atoms/data/Table/Table.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Table = {\n    Root: TableRoot,\n    ScrollContainer: TableScrollContainer,\n    Content: TableContent,\n    Header: TableHeader,\n    Body: TableBody,\n    Column: TableColumn,\n    Row: TableRow,\n    Cell: TableCell,\n} as const\n",
        marker: "export const Table =",
    },
    {
        sb: ".storybook/components/composites/chips/Chip/Chip.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Chip = {\n    Enum: EnumChip,\n    Highlight: HighlightChip,\n    Removable: RemovableToken,\n} as const\n",
        marker: "export const Chip =",
    },
    {
        sb: ".storybook/components/composites/data/KeyValue/KeyValue.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const KeyValue = {\n    Row: KeyValueRow,\n    List: KeyValueList,\n} as const\n",
        marker: "export const KeyValue =",
    },
    {
        sb: ".storybook/components/composites/lists/List/List.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const List = {\n    Row: Row,\n    Labeled: Labeled,\n    Meta: Meta,\n    ToggleRow: ToggleRow,\n} as const\n",
        marker: "export const List =",
    },
    {
        sb: ".storybook/components/composites/layout/Page/Page.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */\nexport const Page = {\n    Header: Header,\n    BottomBar: BottomBar,\n} as const\n",
        marker: "export const Page = {\n    Header",
    },
]

const results = []
for (const m of mirrors) {
    const abs = resolve(ROOT, m.sb)
    if (!existsSync(abs)) {
        results.push({ file: m.sb, status: "missing" })
        continue
    }
    let src = readFileSync(abs, "utf8")
    if (src.includes(m.marker)) {
        results.push({ file: m.sb, status: "already" })
        continue
    }
    if (!src.endsWith("\n")) src += "\n"
    src += m.block
    writeFileSync(abs, src)
    results.push({ file: m.sb, status: "patched" })
}

// Re-add lost src aliases
const srcLost = [
    {
        file: "src/components/composites/data/KeyValue/index.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder). Existing named exports stay public. */\nexport const KeyValue = {\n    Row: KeyValueRow,\n    List: KeyValueList,\n} as const\n",
        marker: "export const KeyValue =",
    },
    {
        file: "src/components/composites/lists/List/index.tsx",
        block: "\n/** Folder-matching compound namespace (export-matches-folder). Existing named exports stay public. */\nexport const List = {\n    Row: Row,\n    Labeled: Labeled,\n    Meta: Meta,\n    ToggleRow: ToggleRow,\n} as const\n",
        marker: "export const List =",
    },
    {
        file: "src/components/overlays/modals/GlobalSearchModal/Content/Block/index.tsx",
        block: "\n/** Folder-matching alias (export-matches-folder) — keep `GlobalSearchContentBlock` as the public name. */\nexport { GlobalSearchContentBlock as Block }\n",
        marker: "as Block",
    },
]

for (const m of srcLost) {
    const abs = resolve(ROOT, m.file)
    let src = readFileSync(abs, "utf8")
    if (src.includes(m.marker)) {
        results.push({ file: m.file, status: "already" })
        continue
    }
    if (!src.endsWith("\n")) src += "\n"
    src += m.block
    writeFileSync(abs, src)
    results.push({ file: m.file, status: "patched" })
}

console.log(JSON.stringify(results, null, 2))
