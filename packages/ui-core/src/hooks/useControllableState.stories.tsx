import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { useControllableState } from "./useControllableState";

// A tiny counter built on the hook, used to show both modes.
function Counter({
  value,
  defaultValue = 0,
  onValueChange,
  label,
}: {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  label: string;
}) {
  const [count, setCount] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <button type="button" onClick={() => setCount((previous) => previous + 1)}>
      {label}: {count}
    </button>
  );
}

const meta = {
  title: "Utilities/useControllableState",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

const uncontrolledChange = fn();

/** Uncontrolled: the component keeps its own count and still reports changes. */
export const Uncontrolled: StoryObj = {
  render: () => <Counter label="Uncontrolled" defaultValue={5} onValueChange={uncontrolledChange} />,
  play: async ({ canvas, userEvent }) => {
    uncontrolledChange.mockClear();
    const button = canvas.getByRole("button");

    await expect(button).toHaveTextContent("Uncontrolled: 5");
    await userEvent.click(button);
    await expect(button).toHaveTextContent("Uncontrolled: 6");
    await expect(uncontrolledChange).toHaveBeenCalledWith(6);
  },
};

const controlledChange = fn();

function ControlledDemo() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "flex", gap: "var(--space-3)" }}>
      {/* Parent accepts changes */}
      <Counter
        label="Controlled"
        value={count}
        onValueChange={(next) => {
          controlledChange(next);
          setCount(next);
        }}
      />
      {/* Parent ignores changes, so the value never moves */}
      <Counter label="Locked" value={10} onValueChange={controlledChange} />
    </div>
  );
}

/** Controlled: the parent owns the value. If the parent ignores onChange, the value doesn't move. */
export const Controlled: StoryObj = {
  render: () => <ControlledDemo />,
  play: async ({ canvas, userEvent }) => {
    controlledChange.mockClear();
    const controlled = canvas.getByRole("button", { name: /Controlled/ });
    const locked = canvas.getByRole("button", { name: /Locked/ });

    await userEvent.click(controlled);
    await expect(controlled).toHaveTextContent("Controlled: 1");

    await userEvent.click(locked);
    await expect(controlledChange).toHaveBeenLastCalledWith(11); // it asked...
    await expect(locked).toHaveTextContent("Locked: 10"); // ...but the parent said no
  },
};
