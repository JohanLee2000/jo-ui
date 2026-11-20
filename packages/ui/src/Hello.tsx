import type { ComponentPropsWithoutRef } from "react";

import { cx } from "@jo-ui/ui-core";

import * as styles from "./Hello.css";

export interface HelloProps extends ComponentPropsWithoutRef<"p"> {
  name?: string;
}

/** Placeholder component to prove the workspace, TS config, Storybook and styling are wired up. */
export function Hello({ name = "world", className, ...rest }: HelloProps) {
  // className is pulled out of ...rest and merged with ours. Left inside rest,
  // a user's className would replace our styles instead of adding to them.
  return (
    <p {...rest} className={cx(styles.root, className)}>
      Hello, {name}!
    </p>
  );
}
