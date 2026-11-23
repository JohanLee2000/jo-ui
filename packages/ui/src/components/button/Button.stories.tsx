import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  // fn() records every call, so tests can check whether onClick fired.
  args: { children: "Button", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Showcase -----------------------------------------------------------------

/** Try every prop with the controls below. */
export const Playground: Story = {};

const variants = ["solid", "outline", "ghost"] as const;
const tones = ["accent", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

/** Every variant × tone, every size, and the disabled and loading states. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--space-6)" }}>
      {tones.map((tone) => (
        <div key={tone} style={row}>
          {variants.map((variant) => (
            <Button key={variant} {...args} variant={variant} tone={tone}>
              {variant} {tone}
            </Button>
          ))}
        </div>
      ))}
      <div style={row}>
        {sizes.map((size) => (
          <Button key={size} {...args} size={size}>
            Size {size}
          </Button>
        ))}
      </div>
      <div style={row}>
        <Button {...args} disabled>
          Disabled
        </Button>
        <Button {...args} variant="outline" disabled>
          Disabled outline
        </Button>
        <Button {...args} loading>
          Saving…
        </Button>
      </div>
    </div>
  ),
};

// --- Behavior tests (run automatically with the story tests) ------------------

export const Click: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Button" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Tab focuses it; Enter and Space both activate it (APG button pattern). */
export const Keyboard: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Button" });

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Button" });

    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: { loading: true, children: "Saving…" },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Saving…" });

    // Screen readers announce it as busy, and it can't be clicked twice.
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toBeDisabled();
    // A spinning icon shows it visually; it's hidden from screen readers.
    const spinner = button.querySelector("svg");
    await expect(spinner).toHaveAttribute("aria-hidden", "true");
    await expect(getComputedStyle(spinner!).animationIterationCount).toBe("infinite");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

const submitted = fn();

/** Inside a form, a Button doesn't submit unless you pass type="submit". */
export const InsideForm: Story = {
  render: (args) => (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // keep Storybook from reloading
        submitted();
      }}
      style={row}
    >
      <Button {...args}>Cancel</Button>
      <Button {...args} type="submit">
        Save
      </Button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    submitted.mockClear();

    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await expect(submitted).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(submitted).toHaveBeenCalledTimes(1);
  },
};

/** asChild renders a link styled as a button: it's still a link to screen readers. */
export const AsLink: Story = {
  args: { asChild: true, variant: "outline" },
  render: (args) => (
    <Button {...args}>
      {/* preventDefault keeps the test page from navigating. It also shows
          Slot merging handlers: this one runs, then Button's onClick. */}
      <a href="#docs" onClick={(event) => event.preventDefault()}>
        Read the docs
      </a>
    </Button>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const link = canvas.getByRole("link", { name: "Read the docs" });

    // A real <a> with Button's classes, and no button-only attributes.
    await expect(link.tagName).toBe("A");
    await expect(link.className).toMatch(/Button_button__/);
    await expect(link).not.toHaveAttribute("type");
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();

    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** A disabled asChild link is marked aria-disabled and doesn't navigate or call onClick. */
export const DisabledLink: Story = {
  args: { asChild: true, disabled: true },
  render: (args) => (
    <Button {...args}>
      <a href="#should-not-navigate">Unavailable</a>
    </Button>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const link = canvas.getByRole("link", { name: "Unavailable" });
    const urlBefore = window.location.href;

    await expect(link).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(link);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(window.location.href).toBe(urlBefore);
  },
};

/** A className passed in is added to the button's own classes, not swapped for them. */
export const CustomClassName: Story = {
  args: { className: "my-app-class" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Button" });
    await expect(button).toHaveClass("my-app-class");
    await expect(button.className).toMatch(/Button_button__/);
  },
};

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-3)",
};
