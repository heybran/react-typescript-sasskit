import Spinner from "./Spinner";
import { ChangeEvent, KeyboardEvent, ReactNode } from "react";

interface InputProps {
  id: string;
  labelText: string;
  type?: string;
  name: string;
  placeholder: string;
  spinner?: boolean;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  errorMessage?: ReactNode | null;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  id,
  labelText,
  type = "text",
  name,
  placeholder,
  spinner,
  onKeyUp,
  onChange,
  errorMessage,
}: InputProps) {
  return (
    <div className="input-field">
      <label htmlFor={id}>{labelText}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onKeyUp={onKeyUp}
        onChange={onChange}
      />
      {spinner ? <Spinner /> : null}
      {errorMessage}
    </div>
  );
}
