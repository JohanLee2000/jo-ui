/**
 * Joins class names, skipping empty values:
 *   cx(styles.root, isActive && styles.active, className)
 *
 * Every component uses this to merge its own classes with the `className`
 * passed in by the user, so neither replaces the other (README §9).
 */
export function cx(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
