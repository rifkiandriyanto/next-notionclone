import React from "react";
import styles from "./styles.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  onClickHandler: () => void;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClickHandler, href }) => {
  return (
    <a
      href={href}
      role="button"
      tabIndex={0}
      className={styles.button}
      onClick={onClickHandler}
      onKeyDown={onClickHandler}
    >
      {children}
    </a>
  );
};

export default Button;
