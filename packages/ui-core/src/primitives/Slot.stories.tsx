import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRef } from "react";
import { expect, fn } from "storybook/test";

import { Slot } from "./Slot";

const meta = {
  title: "Utilities/Slot",
  component: Slot,
  tags: ["autodocs"],
} satisfies Meta<typeof Slot>;

export default meta;
type Story = StoryObj<typeof meta>;

const slotClick = fn();
const childClick = fn();
const slotRef = createRef<HTMLElement>();
const childRef = createRef<HTMLAnchorElement>();

/**
 * The Slot's props land on its child: classNames join, styles combine,
 * both click handlers run, both refs get the element, and the child's own
 * attributes win.
 */
export const MergesProps: Story = {
  render: () => (
    <Slot
      ref={slotRef}
      className="from-slot"
      style={{ padding: "var(--space-2)", color: "red" }}
      onClick={slotClick}
      title="slot title"
      data-from-slot=""
    >
      <a
        ref={childRef}
        href="#slot-demo"
        className="from-child"
        style={{ color: "var(--color-text-accent)" }}
        onClick={(event) => {
          event.preventDefault(); // stay on the page
          childClick();
        }}
        title="child title"
      >
        I'm the child &lt;a&gt;, with the Slot's props merged in
      </a>
    </Slot>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    slotClick.mockClear();
    childClick.mockClear();

    const link = canvas.getByRole("link");

    // Only the child is rendered; Slot adds no wrapper element.
    await expect(canvasElement.firstElementChild).toBe(link);

    await expect(link).toHaveClass("from-slot", "from-child");
    await expect(link).toHaveAttribute("data-from-slot");
    await expect(link).toHaveAttribute("title", "child title"); // child wins
    await expect(link.style.padding).toBe("var(--space-2)"); // from slot
    await expect(link.style.color).toBe("var(--color-text-accent)"); // child wins

    await userEvent.click(link);
    await expect(childClick).toHaveBeenCalledTimes(1);
    await expect(slotClick).toHaveBeenCalledTimes(1);

    await expect(slotRef.current).toBe(link);
    await expect(childRef.current).toBe(link);
  },
};
