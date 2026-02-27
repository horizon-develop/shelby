import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface BaseProps {
  label: string;
  id?: string;
}

interface InputFieldProps extends BaseProps {
  as?: "input";
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  children?: never;
}

interface SelectFieldProps extends BaseProps {
  as: "select";
  inputProps?: SelectHTMLAttributes<HTMLSelectElement>;
  children: ReactNode;
}

type FormFieldProps = InputFieldProps | SelectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, id } = props;
  const baseClass =
    "mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] p-2";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#AE7E50] mb-2">
        {label}
      </label>
      {props.as === "select" ? (
        <select id={id} className={baseClass} {...props.inputProps}>
          {props.children}
        </select>
      ) : (
        <input id={id} className={baseClass} {...props.inputProps} />
      )}
    </div>
  );
}
