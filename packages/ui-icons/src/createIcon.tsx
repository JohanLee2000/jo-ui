import { forwardRef, type ReactNode, type SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "children"> {
  /**
   * Width and height. Default "1em": the icon matches the surrounding
   * font size, so it scales with the text and the component it's in.
   */
  size?: number | string;
  /**
   * Accessible name. Leave it out for decorative icons next to visible text
   * (they're hidden from screen readers). Set it when the icon is the only
   * thing conveying meaning, e.g. a status icon with no text.
   */
  title?: string;
}

/**
 * Wraps an icon's shapes in a consistent <svg>: a 24×24 grid, 2px round
 * strokes, and `currentColor`, so icons take the text color of whatever
 * they're in (a danger Button makes its icon red, automatically).
 */
export function createIcon(displayName: string, shapes: ReactNode) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = "1em", title, ...props },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        // Decorative unless titled: screen readers skip it.
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
        aria-label={title}
        focusable="false" // old Edge/IE made SVGs tab stops
        {...props}
      >
        {shapes}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
