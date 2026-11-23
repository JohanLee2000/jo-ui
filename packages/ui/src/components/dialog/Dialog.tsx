"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

import { cx, Slot, useControllableState, useMergedRefs, useScrollLock } from "@jo-ui/ui-core";

import * as styles from "./Dialog.css";

// --- Shared state ---------------------------------------------------------------

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  triggerRef: RefObject<HTMLElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(part: string) {
  const context = useContext(DialogContext);
  if (!context) throw new Error(`<Dialog.${part}> must be used inside <Dialog.Root>.`);
  return context;
}

// --- Root -------------------------------------------------------------------------

export interface DialogRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Starting state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog wants to open or close (trigger, Close, Esc, backdrop click). */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** Holds the open state and wires the parts together. Renders no element. */
function Root({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogRootProps) {
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);

  const value = useMemo(
    () => ({ open, setOpen, titleId: `${id}title`, descriptionId: `${id}description`, triggerRef }),
    [open, setOpen, id],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

// --- Trigger ----------------------------------------------------------------------

export interface DialogTriggerProps {
  /** One element, usually a Button. It gets the click handler and ARIA attributes. */
  children: ReactElement;
}

/** Opens the dialog. Renders its child (e.g. a Button) with the behavior merged in. */
const Trigger = forwardRef<HTMLElement, DialogTriggerProps>(function Trigger({ children }, ref) {
  const { open, setOpen, triggerRef } = useDialog("Trigger");
  const mergedRef = useMergedRefs(ref, triggerRef);

  return (
    <Slot ref={mergedRef} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      {children}
    </Slot>
  );
});

// --- Content ----------------------------------------------------------------------

export interface DialogContentProps extends Omit<ComponentPropsWithoutRef<"dialog">, "open"> {
  /** Max width: sm 24rem, md 32rem (default), lg 48rem. Always leaves a margin on small screens. */
  size?: keyof typeof styles.sizes;
  /** Close when the dimmed area outside the dialog is clicked. Default true. */
  closeOnBackdropClick?: boolean;
}

/**
 * The dialog itself: a native <dialog> opened with showModal(). The browser then:
 *   - puts it in the top layer, above everything (no z-index needed)
 *   - makes the rest of the page inert (unclickable, unfocusable, hidden from screen readers)
 *   - moves focus inside (to the first focusable element, or one with autoFocus)
 *   - fires "cancel" on Esc
 * What's added here: React state as the source of truth, focus return,
 * scroll locking, backdrop clicks, and naming via Title/Description.
 */
const Content = forwardRef<HTMLDialogElement, DialogContentProps>(function Content(
  { size = "md", closeOnBackdropClick = true, className, children, onClick, onCancel, ...rest },
  ref,
) {
  const { open, setOpen, titleId, descriptionId, triggerRef } = useDialog("Content");
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Hooks run before the early `return null` below: React requires the same
  // hooks, in the same order, on every render.
  const mergedRef = useMergedRefs(ref, dialogRef);

  useScrollLock(open);

  // Sync React state → the native element. Runs after the <dialog> mounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    // Whatever had focus before opening (usually the trigger) gets it back on
    // close. If nothing did (focus was on <body>, e.g. a dialog opened from
    // code on page load), fall back to the trigger: focusing <body> does
    // nothing, leaving keyboard users at the top of the page.
    const active = document.activeElement as HTMLElement | null;
    const returnFocusTo = active && active !== document.body ? active : triggerRef.current;
    if (!dialog.open) dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      const target = returnFocusTo?.isConnected ? returnFocusTo : triggerRef.current;
      target?.focus();
    };
  }, [open, triggerRef]);

  if (!open) return null;

  return (
    <dialog
      ref={mergedRef}
      className={cx(styles.dialog, styles.sizes[size], className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // Esc: the browser would close the <dialog> itself, leaving React state
      // saying "open". Instead, cancel that and ask React to close. A
      // controlled parent can then refuse (e.g. unsaved changes).
      onCancel={(event) => {
        onCancel?.(event);
        event.preventDefault();
        setOpen(false);
      }}
      onClick={(event: MouseEvent<HTMLDialogElement>) => {
        onClick?.(event);
        // The <dialog> has no padding, so a click whose target is the <dialog>
        // itself landed on the ::backdrop, outside the panel.
        if (closeOnBackdropClick && event.target === event.currentTarget) setOpen(false);
      }}
      {...rest}
    >
      <div className={styles.panel}>{children}</div>
    </dialog>
  );
});

// --- Text parts ---------------------------------------------------------------------

/** The dialog's name: announced when it opens. Every dialog needs one. */
const Title = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h2">>(function Title(
  { className, ...rest },
  ref,
) {
  const { titleId } = useDialog("Title");
  return <h2 ref={ref} id={titleId} className={cx(styles.title, className)} {...rest} />;
});

/** Optional supporting text, announced after the title. */
const Description = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(function Description(
  { className, ...rest },
  ref,
) {
  const { descriptionId } = useDialog("Description");
  return <p ref={ref} id={descriptionId} className={cx(styles.description, className)} {...rest} />;
});

/** Groups Title and Description, leaving room for a corner close button. */
const Header = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function Header({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.header, className)} {...rest} />;
});

/** Action buttons, right-aligned. Put the primary action last. */
const Footer = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function Footer({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.footer, className)} {...rest} />;
});

// --- Close --------------------------------------------------------------------------

export interface DialogCloseProps {
  /** One element, usually a Button or IconButton. */
  children: ReactElement;
  /** Pin it to the top-right corner (for an IconButton with an × icon). */
  corner?: boolean;
}

/** Closes the dialog when its child is clicked. */
const Close = forwardRef<HTMLElement, DialogCloseProps>(function Close({ children, corner = false }, ref) {
  const { setOpen } = useDialog("Close");
  return (
    <Slot ref={ref} className={corner ? styles.cornerClose : undefined} onClick={() => setOpen(false)}>
      {children}
    </Slot>
  );
});

// --- Public API -----------------------------------------------------------------------

/**
 * A modal dialog (WAI-ARIA APG dialog pattern).
 *
 *   <Dialog.Root>
 *     <Dialog.Trigger><Button>Delete project</Button></Dialog.Trigger>
 *     <Dialog.Content size="sm">
 *       <Dialog.Header>
 *         <Dialog.Title>Delete project?</Dialog.Title>
 *         <Dialog.Description>This can't be undone.</Dialog.Description>
 *       </Dialog.Header>
 *       <Dialog.Footer>
 *         <Dialog.Close><Button variant="ghost">Cancel</Button></Dialog.Close>
 *         <Button tone="danger">Delete</Button>
 *       </Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog.Root>
 */
export const Dialog = { Root, Trigger, Content, Header, Title, Description, Footer, Close };
