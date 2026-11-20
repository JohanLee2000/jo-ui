import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";

/**
 * Hides content visually but keeps it available to screen readers.
 * Use it for labels that sighted users get from context, e.g. an icon-only
 * button: <button><TrashIcon /><VisuallyHidden>Delete</VisuallyHidden></button>
 *
 * Not the same as display: none or hidden, which hide it from everyone.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<"span">>(
  function VisuallyHidden({ style, ...props }, ref) {
    return <span ref={ref} {...props} style={{ ...visuallyHiddenStyle, ...style }} />;
  },
);

// The standard technique: a 1px box that clips its contents. Inline styles
// because ui-core ships no CSS (README §5).
const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
