interface InputProps {
  id: string;
  labelText: string;
  type?: string;
  name: string;
  placeholder: string;
}

export default function Input({
  id,
  labelText,
  type = "text",
  name,
  placeholder,
}: InputProps) {
  return (
    <div className="input-field">
      <label htmlFor={id}>{labelText}</label>
      <input type={type} id={id} name={name} placeholder={placeholder} />
    </div>
  );
}
