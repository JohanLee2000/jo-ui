import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { expect, waitFor } from "storybook/test";

import {
  Button,
  Checkbox,
  Container,
  Field,
  Heading,
  Inline,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@jo-ui/ui";

const meta = {
  title: "Examples/Sign Up Form",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Errors = Partial<Record<"name" | "email" | "plan" | "terms", string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter an email address like name@example.com.";
  if (!data.get("plan")) errors.plan = "Choose a plan.";
  if (!data.get("terms")) errors.terms = "You need to accept the terms to continue.";
  return errors;
}

function SignUpForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [failedSubmits, setFailedSubmits] = useState(0);

  // After a failed submit has rendered (so the aria-invalid attributes exist),
  // move focus to the first invalid control. Keyboard and screen reader users
  // land right on what needs fixing.
  useEffect(() => {
    if (failedSubmits === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [failedSubmits]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors = validate(data);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedName(null);
      setFailedSubmits((count) => count + 1);
      return;
    }
    setSubmittedName(String(data.get("name")));
  }

  return (
    <Container size="sm" paddingY={{ base: 6, md: 12 }}>
      <Stack gap={6}>
        <Stack gap={2}>
          <Heading level={1} size="2xl">
            Create your account
          </Heading>
          <Text tone="muted">Fields marked * are required.</Text>
        </Stack>

        {/* noValidate: we show our own, consistent error messages instead of
            the browser's popups. `required` still tells screen readers. */}
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <Stack gap={5}>
            <Field label="Name" required error={errors.name}>
              <Input name="name" autoComplete="name" />
            </Field>

            <Field label="Email" required hint="We'll send a confirmation link." error={errors.email}>
              <Input name="email" type="email" autoComplete="email" />
            </Field>

            <Field label="About you" hint="Optional. Shown on your profile.">
              <Textarea name="bio" rows={3} />
            </Field>

            <RadioGroup name="plan" label="Plan" required error={errors.plan}>
              <Radio value="free" description="Up to 3 projects">
                Free
              </Radio>
              <Radio value="pro" description="$8 per month, unlimited projects">
                Pro
              </Radio>
            </RadioGroup>

            <Switch name="updates" defaultChecked description="About once a month.">
              Email me product updates
            </Switch>

            <Stack gap={1}>
              <Checkbox
                name="terms"
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "terms-error" : undefined}
              >
                I accept the terms of service *
              </Checkbox>
              {errors.terms && (
                <Text id="terms-error" size="sm" weight="medium" tone="danger">
                  {errors.terms}
                </Text>
              )}
            </Stack>

            <Inline gap={3}>
              <Button type="submit">Create account</Button>
              <Button type="reset" variant="ghost" onClick={() => setErrors({})}>
                Clear
              </Button>
            </Inline>

            {/* role="status" announces the message politely when it appears. */}
            <div role="status">
              {submittedName && (
                <Text tone="success" weight="medium">
                  Welcome, {submittedName}! Check your email to confirm your account.
                </Text>
              )}
            </div>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}

/**
 * The Phase 3 milestone: a complete, accessible form built only from jo-ui
 * components. Submit it empty to see the errors, then fill it in.
 */
export const Default: StoryObj = {
  render: () => <SignUpForm />,
  play: async ({ canvas, userEvent }) => {
    // 1. Submitting empty shows every error and focuses the first invalid field.
    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));

    const name = canvas.getByRole("textbox", { name: "Name" });
    await expect(name).toBeInvalid();
    await expect(name).toHaveAccessibleDescription("Enter your name.");
    await expect(canvas.getByText("Choose a plan.")).toBeInTheDocument();
    await expect(canvas.getByText("You need to accept the terms to continue.")).toBeInTheDocument();
    await waitFor(() => expect(name).toHaveFocus());

    // 2. A bad email gets a specific message.
    await userEvent.type(name, "Jo");
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "jo@");
    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));
    await expect(canvas.getByText("Enter an email address like name@example.com.")).toBeInTheDocument();
    await expect(name).toBeValid();

    // 3. Fixing everything submits successfully.
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "example.com");
    await userEvent.click(canvas.getByRole("radio", { name: "Pro" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: /accept the terms/ }));
    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));

    await expect(canvas.getByRole("status")).toHaveTextContent("Welcome, Jo!");
  },
};
