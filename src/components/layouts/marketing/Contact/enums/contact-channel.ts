/**
 * Identifies a contact channel rendered as an info card on the contact page.
 * Drives the icon lookup in `map.tsx`.
 */
export enum ContactChannelKind {
    /** Email support channel. */
    Email = "email",
    /** Phone support channel. */
    Phone = "phone",
}
