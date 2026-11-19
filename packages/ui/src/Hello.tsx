import type { ComponentPropsWithoutRef } from "react";

export interface HelloProps extends ComponentPropsWithoutRef<"p"> {
  name?: string;
}

/** Placeholder component to prove the workspace, TS config and Storybook are wired up. */
export function Hello({ name = "world", ...rest }: HelloProps) {
  return <p {...rest}>Hello, {name}!</p>;
}
