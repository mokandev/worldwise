import styles from "./Message.module.css";

interface IMessageProps {
  message: string
}

function Message({ message }: IMessageProps) {
  return (
    <p className={styles.message}>
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
