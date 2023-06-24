import { ReactNode, forwardRef, Ref } from "react";
import styles from "./Dialog.module.css";

interface DialogProps {
  children: ReactNode;
  ariaLabel: string;
}

const Dialog = forwardRef(function Dialog(
  { children, ariaLabel }: DialogProps,
  ref: Ref<HTMLDialogElement>,
) {
  return (
    <dialog className={styles.dialog} ref={ref} aria-label={ariaLabel}>
      {children}
    </dialog>
  );
});

export default Dialog;
