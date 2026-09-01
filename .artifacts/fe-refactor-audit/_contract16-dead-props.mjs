/**
 * BATCH 16 — remove dead SB ModalShell/DrawerShell per-part props (0 JSX consumers; absent from src).
 * Keep ModalShell.bodyClassName (stories) and DrawerShell content/dialog/footer ClassName.
 */
import fs from "node:fs"

function patchModal(path) {
  let s = fs.readFileSync(path, "utf8")
  const before = s
  // Remove prop decls
  s = s.replace(/\r?\n    \/\*\* Extra classes on the default title\/description wrapper \(only with \{@link title\}\)\. \*\/\r?\n    titleClassName\?: string/, "")
  s = s.replace(/\r?\n    \/\*\* Extra classes merged onto `ModalDialog`, in addition to \{@link ModalShellBaseProps\.classNames\}\. \*\/\r?\n    dialogClassName\?: string/, "")
  s = s.replace(/\r?\n    \/\*\* Extra classes merged onto `ModalFooter`\. \*\/\r?\n    footerClassName\?: string/, "")
  // Destructure
  s = s.replace(/\r?\n    titleClassName,/, "")
  s = s.replace(/\r?\n    dialogClassName,/, "")
  s = s.replace(/\r?\n    footerClassName,/, "")
  // Usages
  s = s.replace(
    /className=\{cn\(dialogClassName, classNames\)\}/,
    "className={cn(classNames)}",
  )
  s = s.replace(
    /\{cn\("pr-8", titleClassName\)\}/,
    '{cn("pr-8")}',
  )
  s = s.replace(
    /\/\* `pr-8` \(room for the close button\) \+ arbitrary caller `titleClassName`\r?\n\s*ride a plain wrapper — neither is an `AllowedClassName`, so the typed\r?\n\s*`StackV` frame keeps its closed `classNames` union\. \*\//,
    "/* `pr-8` leaves room for the close button on a plain wrapper — not an `AllowedClassName`. */",
  )
  s = s.replace(
    /className=\{cn\("mt-0!", footerClassName\)\}/,
    'className={cn("mt-0!")}',
  )
  fs.writeFileSync(path, s)
  console.log("ModalShell", { delta: s.length - before.length, title: (s.match(/titleClassName/g) || []).length, dialog: (s.match(/dialogClassName/g) || []).length, footer: (s.match(/footerClassName/g) || []).length, body: (s.match(/bodyClassName/g) || []).length })
}

function patchDrawer(path) {
  let s = fs.readFileSync(path, "utf8")
  const before = s
  s = s.replace(/\r?\n    \/\*\* Extra classes on the default title\/description wrapper \(only with \{@link title\}\)\. \*\/\r?\n    titleClassName\?: string/, "")
  s = s.replace(/\r?\n    \/\*\* Extra classes merged onto `DrawerBody`\. \*\/\r?\n    bodyClassName\?: string/, "")
  s = s.replace(/\r?\n    titleClassName,/, "")
  s = s.replace(/\r?\n    bodyClassName,/, "")
  s = s.replace(
    /\{cn\("pr-8", titleClassName\)\}/,
    '{cn("pr-8")}',
  )
  s = s.replace(
    /\/\* `pr-8` \(room for the close button\) \+ arbitrary caller `titleClassName`\r?\n\s*ride a plain wrapper — neither is an `AllowedClassName`, so the typed\r?\n\s*`StackV` frame keeps its closed `classNames` union\. \*\//,
    "/* `pr-8` leaves room for the close button on a plain wrapper — not an `AllowedClassName`. */",
  )
  // body className cn — remove bodyClassName from list
  s = s.replace(
    /hasHeader && "mt-0!",\r?\n\s*"overflow-y-auto",\r?\n\s*bodyClassName,/,
    'hasHeader && "mt-0!",\n                                "overflow-y-auto",',
  )
  fs.writeFileSync(path, s)
  console.log("DrawerShell", {
    delta: s.length - before.length,
    title: (s.match(/titleClassName/g) || []).length,
    body: (s.match(/bodyClassName/g) || []).length,
    content: (s.match(/contentClassName/g) || []).length,
    dialog: (s.match(/dialogClassName/g) || []).length,
    footer: (s.match(/footerClassName/g) || []).length,
  })
}

patchModal(".storybook/components/composites/layout/ModalShell/ModalShell.tsx")
patchDrawer(".storybook/components/composites/layout/DrawerShell/DrawerShell.tsx")
