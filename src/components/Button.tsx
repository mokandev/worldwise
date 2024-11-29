import styles from "./Button.module.css";

interface IButtonProps {
  children: string;
  onClick: (e: React.SyntheticEvent) => void;
  type: "back" | "primary" | "position";
}

export default function Button({ children, onClick, type }: IButtonProps) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  );
}
