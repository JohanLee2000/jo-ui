/**
 * Combines the user's event handler with a component's own handler.
 * The user's runs first; if it calls `event.preventDefault()`, the
 * component's is skipped. That gives users a way to opt out of built-in
 * behavior:
 *
 *   onClick={composeEventHandlers(props.onClick, () => setOpen(false))}
 *   // <Dialog.Close onClick={(e) => e.preventDefault()}> → dialog stays open
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirs: ((event: E) => void) | undefined,
  ours: ((event: E) => void) | undefined,
  { checkForDefaultPrevented = true } = {},
): (event: E) => void {
  return (event) => {
    theirs?.(event);
    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      ours?.(event);
    }
  };
}
