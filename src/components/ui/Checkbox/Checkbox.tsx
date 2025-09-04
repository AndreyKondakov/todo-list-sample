import styles from "./Checkbox.module.scss";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { label, className, variant = "primary", ...restProps } = props;

  const containerClasses = [
    styles.checkboxContainer,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={containerClasses}>
      <input type="checkbox" {...restProps} />
      <span className={styles.customCheckbox}></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
