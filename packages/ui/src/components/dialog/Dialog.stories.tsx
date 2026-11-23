import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
// `within(document.body)` searches the whole page: an open dialog sits in the
// browser's top layer, so queries limited to the story's canvas can miss it.
import { expect, fn, waitFor, within } from "storybook/test";

import { XIcon } from "@jo-ui/ui-icons";

import { Stack } from "../../layout/Stack";
import { Text } from "../../typography/Text";
import { Button } from "../button/Button";
import { IconButton } from "../button/IconButton";
import { Field } from "../field/Field";
import { Input } from "../input/Input";
import { Dialog } from "./Dialog";

// No autodocs: a docs page renders every story at once, and several modal
// dialogs opening together on one page would block it.
const meta = {
  title: "Components/Dialog",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const onOpenChange = fn();

function DeleteDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button tone="danger" variant="outline">
          Delete project
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>Delete project?</Dialog.Title>
          <Dialog.Description>“Website redesign” and its 12 files will be deleted. This can't be undone.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Close corner>
          <IconButton aria-label="Close" size="sm">
            <XIcon />
          </IconButton>
        </Dialog.Close>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button tone="danger">Delete</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

/** Open by default, to show the look (and give the visual tests a screenshot of it). */
export const Open: Story = {
  render: () => <DeleteDialog defaultOpen />,
  play: async ({ canvasElement }) => {
    // waitFor: it fades in from opacity 0, which counts as "not visible".
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector("dialog[open]")).toBeVisible());
  },
};

/**
 * Opened without the trigger (nothing had focus): closing still returns
 * focus to the trigger, not to <body>. (A real bug found while testing.)
 */
export const FocusReturnWhenOpenedFromCode: Story = {
  render: () => <DeleteDialog defaultOpen />,
  play: async ({ canvas }) => {
    const page = within(document.body);
    await closeLikeEsc(await page.findByRole("dialog"));
    await expect(canvas.getByRole("button", { name: "Delete project" })).toHaveFocus();
  },
};

/** Closes the way a real Esc does: the browser fires "cancel" on the dialog. */
async function closeLikeEsc(dialog: HTMLElement) {
  dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
  await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument());
}

/**
 * The full keyboard flow: the trigger opens it, focus moves inside, Tab stays
 * inside, Esc closes it and focus returns to the trigger.
 */
export const KeyboardAndFocus: Story = {
  render: () => <DeleteDialog />,
  play: async ({ canvas, userEvent }) => {
    onOpenChange.mockClear();
    const page = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Delete project" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    await userEvent.click(trigger);
    const dialog = await page.findByRole("dialog", { name: "Delete project?" });
    await expect(dialog).toHaveAccessibleDescription(/can't be undone/);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Focus moved into the dialog, and Tab never escapes to the page behind it.
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      await expect(trigger).not.toHaveFocus();
    }

    // The page behind can't scroll while it's open.
    await expect(document.documentElement.style.overflow).toBe("hidden");

    // On a real Esc keypress the browser fires "cancel" on the dialog. Test
    // key events are synthetic, and browsers don't run built-in behavior for
    // synthetic events, so fire the same "cancel" event the browser would.
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus(); // focus returned
    await expect(document.documentElement.style.overflow).toBe(""); // scroll unlocked
    await expect(onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

/** Close buttons and the dimmed backdrop both close it. */
export const ClosingWays: Story = {
  render: () => <DeleteDialog />,
  play: async ({ canvas, userEvent }) => {
    const page = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Delete project" });

    // Cancel button
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());

    // Corner × button (named "Close" by its aria-label)
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());

    // Backdrop: a click whose target is the <dialog> element itself
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("dialog"));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

function RenameDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Website redesign");
  const [draft, setDraft] = useState(name);

  return (
    <Stack gap={3} align="flex-start">
      <Text>
        Project: <strong>{name}</strong>
      </Text>
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          if (next) setDraft(name);
          setOpen(next);
        }}
      >
        <Dialog.Trigger>
          <Button variant="outline">Rename</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setName(draft.trim() || name);
              setOpen(false);
            }}
          >
            <Stack gap={4}>
              <Dialog.Header>
                <Dialog.Title>Rename project</Dialog.Title>
                <Dialog.Description>The new name is shown to everyone on the team.</Dialog.Description>
              </Dialog.Header>
              <Field label="Project name">
                {/* autoFocus: showModal() focuses this instead of the first button. */}
                <Input value={draft} onChange={(event) => setDraft(event.target.value)} autoFocus />
              </Field>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Button type="submit">Save</Button>
              </Dialog.Footer>
            </Stack>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </Stack>
  );
}

/** Controlled, with a form inside. autoFocus picks the first focused element. */
export const WithForm: Story = {
  render: () => <RenameDialog />,
  play: async ({ canvas, userEvent }) => {
    const page = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "Rename" }));

    const input = await page.findByRole("textbox", { name: "Project name" });
    await waitFor(() => expect(input).toHaveFocus());

    await userEvent.clear(input);
    await userEvent.type(input, "Landing page{Enter}");

    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(canvas.getByText("Landing page")).toBeInTheDocument();
  },
};
