/**
 * The block's role, the same across every story. Timeline only draws the vertical connector +
 * spacing; the row content is the caller's job (the block's JSDoc notes the children should be
 * FeedItem).
 */
export const usage = "Wrap a sequence of activity rows to connect them with a vertical line on the left, showing they belong to the same timeline. Choose Timeline over stacking bare FeedItems when the order between rows is worth seeing; drop Timeline for a loose feed with no shared thread. Timeline doesn't build the rows itself, it only draws the connector and the indent."
