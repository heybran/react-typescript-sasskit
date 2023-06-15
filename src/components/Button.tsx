import { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  theme?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ text, theme, onClick }: ButtonProps) {
  return (
    <button className={"primary-button " + theme} onClick={onClick}>
      {text}
    </button>
  );
}
