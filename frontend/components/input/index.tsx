import React from "react";
import styles from "./styles.module.scss";

interface InputProps {
  formId: string;
  id: string;
  type: string;
  label: string;
  required: boolean;
  value: string;
  setValue: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  formId,
  id,
  type,
  label,
  required,
  value,
  setValue,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id}>{label}</label>
      <input
        form={formId}
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Input;
