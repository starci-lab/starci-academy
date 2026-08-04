import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    CreateCourseModal,
    type CourseDraftStatus,
    type CreateCourseModalLabels,
} from "@sb-components/nivoexpert/blocks/studio/CreateCourseModal/CreateCourseModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CreateCourseModal` — overlay modal that creates a new `CourseEntity`:
 * name, slug, a short description, a price, and a starting status. The
 * primary action drops the expert straight into `CourseStudio` for the
 * just-created course. The one failure this modal itself surfaces is a
 * taken slug, rendered inline on the field.
 */
const meta: Meta<typeof CreateCourseModal> = {
    title: "NivoExpert/Blocks/Studio/CreateCourseModal/CreateCourseModal",
    component: CreateCourseModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CreateCourseModal>

const LABELS: CreateCourseModalLabels = {
    title: "Create a course",
    description: "Name it, price it, and drop straight into the lesson editor.",
    nameLabel: "Course name",
    namePlaceholder: "e.g. Advanced State Management",
    slugLabel: "Slug",
    slugPlaceholder: "advanced-state-management",
    descriptionLabel: "Short description",
    priceLabel: "Price",
    statusLabel: "Status",
    statusOptions: { draft: "Draft", published: "Published" },
    cancelLabel: "Cancel",
    createLabel: "Create & open Studio",
    creatingLabel: "Creating…",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    InputText: { tier: "atom", role: "name and slug — the slug's own `errorMessage` slot carries the taken-slug rejection" },
    InputTextarea: { tier: "atom", role: "the short description" },
    InputCurrency: { tier: "atom", role: "the price, in VND — the atom owns the currency formatting" },
    SelectSingle: { tier: "atom", role: "the starting status, draft or published" },
    Button: { tier: "atom", role: "cancel (ghost) and create-&-open-studio (primary, busy while creating, disabled while incomplete)" },
}

const REASON =
    "A presentational overlay modal that names a course and hands off to `createCourse` — the primary action routes straight into `CourseStudio`'s lesson editor for the new course rather than closing back to a list, so the expert never re-navigates to start writing. Create stays disabled until both name and slug are filled, and the one failure this modal itself renders — the slug is already taken — surfaces inline on the field rather than a separate banner, the same contract `RegisterDomainModal` uses for a taken domain name."

/** Shared controlled wrapper — one `isOpen`/field state feeds every leaf state below. */
const ControlledCreateCourseModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [status, setStatus] = useState<CourseDraftStatus>("draft")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        title,
        onTitleChange: setTitle,
        slug,
        onSlugChange: setSlug,
        description,
        onDescriptionChange: setDescription,
        price,
        onPriceChange: setPrice,
        status,
        onStatusChange: setStatus,
        onCreate: () => setIsOpen(false),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Create course" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="CreateCourseModal"
                tier="block"
                leaf="Create a course"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "title = \"\" (create disabled)",
                        why: "Nothing typed yet — create stays disabled so an unnamed, un-slugged course is never submitted.",
                        code: `<CreateCourseModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  title=""
  slug=""
  price={0}
  status="draft"
  onCreate={create}
  labels={labels}
/>`,
                        render: <CreateCourseModal {...base} />,
                    },
                    {
                        name: "name + slug + price filled in",
                        why: "Once both required fields are typed, create lights up — the price and status stay editable but never block the action.",
                        code: "<CreateCourseModal title=\"Advanced State Management\" slug=\"advanced-state-management\" price={1500000} … />",
                        render: (
                            <CreateCourseModal
                                {...base}
                                title="Advanced State Management"
                                slug="advanced-state-management"
                                description="Redux, Zustand, and when to reach for neither."
                                price={1500000}
                                onTitleChange={() => {}}
                                onSlugChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isCreating = true",
                        why: "The create mutation is running — every field locks and the button shows its busy state so the expert can't double-submit.",
                        code: "<CreateCourseModal isCreating … />",
                        render: (
                            <CreateCourseModal
                                {...base}
                                title="Advanced State Management"
                                slug="advanced-state-management"
                                price={1500000}
                                onTitleChange={() => {}}
                                onSlugChange={() => {}}
                                isCreating
                            />
                        ),
                    },
                    {
                        name: "slugError set",
                        why: "The slug is already used by another course on this academy — the field itself renders the rejection inline, and the expert can edit the same field and retry.",
                        code: `<CreateCourseModal
  slug="advanced-state-management"
  slugError="This slug is already taken."
  …
/>`,
                        render: (
                            <CreateCourseModal
                                {...base}
                                title="Advanced State Management"
                                slug="advanced-state-management"
                                price={1500000}
                                onTitleChange={() => {}}
                                onSlugChange={() => {}}
                                slugError="This slug is already taken."
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch (this academy's slug-availability rules) hasn't resolved yet, so every field shimmers.",
                        code: "<CreateCourseModal isSkeleton … />",
                        render: <CreateCourseModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All five states (empty, filled, creating, rejected, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledCreateCourseModal />,
}
