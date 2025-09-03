import React from "react";

import TaskCard from "../TaskCard/TaskCard";
import styles from "./Column.module.scss";
import type { Column as ColumnType } from "../../types/column";
import type { Task } from "../../types/task";
import Button from "../ui/Button";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  return (
    <section className={styles.column}>
      <header className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>{column.title}</h2>
      </header>

      <div className={styles.columnTasksList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <footer className={styles.columnFooter}>
        <Button onClick={() => {}}>+ Add a task</Button>
      </footer>
    </section>
  );
};

export default Column;
