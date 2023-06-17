import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  text: string;
  theme?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}

export default function Button({
  text,
  theme,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button className={"primary-button " + (theme ?? "")} onClick={onClick}>
      {text} {children}
    </button>
  );
}
