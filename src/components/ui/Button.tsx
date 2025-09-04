import styles from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  isActive?: boolean;
};

const Button = ({ children, onClick, isActive }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${isActive && styles.active}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
