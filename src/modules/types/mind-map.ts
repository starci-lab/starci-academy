/**
 * A lesson (content) selected from the course mind-map, used to drive the
 * {@link MindMapContentDetailsDrawer}.
 *
 * The slot node passes this to `useMindMapContentDetailsOverlayState().open(selection)`;
 * the drawer reads it to resolve the content and build the lesson URL.
 */
export interface MindMapDetailsSelection {
    /** Selected lesson (content) id. */
    contentId: string
    /** Owning module id — needed to build the lesson URL. */
    moduleId: string
}
