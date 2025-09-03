import type { Task } from "../../types/task";
import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className={styles.taskCard}>
      <p>{task.content}</p>
    </div>
  );
};

export default TaskCard;
